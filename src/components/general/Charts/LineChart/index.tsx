import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  {
    name: '00:00',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: '03:00',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: '06:00',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: '09:00',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: '12:00',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: '15:00',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: '18:00',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

export default function LineChartComponent() {
  return (
    <LineChart
      width={550}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        bottom: 5,
      }}
      className=' -ml-4  text-xs'
    >
      {/* <CartesianGrid strokeDasharray='0 0' /> */}
      <XAxis dataKey='name' />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type='monotone' dataKey='pv' stroke='#204D88' activeDot={{ r: 8 }} />
      {/* <Line type='monotone' dataKey='uv' stroke='#82ca9d' /> */}
    </LineChart>
  );
}
