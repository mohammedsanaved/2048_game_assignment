import { JSX, useCallback, useContext, useEffect, useRef } from 'react';
// import { Tile as TileModel } from '../types/tile';
import '../styles/Board.css';
// import Tile from '../components/Tile';
import { GameContext } from '../context/game-context';
import MobileSwiper, { SwipeInput } from './mobile-swipe';
import Toast from './Toast';
import '../styles/Tile.css';

export default function Board() {
  const { getTiles, moveTiles, startGame, status, boardSize } =
    useContext(GameContext);
  const initialized = useRef(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();
      switch (e.code) {
        case 'ArrowUp':
          moveTiles('move_up');
          break;
        case 'ArrowDown':
          moveTiles('move_down');
          break;
        case 'ArrowLeft':
          moveTiles('move_left');
          break;
        case 'ArrowRight':
          moveTiles('move_right');
          break;
      }
    },
    [moveTiles]
  );

  const handleSwipe = useCallback(
    ({ deltaX, deltaY }: SwipeInput) => {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        deltaX > 0 ? moveTiles('move_right') : moveTiles('move_left');
      } else {
        deltaY > 0 ? moveTiles('move_down') : moveTiles('move_up');
      }
    },
    [moveTiles]
  );

  const renderGrid = () => {
    const cells: JSX.Element[] = [];
    const totalCellsCount = boardSize * boardSize;

    for (let index = 0; index < totalCellsCount; index += 1) {
      cells.push(<div className={`cell`} key={index} />);
    }

    return (
      <div
        className='grid'
        style={{
          gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
          gridTemplateRows: `repeat(${boardSize}, 1fr)`,
        }}
      >
        {cells}
      </div>
    );
  };

  // const renderTiles = () => {
  //   return getTiles().map((tile: TileModel) => (
  //     <Tile key={`${tile?.id}`} {...tile} />
  //   ));
  // };

  useEffect(() => {
    if (!initialized.current) {
      startGame(boardSize);
      initialized.current = true;
    }
  }, [startGame, boardSize]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <MobileSwiper onSwipe={handleSwipe}>
      <div
        className={`board`}
        style={{ '--board-size': boardSize } as React.CSSProperties}
      >
        {status === 'won' && <Toast heading='You won!' type='won' />}
        {status === 'lost' && <Toast heading='You lost!' />}
        {/* <div className={`tiles`}>{renderTiles()}</div> */}
        <div
          className='tiles'
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
            gridTemplateRows: `repeat(${boardSize}, 1fr)`,
          }}
        >
          {getTiles().map((tile) => (
            <div
              key={tile?.id}
              className={`tile tile${tile?.value}`}
              style={{
                gridColumnStart: tile?.position[0] + 1,
                gridRowStart: tile?.position[1] + 1,
              }}
            >
              {tile?.value}
            </div>
          ))}
        </div>

        {renderGrid()}
      </div>
    </MobileSwiper>
  );
}
