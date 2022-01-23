import React, { useState, useEffect } from 'react';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from "recharts"

type DataEntries = {status: string, value: number}[]

const COLORS = ['black', 'green', 'blue', 'red'];

interface Props {
  data: {
    PENDING: number,
    SUCCESS: number,
    RUNNING: number,
    FAILED: number
  }
}

export const DeploymentStatusGraph = (props: Props) => {
  const [graphData, setGraphData] = useState<DataEntries>([])

  // test data
  const myData = {
    PENDING: 20,
    SUCCESS: 150,
    RUNNING: 10,
    FAILED: 5
  }
  useEffect(() => {
    const dataArray = Object.entries(myData)
    const convertedData = dataArray.reduce<DataEntries>((acc, [key, value]) => ([...acc, ({
      status: key,
      value
    })]), [])
    setGraphData(convertedData)
  }, [])
  // end test data

  useEffect(() => {
    if (props.data != null) {
      const dataArray = Object.entries(props.data)
      const convertedData = dataArray.reduce<DataEntries>((acc, [key, value]) => ([...acc, ({
        status: key,
        value
      })]), [])
      setGraphData(convertedData)
    }
  }, [props.data])

  return (
    <ResponsiveContainer width={250} height={250}>
      <PieChart width={120} height={120}>
        <Pie
          data={graphData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="status"
          label
        >
          {graphData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip/>
      </PieChart>
    </ResponsiveContainer>
  );
}
