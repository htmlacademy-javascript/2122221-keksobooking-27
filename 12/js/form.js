import { sendData } from './api.js';
import { showMessage } from './message.js';
import { enableElement, disableElement } from './util.js';
import { setSpecialMarker, closePopups, setDefaultMapView } from './map.js';

const FYLE_TYPES = ['jpg', 'jpeg', 'png'];

const adForm = document.querySelector('.ad-form');
const avatarChooser = adForm.querySelector('#avatar');
const avatarPreview = adForm.querySelector('.ad-form-header__preview img');
const avatarPreviewPlaceholderSrc = avatarPreview.src;
const type = adForm.querySelector('#type');
const price = adForm.querySelector('#price');
const slider = adForm.querySelector('.ad-form__slider');
const timein = adForm.querySelector('#timein');
const timeout = adForm.querySelector('#timeout');
const roomNumber = adForm.querySelector('#room_number');
const capacity = adForm.querySelector('#capacity');
const photoChooser = adForm.querySelector('#images');
const photoPlaceholder = adForm.querySelector('.ad-form__photo');
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

  if (avatarPreview.src !== avatarPreviewPlaceholderSrc) {
    avatarPreview.src = avatarPreviewPlaceholderSrc;
  }

  const housingPhoto = photoPlaceholder.querySelector('img');
  if (housingPhoto) {
    housingPhoto.remove();
  }

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

function validateMinPrice() {
  return minCostOfTypes[type.value] <= price.value;
}

function getMinPriceErrorMessage() {
  return `Минимальная цена для выбранного типа жилья ${minCostOfTypes[type.value]}`;
}

function checkImageType(file) {
  const fileName = file.name.toLowerCase();
  const matches = FYLE_TYPES.some((fileType) => fileName.endsWith(fileType));
  return matches;
}

avatarChooser.addEventListener('change', () => {
  if (avatarChooser.files.length > 0) {
    const file = avatarChooser.files[0];

    if (checkImageType(file)) {
      avatarPreview.src = URL.createObjectURL(file);
      avatarPreview.style.objectFit = 'cover';
    }
  }
});

photoChooser.addEventListener('change', () => {
  if (photoChooser.files.length > 0) {
    const file = photoChooser.files[0];

    if (checkImageType(file)) {
      const previousUploadedImage = photoPlaceholder.querySelector('img');

      if (previousUploadedImage) {
        previousUploadedImage.src = URL.createObjectURL(file);
      } else {
        const photoPreview = document.createElement('img');
        photoPreview.src = URL.createObjectURL(file);
        photoPreview.alt = 'Фотография жилья';
        photoPreview.width = '70';
        photoPreview.height = '70';
        photoPreview.style.objectFit = 'cover';
        photoPlaceholder.append(photoPreview);
      }
    }
  }
});

pristine.addValidator(roomNumber, validateAccommodation, getAccommodationErrorMessage);

capacity.addEventListener('change', () => pristine.validate(roomNumber));

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
