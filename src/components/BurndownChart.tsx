import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Customized,
} from 'recharts';

interface BurndownData {
  date: string;
  guideline: number;
  remaining: number;
}

interface BurndownChartProps {
  data: BurndownData[];
  sprintDates: string;
}

const CustomRemainingLine: React.FC<any> = ({ points }) => {
  if (!points || points.length < 2) return null;

  return (
    <g>
      {points.slice(1).map((point: any, i: number) => {
        const prev = points[i];
        const isUp = point.payload.remaining > prev.payload.remaining;
        const color = isUp ? '#22c55e' : '#ef4444'; // green up, red down

        return (
          <line
            key={`line-${i}`}
            x1={prev.x}
            y1={prev.y}
            x2={point.x}
            y2={point.y}
            stroke={color}
            strokeWidth={3}
          />
        );
      })}
      {points.map((point: any, i: number) => {
        const prev = points[i - 1] ?? point;
        const isUp = point.payload.remaining > prev.payload.remaining;
        const color = i === 0 ? '#ef4444' : isUp ? '#22c55e' : '#ef4444';

        return (
          <circle
            key={`dot-${i}`}
            cx={point.x}
            cy={point.y}
            r={3}
            fill={color}
          />
        );
      })}
    </g>
  );
};

const BurndownChart: React.FC<BurndownChartProps> = ({ data, sprintDates }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border p-4 lg:p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
          {sprintDates}
        </span>
      </div>
      <div className="h-48 lg:h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#64748b' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#64748b' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '12px',
              }}
            />

            {/* Dashed guideline */}
            <Line
              type="monotone"
              dataKey="guideline"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Guideline"
            />

            {/* Transparent remaining line - needed for generating points */}
            <Line
              type="monotone"
              dataKey="remaining"
              stroke="transparent"
              dot={false}
              activeDot={false}
              isAnimationActive={false}
              name="Remaining"
            />

            {/* Custom colored remaining line */}
            <Customized component={CustomRemainingLine} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BurndownChart;
