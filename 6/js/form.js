const mapFilters = document.querySelector('.map__filters');
const adForm = document.querySelector('.ad-form');

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

deactivatePage();
activatePage();
