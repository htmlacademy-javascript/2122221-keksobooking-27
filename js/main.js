function getRandomPositiveInteger(min, max) {
  if (min < 0 || max < 0 || typeof min !== 'number' || typeof max !== 'number') {
    return NaN;
  }

  if (min > max) {
    const swap = min;
    min = max;
    max = swap;
  }

  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

getRandomPositiveInteger(4.9, 2.5);


function getRandomGeographicCoordinate(min, max, decimals) {
  if (min < 0 || max < 0 || decimals < 0 || typeof min !== 'number' || typeof max !== 'number' || typeof decimals !== 'number') {
    return NaN;
  }

  if (min > max) {
    const swap = min;
    min = max;
    max = swap;
  }

  return +(Math.random() * (max - min) + min).toFixed(decimals);
}

getRandomGeographicCoordinate(1.2, 2.3, 2);
