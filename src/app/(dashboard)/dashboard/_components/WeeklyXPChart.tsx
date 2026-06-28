"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

interface WeeklyXPChartProps {
  data: { day: string; xp: number }[];
}

export function WeeklyXPChart({ data }: WeeklyXPChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 5,
          left: -20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis 
          dataKey="day" 
          tick={{ fill: '#64748b', fontSize: 12 }} 
          tickLine={false}
          axisLine={{ stroke: '#1e293b' }}
          dy={10}
        />
        <YAxis 
          tick={{ fill: '#64748b', fontSize: 12 }} 
          tickLine={false}
          axisLine={false}
        />
        <Tooltip 
          cursor={{ fill: '#1e293b', opacity: 0.4 }}
          contentStyle={{ 
            backgroundColor: 'rgba(2, 6, 23, 0.8)', 
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(30, 41, 59, 0.8)',
            borderRadius: '8px',
            color: '#fff'
          }}
          itemStyle={{ color: '#22d3ee' }}
        />
        <Bar dataKey="xp" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={index === data.length - 1 ? '#06b6d4' : '#4f46e5'} 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
