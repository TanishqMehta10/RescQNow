// Minimal ambient declaration for `recharts` to avoid TypeScript errors
// This file is only a stop-gap so `tsc`/editor checks don't fail before running `npm install`.

declare module 'recharts' {
  import * as React from 'react';
  export const PieChart: React.FC<any>;
  export const Pie: React.FC<any>;
  export const Cell: React.FC<any>;
  export const Tooltip: React.FC<any>;
  export const ResponsiveContainer: React.FC<any>;
  export const BarChart: React.FC<any>;
  export const Bar: React.FC<any>;
  export const XAxis: React.FC<any>;
  export const YAxis: React.FC<any>;
  export const CartesianGrid: React.FC<any>;
  export const Legend: React.FC<any>;
  export type TooltipProps = any;
  const _default: any;
  export default _default;
}
