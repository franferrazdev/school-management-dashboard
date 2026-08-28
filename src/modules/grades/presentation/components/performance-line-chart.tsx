"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

// Dados simulados para validação visual no localhost
const mockData = [
  { period: "1º Bimestre", nota: 65.5 },
  { period: "2º Bimestre", nota: 72.0 },
  { period: "3º Bimestre", nota: 85.0 },
  { period: "4º Bimestre", nota: 78.5 },
];

export function PerformanceLineChart() {
  return (
    <div className="w-full h-[320px] bg-stone-900/50 p-4 border border-stone-800 rounded-lg">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={mockData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          {/* Grade de fundo discreta */}
          <CartesianGrid strokeDasharray="3 3" stroke="#292524" />

          {/* Eixos com estilização baseada na paleta stone */}
          <XAxis
            dataKey="period"
            stroke="#a8a29e"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            stroke="#a8a29e"
            fontSize={12}
            tickLine={false}
          />

          {/* Tooltip para o tema escuro/vinho */}
          <Tooltip
            contentStyle={{
              backgroundColor: "#1c1917",
              borderColor: "#292524",
              borderRadius: "8px",
              color: "#f5f5f4",
            }}
          />

          {/* REGRA DE NEGÓCIO: Linha de referência rígisa em 70.0 pontos */}
          <ReferenceLine
            y={70}
            stroke="#be123c"
            strokeDasharray="4 4"
            label={{
              value: "Meta: 70.0",
              fill: "#fb7185",
              fontSize: 10,
              position: "insideBottomLeft",
            }}
          />

          {/* Linha principal de evolução */}
          <Line
            type="monotone"
            dataKey="nota"
            stroke="#f43f52"
            strokeWidth={3}
            activeDot={{ r: 6, fill: "#be123c" }}
            dot={{ r: 4, fill: "#f43f5e" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
