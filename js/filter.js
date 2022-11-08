import { enableElement, disableElement } from './util.js';

const mapFilters = document.querySelector('.map__filters');
const housingType = mapFilters.querySelector('#housing-type');
const housingPrice = mapFilters.querySelector('#housing-price');
const housingRooms = mapFilters.querySelector('#housing-rooms');
const housingGuests = mapFilters.querySelector('#housing-guests');
const housingFeatures = mapFilters.querySelector('#housing-features').querySelectorAll('input');

const dropdownFilters = [housingType, housingPrice, housingRooms, housingGuests];

const PriceLimits = {
  LOW: 10000,
  MIDDLE: 50000,
};

function disableFilters() {
  disableElement(mapFilters);
}

function enableFilters() {
  enableElement(mapFilters);
}

function resetFilters() {
  mapFilters.reset();
}

function filterOffer(item) {
  let isMatching = true;

  dropdownFilters.forEach((dropdownFilter) => {
    if (dropdownFilter.value !== 'any') {
      switch (dropdownFilter) {

        case housingType:
          isMatching = isMatching && item.offer.type === housingType.value;
          break;

        case housingPrice:
          switch (housingPrice.value) {
            case 'low':
              isMatching = isMatching && item.offer.price < PriceLimits.LOW;
              break;
            case 'middle':
              isMatching = isMatching && item.offer.price >= PriceLimits.LOW && item.offer.price < PriceLimits.MIDDLE;
              break;
            case 'high':
              isMatching = isMatching && item.offer.price >= PriceLimits.MIDDLE;
              break;
          }
          break;

        case housingRooms:
          isMatching = isMatching && item.offer.rooms === Number(housingRooms.value);
          break;

        case housingGuests:
          isMatching = isMatching && item.offer.guests === Number(housingGuests.value);
          break;
      }
    }
  });

  housingFeatures.forEach((housingFeature) => {
    if (housingFeature.checked) {
      if (item.offer.features) {
        isMatching = isMatching && item.offer.features.some((feature) => feature === housingFeature.value);
      } else {
        isMatching = isMatching && false;
      }
    }
  });

  return isMatching;
}

function setFilterChange(callback) {
  mapFilters.addEventListener('change', (evt) => {
    if (evt.target.nodeName === 'SELECT' || evt.target.nodeName === 'INPUT') {
      callback();
    }
  });

  mapFilters.addEventListener('reset', () => {
    callback();
  });
}

disableFilters();

export { enableFilters, resetFilters, filterOffer, setFilterChange };
