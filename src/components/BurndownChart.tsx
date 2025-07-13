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

// Custom line component that renders segments with different colors
const CustomActualLine = ({ points }: any) => {
  if (!points || points.length < 2) return null;

  const segments = [];
  
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    
    if (!current || !next) continue;
    
    const currentValue = current.payload.remaining;
    const nextValue = next.payload.remaining;
    const isIncreasing = nextValue > currentValue;
    const isFlat = nextValue === currentValue;
    
    let segmentColor;
    if (isFlat) {
      segmentColor = '#64748b'; // Gray for flat
    } else if (isIncreasing) {
      segmentColor = '#22c55e'; // Green for increasing (scope added)
    } else {
      segmentColor = '#ef4444'; // Red for decreasing (work completed)
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

// Custom dot component that matches segment colors
const CustomDot = ({ cx, cy, payload }: any) => {
  if (!payload) return null;
  
  const nextIndex = payload.index + 1;
  const data = payload.data || [];
  
  if (nextIndex >= data.length) {
    // Last point - use neutral color
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
  const next = data[nextIndex];
  
  if (!current || !next) return null;
  
  const isIncreasing = next.remaining > current.remaining;
  const isFlat = next.remaining === current.remaining;
  
  let dotColor;
  if (isFlat) {
    dotColor = '#64748b';
  } else if (isIncreasing) {
    dotColor = '#22c55e'; // Green for increasing
  } else {
    dotColor = '#ef4444'; // Red for decreasing
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
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 lg:p-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
          <span className="text-xs sm:text-sm font-semibold text-slate-700">
            {sprintDates}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs">
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
      
      <div className="flex-1 min-h-0" style={{ minHeight: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={dataWithIndex} 
            margin={{ 
              top: 10, 
              right: 10, 
              left: 10, 
              bottom: 10 
            }}
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
              tick={{ fontSize: 10, fill: '#64748b', fontWeight: 500 }}
              tickMargin={8}
              interval="preserveStartEnd"
            />
            
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#64748b', fontWeight: 500 }}
              tickMargin={8}
              domain={['dataMin - 3', 'dataMax + 3']}
              width={30}
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

            {/* Actual line with custom segments and dots */}
            <Line
              type="monotone"
              dataKey="remaining"
              stroke="transparent"
              strokeWidth={0}
              dot={<CustomDot />}
              shape={<CustomActualLine />}
              name="Remaining"
              connectNulls={true}
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
      <div className="flex items-center justify-center gap-4 sm:gap-6 mt-4 pt-4 border-t border-slate-100 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <span className="text-xs font-medium text-slate-600">Scope Added</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
          <span className="text-xs font-medium text-slate-600">Work Completed</span>
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