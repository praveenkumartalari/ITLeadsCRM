
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  {
    name: "New Leads",
    leads: 756,
    fill: "#9b87f5"
  },
  {
    name: "Contacted",
    leads: 622,
    fill: "#a78bfa"
  },
  {
    name: "Qualified",
    leads: 457,
    fill: "#8b5cf6"
  },
  {
    name: "Proposal",
    leads: 298,
    fill: "#7c3aed"
  },
  {
    name: "Negotiation",
    leads: 175,
    fill: "#6d28d9"
  },
  {
    name: "Closed",
    leads: 113,
    fill: "#5b21b6"
  }
];

export function PipelineChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value: number) => [`${value} Leads`, '']}
            labelStyle={{ fontWeight: 'bold' }}
            contentStyle={{ 
              borderRadius: 8, 
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          />
          <Bar dataKey="leads" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
