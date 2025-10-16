import { GameContext } from '../context/game-context';
import '../styles/Toast.css';
import { useContext } from 'react';

export default function Toast({ heading = 'You won!', type = '' }) {
  const { startGame } = useContext(GameContext);

  return (
    <div className={`splash ${type === 'won' && 'win'}`}>
      <div>
        <h1>{heading}</h1>
        <button className='button' onClick={startGame}>
          Play again
        </button>
      </div>
    </div>
  );
}
