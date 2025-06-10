// src/assets/components/ChartComponent1.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface ChartComponentProps {
  data: any[]; // Expects data as a prop
}

export default function ChartComponent1({ data }: ChartComponentProps) {
  // Can add logic here to adjust fontSize based on screen size if needed
  // For now, these remain fixed as they are props to recharts components.
  const chartFontSize = 12; // Example: You might dynamically change this
  const tooltipFontSize = 13; // Example: You might dynamically change this

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 10, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: chartFontSize }} // Uses a variable now
          axisLine={{ stroke: "#ccc" }}
          tickLine={false}
        />
        <YAxis
          tickMargin={16} // Remains fixed, adjust if necessary via dynamic logic
          tick={{ fontSize: chartFontSize }} // Uses a variable now
          axisLine={{ stroke: "#ccc" }}
          tickLine={false}
        />
        <Tooltip
          wrapperStyle={{ fontSize: tooltipFontSize }} // Uses a variable now
          contentStyle={{ backgroundColor: "#f9f9f9", borderRadius: 8 }}
          cursor={{ fill: "rgba(0,0,0,0.1)" }}
        />
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          wrapperStyle={{ fontSize: tooltipFontSize }} // Uses a variable now
        />
        <Bar dataKey=" دانشيار" fill="#8884d8" radius={[5, 5, 0, 0]} />
        <Bar dataKey=" استادیار" fill="#82ca9d" radius={[5, 5, 0, 0]} />
        <Bar dataKey=" استاد تمام" fill="#ffc658" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
