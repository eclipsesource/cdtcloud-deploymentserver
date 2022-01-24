import React, { useState, useEffect } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import defineFunctionalComponent from '../../util/defineFunctionalComponent';
import { format } from 'date-fns'

import styles from './Graph.module.scss'

type StateCount = { success: number, failed: number, terminated: number }
type GraphEntry = { date: string } & StateCount

interface Props {
  data: Record<string, StateCount> | undefined
}

const dateFormatter = (timestamp: number) => format(new Date(timestamp), 'MM-dd hh:mm')

export default defineFunctionalComponent(function DeploymentsStatusGraph(props: Props) {
    const [graphData, setGraphData] = useState<GraphEntry[]>([])

    useEffect(() => {
      if (props.data != null) {
        const dataArray = Object.entries<StateCount>(props.data)
        const convertedData = dataArray.reduce<GraphEntry[]>((acc, [key, value]) => {
          return ([...acc, ({
            date: dateFormatter(Date.parse(key)),
            success: value.success,
            failed: value.failed,
            terminated: value.terminated
          })])
        }, [])
        setGraphData(convertedData)
      }
    }, [props.data])

    return (
      <div className={styles.chart}>
        <ResponsiveContainer>
          <AreaChart data={graphData} >
            <CartesianGrid vertical={false} stroke="#aaaaaa77"/>
            <XAxis dataKey="date"/>
            <YAxis allowDecimals={false}/>
            <Tooltip/>
            <Area type={'monotone'} dataKey={'success'} name={'Successful'} stackId={1} fill={"#b7eb8f"} stroke={"#52c41a"}/>
            <Area type={'monotone'} dataKey={'failed'} name={'Failed'} stackId={2} fill={"#ffa39e"} stroke={"#cf1322"}/>
            <Area type={'monotone'} dataKey={'terminated'} name={'Terminated'} stackId={2} fill={"#ffe58f"} stroke={"#faad14"}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
);
