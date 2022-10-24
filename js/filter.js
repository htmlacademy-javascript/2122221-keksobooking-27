import { enableElement, disableElement } from './util.js';

const mapFilters = document.querySelector('.map__filters');
const housingType = mapFilters.querySelector('#housing-type');
const housingPrice = mapFilters.querySelector('#housing-price');
const housingRooms = mapFilters.querySelector('#housing-rooms');
const housingGuests = mapFilters.querySelector('#housing-guests');
const housingFeatures = mapFilters.querySelector('#housing-features').querySelectorAll('input');

const dropdownFilters = [housingType, housingPrice, housingRooms, housingGuests];

function disableFilters() {
  disableElement(mapFilters);
}

function enableFilters() {
  enableElement(mapFilters);
}

function filterOffer(item) {
  let isMatching = true;

  for (const dropdownFilter of dropdownFilters) {
    if (dropdownFilter.value !== 'any') {
      switch (dropdownFilter) {

        case housingType:
          isMatching *= item.offer.type === housingType.value;
          break;

        case housingPrice:
          switch (housingPrice.value) {
            case 'low':
              isMatching *= item.offer.price < 10000;
              break;
            case 'middle':
              isMatching *= item.offer.price >= 10000 && item.offer.price < 50000;
              break;
            case 'high':
              isMatching *= item.offer.price >= 50000;
              break;
          }
          break;

        case housingRooms:
          isMatching *= item.offer.rooms === Number(housingRooms.value);
          break;

        case housingGuests:
          isMatching *= item.offer.guests === Number(housingGuests.value);
          break;
      }
    }
  }

  for (const housingFeature of housingFeatures) {
    if (housingFeature.checked) {
      if (item.offer.features) {
        isMatching *= item.offer.features.some((feature) => feature === housingFeature.value);
      } else {
        isMatching *= false;
      }
    }
  }

  return isMatching;
}

function setFilterChange(callback) {
  mapFilters.addEventListener('change', (evt) => {
    if (evt.target.nodeName === 'SELECT' || evt.target.nodeName === 'INPUT') {
      callback();
    }
  });
}

disableFilters();

export { enableFilters, filterOffer, setFilterChange };
