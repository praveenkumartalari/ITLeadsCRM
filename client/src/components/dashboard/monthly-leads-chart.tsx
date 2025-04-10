import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MonthlySummary {
  month: string;
  newLeads: number;
  converted: number;
}

interface MonthlyLeadsChartProps {
  data: MonthlySummary[];
  isLoading?: boolean;
}

export default function MonthlyLeadsChart({
  data,
  isLoading = false
}: MonthlyLeadsChartProps) {
  const [timeRange, setTimeRange] = useState("6m");

  // In a real app, this would filter the data based on the selected time range
  const filteredData = data;

  // Find the max value to normalize the chart
  const maxValue = Math.max(
    ...filteredData.flatMap(item => [item.newLeads, item.converted])
  );

  return (
    <Card className="bg-white rounded-lg shadow">
      <CardHeader className="p-4 border-b border-slate-200 flex justify-between items-center">
        <CardTitle className="text-lg font-semibold text-slate-800">
          Monthly Lead Trends
        </CardTitle>
        <Select
          value={timeRange}
          onValueChange={setTimeRange}
        >
          <SelectTrigger className="w-[160px] text-sm h-9">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6m">Last 6 months</SelectItem>
            <SelectItem value="1y">This year</SelectItem>
            <SelectItem value="ly">Last year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="w-full h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Chart Visualization */}
            <div className="w-full h-64 flex items-center justify-center">
              <div className="w-full h-full relative">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-slate-500 py-2">
                  <span>200</span>
                  <span>150</span>
                  <span>100</span>
                  <span>50</span>
                  <span>0</span>
                </div>
                
                {/* Chart area */}
                <div className="ml-8 h-full flex items-end">
                  {/* Grid lines */}
                  <div className="absolute left-8 top-0 right-0 h-full grid grid-rows-4 w-full">
                    <div className="border-b border-slate-200"></div>
                    <div className="border-b border-slate-200"></div>
                    <div className="border-b border-slate-200"></div>
                    <div className="border-b border-slate-200"></div>
                  </div>
                  
                  {/* Bars */}
                  <div className="relative h-full w-full flex items-end justify-around">
                    {filteredData.map((month, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className="relative w-12">
                          <div 
                            className="absolute bottom-0 w-6 bg-primary rounded-t-sm opacity-80" 
                            style={{ 
                              height: `${(month.newLeads / maxValue) * 100}%`, 
                              left: "3px"
                            }}
                          ></div>
                          <div 
                            className="absolute bottom-0 w-6 bg-secondary-400 rounded-t-sm" 
                            style={{ 
                              height: `${(month.converted / maxValue) * 100}%`, 
                              left: "3px"
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-slate-500 mt-2">{month.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-2 flex justify-center">
              <div className="flex items-center mr-4">
                <span className="block w-3 h-3 bg-primary mr-1"></span>
                <span className="text-xs text-slate-600">New Leads</span>
              </div>
              <div className="flex items-center">
                <span className="block w-3 h-3 bg-secondary-400 mr-1"></span>
                <span className="text-xs text-slate-600">Converted</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
