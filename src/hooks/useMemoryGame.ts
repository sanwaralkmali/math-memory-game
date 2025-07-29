import { useState, useEffect, useCallback } from 'react';
import { GameCard, GameState, GamePair, PlayerState, BattleGameState } from '@/types/game';
import { useToast } from '@/hooks/use-toast';

export function useMemoryGame(questions: GamePair[]) {
  const { toast } = useToast();
  
  const [gameState, setGameState] = useState<GameState>({
    cards: [],
    selectedCards: [],
    score: 0,
    moves: 0,
    isComplete: false,
    timeElapsed: 0,
  });

  const [startTime, setStartTime] = useState<number | null>(null);

  // Initialize game cards
  const initializeGame = useCallback(() => {
    const cards: GameCard[] = [];
    
    // Create array of available icons (1-15) and shuffle them
    const availableIcons = Array.from({ length: 15 }, (_, i) => i + 1);
    const shuffledIcons = availableIcons.sort(() => Math.random() - 0.5);
    
    questions.forEach((question, index) => {
      const pairId = `pair-${index}`;
      const iconId = shuffledIcons[index % 15]; // Use modulo to handle more than 15 pairs
      
      // Create two cards for each pair
      cards.push(
        {
          id: `${pairId}-a`,
          content: question.pair[0],
          pairId,
          iconId,
          isFlipped: false,
          isMatched: false,
        },
        {
          id: `${pairId}-b`,
          content: question.pair[1],
          pairId,
          iconId,
          isFlipped: false,
          isMatched: false,
        }
      );
    });

    // Shuffle cards
    const shuffledCards = cards.sort(() => Math.random() - 0.5);

    setGameState({
      cards: shuffledCards,
      selectedCards: [],
      score: 0,
      moves: 0,
      isComplete: false,
      timeElapsed: 0,
    });
    
    setStartTime(Date.now());
  }, [questions]);

  // Handle card selection
  const selectCard = useCallback((cardId: string) => {
    setGameState(prevState => {
      if (prevState.selectedCards.length >= 2) {
        return prevState;
      }

      const newSelectedCards = [...prevState.selectedCards, cardId];
      const updatedCards = prevState.cards.map(card =>
        card.id === cardId ? { ...card, isFlipped: true } : card
      );

      return {
        ...prevState,
        cards: updatedCards,
        selectedCards: newSelectedCards,
      };
    });
  }, []);

  // Check for matches when two cards are selected
  useEffect(() => {
    if (gameState.selectedCards.length === 2) {
      const [firstCardId, secondCardId] = gameState.selectedCards;
      const firstCard = gameState.cards.find(card => card.id === firstCardId);
      const secondCard = gameState.cards.find(card => card.id === secondCardId);

      if (firstCard && secondCard) {
        const isMatch = firstCard.pairId === secondCard.pairId;
        
        setTimeout(() => {
          setGameState(prevState => {
            const updatedCards = prevState.cards.map(card => {
              if (card.id === firstCardId || card.id === secondCardId) {
                return {
                  ...card,
                  isMatched: isMatch,
                  isFlipped: isMatch ? true : false,
                };
              }
              return card;
            });

            const newScore = isMatch ? prevState.score + 10 : prevState.score;
            const newMoves = prevState.moves + 1;
            
            // Check if game is complete
            const isComplete = updatedCards.every(card => card.isMatched);
            
            if (isMatch) {
              toast({
                title: "Match! 🎉",
                description: `${firstCard.content} matches ${secondCard.content}`,
              });
            }
            
            if (isComplete) {
              const timeElapsed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
              toast({
                title: "Congratulations! 🏆",
                description: `You completed the game in ${newMoves} moves and ${timeElapsed} seconds!`,
              });
            }

            return {
              ...prevState,
              cards: updatedCards,
              selectedCards: [],
              score: newScore,
              moves: newMoves,
              isComplete,
              timeElapsed: isComplete && startTime ? Math.floor((Date.now() - startTime) / 1000) : prevState.timeElapsed,
            };
          });
        }, 1000);
      }
    }
  }, [gameState.selectedCards, gameState.cards, toast, startTime]);

  // Timer effect
  useEffect(() => {
    if (!startTime || gameState.isComplete) return;

    const timer = setInterval(() => {
      setGameState(prevState => ({
        ...prevState,
        timeElapsed: Math.floor((Date.now() - startTime) / 1000),
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, gameState.isComplete]);

  return {
    gameState,
    initializeGame,
    selectCard,
    restartGame: initializeGame,
  };
}

export function useBattleMemoryGame(questions: GamePair[], playerNames: [string, string]) {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<BattleGameState>({
    cards: [],
    selectedCards: [],
    isComplete: false,
    currentPlayer: 0,
    players: [
      { name: playerNames[0], score: 0, moves: 0, timeElapsed: 0, matches: 0 },
      { name: playerNames[1], score: 0, moves: 0, timeElapsed: 0, matches: 0 },
    ],
  });
  const [playerTimers, setPlayerTimers] = useState<[number | null, number | null]>([null, null]);
  const [timerIntervals, setTimerIntervals] = useState<[NodeJS.Timeout | null, NodeJS.Timeout | null]>([null, null]);

  // Initialize game
  const initializeGame = useCallback(() => {
    const cards: GameCard[] = [];
    
    // Create array of available icons (1-15) and shuffle them
    const availableIcons = Array.from({ length: 15 }, (_, i) => i + 1);
    const shuffledIcons = availableIcons.sort(() => Math.random() - 0.5);
    
    questions.forEach((question, index) => {
      const pairId = `pair-${index}`;
      const iconId = shuffledIcons[index % 15]; // Use modulo to handle more than 15 pairs
      
      cards.push(
        { id: `${pairId}-a`, content: question.pair[0], pairId, iconId, isFlipped: false, isMatched: false },
        { id: `${pairId}-b`, content: question.pair[1], pairId, iconId, isFlipped: false, isMatched: false }
      );
    });
    const shuffledCards = cards.sort(() => Math.random() - 0.5);
    setGameState({
      cards: shuffledCards,
      selectedCards: [],
      isComplete: false,
      currentPlayer: 0,
      players: [
        { name: playerNames[0], score: 0, moves: 0, timeElapsed: 0, matches: 0 },
        { name: playerNames[1], score: 0, moves: 0, timeElapsed: 0, matches: 0 },
      ],
    });
    setPlayerTimers([null, null]);
    setTimerIntervals([null, null]);
  }, [questions, playerNames]);

  // Timer effect for each player
  useEffect(() => {
    // Clear intervals on unmount
    return () => {
      timerIntervals.forEach(interval => interval && clearInterval(interval));
    };
  }, [timerIntervals]);

  const startPlayerTimer = (playerIdx: 0 | 1) => {
    if (timerIntervals[playerIdx]) return;
    const start = Date.now();
    setPlayerTimers(prev => {
      const copy = [...prev] as [number | null, number | null];
      copy[playerIdx] = start;
      return copy;
    });
    setTimerIntervals(prev => {
      const copy = [...prev] as [NodeJS.Timeout | null, NodeJS.Timeout | null];
      copy[playerIdx] = setInterval(() => {
        setGameState(gs => {
          const players = [...gs.players] as [PlayerState, PlayerState];
          players[playerIdx] = {
            ...players[playerIdx],
            timeElapsed: players[playerIdx].timeElapsed + 1,
          };
          return { ...gs, players };
        });
      }, 1000);
      return copy;
    });
  };
  const stopPlayerTimer = (playerIdx: 0 | 1) => {
    if (timerIntervals[playerIdx]) {
      clearInterval(timerIntervals[playerIdx]!);
      setTimerIntervals(prev => {
        const copy = [...prev] as [NodeJS.Timeout | null, NodeJS.Timeout | null];
        copy[playerIdx] = null;
        return copy;
      });
    }
  };

  // Card selection logic
  const selectCard = useCallback((cardId: string) => {
    setGameState(prevState => {
      if (prevState.selectedCards.length >= 2 || prevState.isComplete) return prevState;
      // Only current player can select
      const newSelectedCards = [...prevState.selectedCards, cardId];
      const updatedCards = prevState.cards.map(card =>
        card.id === cardId ? { ...card, isFlipped: true } : card
      );
      // Start timer for current player if not started
      if (newSelectedCards.length === 1) startPlayerTimer(prevState.currentPlayer);
      return {
        ...prevState,
        cards: updatedCards,
        selectedCards: newSelectedCards,
      };
    });
  }, []);

  // Check for matches and turn switching
  useEffect(() => {
    if (gameState.selectedCards.length === 2) {
      const [firstCardId, secondCardId] = gameState.selectedCards;
      const firstCard = gameState.cards.find(card => card.id === firstCardId);
      const secondCard = gameState.cards.find(card => card.id === secondCardId);
      if (firstCard && secondCard) {
        const isMatch = firstCard.pairId === secondCard.pairId;
        setTimeout(() => {
          setGameState(prevState => {
            const updatedCards = prevState.cards.map(card => {
              if (card.id === firstCardId || card.id === secondCardId) {
                return {
                  ...card,
                  isMatched: isMatch,
                  isFlipped: isMatch ? true : false,
                };
              }
              return card;
            });
            const players = [...prevState.players] as [PlayerState, PlayerState];
            let currentPlayer = prevState.currentPlayer;
            if (isMatch) {
              players[currentPlayer] = {
                ...players[currentPlayer],
                score: players[currentPlayer].score + 10,
                moves: players[currentPlayer].moves + 1,
                matches: players[currentPlayer].matches + 1,
              };
              toast({ title: 'Match! 🎉', description: `${firstCard.content} matches ${secondCard.content}` });
            } else {
              players[currentPlayer] = {
                ...players[currentPlayer],
                moves: players[currentPlayer].moves + 1,
              };
              // Stop current player's timer, switch turn
              stopPlayerTimer(currentPlayer);
              currentPlayer = currentPlayer === 0 ? 1 : 0;
            }
            // Check if game is complete
            const isComplete = updatedCards.every(card => card.isMatched);
            if (isComplete) {
              stopPlayerTimer(0);
              stopPlayerTimer(1);
              toast({
                title: 'Game Over! 🏆',
                description: `Winner: ${players[0].score === players[1].score ? 'Tie' : players[0].score > players[1].score ? players[0].name : players[1].name}`,
              });
            }
            return {
              ...prevState,
              cards: updatedCards,
              selectedCards: [],
              players,
              isComplete,
              currentPlayer,
            };
          });
        }, 1000);
      }
    }
  }, [gameState.selectedCards, gameState.cards]);

  // Restart game
  const restartGame = () => {
    initializeGame();
  };

  return {
    gameState,
    initializeGame,
    selectCard,
    restartGame,
  };
}