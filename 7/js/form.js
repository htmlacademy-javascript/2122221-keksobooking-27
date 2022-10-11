const mapFilters = document.querySelector('.map__filters');
const adForm = document.querySelector('.ad-form');
const roomNumber = adForm.querySelector('#room_number');
const capacity = adForm.querySelector('#capacity');

const accommodationOption = {
  '1': ['1'],
  '2': ['2', '1'],
  '3': ['3', '2', '1'],
  '100': ['0'],
};

const pristine = new Pristine(adForm, {
  classTo: 'ad-form__element',
  errorClass: 'ad-form__element--invalid',
  errorTextParent: 'ad-form__element',
});

function deactivatePage() {
  mapFilters.classList.add('map__filters--disabled');
  for (const item of mapFilters.children) {
    item.disabled = true;
  }

  adForm.classList.add('ad-form--disabled');
  for (const item of adForm.children) {
    item.disabled = true;
  }
}

function activatePage() {
  mapFilters.classList.remove('map__filters--disabled');
  for (const item of mapFilters.children) {
    item.disabled = false;
  }

  adForm.classList.remove('ad-form--disabled');
  for (const item of adForm.children) {
    item.disabled = false;
  }
}

function validateAccommodation() {
  return accommodationOption[roomNumber.value].includes(capacity.value);
}

function getAccommodationErrorMessage() {
  return 'Выбранное количество гостей недопустимо для выбранного количества комнат';
}

pristine.addValidator(roomNumber, validateAccommodation, getAccommodationErrorMessage);

capacity.addEventListener('change', () => pristine.validate(roomNumber));

adForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  pristine.validate();
});

deactivatePage();
activatePage();
