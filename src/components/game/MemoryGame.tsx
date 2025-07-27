import { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Sparkles,
  User,
  Trophy,
  RotateCcw,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GameCard } from "./GameCard";
import { GameState, BattleGameState, GamePair } from "@/types/game";
import { useMemoryGame } from "@/hooks/useMemoryGame";
import { useBattleMemoryGame } from "@/hooks/useMemoryGame";

interface MemoryGameProps {
  questions: GamePair[];
  skillTitle: string;
  mode?: "single" | "battle";
  playerNames?: [string, string];
  onComplete?: () => void;
  onBackToDashboard?: () => void;
}

function isBattleState(
  state: GameState | BattleGameState
): state is BattleGameState {
  return (
    Array.isArray((state as BattleGameState).players) &&
    typeof (state as BattleGameState).currentPlayer === "number"
  );
}

export function MemoryGame({
  questions,
  skillTitle,
  mode = "single",
  playerNames = ["Player 1", "Player 2"],
  onComplete,
  onBackToDashboard,
}: MemoryGameProps) {
  // Always call both hooks, only use the correct one
  const singleApi = useMemoryGame(questions);
  const battleApi = useBattleMemoryGame(questions, playerNames);
  const isBattle = mode === "battle";
  const gameApi = isBattle ? battleApi : singleApi;
  const { gameState, initializeGame, selectCard, restartGame } = gameApi;

  // Dialog state for game over
  const [showGameOver, setShowGameOver] = useState(false);
  useEffect(() => {
    if (gameState.isComplete) setShowGameOver(true);
  }, [gameState.isComplete]);

  useEffect(() => {
    initializeGame();
    // eslint-disable-next-line
  }, [initializeGame]);

  useEffect(() => {
    if (gameState.isComplete && onComplete) {
      onComplete();
    }
  }, [gameState.isComplete, onComplete]);

  // Get grid columns based on card count
  const getGridCols = () => {
    const cardCount = gameState.cards.length;
    if (cardCount <= 6) return "grid-cols-2 sm:grid-cols-3 md:grid-cols-3";
    if (cardCount <= 8) return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4";
    if (cardCount <= 12) return "grid-cols-3 sm:grid-cols-4 md:grid-cols-4";
    if (cardCount <= 16) return "grid-cols-4 sm:grid-cols-4 md:grid-cols-4";
    return "grid-cols-4 sm:grid-cols-5 md:grid-cols-6";
  };

  // Get maximum width based on card count to prevent cards from being too big
  const getMaxWidth = () => {
    const cardCount = gameState.cards.length;
    if (cardCount <= 6) return "max-w-xl"; // 2x3 or 3x2 grid - more restrictive
    if (cardCount <= 8) return "max-w-2xl"; // 2x4 or 4x2 grid - more restrictive
    if (cardCount <= 12) return "max-w-2xl"; // 3x4 or 4x3 grid - much more restrictive
    if (cardCount <= 16) return "max-w-3xl"; // 4x4 grid - more restrictive
    return "max-w-4xl"; // Larger grids
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Battle mode: render both players' stats - More compact
  const renderBattleStats = (battleState: BattleGameState) => (
    <div className="grid grid-cols-1 gap-2 mb-3">
      {[0, 1].map((idx) => {
        const player = battleState.players[idx];
        const isCurrent =
          battleState.currentPlayer === idx && !battleState.isComplete;
        return (
          <Card
            key={idx}
            className={cn(
              "transition-all duration-300 border-2",
              isCurrent
                ? "border-purple-500 bg-purple-50 shadow-lg"
                : "border-gray-200"
            )}
          >
            <CardContent className="p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center",
                      isCurrent
                        ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    )}
                  >
                    <User className="w-3 h-3" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 text-xs">
                      {player.name}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-800">
                    {player.score}
                  </div>
                  <div className="text-xs text-gray-500">Score</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1 mt-2 text-center">
                <div>
                  <div className="text-xs font-bold text-gray-800">
                    {player.moves}
                  </div>
                  <div className="text-xs text-gray-500">Moves</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-800">
                    {formatTime(player.timeElapsed)}
                  </div>
                  <div className="text-xs text-gray-500">Time</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-800">
                    {player.matches}
                  </div>
                  <div className="text-xs text-gray-500">Matches</div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  // Single player stats - Now matches battle mode design
  const renderSingleStats = (singleState: GameState) => (
    <div className="grid grid-cols-1 gap-2 mb-3">
      <Card className="border-2 border-purple-500 bg-purple-50 shadow-lg">
        <CardContent className="p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <User className="w-3 h-3" />
              </div>
              <div>
                <div className="font-bold text-gray-800 text-xs">Player</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-800">
                {singleState.score}
              </div>
              <div className="text-xs text-gray-500">Score</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1 mt-2 text-center">
            <div>
              <div className="text-xs font-bold text-gray-800">
                {singleState.moves}
              </div>
              <div className="text-xs text-gray-500">Moves</div>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-800">
                {formatTime(singleState.timeElapsed)}
              </div>
              <div className="text-xs text-gray-500">Time</div>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-800">
                {singleState.cards.filter((card) => card.isMatched).length / 2}/
                {questions.length}
              </div>
              <div className="text-xs text-gray-500">Matches</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Enhanced winner animation for dialog
  const Winner = ({ name }: { name: string }) => (
    <span className="inline-block animate-bounce text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">
      {name}
    </span>
  );

  // Enhanced game over dialog content
  const renderGameOverDialog = () => (
    <Dialog open={showGameOver} onOpenChange={setShowGameOver}>
      <DialogContent className="max-w-md text-center">
        <DialogHeader>
          <DialogTitle className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              🎉 Game Over! 🎉
            </span>
          </DialogTitle>
          <DialogDescription className="text-lg mt-4 flex flex-col items-center">
            {isBattle && isBattleState(gameState) ? (
              <>
                <div className="mb-2 text-gray-600">🏆 Winner:</div>
                <Winner
                  name={
                    gameState.players[0].score === gameState.players[1].score
                      ? "It's a Tie! 🤝"
                      : gameState.players[0].score > gameState.players[1].score
                      ? gameState.players[0].name
                      : gameState.players[1].name
                  }
                />
                <div className="mt-4 text-base text-gray-600">
                  {gameState.players[0].name}: {gameState.players[0].score} pts
                  <br />
                  {gameState.players[1].name}: {gameState.players[1].score} pts
                </div>
              </>
            ) : (
              <>
                <div className="mb-2 text-gray-600">🎊 Congratulations! 🎊</div>
                <Winner name="You Win!" />
                <div className="mt-4 text-base text-gray-600">
                  {isBattleState(gameState) ? null : (
                    <>
                      Moves: {gameState.moves}
                      <br />
                      Time: {formatTime(gameState.timeElapsed)}
                      <br />
                      Score: {gameState.score}
                    </>
                  )}
                </div>
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <Button
          onClick={() => {
            setShowGameOver(false);
            restartGame();
          }}
          className="gap-2 mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
          size="lg"
        >
          <RotateCcw className="w-4 h-4" />
          Play Again
        </Button>
        {onBackToDashboard && (
          <Button
            onClick={onBackToDashboard}
            className="gap-2 mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 border-0"
            size="lg"
          >
            <Settings className="w-4 h-4" />
            Back to Dashboard
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-1 flex flex-col">
      <div className="flex-1 max-w-[600px] mx-auto w-full">
        {/* Header - More compact and fun */}
        <div className="text-center mb-2 relative">
          {onBackToDashboard && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToDashboard}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium mb-1">
            <Sparkles className="w-3 h-3" />
            Math Adventure
          </div>
          <h1 className="text-lg md:text-xl font-bold text-gray-800 mb-1">
            {skillTitle}
          </h1>
          <p className="text-xs text-gray-600">Match the cards and learn! 🎯</p>
        </div>

        {/* Game Stats */}
        {isBattle && isBattleState(gameState)
          ? renderBattleStats(gameState)
          : renderSingleStats(gameState as GameState)}

        {/* Game Board - Minimal spacing for maximum card size */}
        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl flex-1">
          <CardContent className="p-0">
            <div className="flex justify-center items-center w-full h-full">
              <div
                className={cn(
                  "grid gap-0.5 w-full h-full",
                  getGridCols(),
                  getMaxWidth()
                )}
              >
                {gameState.cards.map((card) => (
                  <GameCard
                    key={card.id}
                    card={card}
                    onClick={selectCard}
                    disabled={
                      gameState.selectedCards.length >= 2 ||
                      gameState.isComplete
                    }
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Over Dialog */}
        {renderGameOverDialog()}
      </div>
    </div>
  );
}
