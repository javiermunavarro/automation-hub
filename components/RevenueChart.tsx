"use client";

interface RevenueChartProps {
  data?: { label: string; value: number }[];
}

const defaultData = [
  { label: "Mon", value: 420 },
  { label: "Tue", value: 680 },
  { label: "Wed", value: 520 },
  { label: "Thu", value: 890 },
  { label: "Fri", value: 750 },
  { label: "Sat", value: 340 },
  { label: "Sun", value: 610 },
];

export default function RevenueChart({ data = defaultData }: RevenueChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="flex items-end gap-2" style={{ height: 160 }}>
      {data.map((item) => {
        const heightPercent = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
        return (
          <div key={item.label} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-xs font-medium text-gray-500">
              &euro;{item.value}
            </span>
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-blue-600 to-purple-500 transition-all duration-300"
              style={{ height: `${heightPercent}%`, minHeight: 4 }}
            />
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}
