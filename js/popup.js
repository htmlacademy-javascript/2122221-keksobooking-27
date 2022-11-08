import { declineWordAccordingToNumber } from './util.js';

const TYPES_RUS = {
  flat: 'Квартира',
  bungalow: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
  hotel: 'Отель',
};

const offerTemplate = document.querySelector('#card')
  .content
  .querySelector('.popup');

function createCustomPopup(point) {
  const { author, offer } = point;
  const offerElement = offerTemplate.cloneNode(true);

  if (author.avatar) {
    offerElement.querySelector('.popup__avatar').src = author.avatar;
  }

  offerElement.querySelector('.popup__title').textContent = offer.title;
  offerElement.querySelector('.popup__text--address').textContent = offer.address;
  offerElement.querySelector('[data-price]').textContent = offer.price;
  offerElement.querySelector('.popup__type').textContent = TYPES_RUS[offer.type];

  const declinedRooms = declineWordAccordingToNumber(offer.rooms, ['комната', 'комнаты', 'комнат']);
  const declinedGuests = declineWordAccordingToNumber(offer.guests, ['гостя', 'гостей', 'гостей']);
  offerElement.querySelector('.popup__text--capacity').textContent = `${offer.rooms} ${declinedRooms} для ${offer.guests} ${declinedGuests}`;

  offerElement.querySelector('.popup__text--time').textContent = `Заезд после ${offer.checkin}, выезд до ${offer.checkout}`;

  const featuresContainer = offerElement.querySelector('.popup__features');
  if (offer.features) {
    const featuresList = featuresContainer.querySelectorAll('.popup__feature');
    featuresList.forEach((featuresListItem) => {
      const isNecessary = offer.features.some(
        (feature) => featuresListItem.classList.contains(`popup__feature--${feature}`),
      );

      if (!isNecessary) {
        featuresListItem.remove();
      }
    });
  } else {
    featuresContainer.remove();
  }

  const offerDescription = offerElement.querySelector('.popup__description');
  if (offer.description) {
    offerDescription.textContent = offer.description;
  } else {
    offerDescription.remove();
  }

  const photosList = offerElement.querySelector('.popup__photos');
  if (offer.photos) {
    const photosListItem = photosList.querySelector('.popup__photo');
    photosListItem.remove();
    for (let i = 0; i < offer.photos.length; i++) {
      const photoElement = photosListItem.cloneNode(true);
      photoElement.src = offer.photos[i];
      photosList.appendChild(photoElement);
    }
  } else {
    photosList.remove();
  }

  return offerElement;
}

export { createCustomPopup };
