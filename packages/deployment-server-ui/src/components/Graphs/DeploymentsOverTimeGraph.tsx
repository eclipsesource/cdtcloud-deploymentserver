import React, { useState, useEffect } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import defineFunctionalComponent from '../../util/defineFunctionalComponent';
import { format } from 'date-fns'

import styles from './Graph.module.scss';

type GraphEntry = { date: string, deploys: number }

interface Props {
  data: Record<string, number> | undefined,
  chartTime: number
}

const dateFormatter = (timestamp: number) => format(new Date(timestamp), 'MM-dd hh:mm aaaaa\'m\'')

export default defineFunctionalComponent(function DeploymentsOverTimeGraph(props: Props) {
  const [graphData, setGraphData] = useState<GraphEntry[]>([])

  useEffect(() => {
    if (props.data != null) {
      const dataArray = Object.entries<number>(props.data)
      const convertedData = dataArray.reduce<GraphEntry[]>((acc, [key, value]) => {
        return ([...acc, ({
          date: dateFormatter(Date.parse(key)),
          deploys: value
        })])
      }, [])
      setGraphData(convertedData)
    }
  }, [props.data])

    return (
      <div className={styles.chart}>
        <ResponsiveContainer>
          <AreaChart data={graphData.slice(-props.chartTime)} margin={{ top: 10, right: 0, left: -30, bottom: 5 }}>
            <CartesianGrid vertical={false} stroke="#aaaaaa77"/>
            <XAxis dataKey="date"/>
            <YAxis allowDecimals={false}/>
            <Tooltip formatter={(value: number) => [value, "Deployments"]}/>
            <Area type={'monotone'} dataKey={'deploys'} stroke={'#3930e5'} fill={"#3b9aec"}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
);
