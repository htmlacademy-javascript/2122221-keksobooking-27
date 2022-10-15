const mapFilters = document.querySelector('.map__filters');
const adForm = document.querySelector('.ad-form');
const type = document.querySelector('#type');
const price = document.querySelector('#price');
const timein = document.querySelector('#timein');
const timeout = document.querySelector('#timeout');
const roomNumber = adForm.querySelector('#room_number');
const capacity = adForm.querySelector('#capacity');

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

function enableElement(element) {
  element.classList.remove(`${element.classList[0]}--disabled`);
  for (const item of element.children) {
    item.disabled = false;
  }
}

function disableElement(element) {
  element.classList.add(`${element.classList[0]}--disabled`);
  for (const item of element.children) {
    item.disabled = true;
  }
}

function deactivatePage() {
  disableElement(mapFilters);
  disableElement(adForm);
}

function activatePage() {
  enableElement(mapFilters);
  enableElement(adForm);
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

  pristine.validate();
});

deactivatePage();
activatePage();
