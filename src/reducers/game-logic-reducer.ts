import { uid } from 'uid';
import { Tile, TileMap } from '../types/tile';
import { flattenDeep, isEqual, isNil } from 'lodash';

export type GameStatus = 'ongoing' | 'won' | 'lost';

export type State = {
  board: string[][];
  tiles: TileMap;
  tilesByIds: string[];
  hasChanged: boolean;
  score: number;
  status: GameStatus;
  boardSize: number;
};
type Action =
  | { type: 'create_tile'; tile: Tile }
  | { type: 'clean_up' }
  | { type: 'move_up' }
  | { type: 'move_down' }
  | { type: 'move_left' }
  | { type: 'move_right' }
  | { type: 'reset_game' }
  | { type: 'init_game'; payload: { size: number } }
  | { type: 'update_status'; status: GameStatus };

function createBoard(size = 4) {
  const board: string[][] = [];

  for (let i = 0; i < size; i += 1) {
    board[i] = new Array(size).fill(undefined);
  }

  return board;
}

/**
 * initializeTiles: create an empty board and place two starting tiles (2 or 4)
 */
function initializeTiles(size: number) {
  const board = createBoard(size);
  const tiles: TileMap = {};

  const emptyPositions: [number, number][] = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      emptyPositions.push([x, y]);
    }
  }

  const pickEmpty = () => {
    if (emptyPositions.length === 0) return null;
    const idx = Math.floor(Math.random() * emptyPositions.length);
    const pos = emptyPositions.splice(idx, 1)[0];
    return pos;
  };

  for (let i = 0; i < 2; i++) {
    const pos = pickEmpty();
    if (!pos) break;
    const [x, y] = pos;
    const id = uid();
    const value = Math.random() < 0.9 ? 2 : 4;
    tiles[id] = { id, position: [x, y], value };
    board[y][x] = id;
  }

  return { board, tiles, tilesByIds: Object.keys(tiles) };
}

export const initialState: State = {
  board: createBoard(4),
  tiles: {},
  tilesByIds: [],
  hasChanged: false,
  score: 0,
  status: 'ongoing',
  boardSize: 4,
};

