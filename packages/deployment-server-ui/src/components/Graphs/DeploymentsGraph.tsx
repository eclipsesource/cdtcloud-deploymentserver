import React, { useState, useEffect } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import defineFunctionalComponent from '../../util/defineFunctionalComponent'
import { format } from 'date-fns'
import { DeployRequest } from 'deployment-server'

import styles from './Graph.module.scss'

type GraphEntry = { hour: string, deploys: number }

interface Props {
  data: DeployRequest[],
  chartTime: number
}

const dateFormatter = (timestamp: number) => format(new Date(timestamp), 'MM-dd hh aaaaa\'m\'')
const fillNill = (timeSlots: number) => {
  const initialData = []
  const now = Date.now()
  for (let i = 0; i < timeSlots; i++) {
    const hour = dateFormatter(now - i * 60 * 60 * 1000)
    initialData.push({hour, deploys: 0})
  }
  return initialData
}

export default defineFunctionalComponent(function DeploymentsGraph(props: Props) {
    const [graphData, setGraphData] = useState<GraphEntry[]>(fillNill(props.chartTime))

    useEffect(() => {
      if (props.data != null) {
        const dataArray = Object.entries<DeployRequest>(props.data)
        const convertedData = dataArray.reduce<GraphEntry[]>((acc, [key, value]) => {
          return ([...acc, ({
            hour: dateFormatter(Date.parse(value.createdAt.toString())),
            deploys: 1
          })])
        }, [])
        const filledData = convertedData.reduce<GraphEntry[]>((acc, value) => {
          const exists = acc.filter(t => t.hour === value.hour)
          if (exists.length > 0) {
            const index = acc.indexOf(exists[0])
            acc[index].deploys = acc[index].deploys + value.deploys
          }
          return acc
        }, graphData)
        setGraphData(filledData)
      }
    }, [props.data])

    return (
      <div className={styles.chart}>
        <ResponsiveContainer>
          <AreaChart data={graphData.slice(-props.chartTime)} margin={{ top: 10, right: 0, left: -30, bottom: 5 }}>
            <CartesianGrid vertical={false} stroke={'#aaaaaa77'}/>
            <XAxis dataKey={'hour'}/>
            <YAxis allowDecimals={false}/>
            <Tooltip formatter={(value: number) => [value, 'Deployments']}/>
            <Area type={'monotone'} dataKey={'deploys'} stroke={'#3930e5'} fill={'#3b9aec'}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )
  }
)
