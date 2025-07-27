import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MemoryGame } from "@/components/game/MemoryGame";
import { SkillDashboard } from "@/components/game/SkillDashboard";
import { loadSkillData, loadSkillQuestions } from "@/utils/skillLoader";
import { SkillData, GamePair } from "@/types/game";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function Game() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [skillData, setSkillData] = useState<SkillData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [mode, setMode] = useState<"single" | "battle">("single");
  const [playerNames, setPlayerNames] = useState<[string, string]>([
    "Player 1",
    "Player 2",
  ]);
  const [gameType, setGameType] = useState("fraction-decimal");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "easy"
  );
  const [questions, setQuestions] = useState<GamePair[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  const skillId = searchParams.get("skill");

  useEffect(() => {
    async function loadSkill() {
      if (!skillId) {
        setError("No skill specified in URL");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await loadSkillData(skillId);
        if (!data) {
          setError(`Skill '${skillId}' not found`);
        } else {
          setSkillData(data);
          if (!data.hasDashboard) {
            setGameStarted(true);
          }
        }
      } catch (err) {
        setError("Failed to load skill data");
        console.error("Error loading skill:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSkill();
  }, [skillId]);

  // Accept new options object from SkillDashboard
  const handleStartGame = async (options: {
    mode: "single" | "battle";
    player1: string;
    player2?: string;
    gameType: string;
    difficulty: "easy" | "medium" | "hard";
  }) => {
    setMode(options.mode);
    setPlayerNames([
      options.player1 || "Player 1",
      options.player2 || "Player 2",
    ]);
    setGameType(options.gameType);
    setDifficulty(options.difficulty);
    setQuestionsLoading(true);
    try {
      const qs = await loadSkillQuestions(skillId!, options.gameType);
      setQuestions(qs);
    } catch (err) {
      setError("Failed to load questions for this game type.");
      setQuestions([]);
    } finally {
      setQuestionsLoading(false);
      setGameStarted(true);
    }
  };

  const handleBackToDashboard = () => {
    setGameStarted(false);
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const getQuestionsForMode = () => {
    // Use difficulty to determine maxPairs
    const maxPairs =
      difficulty === "easy" ? 6 : difficulty === "medium" ? 8 : 15;
    // Shuffle questions for each game
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(maxPairs, shuffled.length));
  };

  // Map gameType to a user-friendly title
  const gameTypeTitles: Record<string, string> = {
    "fraction-decimal": "Fraction ⇄ Decimal",
    "fraction-percentage": "Fraction ⇄ Percentage",
    "percentage-decimal": "Percentage ⇄ Decimal",
    mixed: "Mixed",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-game-bg flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading skill data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !skillData) {
    return (
      <div className="min-h-screen bg-gradient-game-bg flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {error || "Unknown error occurred"}
            </p>
            <Button onClick={handleBackToHome} className="w-full gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!gameStarted && skillData.hasDashboard) {
    return <SkillDashboard onStartGame={handleStartGame} />;
  }

  if (questionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-game-bg flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading questions...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-game-bg">
      <MemoryGame
        questions={getQuestionsForMode()}
        skillTitle={gameTypeTitles[gameType] || skillData.title}
        mode={mode}
        playerNames={playerNames}
        onComplete={() => {
          // Could add completion tracking or navigation here
        }}
        onBackToDashboard={
          skillData.hasDashboard ? handleBackToDashboard : undefined
        }
      />
    </div>
  );
}