export const gameReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'clean_up': {
      const flattenBoard = flattenDeep(state.board);
      const newTiles: TileMap = flattenBoard.reduce(
        (result, tileId: string) => {
          if (isNil(tileId)) {
            return result;
          }

          return {
            ...result,
            [tileId]: state.tiles[tileId],
          };
        },
        {}
      );

      return {
        ...state,
        tiles: newTiles,
        tilesByIds: Object.keys(newTiles),
        hasChanged: false,
      };
    }
    case 'create_tile': {
      const tileId = uid();
      const [x, y] = action.tile.position;
      const newBoard = JSON.parse(JSON.stringify(state.board));
      newBoard[y][x] = tileId;
      return {
        ...state,
        board: newBoard,
        tiles: {
          ...state.tiles,
          [tileId]: {
            id: tileId,
            ...action.tile,
          },
        },
        tilesByIds: [...state.tilesByIds, tileId],
      };
    }
    case 'move_up': {
      const newBoard = createBoard(state.boardSize);
      const newTiles: TileMap = {};
      let hasChanged = false;
      let { score } = state;

      for (let x = 0; x < state.boardSize; x++) {
        let newY = 0;
        let previousTile: Tile | undefined;

        for (let y = 0; y < state.boardSize; y++) {
          const tileId = state.board[y][x];
          const currentTile = state.tiles[tileId];

          if (!isNil(tileId)) {
            if (previousTile?.value === currentTile.value) {
              score += previousTile.value * 2;
              newTiles[previousTile.id as string] = {
                ...previousTile,
                value: previousTile.value * 2,
              };
              newTiles[tileId] = {
                ...currentTile,
                position: [x, newY - 1],
              };
              previousTile = undefined;
              hasChanged = true;
              continue;
            }

            newBoard[newY][x] = tileId;
            newTiles[tileId] = {
              ...currentTile,
              position: [x, newY],
            };
            previousTile = newTiles[tileId];
            if (!isEqual(currentTile.position, [x, newY])) {
              hasChanged = true;
            }
            newY++;
          }
        }
      }
      return {
        ...state,
        board: newBoard,
        tiles: newTiles,
        hasChanged,
        score,
      };
    }
    case 'move_down': {
      const newBoard = createBoard(state.boardSize);
      const newTiles: TileMap = {};
      let hasChanged = false;
      let { score } = state;

      for (let x = 0; x < state.boardSize; x++) {
        let newY = state.boardSize - 1;
        let previousTile: Tile | undefined;

        for (let y = state.boardSize - 1; y >= 0; y--) {
          const tileId = state.board[y][x];
          const currentTile = state.tiles[tileId];

          if (!isNil(tileId)) {
            if (previousTile?.value === currentTile.value) {
              score += previousTile.value * 2;
              newTiles[previousTile.id as string] = {
                ...previousTile,
                value: previousTile.value * 2,
              };
              newTiles[tileId] = {
                ...currentTile,
                position: [x, newY + 1],
              };
              previousTile = undefined;
              hasChanged = true;
              continue;
            }

            newBoard[newY][x] = tileId;
            newTiles[tileId] = {
              ...currentTile,
              position: [x, newY],
            };
            previousTile = newTiles[tileId];
            if (!isEqual(currentTile.position, [x, newY])) {
              hasChanged = true;
            }
            newY--;
          }
        }
      }
      return {
        ...state,
        board: newBoard,
        tiles: newTiles,
        hasChanged,
        score,
      };
    }
    case 'move_left': {
      const newBoard = createBoard(state.boardSize);
      const newTiles: TileMap = {};
      let hasChanged = false;
      let { score } = state;

      for (let y = 0; y < state.boardSize; y++) {
        let newX = 0;
        let previousTile: Tile | undefined;

        for (let x = 0; x < state.boardSize; x++) {
          const titleId = state.board[y][x];
          const currentTile = state.tiles[titleId];

          if (!isNil(titleId)) {
            if (previousTile?.value === currentTile.value) {
              score += previousTile.value * 2;
              newTiles[previousTile.id as string] = {
                ...previousTile,
                value: previousTile.value * 2,
              };
              newTiles[titleId] = {
                ...currentTile,
                position: [newX - 1, y],
              };
              previousTile = undefined;
              hasChanged = true;
              continue;
            }

            newBoard[y][newX] = titleId;
            newTiles[titleId] = {
              ...currentTile,
              position: [newX, y],
            };
            previousTile = newTiles[titleId];
            if (!isEqual(currentTile.position, [newX, y])) {
              hasChanged = true;
            }
            newX++;
          }
        }
      }
      return {
        ...state,
        board: newBoard,
        tiles: newTiles,
        hasChanged,
        score,
      };
    }
    case 'move_right': {
      const newBoard = createBoard(state.boardSize);
      const newTiles: TileMap = {};
      let hasChanged = false;
      let { score } = state;

      for (let y = 0; y < state.boardSize; y++) {
        let newX = state.boardSize - 1;
        let previousTile: Tile | undefined;

        for (let x = state.boardSize - 1; x >= 0; x--) {
          const tileId = state.board[y][x];
          const currentTile = state.tiles[tileId];
          if (!isNil(tileId)) {
            if (previousTile?.value === currentTile.value) {
              score += previousTile.value * 2;
              newTiles[previousTile.id as string] = {
                ...previousTile,
                value: previousTile.value * 2,
              };
              newTiles[tileId] = {
                ...currentTile,
                position: [newX + 1, y],
              };
              previousTile = undefined;
              hasChanged = true;
              continue;
            }

            newBoard[y][newX] = tileId;
            newTiles[tileId] = {
              ...currentTile,
              position: [newX, y],
            };
            previousTile = newTiles[tileId];
            if (!isEqual(currentTile.position, [newX, y])) {
              hasChanged = true;
            }
            newX--;
          }
        }
      }
      return {
        ...state,
        board: newBoard,
        tiles: newTiles,
        hasChanged,
        score,
      };
    }
    case 'reset_game': {
      return {
        ...initialState,
        board: createBoard(state.boardSize),
        boardSize: state.boardSize,
      };
    }
    case 'update_status': {
      return {
        ...state,
        status: action.status,
      };
    }
    case 'init_game': {
      const size = action.payload.size;
      const { board, tiles, tilesByIds } = initializeTiles(size);

      return {
        ...state,
        board,
        tiles,
        tilesByIds,
        boardSize: size,
        score: 0,
        hasChanged: false,
        status: 'ongoing',
      };
    }
    default:
      return state;
  }
};
