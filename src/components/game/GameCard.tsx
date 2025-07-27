import { GameCard as GameCardType } from "@/types/game";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface GameCardProps {
  card: GameCardType;
  onClick: (cardId: string) => void;
  disabled?: boolean;
}

export function GameCard({ card, onClick, disabled = false }: GameCardProps) {
  const [showMatchEffect, setShowMatchEffect] = useState(false);

  // Show match effect only once when card becomes matched
  useEffect(() => {
    if (card.isMatched && !showMatchEffect) {
      setShowMatchEffect(true);
      // Remove the effect after animation completes
      const timer = setTimeout(() => {
        setShowMatchEffect(false);
      }, 600); // 0.6 second animation
      return () => clearTimeout(timer);
    }
  }, [card.isMatched, showMatchEffect]);

  const handleClick = () => {
    if (!disabled && !card.isFlipped && !card.isMatched) {
      onClick(card.id);
    }
  };

  return (
    <div
      className="game-card-container perspective-1000 w-full h-full min-h-[4rem] sm:min-h-[5rem] md:min-h-[6rem] lg:min-h-[7rem] xl:min-h-[8rem] aspect-square cursor-pointer"
      onClick={handleClick}
    >
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-500 preserve-3d",
          card.isFlipped && "rotate-y-180"
        )}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Card Back - More fun design */}
        <div
          className={cn(
            "absolute inset-0 w-full h-full rounded-lg border-2 flex items-center justify-center",
            "backface-hidden bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold",
            "shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105",
            !card.isFlipped && "z-10",
            disabled && "opacity-50 cursor-not-allowed hover:scale-100"
          )}
        >
          <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
            ?
          </div>
        </div>

        {/* Card Front - Enhanced styling */}
        <div
          className={cn(
            "absolute inset-0 w-full h-full rounded-lg border-2 flex items-center justify-center p-0.5",
            "backface-hidden rotate-y-180 font-bold text-center leading-tight",
            card.isMatched
              ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white border-green-500 shadow-lg"
              : "bg-white text-gray-800 border-gray-200 shadow-md",
            showMatchEffect && "scale-110 shadow-2xl shadow-green-400/50",
            "transition-all duration-300"
          )}
        >
          <span className="break-words max-w-full text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold">
            {card.content}
          </span>
        </div>
      </div>
    </div>
  );
}
