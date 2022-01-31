import React, { useState, useEffect } from 'react'
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from 'recharts'

import colors from '../../Colors.module.scss'

type DataEntries = { status: string, value: number }[]

interface Props {
  data: {
    FAILED: number,
    TERMINATED: number,
    PENDING: number,
    SUCCESS: number
  }
}

export const DeploymentStatusPie = (props: Props) => {
  const [graphData, setGraphData] = useState<DataEntries>([])

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
          fill={'#000000'}
          dataKey="value"
          nameKey="status"
          label={((label) => `${(label.percent * 100).toFixed(0)}%`)}
        >
          {graphData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[entry.status.toLowerCase()]}/>
          ))}
        </Pie>
        <Tooltip/>
      </PieChart>
    </ResponsiveContainer>
  )
}
