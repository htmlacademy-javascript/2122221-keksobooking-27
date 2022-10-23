import { sendData } from './api.js';
import { showMessage } from './message.js';
import { enableElement, disableElement } from './util.js';
import { setSpecialMarker, closePopups, setDefaultMapView } from './map.js';

const adForm = document.querySelector('.ad-form');
const type = document.querySelector('#type');
const price = document.querySelector('#price');
const slider = document.querySelector('.ad-form__slider');
const timein = document.querySelector('#timein');
const timeout = document.querySelector('#timeout');
const roomNumber = adForm.querySelector('#room_number');
const capacity = adForm.querySelector('#capacity');
const submitButton = adForm.querySelector('.ad-form__submit');
const resetButton = adForm.querySelector('.ad-form__reset');

const accommodationOption = {
  '1': ['1'],
  '2': ['2', '1'],
  '3': ['3', '2', '1'],
  '100': ['0'],
};

const minCostOfTypes = {
  bungalow: 0,
  flat: 1000,
  hotel: 3000,
  house: 5000,
  palace: 10000,
};

const pristine = new Pristine(adForm, {
  classTo: 'ad-form__element',
  errorClass: 'ad-form__element--invalid',
  errorTextParent: 'ad-form__element',
});

function disableForm() {
  disableElement(adForm);
  slider.setAttribute('disabled', true);
}

function enableForm() {
  enableElement(adForm);
  slider.removeAttribute('disabled');
}

function onResetButtonClick(evt) {
  evt.preventDefault();
  resetForm();
}

function resetForm() {
  adForm.reset();
  setSpecialMarker();
  closePopups();
  setDefaultMapView();
}

function validateAccommodation() {
  return accommodationOption[roomNumber.value].includes(capacity.value);
}

function getAccommodationErrorMessage() {
  return 'Выбранное количество гостей недопустимо для выбранного количества комнат';
}

pristine.addValidator(roomNumber, validateAccommodation, getAccommodationErrorMessage);

capacity.addEventListener('change', () => pristine.validate(roomNumber));

function validateMinPrice() {
  return minCostOfTypes[type.value] <= price.value;
}

function getMinPriceErrorMessage() {
  return `Минимальная цена для выбранного типа жилья ${minCostOfTypes[type.value]}`;
}

pristine.addValidator(price, validateMinPrice, getMinPriceErrorMessage);

type.addEventListener('change', () => {
  price.placeholder = minCostOfTypes[type.value];
  pristine.validate(price);
});

timein.addEventListener('change', () => {
  timeout.value = timein.value;
});

timeout.addEventListener('change', () => {
  timein.value = timeout.value;
});

adForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();
  if (isValid) {
    submitButton.disabled = true;
    sendData(
      () => {
        showMessage('success');
        submitButton.disabled = false;
        resetForm();
      },
      () => {
        showMessage('error');
        submitButton.disabled = false;
      },
      new FormData(evt.target)
    );
  }
});

resetButton.addEventListener('click', (evt) => onResetButtonClick(evt));

noUiSlider.create(slider, {
  range: {
    min: 0,
    max: 100000,
  },
  start: 5000,
  step: 1,
  connect: 'lower',
  format: {
    to: function (value) {
      return value.toFixed(0);
    },
    from: function (value) {
      return parseFloat(value);
    },
  },
});

slider.noUiSlider.on('update', () => {
  price.value = slider.noUiSlider.get();
});

disableForm();

export { enableForm };
