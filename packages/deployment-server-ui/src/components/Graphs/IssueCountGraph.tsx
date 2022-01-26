import React, { useState, useEffect } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import defineFunctionalComponent from '../../util/defineFunctionalComponent'
import { format } from 'date-fns'

import styles from './Graph.module.scss'

// TODO: redundant types anf function
interface DeployCount { SUCCESS: number, FAILED: number, TERMINATED: number }
interface DeployData { issueCount: number, deployCount: DeployCount }
interface GraphEntry { date: string, total: number[], noIssue: number }

interface Props {
  data: Record<string, DeployData> | undefined
}

const dateFormatter = (timestamp: number) => format(new Date(timestamp), 'MM-dd hh:mm aaaaa\'m\'')

export default defineFunctionalComponent(function IssueCountGraph (props: Props) {
  const [graphData, setGraphData] = useState<GraphEntry[]>([])

  useEffect(() => {
    if (props.data != null) {
      const dataArray = Object.entries<DeployData>(props.data)
      const convertedData = dataArray.reduce<GraphEntry[]>((acc, [key, value]) => {
        const noIssue = Object.values(value.deployCount).reduce((last, current) => last + current, 0)
        return ([...acc, ({
          date: dateFormatter(Date.parse(key)),
          total: [noIssue, value.issueCount + noIssue],
          noIssue
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
          <Tooltip formatter={(value: number[], name: string) => {
            if (name === 'Issues') {
              return value[1] - value[0]
            }
            return value
          }}
          />
          <Area type='monotone' dataKey='noIssue' name='Deployments' fill='#b7eb8f' stroke='#52c41a' />
          <Area type='monotone' dataKey='total' name='Issues' fill='#ffa39e' stroke='#cf1322' />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
)
