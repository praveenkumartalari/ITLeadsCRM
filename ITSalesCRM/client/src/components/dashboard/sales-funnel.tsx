import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FunnelStage {
  stage: string;
  count: number;
}

interface SalesFunnelProps {
  data: FunnelStage[];
  conversionRate: number;
  avgDealSize: number;
  isLoading?: boolean;
}

export default function SalesFunnel({
  data,
  conversionRate,
  avgDealSize,
  isLoading = false
}: SalesFunnelProps) {
  // Find the max count to calculate percentages
  const maxCount = Math.max(...data.map(item => item.count));
  
  return (
    <Card className="bg-white rounded-lg shadow">
      <CardHeader className="p-4 border-b border-slate-200">
        <CardTitle className="text-lg font-semibold text-slate-800">Sales Funnel</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="w-full h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Funnel Chart Visualization */}
            <div className="w-full h-64 flex flex-col items-center justify-center">
              <div className="w-full max-w-xs">
                <div className="flex flex-col items-center space-y-1">
                  {data.map((stage, index) => {
                    // Calculate width percentage based on position in funnel and count
                    const widthPercentage = Math.max(60, 100 - (index * 10));
                    
                    // Adjust color intensity based on position in funnel
                    const colorIntensity = 600 - (index * 100);
                    
                    return (
                      <div
                        key={stage.stage}
                        className={`bg-primary-${colorIntensity} text-white text-center py-2 rounded-t-sm`}
                        style={{ 
                          width: `${widthPercentage}%`,
                          backgroundColor: index === 0 ? 'hsl(var(--primary))' : '',
                          opacity: index === 0 ? 1 : 1 - (index * 0.1)
                        }}
                      >
                        <span className="text-sm font-medium">
                          {stage.stage} ({stage.count})
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="bg-slate-50 p-2 rounded">
                <span className="text-xs text-slate-500">Conversion Rate</span>
                <p className="text-lg font-semibold text-slate-800">{conversionRate.toFixed(1)}%</p>
              </div>
              <div className="bg-slate-50 p-2 rounded">
                <span className="text-xs text-slate-500">Avg. Deal Size</span>
                <p className="text-lg font-semibold text-slate-800">${avgDealSize.toLocaleString()}</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
