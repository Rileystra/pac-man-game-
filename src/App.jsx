import { useCallback, useEffect, useMemo, useState } from "react";

const STARTING_MAZE = [
  "WWWWWWWWWWWWWWW",
  "W.............W",
  "W.WWW.WWW.WWW.W",
  "W.............W",
  "W.W.WWWWW.W.W.W",
  "W.............W",
  "WWW.W.W.W.W.WWW",
  "W.............W",
  "W.WWW.WWW.WWW.W",
  "W.............W",
  "WWWWWWWWWWWWWWW",
];

const DIRECTIONS = {
  ArrowUp: { row: -1, col: 0, rotation: -90 },
  ArrowDown: { row: 1, col: 0, rotation: 90 },
  ArrowLeft: { row: 0, col: -1, rotation: 180 },
  ArrowRight: { row: 0, col: 1, rotation: 0 },
};

const INITIAL_PACMAN = { row: 1, col: 1 };
const INITIAL_GHOST = { row: 9, col: 13 };

function createMaze() {
  return STARTING_MAZE.map((row) => row.split(""));
}

function App() {
  const [maze, setMaze] = useState(createMaze);
  const [pacman, setPacman] = useState(INITIAL_PACMAN);
  const [ghost, setGhost] = useState(INITIAL_GHOST);
  const [direction, setDirection] = useState(DIRECTIONS.ArrowRight);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("playing");

  const totalPellets = useMemo(
    () => STARTING_MAZE.join("").split("").filter((cell) => cell === ".").length,
    []
  );

  const pelletsLeft = maze.flat().filter((cell) => cell === ".").length;
  const pelletsCollected = totalPellets - pelletsLeft;

  const isWall = useCallback(
    (row, col) => maze[row]?.[col] === "W" || maze[row]?.[col] === undefined,
    [maze]
  );

  const checkCollision = useCallback((pacmanPosition, ghostPosition) => {
    return (
      pacmanPosition.row === ghostPosition.row &&
      pacmanPosition.col === ghostPosition.col
    );
  }, []);

  const movePacman = useCallback(
    (key) => {
      if (status !== "playing") return;

      const nextDirection = DIRECTIONS[key];
      if (!nextDirection) return;

      const nextPosition = {
        row: pacman.row + nextDirection.row,
        col: pacman.col + nextDirection.col,
      };

      setDirection(nextDirection);

      if (isWall(nextPosition.row, nextPosition.col)) return;

      setMaze((currentMaze) => {
        const updatedMaze = currentMaze.map((row) => [...row]);

        if (updatedMaze[nextPosition.row][nextPosition.col] === ".") {
          updatedMaze[nextPosition.row][nextPosition.col] = " ";
          setScore((currentScore) => currentScore + 10);
        }

        if (!updatedMaze.flat().includes(".")) {
          setStatus("won");
        }

        return updatedMaze;
      });

      setPacman(nextPosition);

      if (checkCollision(nextPosition, ghost)) {
        setStatus("lost");
      }
    },
    [checkCollision, ghost, isWall, pacman, status]
  );

  const moveGhost = useCallback(() => {
    if (status !== "playing") return;

    const possibleMoves = Object.values(DIRECTIONS)
      .map((move) => ({
        row: ghost.row + move.row,
        col: ghost.col + move.col,
      }))
      .filter((position) => !isWall(position.row, position.col));

    if (possibleMoves.length === 0) return;

    const nextMove =
      possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

    setGhost(nextMove);

    if (checkCollision(pacman, nextMove)) {
      setStatus("lost");
    }
  }, [checkCollision, ghost, isWall, pacman, status]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key in DIRECTIONS) {
        event.preventDefault();
        movePacman(event.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [movePacman]);

  useEffect(() => {
    const ghostTimer = setInterval(moveGhost, 500);
    return () => clearInterval(ghostTimer);
  }, [moveGhost]);

  function restartGame() {
    setMaze(createMaze());
    setPacman(INITIAL_PACMAN);
    setGhost(INITIAL_GHOST);
    setDirection(DIRECTIONS.ArrowRight);
    setScore(0);
    setStatus("playing");
  }

  function renderCell(cell, rowIndex, colIndex) {
    const hasPacman = pacman.row === rowIndex && pacman.col === colIndex;
    const hasGhost = ghost.row === rowIndex && ghost.col === colIndex;

    return (
      <div
        className={`cell ${cell === "W" ? "wall" : "path"}`}
        key={`${rowIndex}-${colIndex}`}
      >
        {hasPacman && (
          <div
            className="pacman"
            style={{ transform: `rotate(${direction.rotation}deg)` }}
            aria-label="Pac-Man"
          />
        )}

        {hasGhost && (
          <div className="ghost" aria-label="Ghost">
            👻
          </div>
        )}

        {!hasPacman && !hasGhost && cell === "." && <div className="pellet" />}
      </div>
    );
  }

  return (
    <main className="page">
      <section className="game-card">
        <header className="game-header">
          <div>
            <p className="eyebrow">React JavaScript Game</p>
            <h1>Pac-Man Mini</h1>
          </div>
          <button className="restart-button" onClick={restartGame}>
            Restart
          </button>
        </header>

        <div className="stats">
          <div>
            <span>Score</span>
            <strong>{score}</strong>
          </div>
          <div>
            <span>Pellets</span>
            <strong>
              {pelletsCollected}/{totalPellets}
            </strong>
          </div>
          <div>
            <span>Status</span>
            <strong>
              {status === "playing" && "Playing"}
              {status === "won" && "You won!"}
              {status === "lost" && "Game over"}
            </strong>
          </div>
        </div>

        <div className="maze" aria-label="Pac-Man maze">
          {maze.map((row, rowIndex) =>
            row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))
          )}
        </div>

        {status !== "playing" && (
          <div className={`message ${status}`}>
            {status === "won"
              ? "Nice! You collected every pellet."
              : "The ghost caught Pac-Man."}
          </div>
        )}

        <p className="instructions">
          Use the arrow keys to move. Collect all pellets and avoid the ghost.
        </p>
      </section>
    </main>
  );
}

export default App;
