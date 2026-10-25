"use client";

import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  color: "var(--popover-foreground)",
};
const tick = { fill: "var(--muted-foreground)", fontSize: 12 };

export function UsersByRoleChart({ data }: { data: { role: string; count: number }[] }) {
  const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"];
  return (
    <figure>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="role" innerRadius={55} outerRadius={85} paddingAngle={3} stroke="var(--card)">
              {data.map((item, index) => (
                <Cell key={item.role} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <figcaption className="sr-only">Users by role: {data.map((item) => `${item.role} ${item.count}`).join(", ")}</figcaption>
    </figure>
  );
}

export function InvoiceStatusChart({ data }: { data: { status: string; count: number; amount: number }[] }) {
  return (
    <figure>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="status" tickLine={false} axisLine={false} tick={tick} />
            <YAxis tickLine={false} axisLine={false} tick={tick} tickFormatter={(value: number) => (value >= 1000 ? `${value / 1000}k` : String(value))} />
            <Tooltip
              cursor={{ fill: "var(--muted)" }}
              contentStyle={tooltipStyle}
              formatter={(value, _name, item) => [`BDT ${Number(value).toLocaleString("en-US")} (${item.payload.count} invoices)`, "Amount"]}
            />
            <Bar dataKey="amount" fill="var(--chart-1)" radius={[6, 6, 0, 0]} maxBarSize={56} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <figcaption className="sr-only">Invoice amount by status: {data.map((item) => `${item.status} ${item.amount}`).join(", ")}</figcaption>
    </figure>
  );
}

export function SeatsChart({ data }: { data: { name: string; enrolled: number; free: number }[] }) {
  return (
    <figure>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 8 }}>
            <CartesianGrid horizontal={false} stroke="var(--border)" />
            <XAxis type="number" tickLine={false} axisLine={false} tick={tick} />
            <YAxis type="category" dataKey="name" width={72} tickLine={false} axisLine={false} tick={tick} />
            <Tooltip cursor={{ fill: "var(--muted)" }} contentStyle={tooltipStyle} />
            <Bar dataKey="enrolled" name="Enrolled" stackId="seats" fill="var(--chart-1)" />
            <Bar dataKey="free" name="Free seats" stackId="seats" fill="var(--muted)" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <figcaption className="sr-only">Seats filled in the most popular offerings: {data.map((item) => `${item.name} ${item.enrolled}`).join(", ")}</figcaption>
    </figure>
  );
}
