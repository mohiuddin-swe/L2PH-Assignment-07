"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface GpaChartProps {
  data: { semester: string; gpa: number; totalCredits: number }[];
}

export function GpaChart({ data }: GpaChartProps) {
  return (
    <figure>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="semester" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
            <YAxis domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
            <Tooltip
              cursor={{ fill: "var(--muted)" }}
              contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--popover-foreground)" }}
              formatter={(value) => [Number(value).toFixed(2), "GPA"]}
            />
            <Bar dataKey="gpa" fill="var(--chart-1)" radius={[6, 6, 0, 0]} maxBarSize={56} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <figcaption className="sr-only">
        GPA by semester: {data.map((item) => `${item.semester} ${item.gpa.toFixed(2)}`).join(", ")}
      </figcaption>
    </figure>
  );
}