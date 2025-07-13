import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
} from 'recharts';

interface BurndownData {
  date: string;
  guideline: number;
  remaining: number;
  isWeekend?: boolean;
}

interface BurndownChartProps {
  data: BurndownData[];
  sprintDates: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const remaining = data.remaining;
    const guideline = data.guideline;
    const variance = remaining - guideline;
    const isAhead = variance < 0;
    
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg p-3 shadow-xl">
        <p className="text-sm font-semibold text-slate-800 mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-slate-600">Remaining:</span>
            <span className="text-sm font-bold text-slate-900">{remaining} pts</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-slate-600">Guideline:</span>
            <span className="text-sm font-medium text-slate-700">{guideline} pts</span>
          </div>
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-100">
            <span className="text-xs text-slate-600">Variance:</span>
            <span className={`text-sm font-bold ${isAhead ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isAhead ? '−' : '+'}{Math.abs(variance)} pts
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Custom line component that changes color based on trend
const CustomLine = ({ points, stroke }: any) => {
  if (!points || points.length < 2) return null;

  const segments = [];
  
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    
    if (!current || !next) continue;
    
    const isRising = next.payload.remaining > current.payload.remaining;
    const isFlat = next.payload.remaining === current.payload.remaining;
    
    let segmentColor;
    if (isFlat) {
      segmentColor = '#64748b'; // Gray for flat
    } else if (isRising) {
      segmentColor = '#ef4444'; // Red for rising (bad)
    } else {
      segmentColor = '#22c55e'; // Green for falling (good)
    }
    
    segments.push(
      <line
        key={i}
        x1={current.x}
        y1={current.y}
        x2={next.x}
        y2={next.y}
        stroke={segmentColor}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  }
  
  return <g>{segments}</g>;
};

// Custom dot component
const CustomDot = ({ cx, cy, payload }: any) => {
  if (!payload) return null;
  
  const prevIndex = payload.index - 1;
  const data = payload.data || [];
  
  if (prevIndex < 0) {
    // First point - use neutral color
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill="#64748b"
        stroke="#ffffff"
        strokeWidth={2}
        className="drop-shadow-sm"
      />
    );
  }
  
  const current = data[payload.index];
  const previous = data[prevIndex];
  
  if (!current || !previous) return null;
  
  const isRising = current.remaining > previous.remaining;
  const isFlat = current.remaining === previous.remaining;
  
  let dotColor;
  if (isFlat) {
    dotColor = '#64748b';
  } else if (isRising) {
    dotColor = '#ef4444';
  } else {
    dotColor = '#22c55e';
  }
  
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill={dotColor}
      stroke="#ffffff"
      strokeWidth={2}
      className="drop-shadow-sm"
    />
  );
};

const BurndownChart: React.FC<BurndownChartProps> = ({ data, sprintDates }) => {
  // Add index to each data point for trend calculation
  const dataWithIndex = data.map((item, index) => ({
    ...item,
    index,
    data
  }));

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          <span className="text-sm font-semibold text-slate-700">
            {sprintDates}
          </span>
        </div>
        <div className="flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-slate-400 rounded-full"></div>
            <span className="text-slate-600 font-medium">Guideline</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-emerald-500 rounded-full"></div>
            <span className="text-slate-600 font-medium">Actual</span>
          </div>
        </div>
      </div>
      
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={dataWithIndex} 
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <defs>
              <linearGradient id="guidelineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#cbd5e1" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="1 3" 
              stroke="#f1f5f9" 
              strokeOpacity={0.8}
              horizontal={true}
              vertical={false}
            />
            
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
              tickMargin={12}
            />
            
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
              tickMargin={12}
              domain={['dataMin - 3', 'dataMax + 3']}
            />
            
            <Tooltip content={<CustomTooltip />} />

            {/* Guideline */}
            <Line
              type="monotone"
              dataKey="guideline"
              stroke="url(#guidelineGradient)"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              name="Guideline"
            />

            {/* Main line with custom rendering */}
            <Line
              type="monotone"
              dataKey="remaining"
              stroke="transparent"
              strokeWidth={0}
              dot={<CustomDot />}
              shape={<CustomLine />}
              name="Remaining"
              activeDot={{
                r: 6,
                stroke: '#ffffff',
                strokeWidth: 3,
                fill: '#3b82f6'
              }}
            />

            {/* Weekend reference lines */}
            {dataWithIndex.map((point, index) => 
              point.isWeekend ? (
                <ReferenceLine
                  key={`weekend-${index}`}
                  x={point.date}
                  stroke="#f8fafc"
                  strokeWidth={2}
                  strokeOpacity={0.6}
                />
              ) : null
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-8 mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <span className="text-xs font-medium text-slate-600">Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
          <span className="text-xs font-medium text-slate-600">Scope Increase</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
          <span className="text-xs font-medium text-slate-600">No Change</span>
        </div>
      </div>
    </div>
  );
};

export default BurndownChart;