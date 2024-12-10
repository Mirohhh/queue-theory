import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from "recharts";

  let res;
const SimChart = (props) => {
    const data = props.data.map(([name, num]) => ({ name, num }));
    res =data;
    console.log(res);

    return (
        <ResponsiveContainer width={"100%"} aspect={3}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
          <YAxis name='Number of Customers'/>
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="num"
            stroke="#1c62b9"
            strokeWidth={4}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    )
}

export default SimChart;