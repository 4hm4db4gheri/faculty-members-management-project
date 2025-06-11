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
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 10, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: "#ccc" }}
          tickLine={false}
        />
        <YAxis
          tickMargin={16}
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: "#ccc" }}
          tickLine={false}
        />
        <Tooltip
          wrapperStyle={{ fontSize: 13 }}
          contentStyle={{ backgroundColor: "#f9f9f9", borderRadius: 8 }}
          cursor={{ fill: "rgba(0,0,0,0.1)" }}
        />
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          wrapperStyle={{ fontSize: 13 }}
        />
        <Bar dataKey=" دانشيار" fill="#8884d8" radius={[5, 5, 0, 0]} />
        <Bar dataKey=" استادیار" fill="#82ca9d" radius={[5, 5, 0, 0]} />
        <Bar dataKey=" استاد تمام" fill="#ffc658" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
