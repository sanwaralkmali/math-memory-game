import { GameCard as GameCardType } from '@/types/game';
import { cn } from '@/lib/utils';

interface GameCardProps {
  card: GameCardType;
  onClick: (cardId: string) => void;
  disabled?: boolean;
}

export function GameCard({ card, onClick, disabled = false }: GameCardProps) {
  const handleClick = () => {
    if (!disabled && !card.isFlipped && !card.isMatched) {
      onClick(card.id);
    }
  };

  return (
    <div 
      className="game-card-container perspective-1000 w-12 h-12 md:w-24 md:h-24 lg:w-32 lg:h-32 aspect-square cursor-pointer"
      onClick={handleClick}
    >
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-600 preserve-3d",
          card.isFlipped && "rotate-y-180"
        )}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Card Back */}
        <div 
          className={cn(
            "absolute inset-0 w-full h-full rounded-lg border-2 flex items-center justify-center",
            "backface-hidden bg-gradient-primary text-primary-foreground font-semibold text-sm md:text-lg lg:text-xl",
            "shadow-lg hover:shadow-xl transition-shadow duration-300",
            !card.isFlipped && "z-10",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <div className="text-base md:text-2xl lg:text-3xl">?</div>
        </div>
        
        {/* Card Front */}
        <div 
          className={cn(
            "absolute inset-0 w-full h-full rounded-lg border-2 flex items-center justify-center p-1 md:p-3 lg:p-4",
            "backface-hidden rotate-y-180 font-semibold text-sm md:text-lg lg:text-xl text-center leading-tight",
            card.isMatched 
              ? "bg-gradient-success text-success-foreground border-success animate-pulse-success" 
              : "bg-game-card text-card-foreground border-border",
            "shadow-lg"
          )}
        >
          <span className="break-words max-w-full">{card.content}</span>
        </div>
      </div>
    </div>
  );
}