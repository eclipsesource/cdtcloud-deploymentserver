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

type TypeCount = Record<string, number>
type GraphEntry = Array<Record<string, TypeCount>>

interface Props {
  data: Record<string, TypeCount> | undefined
}

const dateFormatter = (timestamp: number): string => format(new Date(timestamp), 'MM-dd hh:mm aaaaa\'m\'')

export default defineFunctionalComponent(function DeploymentsStatusGraph (props: Props) {
  const [graphData, setGraphData] = useState<GraphEntry[]>([])

  useEffect(() => {
    if (props.data != null) {
      const dataArray = Object.entries<TypeCount>(props.data)
      const convertedData = dataArray.reduce<GraphEntry[]>((acc, [key, value]) => {
        return ([...acc,
          {
            date: dateFormatter(Date.parse(key)),
            ...Object.entries(value).reduce((ent, [k, v]) => ({ ...ent, [k]: v }), [])
          }])
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
            {graphData.map((value, index) => {
              const key = Object.keys(value)[index]
              if (key == null || key === 'date') {
                return <></>
              }
              return <Area type={'monotone'} dataKey={key} name={key}/>
            })}
          </AreaChart>
        </ResponsiveContainer>
      </div>
  )
}
)
