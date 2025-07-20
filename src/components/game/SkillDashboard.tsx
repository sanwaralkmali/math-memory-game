import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Users, Trophy, Play, ListOrdered, UserCircle2, Star } from 'lucide-react';

interface SkillDashboardProps {
  onStartGame: (options: {
    mode: 'single' | 'battle',
    player1: string,
    player2?: string,
    gameType: string,
    difficulty: 'easy' | 'medium' | 'hard',
  }) => void;
}

export function SkillDashboard({ onStartGame }: SkillDashboardProps) {
  // State
  const [mode, setMode] = useState<'single' | 'battle'>('single');
  const [player1, setPlayer1] = useState('Player 1');
  const [player2, setPlayer2] = useState('Player 2');
  const [gameType, setGameType] = useState('fraction-decimal');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);

  // Game type options
  const gameTypes = [
    { value: 'fraction-decimal', label: 'Fraction ⇄ Decimal' },
    { value: 'fraction-percentage', label: 'Fraction ⇄ Percentage' },
    { value: 'percentage-decimal', label: 'Percentage ⇄ Decimal' },
    { value: 'mixed', label: 'Mixed' },
  ];

  // Difficulty options
  const difficulties = [
    { value: 'easy', label: 'Easy', grid: '3 x 4' },
    { value: 'medium', label: 'Medium', grid: '4 x 4' },
    { value: 'hard', label: 'Hard', grid: '5 x 6' },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-game-bg p-4 font-cairo">
      <Card className="w-full max-w-2xl md:max-w-3xl shadow-xl border-2 border-primary/10 bg-white/90 backdrop-blur-md rounded-2xl">
        <CardHeader className="pb-4 pt-8 text-center border-b border-muted/40">
          <CardTitle className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-primary drop-shadow-sm font-cairo">Convert and Match</CardTitle>
          <div className="flex justify-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs px-3 py-1 font-cairo">Modern Math Memory Game</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-10 space-y-8">
          {/* Game Mode & Player Names */}
          <section className="rounded-xl bg-muted/40 p-4 md:p-6 flex flex-col md:flex-row md:items-center md:gap-8 gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 text-base font-semibold font-cairo">
                <Users className="w-5 h-5 text-primary" /> Game Mode
              </div>
              <RadioGroup value={mode} onValueChange={v => setMode(v as 'single' | 'battle')} className="flex gap-4 font-cairo">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="single" id="mode-single" />
                  <label htmlFor="mode-single" className="text-sm cursor-pointer font-cairo">Single Player</label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="battle" id="mode-battle" />
                  <label htmlFor="mode-battle" className="text-sm cursor-pointer font-cairo">Battle Mode</label>
                </div>
              </RadioGroup>
            </div>
            {mode === 'battle' && (
              <div className="flex-1 flex flex-col md:flex-row gap-2 md:gap-4">
                <Input value={player1} onChange={e => setPlayer1(e.target.value)} className="text-sm font-cairo" placeholder="Player 1 Name" maxLength={12} />
                <Input value={player2} onChange={e => setPlayer2(e.target.value)} className="text-sm font-cairo" placeholder="Player 2 Name" maxLength={12} />
              </div>
            )}
          </section>

          {/* Game Type & Difficulty */}
          <section className="grid md:grid-cols-2 gap-6">
            {/* Game Type */}
            <div className="rounded-xl bg-muted/40 p-4 md:p-6">
              <div className="flex items-center gap-2 mb-2 text-base font-semibold font-cairo">
                <ListOrdered className="w-5 h-5 text-primary" /> Game Type
              </div>
              <RadioGroup value={gameType} onValueChange={setGameType} className="flex flex-col gap-2 font-cairo">
                {gameTypes.map(type => (
                  <div key={type.value} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition cursor-pointer">
                    <RadioGroupItem value={type.value} id={`game-type-${type.value}`} />
                    <label htmlFor={`game-type-${type.value}`} className="text-sm font-cairo cursor-pointer">{type.label}</label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            {/* Difficulty */}
            <div className="rounded-xl bg-muted/40 p-4 md:p-6">
              <div className="flex items-center gap-2 mb-2 text-base font-semibold font-cairo">
                <Trophy className="w-5 h-5 text-primary" /> Difficulty
              </div>
              <RadioGroup value={difficulty} onValueChange={v => setDifficulty(v as 'easy' | 'medium' | 'hard')} className="flex gap-4 font-cairo">
                {difficulties.map(d => (
                  <div key={d.value} className="flex flex-col items-center gap-1">
                    <RadioGroupItem value={d.value} id={`diff-${d.value}`} />
                    <label htmlFor={`diff-${d.value}`} className="text-sm cursor-pointer font-cairo font-medium">{d.label}<br /><span className="text-xs text-muted-foreground font-cairo">{d.grid}</span></label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </section>

          {/* Actions */}
          <section className="flex flex-col md:flex-row gap-4 md:gap-8 items-center justify-center mt-2">
            <Button size="lg" className="w-full md:w-1/2 text-lg font-bold gap-2 shadow-md font-cairo" onClick={() => onStartGame({ mode, player1, player2: mode === 'battle' ? player2 : undefined, gameType, difficulty })}>
              <Play className="w-5 h-5" /> Start Game
            </Button>
            <Dialog open={leaderboardOpen} onOpenChange={setLeaderboardOpen}>
              <DialogTrigger asChild>
                <Button size="lg" variant="outline" className="w-full md:w-1/2 gap-2 shadow-md font-cairo"><Trophy className="w-5 h-5" /> Leaderboard</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md font-cairo">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-2xl font-cairo"><Star className="w-6 h-6 text-yellow-400" /> Leaderboard</DialogTitle>
                  <DialogDescription className="mb-4 font-cairo">Top players</DialogDescription>
                </DialogHeader>
                <div className="space-y-3 mt-2">
                  <div className="flex justify-between text-xs text-muted-foreground mt-2 font-cairo"><span> COMING SOON . . .</span></div>
                </div>
              </DialogContent>
            </Dialog>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}