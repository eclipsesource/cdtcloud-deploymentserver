/********************************************************************************
    Copyright (c) 2022 EclipseSource and others.

    This program and the accompanying materials are made available under the
    terms of the Eclipse Public License v. 2.0 which is available at
    http://www.eclipse.org/legal/epl-2.0.

    This Source Code may also be made available under the following Secondary
    Licenses when the conditions for such availability set forth in the Eclipse
    Public License v. 2.0 are satisfied: GNU General Public License, version 2
    with the GNU Classpath Exception which is available at
    https://www.gnu.org/software/classpath/license.html.

    SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
********************************************************************************/

import React, { useState, useEffect } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import defineFunctionalComponent from '../../util/defineFunctionalComponent'
import { format } from 'date-fns'

import styles from './Graph.module.scss'

// TODO: redundant types anf function
interface deploymentCount { SUCCESS: number, FAILED: number, TERMINATED: number }
interface DeployData { issueCount: number, deploymentCount: deploymentCount }
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
        const noIssue = Object.values(value.deploymentCount).reduce((last, current) => last + current, 0)
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
            <CartesianGrid vertical={false} stroke={'#aaaaaa77'}/>
            <XAxis dataKey={'date'}/>
            <YAxis allowDecimals={false}/>
            <Tooltip formatter={(value: number[], name: string) => {
              if (name === 'Issues') {
                return value[1] - value[0]
              }
              return value
            }}/>
            <Area type={'monotone'} dataKey={'noIssue'} name={'Deployments'} fill={'#b7eb8f'} stroke={'#52c41a'}/>
            <Area type={'monotone'} dataKey={'total'} name={'Issues'} fill={'#ffa39e'} stroke={'#cf1322'}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
  )
}
)
