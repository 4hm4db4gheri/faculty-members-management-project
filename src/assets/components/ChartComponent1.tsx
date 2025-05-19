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

const data1 = [
  { name: "علوم", دانشيار: 20, استادیار: 15, "استاد تمام": 10 },
  { name: "فنی", دانشيار: 15, استادیار: 18, "استاد تمام": 12 },
  { name: "حقوق", دانشيار: 10, استادیار: 12, "استاد تمام": 18 },
  { name: "روانشناسی", دانشيار: 18, استادیار: 14, "استاد تمام": 16 },
];

export default function ChartComponent1() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data1} margin={{ top: 10, right: 20 }}>
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
        <Bar dataKey="دانشيار" fill="#8884d8" radius={[5, 5, 0, 0]} />
        <Bar dataKey="استادیار" fill="#82ca9d" radius={[5, 5, 0, 0]} />
        <Bar dataKey="استاد تمام" fill="#ffc658" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
