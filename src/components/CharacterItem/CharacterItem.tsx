import React from 'react';
import './CharacterItem.scss';

type CharacterItemProp = {
  image: string
  name: string
  status: string
  clickable: boolean;
  onClick?: () => void
}

const CharacterItem = ({
  name, status, image, clickable, onClick,
}: CharacterItemProp) => (
  <div
    className={`character ${clickable && 'clickable'}`}
    onClick={onClick}
  >
    <img src={image} alt={name} className="character__image" />
    <div className="character__content">
      <h4>{name}</h4>
      <span className={`status ${status.toLocaleLowerCase()}`} />
    </div>
  </div>
);

export default CharacterItem;
