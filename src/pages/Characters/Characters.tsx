import React, { useEffect, useRef, useState } from 'react';
import './Characters.scss';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import CharacterItem from '../../components/CharacterItem/CharacterItem';

axios.defaults.baseURL = 'https://rickandmortyapi.com/api';

export type CharacterType = {
  id: number;
  name: string;
  status: string;
  image: string;
}

const Characters = () => {
  const history = useHistory();
  const [characters, setCharacters] = useState<CharacterType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const totalPages = useRef(0);

  useEffect(() => {
    axios.get(`/character?page=${page}`).then(({ data }) => {
      const { results, info } = data;

      const newCharacters = characters.concat(results);

      if (page === 1) {
        totalPages.current = info.pages;
      }

      setCharacters(newCharacters);
      setLoading(false);
    });
  }, [page]);

  return (
    <div>
      {loading && (<h1>Loading....</h1>)}
      {!loading && (
        <div>
          <div className="characters">
            {characters.map(({
              id, name, status, image,
            }) => (
              <CharacterItem
                key={id}
                clickable
                name={name}
                status={status}
                image={image}
                onClick={() => history.push(`/character/${id}`)}
              />
            ))}
          </div>
          <div className="character__buttonWrapper">
            {totalPages.current > page && (
              <button
                className="character__button"
                type="button"
                onClick={() => {
                  setPage(page + 1);
                }}
              >
                Load more
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Characters;
