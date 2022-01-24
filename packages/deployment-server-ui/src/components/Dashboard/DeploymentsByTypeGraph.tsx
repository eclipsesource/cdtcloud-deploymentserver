import React, { useState, useEffect } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import defineFunctionalComponent from '../../util/defineFunctionalComponent';
import { format } from 'date-fns'

import styles from './Graph.module.scss'

type TypeCount = Record<string, number>
type GraphEntry = Record<string, TypeCount>[]

interface Props {
  data: Record<string, TypeCount> | undefined
}

const dateFormatter = (timestamp: number) => format(new Date(timestamp), 'MM-dd hh:mm')

export default defineFunctionalComponent(function DeploymentsStatusGraph(props: Props) {
    const [graphData, setGraphData] = useState<GraphEntry[]>([])

    useEffect(() => {
      if (props.data != null) {
        const dataArray = Object.entries<TypeCount>(props.data)
        const convertedData = dataArray.reduce<GraphEntry[]>((acc, [key, value]) => {
          return ([...acc,
            {
              date: dateFormatter(Date.parse(key)),
              ...Object.entries(value).reduce((ent, [k, v]) => ({...ent, [k]: v}), [])
            }])
        }, [])
        setGraphData(convertedData)
      }
    }, [props.data])

    return (
      <div className={styles.chart}>
        <ResponsiveContainer>
          <AreaChart data={graphData}>
            <CartesianGrid vertical={false} stroke="#aaaaaa77"/>
            <XAxis dataKey="date"/>
            <YAxis allowDecimals={false}/>
            <Tooltip/>
            {graphData.map((value, index) => {
              const key = Object.keys(value)[index]
              if (key == null || key === 'date') {
                return
              }
              return <Area type={"monotone"} dataKey={key} name={key}/>
            })}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
);
