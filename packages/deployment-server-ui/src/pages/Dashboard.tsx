import RecentDeploymentList from "../components/Dashboard/RecentDeploymentList";
import DeploymentsOverTimeGraph from "../components/Dashboard/DeploymentsOverTimeGraph";
import defineFunctionalComponent from "../util/defineFunctionalComponent";
import { DeviceCount, DeployRequestCount } from "deployment-server";
import { useState, useEffect } from "react";
import { useInterval } from "react-use";

import { Card, Divider,  Row, Col } from "antd";
import "./DashboardCSS.css";

export default defineFunctionalComponent(function Dasboard() {

  const [data, setData] = useState<DeviceCount>();
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

      <div className="gutter-example">
        <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}>
          <Col span={8}>
            <Card title="Total Deployments" >
              <h2>Number</h2>
            </Card>
          </Col>

          <Col span={8}>
            <Card title="Connected Devices" >
              <h2>{data.deviceCount}</h2>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Supported Board Types" >
              <h2>All of them</h2>
            </Card>
          </Col>
        </Row>

        <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}>
          <Col span={14}>
            <Card title="Deployments over Time Chart" >
             <DeploymentsOverTimeGraph/>
            </Card>
          </Col>
          <Col span={10}>
            <Card title="Recent Deployments " >
             <RecentDeploymentList/>
            </Card>
          </Col>
        </Row>
      </div>
    </main>
  );
});
