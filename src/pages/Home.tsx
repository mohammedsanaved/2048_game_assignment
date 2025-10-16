import { useContext } from 'react';
import { GameContext } from '../context/game-context';
import '../styles/Home.css';

export default function Home() {
  const { startGame } = useContext(GameContext);

  return (
    <div className='container'>
      <button className='restart-button' onClick={() => startGame(4)}>
        Restart
      </button>

      <div className='controls'>
        <span className='start-text'>Start size:</span>
        <div className='button-group'>
          {[3, 4, 5, 6].map((s) => (
            <button key={s} onClick={() => startGame(s)} className='button'>
              {s}×{s}
            </button>
          ))}
          <button onClick={() => startGame(4)} className='button'>
            Default 4×4
          </button>
        </div>
      </div>
    </div>
  );
}
