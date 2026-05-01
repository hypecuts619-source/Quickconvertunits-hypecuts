import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { categories, convert } from "../lib/units";

export default function ConversionChart({
  categoryId,
  valFrom,
  unitFrom,
  theme,
}: {
  categoryId: string;
  valFrom: string;
  unitFrom: string;
  theme: string;
}) {
  if (categoryId !== "energy" && categoryId !== "data_storage") return null;
  const numVal = parseFloat(valFrom);
  if (isNaN(numVal) || numVal <= 0) return null; // Log scale requires positive values

  const activeCat = categories.find((c) => c.id === categoryId);
  if (!activeCat) return null;

  const data = activeCat.units.map((u) => {
    let rawVal = convert(numVal, unitFrom, u.id, categoryId);
    return {
      name: u.symbol,
      fullName: u.name,
      value: rawVal,
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      const formatted =
        val >= 1000 || val < 0.01 ? val.toExponential(4) : val.toPrecision(4);
      return (
        <div className="bg-white dark:bg-neutral-800 p-3 shadow-lg rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm">
          <p className="font-semibold text-neutral-900 dark:text-neutral-100">
            {payload[0].payload.fullName}
          </p>
          <p className="text-primary-600 dark:text-primary-400 mt-1">
            {formatted} {label}
          </p>
        </div>
      );
    }
    return null;
  };

  const getThemeColor = () => {
    switch (theme) {
      case "rose": return "#e11d48";
      case "emerald": return "#10b981";
      case "violet": return "#8b5cf6";
      case "amber": return "#f59e0b";
      default: return "#3b82f6";
    }
  };

  return (
    <div className="mt-8 bg-white dark:bg-neutral-800 py-6 px-4 md:px-6 rounded-3xl shadow-xl shadow-neutral-200/50 dark:shadow-none border border-neutral-100 dark:border-neutral-700 w-full h-[350px]">
      <h3 className="text-center font-semibold mb-6 text-neutral-800 dark:text-neutral-200">
        Equivalent {activeCat.name} (Logarithmic Scale)
      </h3>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            dy={10}
            interval="preserveStartEnd"
            tickFormatter={(val) => val.length > 6 ? val.substring(0, 5) + ".." : val}
          />
          <YAxis scale="log" domain={["auto", "auto"]} hide />
          <Tooltip cursor={{ fill: "rgba(156, 163, 175, 0.1)" }} content={<CustomTooltip />} />
          <Bar dataKey="value" fill={getThemeColor()} radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
