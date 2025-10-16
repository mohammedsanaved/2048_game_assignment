import { memo, useEffect, useState, useContext } from 'react';
import { useMediaQuery } from 'react-responsive';
import { mergeAnimationDuration } from '../../contant';
import { Tile as TileProps } from '../types/tile';
import usePreviousProps from '../hooks/use-previous-prop';
import { GameContext } from '../context/game-context';
import '../styles/Tile.css';

function parsePx(value: string | null): number {
  if (!value) return 0;
  return Number(value.replace('px', '').trim()) || 0;
}

function Tile({ position, value }: TileProps) {
  const { boardSize } = useContext(GameContext);
  const isWideScreen = useMediaQuery({ minWidth: 512 });

  const [scale, setScale] = useState(1);
  const previousValue = usePreviousProps<number>(value);
  const hasChanged = previousValue !== value;

  const [styleLeft, setStyleLeft] = useState(0);
  const [styleTop, setStyleTop] = useState(0);
  const [tileSize, setTileSize] = useState(0);

  /** 🔧 Compute actual pixel position & tile size using grid cell geometry */
  const computePosition = () => {
    if (!position || !Array.isArray(position) || position.length < 2) return;

    const grid = document.querySelector('.grid') as HTMLElement | null;
    const board = document.querySelector('.board') as HTMLElement | null;
    if (!grid || !board) return;

    const gridRect = grid.getBoundingClientRect();
    const boardRect = board.getBoundingClientRect();
    const cs = getComputedStyle(grid);

    // read actual grid gap (supports different browsers)
    const gapX = parsePx(cs.columnGap || cs.gap);
    const gapY = parsePx(cs.rowGap || cs.gap);

    // calculate cell size based on grid size minus gaps
    const cellWidth = (gridRect.width - gapX * (boardSize - 2)) / boardSize;
    const cellHeight = (gridRect.height - gapY * (boardSize - 2)) / boardSize;
    const cellSize = Math.min(cellWidth, cellHeight);

    // reduce tile size and add gap between tiles for better separation
    const tileSize = cellSize * 0.5;
    const sizeOffset = (cellSize - tileSize) / 2;

    // position offset relative to .board container
    const offsetLeft = gridRect.left - boardRect.left;
    const offsetTop = gridRect.top - boardRect.top;

    const [col, row] = position;

    // compute pixel position including gaps and centering offset
    const left = offsetLeft + col * (cellSize + gapX) + sizeOffset;
    const top = offsetTop + row * (cellSize + gapY) + sizeOffset;

    setStyleLeft(left);
    setStyleTop(top);
    setTileSize(tileSize);
  };

  useEffect(() => {
    computePosition();
    const handleResize = () => computePosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position, boardSize]);

  useEffect(() => {
    if (hasChanged) {
      setScale(1.1);
      const t = setTimeout(() => setScale(1), mergeAnimationDuration);
      return () => clearTimeout(t);
    }
  }, [hasChanged]);

  if (!position || !Array.isArray(position) || position.length < 2) return null;

  const style: React.CSSProperties = {
    left: `${styleLeft}px`,
    top: `${styleTop}px`,
    width: `${tileSize}px`,
    height: `${tileSize}px`,
    lineHeight: `${tileSize}px`,
    fontSize: `${Math.max(12, Math.floor(tileSize / 2.5))}px`,
    transform: `scale(${scale})`,
    zIndex: value,
    position: 'absolute',
  };

  return (
    <div className={`tile tile${value}`} style={style}>
      {value}
    </div>
  );
}

export default memo(
  Tile,
  (prev, next) =>
    prev.value === next.value &&
    prev.position[0] === next.position[0] &&
    prev.position[1] === next.position[1]
);
