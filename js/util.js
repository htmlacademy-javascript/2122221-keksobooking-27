function getRandomPositiveInteger(min, max) {
  if (min < 0 || max < 0 || typeof min !== 'number' || typeof max !== 'number') {
    return NaN;
  }

  const lower = Math.ceil(Math.min(min, max));
  const greater = Math.floor(Math.max(min, max));

  return Math.floor(Math.random() * (greater - lower + 1)) + lower;
}

function getRandomGeographicCoordinate(min, max, decimals) {
  if (min < 0 || max < 0 || decimals < 0 || typeof min !== 'number' || typeof max !== 'number' || typeof decimals !== 'number') {
    return NaN;
  }

  const lower = Math.min(min, max);
  const greater = Math.max(min, max);

  return Number((Math.random() * (greater - lower) + lower).toFixed(decimals));
}

const getRandomArrayElement = (elements) => elements[getRandomPositiveInteger(0, elements.length - 1)];

function createIdGenerator() {
  let lastGeneratedId = 0;

  return function () {
    lastGeneratedId++;
    return lastGeneratedId;
  };
}

function declineNumerals(value, words) {
  const remainderOfDivisionBy100 = Math.abs(value) % 100;
  const remainderOfDivisionBy10 = remainderOfDivisionBy100 % 10;
  if (remainderOfDivisionBy100 > 10 && remainderOfDivisionBy100 < 20) { return words[2]; }
  if (remainderOfDivisionBy10 > 1 && remainderOfDivisionBy10 < 5) { return words[1]; }
  if (remainderOfDivisionBy10 === 1) { return words[0]; }
  return words[2];
}

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

function debounce(callback, timeoutDelay = 500) {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
}

function createCloseButton(color = 'white', padding = '4px') {
  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.style.position = 'absolute';
  closeButton.style.top = 0;
  closeButton.style.right = 0;
  closeButton.style.padding = padding;
  closeButton.style.border = 'none';
  closeButton.style.font = '16px/14px Tahoma, Verdana, sans-serif';
  closeButton.style.color = color;
  closeButton.style.backgroundColor = 'transparent';
  closeButton.textContent = '×';
  return closeButton;
}

export { getRandomPositiveInteger, getRandomGeographicCoordinate, getRandomArrayElement, createIdGenerator, declineNumerals, enableElement, disableElement, debounce, createCloseButton };
