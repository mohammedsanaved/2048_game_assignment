import Board from './components/Board';
import ScoreBoard from './components/ScoreBoard';
import GameProvider from './context/game-context';
import Home from './pages/Home';

const App = () => {
  return (
    <div>
      <GameProvider>
        <ScoreBoard />
        <div className='board-container'>
          <Board />
        </div>
        <Home />
      </GameProvider>
    </div>
  );
};

export default App;
