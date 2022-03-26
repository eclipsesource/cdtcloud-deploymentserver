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

interface deploymentCount { SUCCESS: number, FAILED: number, TERMINATED: number }
interface DeployData { issueCount: number, deploymentCount: deploymentCount }
type GraphEntry = { date: string } & deploymentCount

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
          SUCCESS: value.deploymentCount.SUCCESS,
          FAILED: value.deploymentCount.FAILED,
          TERMINATED: value.deploymentCount.TERMINATED
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
            <Tooltip/>
            <Area type={'monotone'} dataKey={'SUCCESS'} name={'Successful'} stackId={1} fill={'#b7eb8f'}
                  stroke={'#52c41a'}/>
            <Area type={'monotone'} dataKey={'FAILED'} name={'Failed'} stackId={2} fill={'#ffa39e'} stroke={'#cf1322'}/>
            <Area type={'monotone'} dataKey={'TERMINATED'} name={'Terminated'} stackId={2} fill={'#ffe58f'}
                  stroke={'#faad14'}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
  )
}
)
