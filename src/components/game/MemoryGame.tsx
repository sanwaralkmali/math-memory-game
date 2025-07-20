import { useEffect, useState } from 'react';
import { GameCard } from './GameCard';
import { useMemoryGame, useBattleMemoryGame } from '@/hooks/useMemoryGame';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { GamePair, BattleGameState, GameState } from '@/types/game';
import { RotateCcw, Trophy, User } from 'lucide-react';
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
                <span className="text-sm text-muted-foreground">Moves</span>
                <span className="text-lg font-bold">{player.moves}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Time</span>
                <span className="text-lg font-bold">{formatTime(player.timeElapsed)}</span>
              </div>
              <div className="flex items-center gap-2">
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
          <div>
            <div className="text-sm text-muted-foreground">Moves</div>
            <div className="text-xl font-bold">{singleState.moves}</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <div>
            <div className="text-sm text-muted-foreground">Time</div>
            <div className="text-xl font-bold">{formatTime(singleState.timeElapsed)}</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="text-sm text-muted-foreground">Matches</div>
          <div className="text-xl font-bold">{singleState.cards.filter(card => card.isMatched).length / 2}/{questions.length}</div>
        </CardContent>
      </Card>
    </div>
  );

  // Winner animation for dialog
  const Winner = ({ name }: { name: string }) => (
    <span className="inline-block animate-bounce-in text-3xl md:text-5xl font-extrabold text-primary drop-shadow-lg">{name}</span>
  );

  // Game over dialog content
  const renderGameOverDialog = () => (
    <Dialog open={showGameOver} onOpenChange={setShowGameOver}>
      <DialogContent className="max-w-md text-center center">
        <DialogHeader>
          <DialogTitle className="flex flex-col items-center gap-2">
            <Trophy className="w-10 h-10 text-yellow-400 animate-bounce" />
            Game Over!
          </DialogTitle>
          <DialogDescription className="text-lg mt-2 flex flex-col items-center ">
            {isBattle && isBattleState(gameState) ? (
              <>
                <div className="mb-2">Winner:</div>
                <Winner name={
                  gameState.players[0].score === gameState.players[1].score
                    ? 'Tie'
                    : gameState.players[0].score > gameState.players[1].score
                      ? gameState.players[0].name
                      : gameState.players[1].name
                } />
                <div className="mt-4 text-base">
                  {gameState.players[0].name}: {gameState.players[0].score} pts<br />
                  {gameState.players[1].name}: {gameState.players[1].score} pts
                </div>
              </>
            ) : (
              <>
                <div className="mb-2">Congratulations!</div>
                <Winner name="You Win!" />
                <div className="mt-4 text-base">
                  {isBattleState(gameState) ? null : (
                    <>
                      Moves: {gameState.moves}<br />
                      Time: {formatTime(gameState.timeElapsed)}<br />
                      Score: {gameState.score}
                    </>
                  )}
                </div>
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <Button 
          onClick={() => { setShowGameOver(false); restartGame(); }}
          variant="secondary"
          className="gap-2 mt-4 w-full"
        >
          <RotateCcw className="w-4 h-4" />
          Play Again
        </Button>
      </DialogContent>
    </Dialog>
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
              "grid gap-2 max-w-3xl mx-auto",
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

        {/* Game Over Dialog */}
        {renderGameOverDialog()}
      </div>
    </div>
  );
}