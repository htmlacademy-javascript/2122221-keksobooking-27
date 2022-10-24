import { getData } from './api.js';
import { createCustomPopup } from './popup.js';
import { enableForm } from './form.js';
import { showAlert } from './message.js';
import { enableFilters, filterOffer, setFilterChange } from './filter.js';
import { debounce } from './util.js';

const SIMILAR_OFFERS_COUNT = 10;

const address = document.querySelector('#address');

const CITY_CENTER_COORDINATES = {
  LAT: 35.681729,
  LNG: 139.753927,
};

const map = L.map('map-canvas');
const markerGroup = L.layerGroup().addTo(map);
const MAP_ZOOM = 12;

const specialPinIcon = L.icon({
  iconUrl: './img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
});

const specialPinMarker = L.marker(
  {
    lat: CITY_CENTER_COORDINATES.LAT,
    lng: CITY_CENTER_COORDINATES.LNG,
  },
  {
    icon: specialPinIcon,
    draggable: true,
  }
);

const similarPinIcon = L.icon({
  iconUrl: './img/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

function setDefaultMapView() {
  map.setView({
    lat: CITY_CENTER_COORDINATES.LAT,
    lng: CITY_CENTER_COORDINATES.LNG,
  }, MAP_ZOOM);
}

function createSpecialMarker() {
  specialPinMarker.addTo(map);
  setSpecialMarker();

  specialPinMarker.on('moveend', (evt) => {
    const coordinates = evt.target.getLatLng();
    setSpecialMarker(coordinates.lat, coordinates.lng);
  });
}

function setSpecialMarker(lat = CITY_CENTER_COORDINATES.LAT, lng = CITY_CENTER_COORDINATES.LNG) {
  specialPinMarker.setLatLng({
    lat,
    lng,
  });
  address.value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

function createSimilarMarker(point) {
  const { location } = point;
  const similarPinMarker = L.marker(
    {
      lat: location.lat,
      lng: location.lng,
    },
    {
      icon: similarPinIcon,
    }
  );

  similarPinMarker
    .addTo(markerGroup)
    .bindPopup(createCustomPopup(point));
}

function createSimilarMarkers(offers) {
  markerGroup.clearLayers();
  offers
    .filter(filterOffer)
    .slice(0, SIMILAR_OFFERS_COUNT)
    .forEach((point) => {
      createSimilarMarker(point, map);
    });
}

function getSimilarOffers() {
  getData((offers) => {
    createSimilarMarkers(offers);
    enableFilters();
    setFilterChange(debounce(() => createSimilarMarkers(offers)));
  }, () => {
    showAlert('При попытке загрузить похожие объявления произошла ошибка');
  });
}

function closePopups() {
  for (const layer of markerGroup.getLayers()) {
    const popup = layer.getPopup();
    if (popup.isOpen()) {
      layer.closePopup();
    }
  }
}

const createTileLayers = new Promise((resolve, reject) => {
  setDefaultMapView();

  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  ).addTo(map)
    .on('tileerror', () => reject())
    .on('load', () => resolve());
});

createTileLayers
  .then(() => {
    createSpecialMarker();
    enableForm();
    getSimilarOffers();
  })
  .catch(() => showAlert('При загрузке карты произошла ошибка'));

export { setSpecialMarker, closePopups, setDefaultMapView };
