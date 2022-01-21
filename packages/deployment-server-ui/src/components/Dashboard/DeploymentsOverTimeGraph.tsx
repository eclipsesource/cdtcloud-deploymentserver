import React, { useState, useEffect } from 'react';
import styles from './DeploymentsOverTimeGraph.module.scss';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import defineFunctionalComponent from '../../util/defineFunctionalComponent';
import { format } from 'date-fns'

type DataEntries = {date: string, deploys: string}[]

const dateFormatter = (timestamp: number) => format(new Date(timestamp), 'MM-dd hh:mm')

interface Props {
  data: any,
  chartTime: number
}

export default defineFunctionalComponent(function DeploymentsOverTimeGraph(props: Props) {
    const [graphData, setGraphData] = useState<DataEntries>([])

    useEffect(() => {
      if (props.data != null) {
        const dataArray = Object.entries<string>(props.data)
        const convertedData = dataArray.reduce<DataEntries>((acc, [key, value]) => ([...acc, ({
          date: dateFormatter(Date.parse(key)),
          deploys: value
        })]), [])
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
