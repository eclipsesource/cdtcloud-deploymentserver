import RecentDeploymentList from "../components/Dashboard/RecentDeploymentList";
import DeploymentsOverTimeGraph from "../components/Dashboard/DeploymentsOverTimeGraph";
import defineFunctionalComponent from "../util/defineFunctionalComponent";
import { Dashboard } from "deployment-server";
import { useState, useEffect } from "react";
import { useInterval } from "react-use";
import classnames from 'classnames'

import { Card, Divider, Row, Col, Statistic } from "antd";
import "./Dashboard.css";
import styles from '../components/Dashboard/DeploymentsOverTimeGraph.module.scss'

import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  FieldTimeOutlined,
  HddOutlined,
  LockOutlined,
  PlayCircleOutlined,
  RocketOutlined,
  SyncOutlined,
} from "@ant-design/icons";

export default defineFunctionalComponent(function Dasboard() {
  const [data, setData] = useState<Dashboard>();
  const [refreshFlip, setRefetchFlip] = useState<boolean>(false);
  const [chartTime, setChartTime] = useState(24)

  const updateDashboardData = () => {
    try {
      fetch("/api/dashboard")
        .then((res) => res.json())
        .then((res) => setData(res));
    } catch (e) {
      console.log(e)
    }
  };

  useInterval(function () {
    setRefetchFlip(!refreshFlip);
  }, 3000);

  useEffect(() => {
    updateDashboardData()
  }, [refreshFlip]);

  return (
    <main>
      <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]} align="stretch">
        <Col span={8}>
          <Card
            title="Deployments Overview"
            extra={<a href="/deployments">All Deployments</a>}
            style={{ height: "100%" }}
          >
            <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}>
              <Col span={8}>
                <Statistic
                  title="Total Deploys"
                  value={data?.deployRequestCount ?? 0}
                  prefix={<RocketOutlined />}
                  valueStyle={{ color: "black" }}
                />
                <Statistic
                  title="Pending Deploys"
                  value={data?.deploymentOverview.PENDING ?? 0}
                  prefix={<FieldTimeOutlined />}
                  valueStyle={{ color: "blue" }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Running Deploys"
                  value={data?.deployRequestCount ?? 0}
                  prefix={<PlayCircleOutlined />}
                  valueStyle={{ color: "grey" }}
                />
                <Statistic
                  title="Success Deploys"
                  value={data?.deploymentOverview.SUCCESS ?? 0}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: "green" }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Terminated Deploys"
                  value={data?.deploymentOverview.TERMINATED ?? 0}
                  prefix={<ExclamationCircleOutlined />}
                  valueStyle={{ color: "orange" }}
                />
                <Statistic
                  title="Failed Deploys"
                  value={data?.deploymentOverview.FAILED ?? 0}
                  prefix={<CloseCircleOutlined />}
                  valueStyle={{ color: "red" }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="Device Overview"
            extra={<a href="/devices">All Devices</a>}
            style={{ height: "100%" }}
          >
            <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}>
              <Col span={12}>
                <Statistic
                  title="Available Devices"
                  value={data?.deviceOverview.AVAILABLE ?? 0}
                  prefix={<HddOutlined />}
                  valueStyle={{ color: "green" }}
                />
                <Statistic
                  title="Deploying Devices"
                  value={data?.deviceOverview.DEPLOYING ?? 0}
                  prefix={<SyncOutlined spin />}
                  valueStyle={{ color: "blue" }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Running Devices"
                  value={data?.deviceOverview.RUNNING ?? 0}
                  prefix={<PlayCircleOutlined />}
                  valueStyle={{ color: "grey" }}
                />
                <Statistic
                  title="Unavailable Devices"
                  value={data?.deviceOverview.UNAVAILABLE ?? 0}
                  prefix={<LockOutlined />}
                  valueStyle={{ color: "red" }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="Supported Board Types"
            extra={<a href="/types">All Board Types</a>}
            style={{ height: "100%" }}
          >
            <h2>27</h2>
          </Card>
        </Col>
      </Row>
      <Divider />
      <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]} align="stretch">
        <Col span={12}>
          <Card
            title="Deployments"
            extra={
              <div className={styles.topline}>
                <div className={styles.dchooser}>
                  {[6, 12, 24].map((t: number) =>
                    <div className={classnames(styles.dtime, { [styles.selected]: chartTime === t })}
                         onClick={() => setChartTime(t)}
                    >{t}h</div>)}
                </div>
              </div>
          }
          >
            <DeploymentsOverTimeGraph data={data?.deploymentsPerBucket} chartTime={chartTime}/>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="Recent Deployments "
            extra={<a href="/deployments">All Deployments</a>}
            style={{ height: "100%" }}
          >
            <RecentDeploymentList />
          </Card>
        </Col>
      </Row>
      <Divider />
    </main>
  );
});
