import defineFunctionalComponent from '../util/defineFunctionalComponent'
import RecentDeploymentList from '../components/Dashboard/RecentDeploymentList'
import { Card, Col, Divider, Result, Row, Spin } from 'antd'
import { useAppSelector } from '../app/hooks'
import React from 'react'
import type { Dashboard } from 'deployment-server'
import DeploymentsOverTimeGraph from '../components/Graphs/DeploymentsOverTimeGraph'

import styles from './Deployments.module.scss'

export default defineFunctionalComponent(function Deployments() {
  const dashboardState = useAppSelector((state) => state.dashboard)

  return (
    <main style={{maxHeight:"85vh", overflowY: 'scroll'}}>
      <Row>
        <Col span={24}>
          <Card title={'Deployments'} style={{overflow: 'auto' }}>
            {dashboardState.loading && !dashboardState.error ? (
              <div className={styles.loadouter}>
                <Spin tip={'Loading...'}/>
              </div>
            ) : dashboardState.error ? (
              <Result
                status={'error'}
                title={'Fetch Failed'}
                subTitle={'Please refresh the page or try again later.'}
              />
            ) : (
              <RecentDeploymentList
                details
                data={
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
        <Col span={24} style={{minWidth: "0", overflow: 'auto'}}>
          <Card title="Deployment Graph">
            <DeploymentsOverTimeGraph
              data={dashboardState.data ? (dashboardState.data as Dashboard).deploymentsPerBucket : undefined}
              chartTime={24}
            />
          </Card>
        </Col>
      </Row>
    </main>
  )
})
