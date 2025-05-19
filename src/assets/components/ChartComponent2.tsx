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

const data2 = [
  { name: "علوم", اجرایی: 20, انتقال: 15, بازنشسته: 10, پیمانی: 5 },
  { name: "فنی", اجرایی: 18, انتقال: 12, بازنشسته: 8, پیمانی: 4 },
  { name: "حقوق", اجرایی: 22, انتقال: 13, بازنشسته: 10, پیمانی: 7 },
  { name: "روانشناسی", اجرایی: 25, انتقال: 14, بازنشسته: 11, پیمانی: 6 },
];

export default function ChartComponent2() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={data2}
        margin={{ top: 10, right: 20, bottom: 20, left: 20 }}
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
          wrapperStyle={{ fontSize: 13 }}
        />
        <Bar dataKey="اجرایی" fill="#ff7f50" radius={[5, 5, 0, 0]} />
        <Bar dataKey="انتقال" fill="#87ceeb" radius={[5, 5, 0, 0]} />
        <Bar dataKey="بازنشسته" fill="#da70d6" radius={[5, 5, 0, 0]} />
        <Bar dataKey="پیمانی" fill="#32cd32" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
