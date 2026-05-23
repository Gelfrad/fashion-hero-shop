"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartPoint {
  day: string;
  clicks: number;
  sales: number;
}

interface CampaignChartProps {
  data: ChartPoint[];
}

export function CampaignChart({ data }: CampaignChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ left: -10, right: 10, top: 5, bottom: 5 }}>
        <CartesianGrid stroke="#e5e3dc" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="#9a9690" />
        <YAxis yAxisId="left" tick={{ fontSize: 10 }} stroke="#9a9690" />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} stroke="#9a9690" />
        <RTooltip
          contentStyle={{
            fontSize: 12,
            borderRadius: 8,
            border: "1px solid #e5e3dc",
            background: "#ffffff",
          }}
          labelFormatter={(l) => `Dzień ${l}`}
          formatter={(value: number, name) => {
            const labels: Record<string, string> = {
              clicks: "Kliknięcia",
              sales: "Sprzedaż (PLN)",
            };
            return [value, labels[name as string] ?? name];
          }}
        />
        <Line yAxisId="left" type="monotone" dataKey="clicks" stroke="#212121" strokeWidth={2} dot={false} />
        <Line yAxisId="right" type="monotone" dataKey="sales" stroke="#f59e0b" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
