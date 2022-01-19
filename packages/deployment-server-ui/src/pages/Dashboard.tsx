import RecentDeploymentList from "../components/Dashboard/RecentDeploymentList";
import DeploymentsOverTimeGraph from "../components/Dashboard/DeploymentsOverTimeGraph";
import defineFunctionalComponent from "../util/defineFunctionalComponent";
import { Dashboard } from "deployment-server";
import { useState, useEffect } from "react";
import { useInterval } from "react-use";

import { Card, Divider, Row, Col, Tabs } from "antd";
import "./Dashboard.css";
import { Link } from "react-router-dom";

export default defineFunctionalComponent(function Dasboard() {
  const [data, setData] = useState<Dashboard>();
  let [refreshFlip, setRefetchFlip] = useState(false);

  useInterval(function () {
    setRefetchFlip(!refreshFlip);
  }, 3000);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((res) => setData(res));
  }, [refreshFlip]);

  return (
    <main>
      <h2> Dashboard </h2>
      <Divider />
      <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}  align="middle">
        <Col span={8}>
          <Card
            title="Deployments Overview"
            extra={<Link to="/deployments">All Deployments</Link>}
          >
          <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}>
              <Col span={6}>
                <h3>Total:</h3>
                <h3>Pending:</h3>
                <h3>Running:</h3>
              </Col>
              <Col span={6}>
                <h3>{data?.deployRequestCount}</h3>
                <h3>{data?.deploymentOverview.PENDING}</h3>
                <h3>{data?.deploymentOverview.RUNNING}</h3>
              </Col>
              <Col span={6}>
                <h3>Sucessfull:</h3>
                <h3>Terminated:</h3>
                <h3>Failed:</h3>
              </Col>
              <Col span={6}>
                <h3>{data?.deploymentOverview.SUCCESS}</h3>
                <h3>{data?.deploymentOverview.TERMINATED}</h3>
                <h3>{data?.deploymentOverview.FAILED}</h3>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="Device Overview"
            extra={<Link to="/devices">All Devices</Link>}
          >
            <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}>
              <Col span={12}>
                <h3>Available: {data?.deviceOverview.AVAILABLE}</h3>
                <h3>Deploying: {data?.deviceOverview.DEPLOYING}</h3>
              </Col>
              <Col span={12}>
                <h3> Running:{data?.deviceOverview.RUNNING}</h3>
                <h3>Unavailable:{data?.deviceOverview.UNAVAILABLE}</h3>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="Supported Board Types"
            extra={<Link to="/types">All Board Types</Link>}
          >
            <h2>Memes</h2>
          </Card>
        </Col>
      </Row>
      <Divider />
      <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]} align="middle">
        <Col span={12}>
          <Card title="Deployments over Time Chart">
            <DeploymentsOverTimeGraph />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="Recent Deployments "
            extra={<Link to="/deployments">All Deployments</Link>}
          >
            <RecentDeploymentList />
          </Card>
        </Col>
      </Row>
      <Divider />
    </main>
  );
});
