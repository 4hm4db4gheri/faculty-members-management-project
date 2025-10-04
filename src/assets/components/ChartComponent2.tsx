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

export default function ChartComponent2({ data }: ChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 10, right: 20, bottom: 40, left: 10 }}
      >
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
          wrapperStyle={{ fontSize: 13, paddingTop: "10px" }}
        />
        <Bar dataKey=" اجرایی" fill="#ff7f50" radius={[5, 5, 0, 0]} />
        <Bar dataKey=" انتقال" fill="#87ceeb" radius={[5, 5, 0, 0]} />
        <Bar dataKey=" بازنشسته" fill="#da70d6" radius={[5, 5, 0, 0]} />
        <Bar dataKey=" پیمانی" fill="#32cd32" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
