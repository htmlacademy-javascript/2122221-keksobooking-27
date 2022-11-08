function declineWordAccordingToNumber(value, words) {
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

export { declineWordAccordingToNumber, enableElement, disableElement, debounce };
