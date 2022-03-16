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
import defineFunctionalComponent from '../util/defineFunctionalComponent'
import RecentDeploymentList from '../components/Dashboard/RecentDeploymentList'
import { Card, Col, Divider, Result, Row, Spin } from 'antd'
import { useAppSelector } from '../app/hooks'
import React from 'react'
import type { Dashboard } from 'deployment-server'
import DeploymentsOverTimeGraph from '../components/Graphs/DeploymentsOverTimeGraph'

import styles from './Deployments.module.scss'

export default defineFunctionalComponent(function Deployments () {
  const dashboardState = useAppSelector((state) => state.dashboard)

  return (
    <main style={{ maxHeight: '85vh', overflowY: 'scroll' }}>
      <Row>
        <Col span={24}>
          <Card title={'Deployments'} style={{ overflow: 'auto' }}>
            {dashboardState.loading && !dashboardState.error
              ? (
              <div className={styles.loadouter}>
                <Spin tip={'Loading...'}/>
              </div>
                )
              : dashboardState.error
                ? (
              <Result
                status={'error'}
                title={'Fetch Failed'}
                subTitle={'Please refresh the page or try again later.'}
              />
                  )
                : (
              <RecentDeploymentList
                details
                data={
                  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                  dashboardState.data
                    ? (dashboardState.data as Dashboard).recentDeployments
                    : undefined
                }
              />
                  )}
          </Card>
        </Col>
      </Row>
      <Divider/>
      <Row>
        <Col span={24} style={{ minWidth: '0', overflow: 'auto' }}>
          <Card title="Deployment Graph">
            <DeploymentsOverTimeGraph
              // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
              data={dashboardState.data ? (dashboardState.data as Dashboard).deploymentsPerBucket : undefined}
              chartTime={24}
            />
          </Card>
        </Col>
      </Row>
    </main>
  )
})
