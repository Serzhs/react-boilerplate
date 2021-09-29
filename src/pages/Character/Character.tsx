import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { CharacterType } from '../Characters/Characters';
import CharacterItem from '../../components/CharacterItem/CharacterItem';
import './Character.scss';
import 'react-toastify/dist/ReactToastify.css';

const Character = () => {
  const [character, setCharacter] = useState<CharacterType>();
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{id: string}>();
  const history = useHistory();

  useEffect(() => {
    axios.get(`/character/${id}`).then(({ data }) => {
      setCharacter(data);
      setLoading(false);
    }).catch(() => {
      toast('Something went wrong', {
        type: 'error',
      });
      history.push('/');
    });
  }, [id]);

  return (
    <div>
      <button className="back" onClick={() => history.push('/')}>
        ⬅️ Back
      </button>
      {loading && (<h1>Loading....</h1>)}
      <div className="characterWrapper">
        {character && !loading && (
          <CharacterItem
            name={character.name}
            status={character.status}
            image={character.image}
            clickable={false}
          />
        )}
      </div>
    </div>
  );
};

export default Character;
