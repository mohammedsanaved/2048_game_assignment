import { GameContext } from '../context/game-context';
import '../styles/Score.css';
import { useContext } from 'react';
import { gameWinTileValue } from '../../contant';

export default function ScoreBoard() {
  const { score } = useContext(GameContext);

  return (
    <div className={`score`}>
      <div
        style={{ display: 'flex', flexDirection: 'column' }}
        className='total-score'
      >
        <span style={{ color: 'var(--button-background)' }}>Win Score</span>
        <div style={{ color: 'var(--button-background)' }}>
          {gameWinTileValue}
        </div>
      </div>
      <div
        style={{ display: 'flex', flexDirection: 'column' }}
        className='current-score'
      >
        <span style={{ color: 'var(--button-background)' }}>Current Score</span>
        <div style={{ color: 'var(--button-background)' }}>{score}</div>
      </div>
    </div>
  );
}
