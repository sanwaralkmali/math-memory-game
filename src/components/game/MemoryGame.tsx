import { useEffect } from 'react';
import { GameCard } from './GameCard';
import { useMemoryGame, useBattleMemoryGame } from '@/hooks/useMemoryGame';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GamePair, BattleGameState, GameState } from '@/types/game';
import { RotateCcw, Trophy, Clock, Target, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MemoryGameProps {
  questions: GamePair[];
  skillTitle: string;
  mode?: 'single' | 'battle';
  playerNames?: [string, string];
  onComplete?: () => void;
}

function isBattleState(state: GameState | BattleGameState): state is BattleGameState {
  return Array.isArray((state as BattleGameState).players) && typeof (state as BattleGameState).currentPlayer === 'number';
}

export function MemoryGame({ questions, skillTitle, mode = 'single', playerNames = ['Player 1', 'Player 2'], onComplete }: MemoryGameProps) {
  // Always call both hooks, only use the correct one
  const singleApi = useMemoryGame(questions);
  const battleApi = useBattleMemoryGame(questions, playerNames);
  const isBattle = mode === 'battle';
  const gameApi = isBattle ? battleApi : singleApi;
  const { gameState, initializeGame, selectCard, restartGame } = gameApi;

  useEffect(() => {
    initializeGame();
    // eslint-disable-next-line
  }, [initializeGame]);

  useEffect(() => {
    if (gameState.isComplete && onComplete) {
      onComplete();
    }
  }, [gameState.isComplete, onComplete]);

  // Always use 4 columns for the game board
  const gridCols = 'grid-cols-4';

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Battle mode: render both players' stats
  const renderBattleStats = (battleState: BattleGameState) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {[0, 1].map(idx => {
        const player = battleState.players[idx];
        const isCurrent = battleState.currentPlayer === idx && !battleState.isComplete;
        return (
          <Card key={idx} className={cn(isCurrent && 'ring-2 ring-primary') + ' transition-all'}>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <User className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg font-bold">{player.name} {isCurrent && <span className="text-xs text-primary">(Your Turn)</span>}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4 items-center justify-between p-4 pt-0">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-warning" />
                <span className="text-sm text-muted-foreground">Score</span>
                <span className="text-lg font-bold">{player.score}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Moves</span>
                <span className="text-lg font-bold">{player.moves}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-secondary" />
                <span className="text-sm text-muted-foreground">Time</span>
                <span className="text-lg font-bold">{formatTime(player.timeElapsed)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-accent" />
                <span className="text-sm text-muted-foreground">Matches</span>
                <span className="text-lg font-bold">{player.matches}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  // Single player stats (as before)
  const renderSingleStats = (singleState: GameState) => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <Trophy className="w-5 h-5 text-warning" />
          <div>
            <div className="text-sm text-muted-foreground">Score</div>
            <div className="text-xl font-bold">{singleState.score}</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <Target className="w-5 h-5 text-primary" />
          <div>
            <div className="text-sm text-muted-foreground">Moves</div>
            <div className="text-xl font-bold">{singleState.moves}</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <Clock className="w-5 h-5 text-secondary" />
          <div>
            <div className="text-sm text-muted-foreground">Time</div>
            <div className="text-xl font-bold">{formatTime(singleState.timeElapsed)}</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="w-5 h-5 rounded-full bg-accent" />
          <div>
            <div className="text-sm text-muted-foreground">Matches</div>
            <div className="text-xl font-bold">{singleState.cards.filter(card => card.isMatched).length / 2}/{questions.length}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-game-bg p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {skillTitle}
          </h1>
          <p className="text-muted-foreground">
            Match the cards to find all the pairs!
          </p>
        </div>

        {/* Game Stats */}
        {isBattle && isBattleState(gameState)
          ? renderBattleStats(gameState)
          : renderSingleStats(gameState as GameState)}

        {/* Game Board */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className={cn(
              "grid gap-4 max-w-4xl mx-auto",
              gridCols
            )}>
              {gameState.cards.map((card) => (
                <GameCard
                  key={card.id}
                  card={card}
                  onClick={selectCard}
                  disabled={gameState.selectedCards.length >= 2 || gameState.isComplete}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Game Complete */}
        {gameState.isComplete && (
          <Card className="border-success bg-gradient-success text-success-foreground animate-bounce-in">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <Trophy className="w-6 h-6" />
                {isBattle && isBattleState(gameState) ? 'Game Over!' : 'Congratulations!'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {isBattle && isBattleState(gameState) ? (
                <>
                  <p className="mb-4">
                    Winner: {gameState.players[0].score === gameState.players[1].score
                      ? 'Tie'
                      : gameState.players[0].score > gameState.players[1].score
                        ? gameState.players[0].name
                        : gameState.players[1].name}
                  </p>
                  <p className="text-sm opacity-90 mb-6">
                    {gameState.players[0].name}: {gameState.players[0].score} pts, {gameState.players[1].name}: {gameState.players[1].score} pts
                  </p>
                </>
              ) : (
                // Only show this if gameState is GameState (not BattleGameState)
                isBattleState(gameState) ? null : (
                  <>
                    <p className="mb-4">
                      You completed the game in {gameState.moves} moves and {formatTime(gameState.timeElapsed)}!
                    </p>
                    <p className="text-sm opacity-90 mb-6">
                      Final Score: {gameState.score} points
                    </p>
                  </>
                )
              )}
              <Button 
                onClick={restartGame}
                variant="secondary"
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Play Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Controls */}
        {!gameState.isComplete && (
          <div className="text-center">
            <Button 
              onClick={restartGame}
              variant="outline"
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Restart Game
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}