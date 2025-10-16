import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useReducer,
} from 'react';
import { isNil, throttle } from 'lodash';
import { gameWinTileValue, mergeAnimationDuration } from '../../contant';
import { Tile } from '../types/tile';
import { initialState, gameReducer } from '../reducers/game-logic-reducer';
import { MoveDirection } from '../types/moveDirections';

export const GameContext = createContext({
  score: 0,
  status: 'ongoing',
  boardSize: 4,
  moveTiles: (_: MoveDirection) => {},
  getTiles: () => [] as Tile[],
  startGame: (_?: number) => {},
});

export default function GameProvider({ children }: PropsWithChildren) {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

  const getEmptyCells = () => {
    const results: [number, number][] = [];
    const size = gameState.boardSize;

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        if (isNil(gameState.board[y][x])) {
          results.push([x, y]);
        }
      }
    }
    return results;
  };

  const appendRandomTile = () => {
    const emptyCells = getEmptyCells();
    if (emptyCells.length > 0) {
      const cellIndex = Math.floor(Math.random() * emptyCells.length);
      const newTileValue = Math.random() < 0.9 ? 2 : 4;
      const newTile = {
        position: emptyCells[cellIndex],
        value: newTileValue,
      };
      dispatch({ type: 'create_tile', tile: newTile });
    }
  };

  const getTiles = () => {
    return gameState.tilesByIds.map((tileId) => gameState.tiles[tileId]);
  };

  const moveTiles = useCallback(
    throttle(
      (type: MoveDirection) => dispatch({ type }),
      mergeAnimationDuration * 1.05,
      { trailing: false }
    ),
    [dispatch]
  );

  const startGame = (size: number = 4) => {
    dispatch({ type: 'init_game', payload: { size } });
  };

  const checkGameState = () => {
    const { tiles, board, score, boardSize } = gameState;
    const isWon = Object.values(tiles).some((t) => t.value >= gameWinTileValue) || score >= gameWinTileValue;

    if (isWon) {
      dispatch({ type: 'update_status', status: 'won' });
      return;
    }

  const maxIndex = boardSize - 1;

  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      if (isNil(board[y][x])) return;
      if (x < maxIndex && tiles[board[y][x]]?.value === tiles[board[y][x + 1]]?.value) return;
      if (y < maxIndex && tiles[board[y][x]]?.value === tiles[board[y + 1]?.[x]]?.value) return;
    }
  }

    dispatch({ type: 'update_status', status: 'lost' });
  };

  useEffect(() => {
    if (gameState.hasChanged) {
      setTimeout(() => {
        dispatch({ type: 'clean_up' });
        appendRandomTile();
      }, mergeAnimationDuration);
    }
  }, [gameState.hasChanged]);

  useEffect(() => {
    if (!gameState.hasChanged) {
      checkGameState();
    }
  }, [gameState.hasChanged, gameState.board]);

  return (
    <GameContext.Provider
      value={{
        score: gameState.score,
        status: gameState.status,
        boardSize: gameState.boardSize,
        getTiles,
        moveTiles,
        startGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
