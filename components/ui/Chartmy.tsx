"use client"

import React from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
interface prosp {
  data:{
    name: string;
    total: number;
  }[];
}
const Chartmy = ({ data }: prosp) => {
  return (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false}
            axisLine={false}
              />
            <YAxis stroke="#888888" tickLine={false} axisLine={false} tickFormatter={(val)=>`$${val}`} />
            <Tooltip />
            <Bar dataKey="total" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chartmy;
