import { Divider, Typography } from "antd";
import RecentDeploymentList from "../components/Dashboard/RecentDeploymentList";
import defineFunctionalComponent from "../util/defineFunctionalComponent";
import { Card, Space, Row, Col } from "antd";

export default defineFunctionalComponent(function Dasboard() {
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
              <h2>42</h2>
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
              <p>In this card</p>
              <p>We would have</p>
              <p>The Deployments</p>
              <p>over</p>
              <p>time</p>
              <p>listed in a handy </p>
              <p>graph</p>
              <p>This card should not be bigger than this</p>
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
