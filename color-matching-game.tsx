import React, { useState, useEffect, useRef } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const colors = [
  '#FF0000', // red
  '#87CEFA', // light blue
  '#000080', // navy blue
  '#FFFF00', // yellow
  '#FFA500', // light orange
  '#FF8C00', // dark orange
  '#FFC0CB', // pink
  '#228B22'  // medium green
];

const TitleScreen = ({ onStartGame }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <h1 className="text-4xl font-bold mb-8">Color Cascade</h1>
    <div className="flex flex-col gap-4">
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-40"
        onClick={() => onStartGame('easy')}
      >
        Easy (8 tiles)
      </button>
      <button
        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded w-40"
        onClick={() => onStartGame('medium')}
      >
        Medium (12 tiles)
      </button>
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-40"
        onClick={() => onStartGame('hard')}
      >
        Hard (16 tiles)
      </button>
    </div>
  </div>
);

const ColorMatchingGame = () => {
  const [blocks, setBlocks] = useState([]);
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [difficulty, setDifficulty] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (difficulty) {
      initializeGame();
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [difficulty]);

  const initializeGame = () => {
    const tileCount = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 12 : 16;
    const gameColors = colors.slice(0, tileCount / 2);
    const newBlocks = [...gameColors, ...gameColors]
      .sort(() => Math.random() - 0.5)
      .map((color, index) => ({ id: index, color, matched: false }));
    setBlocks(newBlocks);
    setSelectedBlocks([]);
    setCurrentScore(0);
    setMoves(0);
    setGameOver(false);
    setIsChecking(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleBlockClick = (block) => {
    if (block.matched || selectedBlocks.some(b => b.id === block.id) || isChecking) return;

    const newSelectedBlocks = [...selectedBlocks, block];
    setSelectedBlocks(newSelectedBlocks);

    if (newSelectedBlocks.length === 2) {
      setIsChecking(true);
      setMoves(moves + 1);
      
      if (newSelectedBlocks[0].color === newSelectedBlocks[1].color) {
        setBlocks(blocks.map(b => 
          newSelectedBlocks.some(selected => selected.id === b.id) ? { ...b, matched: true } : b
        ));
        const newCurrentScore = currentScore + 1;
        setCurrentScore(newCurrentScore);
        setTotalScore(totalScore + 1);
        if (newCurrentScore === blocks.length / 2) {
          setGameOver(true);
        }
      }

      timeoutRef.current = setTimeout(() => {
        setSelectedBlocks([]);
        setIsChecking(false);
      }, 1000);
    }
  };

  const playAgain = () => {
    initializeGame();
  };

  const goToTitleScreen = () => {
    setDifficulty(null);
  };

  if (!difficulty) {
    return <TitleScreen onStartGame={setDifficulty} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Color Cascade</h1>
      <div className="mb-4">
        <span className="mr-4">Current Score: {currentScore}</span>
        <span className="mr-4">Total Score: {totalScore}</span>
        <span>Moves: {moves}</span>
      </div>
      <div className={`grid gap-4 mb-4 ${
        difficulty === 'easy' ? 'grid-cols-3' : 
        difficulty === 'medium' ? 'grid-cols-3' : 'grid-cols-4'
      }`}>
        {blocks.map(block => (
          <div
            key={block.id}
            className={`w-20 h-20 rounded-lg cursor-pointer transition-all duration-300 ${
              block.matched ? 'opacity-0' : 'opacity-100'
            }`}
            style={{
              backgroundColor: block.matched || selectedBlocks.some(b => b.id === block.id) ? block.color : 'gray',
            }}
            onClick={() => handleBlockClick(block)}
          />
        ))}
      </div>
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={goToTitleScreen}
      >
        Back to Title
      </button>
      <AlertDialog open={gameOver}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Congratulations!</AlertDialogTitle>
            <AlertDialogDescription>
              You've completed the {difficulty} game in {moves} moves!
              Your total score is now {totalScore}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-between">
            <AlertDialogAction onClick={playAgain} className="bg-sky-500 hover:bg-sky-700 text-white">
              Play Again
            </AlertDialogAction>
            <AlertDialogAction onClick={goToTitleScreen} className="bg-red-500 hover:bg-red-700 text-white">
              Title Screen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ColorMatchingGame;
