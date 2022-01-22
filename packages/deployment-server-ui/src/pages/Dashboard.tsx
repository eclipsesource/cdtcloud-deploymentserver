import RecentDeploymentList from "../components/Dashboard/RecentDeploymentList";
import DeploymentsOverTimeGraph from "../components/Dashboard/DeploymentsOverTimeGraph";
import defineFunctionalComponent from "../util/defineFunctionalComponent";
import { Dashboard } from "deployment-server";
import { useState, useEffect } from "react";
import { useInterval } from "react-use";
import classnames from 'classnames'

import { Card, Divider, Row, Col } from "antd";
import "./Dashboard.css";
import styles from '../components/Dashboard/DeploymentsOverTimeGraph.module.scss'


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
      <h2> Dashboard </h2>
      <Divider/>
      <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}  align="middle">
        <Col span={8}>
          <Card
            title="Deployments Overview"
            extra={<a href="/deployments">All Deployments</a>}
          >
          <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}>
              <Col span={6}>
                <h3>Total:</h3>
                <h3>Pending:</h3>
                <h3>Running:</h3>
              </Col>
              <Col span={6}>
                <h3>{data?.deployRequestCount ?? 0}</h3>
                <h3>{data?.deploymentOverview.PENDING ?? 0}</h3>
                <h3>{data?.deploymentOverview.RUNNING ?? 0}</h3>
              </Col>
              <Col span={6}>
                <h3>Success:</h3>
                <h3>Terminated:</h3>
                <h3>Failed:</h3>
              </Col>
              <Col span={6}>
                <h3>{data?.deploymentOverview.SUCCESS ?? 0}</h3>
                <h3>{data?.deploymentOverview.TERMINATED ?? 0}</h3>
                <h3>{data?.deploymentOverview.FAILED ?? 0}</h3>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="Device Overview"
            extra={<a href="/devices">All Devices</a>}
          >
            <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}>
              <Col span={6}>
                <h3>Available:</h3>
                <h3>Deploying:</h3>
              </Col>
              <Col span={6}>
                <h3>{data?.deviceOverview.AVAILABLE ?? 0}</h3>
                <h3>{data?.deviceOverview.DEPLOYING ?? 0}</h3>
              </Col>
              <Col span={6}>
                <h3>Running:</h3>
                <h3>Unavailable:</h3>
              </Col>
              <Col span={6}>
                <h3>{data?.deviceOverview.RUNNING ?? 0}</h3>
                <h3>{data?.deviceOverview.UNAVAILABLE  ?? 0}</h3>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="Supported Board Types"
            extra={<a href="/types">All Board Types</a>}
          >
            <h2></h2>
          </Card>
        </Col>
      </Row>
      <Divider/>
      <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]} align="top">
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
          >
            <RecentDeploymentList/>
          </Card>
        </Col>
      </Row>
      <Divider/>
    </main>
  );
});
