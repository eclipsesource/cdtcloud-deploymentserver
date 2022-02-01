import RecentDeploymentList from "../components/Dashboard/RecentDeploymentList"
import DeploymentsOverTimeGraph from "../components/Graphs/DeploymentsOverTimeGraph"
import defineFunctionalComponent from "../util/defineFunctionalComponent"
import { Dashboard } from "deployment-server"
import React, { useState } from "react"
import classnames from "classnames"
import { Card, Divider, Row, Col, Statistic, Spin, Result } from "antd"
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
} from "@ant-design/icons"
import { useAppSelector } from "../app/hooks"

import "./Dashboard.css"
import deployGraphStyles from "../components/Graphs/Graph.module.scss"

export default defineFunctionalComponent(function Dashboard() {
  const dashboardState = useAppSelector((state) => state.dashboard)
  const [chartTime, setChartTime] = useState<number>(24)

  return (
    dashboardState.loading && !dashboardState.error ?
      <main style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Spin tip={"Loading..."}/>
      </main>
      :
      dashboardState.error ?
        <main>
          <Result
            status="error"
            title="Fetch Failed"
            subTitle="Please refresh the page or try again later."
          />
        </main>
        :
        <main>
          <Row gutter={[{xs: 8, sm: 16, md: 24, lg: 32}, 20]} align="stretch">
            <Col span={8}>
              <Card
                title="Deployments Overview"
                extra={<a href="/deployments">All Deployments</a>}
                style={{height: "100%"}}
              >
                <Row gutter={[{xs: 8, sm: 16, md: 24, lg: 32}, 20]}>
                  <Col span={8}>
                    <Statistic
                      title="Total Deploys"
                      value={dashboardState.data ? (dashboardState.data as Dashboard).deployRequestCount : 0}
                      prefix={<RocketOutlined/>}
                      valueStyle={{color: "black"}}
                    />
                    <Statistic
                      title="Pending Deploys"
                      value={dashboardState.data ? (dashboardState.data as Dashboard).deploymentOverview.PENDING : 0}
                      prefix={<FieldTimeOutlined/>}
                      valueStyle={{color: "blue"}}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Running Deploys"
                      value={dashboardState.data ? (dashboardState.data as Dashboard).deploymentOverview.RUNNING : 0}
                      prefix={<PlayCircleOutlined/>}
                      valueStyle={{color: "grey"}}
                    />
                    <Statistic
                      title="Success Deploys"
                      value={dashboardState.data ? (dashboardState.data as Dashboard).deploymentOverview.SUCCESS : 0}
                      prefix={<CheckCircleOutlined/>}
                      valueStyle={{color: "green"}}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Terminated Deploys"
                      value={dashboardState.data ? (dashboardState.data as Dashboard).deploymentOverview.TERMINATED : 0}
                      prefix={<ExclamationCircleOutlined/>}
                      valueStyle={{color: "orange"}}
                    />
                    <Statistic
                      title="Failed Deploys"
                      value={dashboardState.data ? (dashboardState.data as Dashboard).deploymentOverview.FAILED : 0}
                      prefix={<CloseCircleOutlined/>}
                      valueStyle={{color: "red"}}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={8}>
              <Card
                title="Device Overview"
                extra={<a href="/devices">All Devices</a>}
                style={{height: "100%"}}
              >
                <Row gutter={[{xs: 8, sm: 16, md: 24, lg: 32}, 20]}>
                  <Col span={12}>
                    <Statistic
                      title="Available Devices"
                      value={dashboardState.data ? (dashboardState.data as Dashboard).deviceOverview.AVAILABLE : 0}
                      prefix={<HddOutlined/>}
                      valueStyle={{color: "green"}}
                    />
                    <Statistic
                      title="Deploying Devices"
                      value={dashboardState.data ? (dashboardState.data as Dashboard).deviceOverview.DEPLOYING : 0}
                      prefix={<SyncOutlined/>}
                      valueStyle={{color: "blue"}}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Running Devices"
                      value={dashboardState.data ? (dashboardState.data as Dashboard).deviceOverview.RUNNING : 0}
                      prefix={<PlayCircleOutlined/>}
                      valueStyle={{color: "grey"}}
                    />
                    <Statistic
                      title="Unavailable Devices"
                      value={dashboardState.data ? (dashboardState.data as Dashboard).deviceOverview.UNAVAILABLE : 0}
                      prefix={<LockOutlined/>}
                      valueStyle={{color: "red"}}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={8}>
              <Card
                title="Device Types"
                extra={<a href="/types">All Device Types</a>}
                style={{height: "100%"}}
              >
               <Row gutter={[{xs: 8, sm: 16, md: 24, lg: 32}, 20]}>
                  <Col span={24}>
                    <Statistic
                    title="Most Used Device Type"
                    value={dashboardState.data ? (dashboardState.data as Dashboard).mostUsedDeviceType : ""}
                    prefix={""}
                    valueStyle={{color: "black"}}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Connected / Supported Types"
                      value={"2"}
                      suffix={"/27"}
                      prefix={<ShrinkOutlined />}
                      valueStyle={{color: "grey"}}
                    />
                    </Col>
                    <Col span={12}>
                    <Statistic
                      title="Average Queue Time"
                      value={dashboardState.data ? (dashboardState.data as Dashboard).averageQueueTime : ""}
                      prefix={<ClockCircleOutlined/>}
                      suffix={"seconds"}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <Divider/>
          <Row gutter={[{xs: 8, sm: 16, md: 24, lg: 32}, 20]} align="stretch">
            <Col span={11}>
              <Card
                title="Deployments"
                extra={
                  <div className={deployGraphStyles.topline}>
                    <div className={deployGraphStyles.dchooser}>
                      {[6, 12, 24].map((t: number) =>
                        <div className={classnames(deployGraphStyles.dtime, {[deployGraphStyles.selected]: chartTime === t})}
                             onClick={() => setChartTime(t)}
                        >{t}h</div>)}
                    </div>
                  </div>
                }
                style={{height: "100%", overflow: "auto"}}
              >
                <DeploymentsOverTimeGraph
                  data={dashboardState.data ? (dashboardState.data as Dashboard).deploymentsPerBucket : undefined}
                  chartTime={chartTime}
                />
              </Card>
            </Col>
            <Col span={13}>
              <Card
                title="Recent Deployments "
                extra={<a href="/deployments">All Deployments</a>}
                style={{maxHeight: "480px", overflow: "auto"}}
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
