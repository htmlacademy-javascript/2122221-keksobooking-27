import { createOffers } from './data.js';
import { createCustomPopup } from './popup.js';
import { activatePage } from './form.js';

const address = document.querySelector('#address');
const offers = createOffers();

const CITY_CENTER_COORDINATES = {
  LAT: 35.681729,
  LNG: 139.753927,
};

const mapZoom = 12;

const map = L.map('map-canvas')
  .on('load', () => {
    activatePage();
  })
  .setView({
    lat: CITY_CENTER_COORDINATES.LAT,
    lng: CITY_CENTER_COORDINATES.LNG,
  }, mapZoom);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

const specialPinIcon = L.icon({
  iconUrl: '../img/main-pin.svg',
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
  iconUrl: '../img/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const markerGroup = L.layerGroup().addTo(map);

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

specialPinMarker.addTo(map);

specialPinMarker.on('moveend', (evt) => {
  const coordinates = evt.target.getLatLng();
  address.value = `${coordinates.lat.toFixed(5)}, ${coordinates.lng.toFixed(5)}`;
});

offers.forEach((point) => {
  createSimilarMarker(point);
});
