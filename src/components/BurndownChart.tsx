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
      <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl p-4 shadow-xl">
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
          <div className="text-xs text-center pt-1">
            <span className={`px-2 py-1 rounded-full font-medium ${
              isAhead 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-rose-100 text-rose-700'
            }`}>
              {isAhead ? 'Ahead of Schedule' : 'Behind Schedule'}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const BurndownChart: React.FC<BurndownChartProps> = ({ data, sprintDates }) => {
  // Create segments for different colored lines
  const createSegments = () => {
    const segments = [];
    
    for (let i = 0; i < data.length - 1; i++) {
      const current = data[i];
      const next = data[i + 1];
      const isRising = next.remaining > current.remaining;
      const isFlat = next.remaining === current.remaining;
      
      segments.push({
        start: i,
        end: i + 1,
        color: isFlat ? '#64748b' : isRising ? '#ef4444' : '#22c55e', // Red for rising (bad), Green for falling (good)
        type: isFlat ? 'flat' : isRising ? 'rising' : 'falling'
      });
    }
    
    return segments;
  };

  const segments = createSegments();

  // Create individual line data for each segment
  const getSegmentData = (startIndex: number, endIndex: number) => {
    return data.slice(startIndex, endIndex + 1);
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-lg border border-slate-200/60 p-4 lg:p-6 h-full backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full shadow-sm"></div>
          <span className="text-xs font-semibold text-slate-700 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200">
            {sprintDates}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-slate-400 rounded-full opacity-60"></div>
            <span className="text-slate-600 font-medium">Guideline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-gradient-to-r from-emerald-500 to-rose-500 rounded-full"></div>
            <span className="text-slate-600 font-medium">Actual</span>
          </div>
        </div>
      </div>
      
      <div className="h-48 lg:h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <defs>
              <linearGradient id="guidelineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#cbd5e1" stopOpacity={0.4} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="2 4" 
              stroke="#e2e8f0" 
              strokeOpacity={0.6}
              horizontal={true}
              vertical={false}
            />
            
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#64748b', fontWeight: 500 }}
              tickMargin={8}
            />
            
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#64748b', fontWeight: 500 }}
              tickMargin={8}
              domain={['dataMin - 2', 'dataMax + 2']}
            />
            
            <Tooltip content={<CustomTooltip />} />

            {/* Guideline with gradient */}
            <Line
              type="monotone"
              dataKey="guideline"
              stroke="url(#guidelineGradient)"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
              name="Guideline"
              filter="url(#glow)"
            />

            {/* Render each segment with its own color */}
            {segments.map((segment, index) => (
              <Line
                key={`segment-${index}`}
                type="monotone"
                dataKey="remaining"
                data={getSegmentData(segment.start, segment.end)}
                stroke={segment.color}
                strokeWidth={3}
                dot={{
                  fill: segment.color,
                  strokeWidth: 2,
                  stroke: '#ffffff',
                  r: 4,
                  filter: 'url(#glow)'
                }}
                activeDot={{
                  r: 6,
                  stroke: segment.color,
                  strokeWidth: 3,
                  fill: '#ffffff',
                  filter: 'url(#glow)'
                }}
                name="Remaining"
                connectNulls={false}
              />
            ))}

            {/* Weekend reference lines */}
            {data.map((point, index) => 
              point.isWeekend ? (
                <ReferenceLine
                  key={`weekend-${index}`}
                  x={point.date}
                  stroke="#f1f5f9"
                  strokeWidth={1}
                  strokeOpacity={0.8}
                />
              ) : null
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Status indicators */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-200/60">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-sm"></div>
          <span className="text-xs font-medium text-slate-600">Progress (Good)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-rose-500 rounded-full shadow-sm"></div>
          <span className="text-xs font-medium text-slate-600">Scope Increase (Risk)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-slate-500 rounded-full shadow-sm"></div>
          <span className="text-xs font-medium text-slate-600">No Change</span>
        </div>
      </div>
    </div>
  );
};

export default BurndownChart;