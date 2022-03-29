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

import RecentDeploymentList from '../components/Dashboard/RecentDeploymentList'
import DeploymentsOverTimeGraph from '../components/Graphs/DeploymentsOverTimeGraph'
import defineFunctionalComponent from '../util/defineFunctionalComponent'
import { Dashboard, Device, DeviceTypeResource } from 'deployment-server'
import { DeviceStatus } from './Devices'
import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import { Card, Divider, Row, Col, Statistic, Spin, Result } from 'antd'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  FieldTimeOutlined,
  HddOutlined,
  LockOutlined,
  PlayCircleOutlined,
  RocketOutlined,
  ShrinkOutlined,
  SyncOutlined
} from '@ant-design/icons'
import { useAppSelector } from '../app/hooks'

import styles from './Dashboard.module.scss'
import deployGraphStyles from '../components/Graphs/Graph.module.scss'
import colors from '../Colors.module.scss'

export default defineFunctionalComponent(function Dashboard () {
  const dashboardState = useAppSelector((state) => state.dashboard)
  const [chartTime, setChartTime] = useState<number>(24)
  const [connectedTypes, setConnectedTypes] = useState<string[]>([])
  const [supportedTypes, setSupportedTypes] = useState<DeviceTypeResource[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchAsync = async (): Promise<void> => {
      const respTypes = await fetch('/api/device-types')
      const types = await respTypes.json() as DeviceTypeResource[]
      setSupportedTypes(types)

      const respDevices = await fetch('/api/devices')
      const devices = await respDevices.json() as Device[]

      const uniqueTypes = devices.reduce<string[]>((acc, value) => {
        const exists = acc.filter(t => t === value.deviceTypeId)
        if (exists.length > 0 || value.status === DeviceStatus.UNAVAILABLE) {
          return acc
        }
        return [...acc, value.deviceTypeId]
      }, [])

      setConnectedTypes(uniqueTypes)
      setLoading(false)
    }

    fetchAsync()
  }, [dashboardState])

  return (
    dashboardState.loading && !dashboardState.error && loading
      ? <main className={styles.main}>
        <Spin tip={'Loading...'}/>
      </main>
      : dashboardState.error
        ? <main>
          <Result
            status={'error'}
            title={'Fetch Failed'}
            subTitle={'Please refresh the page or try again later.'}
          />
        </main>
        : <main>
          <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]} align={'stretch'}>
            <Col span={8}>
              <Card
                title={'Deployments Overview'}
                extra={<a href={'/deployments'}>All Deployments</a>}
                style={{ height: '100%' }}
              >
                <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}>
                  <Col span={8}>
                    <Statistic
                      title={'Total Deploys'}
                      value={dashboardState.data ? (dashboardState.data as Dashboard).deployRequestCount : 0}
                      prefix={<RocketOutlined/>}
                      valueStyle={{ color: 'black' }}
                    />
                    <Statistic
                      title={'Pending Deploys'}
                      value={dashboardState.data ? (dashboardState.data as Dashboard).deploymentOverview.PENDING : 0}
                      prefix={<FieldTimeOutlined/>}
                      valueStyle={{ color: colors.pending }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title={'Running Deploys'}
                      value={dashboardState.data ? (dashboardState.data as Dashboard).deploymentOverview.RUNNING : 0}
                      prefix={<PlayCircleOutlined/>}
                      valueStyle={{ color: colors.running }}
                    />
                    <Statistic
                      title={'Success Deploys'}
                      value={dashboardState.data ? (dashboardState.data as Dashboard).deploymentOverview.SUCCESS : 0}
                      prefix={<CheckCircleOutlined/>}
                      valueStyle={{ color: colors.success }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title={'Terminated Deploys'}
                      value={dashboardState.data ? (dashboardState.data as Dashboard).deploymentOverview.TERMINATED : 0}
                      prefix={<ExclamationCircleOutlined/>}
                      valueStyle={{ color: colors.terminated }}
                    />
                    <Statistic
                      title={'Failed Deploys'}
                      value={dashboardState.data ? (dashboardState.data as Dashboard).deploymentOverview.FAILED : 0}
                      prefix={<CloseCircleOutlined/>}
                      valueStyle={{ color: colors.failed }}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={8}>
              <Card
                title={'Device Overview'}
                extra={<a href={'/devices'}>All Devices</a>}
                style={{ height: '100%' }}
              >
                <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}>
                  <Col span={12}>
                    <Statistic
                      title={'Available Devices'}
                      value={dashboardState.data ? (dashboardState.data as Dashboard).deviceOverview.AVAILABLE : 0}
                      prefix={<HddOutlined/>}
                      valueStyle={{ color: colors.success }}
                    />
                    <Statistic
                      title={'Deploying Devices'}
                      value={dashboardState.data ? (dashboardState.data as Dashboard).deviceOverview.DEPLOYING : 0}
                      prefix={<SyncOutlined/>}
                      valueStyle={{ color: colors.pending }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title={'Running Devices'}
                      value={dashboardState.data ? ((dashboardState.data as Dashboard).deviceOverview.MONITORING + (dashboardState.data as Dashboard).deviceOverview.RUNNING) : 0}
                      prefix={<PlayCircleOutlined/>}
                      valueStyle={{ color: colors.running }}
                    />
                    <Statistic
                      title={'Unavailable Devices'}
                      value={dashboardState.data ? (dashboardState.data as Dashboard).deviceOverview.UNAVAILABLE : 0}
                      prefix={<LockOutlined/>}
                      valueStyle={{ color: colors.failed }}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={8}>
              <Card
                title={'Device Types'}
                extra={<a href={'/types'}>All Device Types</a>}
                style={{ height: '100%' }}
              >
                <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}>
                  <Col span={24}>
                    <Statistic
                      title={'Most Used Device Type'}
                      value={dashboardState.data ? (dashboardState.data as Dashboard).mostUsedDeviceType : ''}
                      valueStyle={{ color: 'black' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title={'Connected / Supported Types'}
                      value={connectedTypes.length}
                      suffix={`/${supportedTypes.length}`}
                      prefix={<ShrinkOutlined/>}
                      valueStyle={{ color: 'grey' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title={'Average Queue Time'}
                      value={dashboardState.data != null && (dashboardState.data as Dashboard).averageQueueTime != null ? (dashboardState.data as Dashboard).averageQueueTime : ''}
                      prefix={<ClockCircleOutlined/>}
                      suffix={'seconds'}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <Divider/>
          <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]} align={'stretch'}>
            <Col span={12}>
              <Card
                title={'Deployments'}
                extra={
                  <div className={deployGraphStyles.topline}>
                    <div className={deployGraphStyles.dchooser}>
                      {[6, 12, 24].map((t: number) =>
                        <div
                          className={classnames(deployGraphStyles.dtime, { [deployGraphStyles.selected]: chartTime === t })}
                          onClick={() => setChartTime(t)}
                        >{t}h</div>)}
                    </div>
                  </div>
                }
                style={{ height: '100%', overflow: 'auto' }}
              >
                <DeploymentsOverTimeGraph
                  data={dashboardState.data ? (dashboardState.data as Dashboard).deploymentsPerBucket : undefined}
                  chartTime={chartTime}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card
                title={'Recent Deployments'}
                extra={<a href={'/deployments'}>All Deployments</a>}
                style={{ maxHeight: '480px', overflow: 'auto' }}
              >
                <RecentDeploymentList
                  data={dashboardState.data ? (dashboardState.data as Dashboard).recentDeployments : undefined}
                />
              </Card>
            </Col>
          </Row>
          <Divider/>
        </main>
  )
})
