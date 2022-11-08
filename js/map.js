import { getData } from './api.js';
import { createCustomPopup } from './popup.js';
import { enableForm } from './form.js';
import { showAlert } from './message.js';
import { enableFilters, filterOffer, setFilterChange } from './filter.js';
import { debounce } from './util.js';

const SIMILAR_OFFERS_COUNT = 10;

const address = document.querySelector('#address');

const CityCenterCoordinates = {
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
    lat: CityCenterCoordinates.LAT,
    lng: CityCenterCoordinates.LNG,
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
    lat: CityCenterCoordinates.LAT,
    lng: CityCenterCoordinates.LNG,
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

function setSpecialMarker(lat = CityCenterCoordinates.LAT, lng = CityCenterCoordinates.LNG) {
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

  let counter = 0;
  const filteredOffers = [];

  for (let i = 0; i < offers.length; i++) {
    if (filterOffer(offers[i])) {
      filteredOffers.push(offers[i]);
      counter++;
    }

    if (counter === SIMILAR_OFFERS_COUNT) {
      break;
    }
  }

  filteredOffers.forEach((point) => createSimilarMarker(point, map));
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

export { setSpecialMarker, setDefaultMapView };
