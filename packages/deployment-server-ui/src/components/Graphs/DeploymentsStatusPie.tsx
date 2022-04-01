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

import React, { useState, useEffect, ReactElement } from 'react'
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from 'recharts'

import colors from '../../Colors.module.scss'

type DataEntries = Array<{ status: string, value: number }>

interface Props {
  data: {
    FAILED: number
    TERMINATED: number
    PENDING: number
    SUCCESS: number
  }
}

export const DeploymentStatusPie = (props: Props): ReactElement => {
  const [graphData, setGraphData] = useState<DataEntries>([])

  useEffect(() => {
    if (props.data != null) {
      const dataArray = Object.entries(props.data)
      const convertedData = dataArray.reduce<DataEntries>((acc, [key, value]) => ([...acc, ({
        status: key,
        value
      })]), [])
      setGraphData(convertedData)
    }
  }, [props.data])

  return (
    <ResponsiveContainer width={250} height={250}>
      <PieChart width={120} height={120}>
        <Pie
          data={graphData}
          cx={'50%'}
          cy={'50%'}
          outerRadius={80}
          fill={'#000000'}
          dataKey={'value'}
          nameKey={'status'}
          label={((label) => `${(label.percent * 100).toFixed(0)}%`)}
        >
          {graphData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[entry.status.toLowerCase()]}/>
          ))}
        </Pie>
        <Tooltip/>
      </PieChart>
    </ResponsiveContainer>
  )
}
