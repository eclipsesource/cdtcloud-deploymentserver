import React, { useState, useEffect } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import defineFunctionalComponent from '../../util/defineFunctionalComponent'
import { format } from 'date-fns'

import styles from './Graph.module.scss'

interface DeployCount { SUCCESS: number, FAILED: number, TERMINATED: number }
interface DeployData { issueCount: number, deployCount: DeployCount }
type GraphEntry = { date: string } & DeployCount

interface Props {
  data: Record<string, DeployData> | undefined
}

const dateFormatter = (timestamp: number) => format(new Date(timestamp), 'MM-dd hh:mm aaaaa\'m\'')

export default defineFunctionalComponent(function DeploymentsStatusGraph (props: Props) {
  const [graphData, setGraphData] = useState<GraphEntry[]>([])

  useEffect(() => {
    if (props.data != null) {
      const dataArray = Object.entries<DeployData>(props.data)
      const convertedData = dataArray.reduce<GraphEntry[]>((acc, [key, value]) => {
        return ([...acc, ({
          date: dateFormatter(Date.parse(key)),
          SUCCESS: value.deployCount.SUCCESS,
          FAILED: value.deployCount.FAILED,
          TERMINATED: value.deployCount.TERMINATED
        })])
      }, [])
      setGraphData(convertedData)
    }
  }, [props.data])

  return (
    <div className={styles.chart}>
      <ResponsiveContainer>
        <AreaChart data={graphData}>
          <CartesianGrid vertical={false} stroke='#aaaaaa77' />
          <XAxis dataKey='date' />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Area type='monotone' dataKey='SUCCESS' name='Successful' stackId={1} fill='#b7eb8f' stroke='#52c41a' />
          <Area type='monotone' dataKey='FAILED' name='Failed' stackId={2} fill='#ffa39e' stroke='#cf1322' />
          <Area type='monotone' dataKey='TERMINATED' name='Terminated' stackId={2} fill='#ffe58f' stroke='#faad14' />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
)
