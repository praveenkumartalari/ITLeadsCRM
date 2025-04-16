
import { cn } from "@/lib/utils";

interface LeadScoreIndicatorProps {
  score: number;
  showText?: boolean;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export function LeadScoreIndicator({ 
  score, 
  showText = true, 
  className,
  size = 'medium' 
}: LeadScoreIndicatorProps) {
  // Determine color based on score
  const getScoreColor = () => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Determine size classes
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return "h-1";
      case 'large':
        return "h-3";
      case 'medium':
      default:
        return "h-2";
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("w-full bg-gray-200 rounded-full overflow-hidden", getSizeClass())}>
        <div 
          className={cn("h-full rounded-full", getScoreColor())}
          style={{ width: `${score}%` }}
        />
      </div>
      {showText && <span className="text-sm font-medium w-8 text-gray-700">{score}</span>}
    </div>
  );
}
