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

export { getRandomPositiveInteger, getRandomGeographicCoordinate, getRandomArrayElement };
