import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Users,
  Trophy,
  Play,
  ListOrdered,
  Star,
  HelpCircle,
  Sparkles,
  Brain,
} from "lucide-react";
import { Link } from "react-router-dom";
import { MATHLOGAMEFooter } from "@/components/ui/MATHLOGAMEFooter";

interface SkillDashboardProps {
  onStartGame: (options: {
    mode: "single" | "battle";
    player1: string;
    player2?: string;
    gameType: string;
    difficulty: "easy" | "medium" | "hard";
  }) => void;
}

export function SkillDashboard({ onStartGame }: SkillDashboardProps) {
  // State
  const [mode, setMode] = useState<"single" | "battle">("single");
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("Player 2");
  const [gameType, setGameType] = useState("fraction-decimal");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "easy"
  );
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  // Game type options
  const gameTypes = [
    { value: "fraction-decimal", label: "Fraction ⇄ Decimal" },
    { value: "fraction-percentage", label: "Fraction ⇄ Percentage" },
    { value: "percentage-decimal", label: "Percentage ⇄ Decimal" },
    { value: "mixed", label: "Mixed" },
  ];

  // Difficulty options
  const difficulties = [
    { value: "easy", label: "Easy", grid: "3×4", emoji: "😊" },
    { value: "medium", label: "Medium", grid: "4×4", emoji: "🤔" },
    { value: "hard", label: "Hard", grid: "5×6", emoji: "🧠" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex flex-col">
      {/* Header with Game Title */}
      <div className="text-center py-6 px-4">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-3">
          <Sparkles className="w-4 h-4" />
          Math Adventure
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Rational Conversion
          </span>
        </h1>
        <p className="text-gray-600">Match the cards and learn math! 🎯</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg border-0 shadow-2xl bg-white/95 backdrop-blur-sm rounded-2xl">
          <CardContent className="p-6 space-y-6">
            {/* Game Mode - Compact */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <Users className="w-5 h-5 text-purple-600" />
                  Mode
                </div>
                <Dialog
                  open={instructionsOpen}
                  onOpenChange={setInstructionsOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-purple-600 hover:text-purple-700"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
                        <Brain className="w-6 h-6 text-purple-600" />
                        How to Play
                      </DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Learn the rules of the game
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-800">
                          🎯 Objective
                        </h4>
                        <p className="text-sm text-gray-600">
                          Find matching pairs of mathematical expressions. For
                          example, match "0.5" with "1/2".
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-800">
                          🎮 How to Play
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Click on cards to flip them</li>
                          <li>• Find matching pairs</li>
                          <li>• Complete all pairs to win</li>
                          <li>• Try to use fewer moves!</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-800">
                          🏆 Scoring
                        </h4>
                        <p className="text-sm text-gray-600">
                          Score points for each match. The faster you complete
                          the game, the higher your score!
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <RadioGroup
                value={mode}
                onValueChange={(v) => setMode(v as "single" | "battle")}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="single" id="mode-single" />
                  <label
                    htmlFor="mode-single"
                    className="text-sm cursor-pointer font-medium"
                  >
                    Single Player
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="battle" id="mode-battle" />
                  <label
                    htmlFor="mode-battle"
                    className="text-sm cursor-pointer font-medium"
                  >
                    Battle Mode
                  </label>
                </div>
              </RadioGroup>

              {/* Player Names */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Player Name
                </div>
                {mode === "single" ? (
                  <Input
                    value={player1}
                    onChange={(e) => setPlayer1(e.target.value)}
                    className="text-sm"
                    placeholder="Enter your name"
                    maxLength={12}
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      value={player1}
                      onChange={(e) => setPlayer1(e.target.value)}
                      className="text-sm"
                      placeholder="Player 1"
                      maxLength={12}
                    />
                    <Input
                      value={player2}
                      onChange={(e) => setPlayer2(e.target.value)}
                      className="text-sm"
                      placeholder="Player 2"
                      maxLength={12}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Game Type & Difficulty - Side by Side */}
            <div className="grid grid-cols-2 gap-4">
              {/* Game Type */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <ListOrdered className="w-5 h-5 text-purple-600" />
                  Type
                </div>
                <RadioGroup
                  value={gameType}
                  onValueChange={setGameType}
                  className="space-y-2"
                >
                  {gameTypes.map((type) => (
                    <div key={type.value} className="flex items-center gap-2">
                      <RadioGroupItem
                        value={type.value}
                        id={`game-type-${type.value}`}
                      />
                      <label
                        htmlFor={`game-type-${type.value}`}
                        className="text-xs cursor-pointer font-medium leading-tight"
                      >
                        {type.label}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Difficulty */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <Trophy className="w-5 h-5 text-purple-600" />
                  Level
                </div>
                <RadioGroup
                  value={difficulty}
                  onValueChange={(v) =>
                    setDifficulty(v as "easy" | "medium" | "hard")
                  }
                  className="space-y-2"
                >
                  {difficulties.map((d) => (
                    <div key={d.value} className="flex items-center gap-2">
                      <RadioGroupItem value={d.value} id={`diff-${d.value}`} />
                      <label
                        htmlFor={`diff-${d.value}`}
                        className="text-xs cursor-pointer font-medium"
                      >
                        {d.emoji} {d.label} ({d.grid})
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>

            {/* Actions - Compact */}
            <div className="flex gap-3 pt-2">
              <Button
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-md font-semibold"
                onClick={() =>
                  onStartGame({
                    mode,
                    player1: player1 || "Player 1",
                    player2: mode === "battle" ? player2 : undefined,
                    gameType,
                    difficulty,
                  })
                }
                disabled={!player1.trim()}
              >
                <Play className="w-4 h-4 mr-2" />
                Start Game
              </Button>

              <Dialog open={leaderboardOpen} onOpenChange={setLeaderboardOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2 shadow-md border-purple-300 hover:bg-purple-50 text-purple-600"
                  >
                    <Trophy className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
                      <Star className="w-6 h-6 text-yellow-500" />
                      Leaderboard
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Top players will appear here
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 mt-4">
                    <div className="text-center text-gray-500 py-8">
                      <Star className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="font-medium">Coming Soon...</p>
                      <p className="text-sm">
                        Leaderboard will be available soon!
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <MATHLOGAMEFooter />
    </div>
  );
}
