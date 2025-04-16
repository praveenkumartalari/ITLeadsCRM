
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { LeadScoreIndicator } from "@/components/leads/LeadScoreIndicator";

// Define scoring criteria
const scoringCriteria = [
  { id: "budget", name: "Budget", description: "Financial capacity of the lead", defaultValue: 50 },
  { id: "authority", name: "Authority", description: "Decision-making power", defaultValue: 50 },
  { id: "need", name: "Need", description: "Urgency and clarity of requirements", defaultValue: 50 },
  { id: "timeline", name: "Timeline", description: "Expected purchase timeframe", defaultValue: 50 },
  { id: "engagement", name: "Engagement", description: "Level of interaction with marketing", defaultValue: 50 },
];

interface LeadScoringProps {
  initialScore?: number;
  onScoreChange?: (score: number) => void;
  readOnly?: boolean;
}

export function LeadScoring({ initialScore = 50, onScoreChange, readOnly = false }: LeadScoringProps) {
  const [criteria, setCriteria] = useState(
    scoringCriteria.map(criterion => ({
      ...criterion,
      value: initialScore, // Initialize all criteria with the initial score
    }))
  );
  
  const calculateOverallScore = (criteriaList: typeof criteria) => {
    return Math.round(
      criteriaList.reduce((sum, { value }) => sum + value, 0) / criteriaList.length
    );
  };
  
  const [overallScore, setOverallScore] = useState(calculateOverallScore(criteria));
  
  const handleCriterionChange = (index: number, newValue: number[]) => {
    if (readOnly) return;
    
    const updatedCriteria = [...criteria];
    updatedCriteria[index].value = newValue[0];
    
    setCriteria(updatedCriteria);
    const newOverallScore = calculateOverallScore(updatedCriteria);
    setOverallScore(newOverallScore);
    
    if (onScoreChange) {
      onScoreChange(newOverallScore);
    }
  };
  
  const getScoreLabel = (score: number) => {
    if (score >= 85) return { label: "Hot", color: "destructive" };
    if (score >= 70) return { label: "Warm", color: "orange" };
    if (score >= 50) return { label: "Lukewarm", color: "secondary" };
    return { label: "Cold", color: "blue" };
  };
  
  const scoreInfo = getScoreLabel(overallScore);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Lead Score
          <Badge variant={scoreInfo.color as any}>{scoreInfo.label}</Badge>
        </CardTitle>
        <CardDescription>Evaluate lead quality based on key factors</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <LeadScoreIndicator score={overallScore} size="large" />
          <div className="mt-2 text-lg font-medium">{overallScore}/100</div>
        </div>
        
        <div className="space-y-6">
          {criteria.map((criterion, index) => (
            <div key={criterion.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{criterion.name}</div>
                  <div className="text-sm text-gray-500">{criterion.description}</div>
                </div>
                <div className="font-medium">{criterion.value}</div>
              </div>
              <Slider
                disabled={readOnly}
                value={[criterion.value]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => handleCriterionChange(index, value)}
                className={readOnly ? "opacity-70" : ""}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
