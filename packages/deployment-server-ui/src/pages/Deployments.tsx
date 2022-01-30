import defineFunctionalComponent from "../util/defineFunctionalComponent";
import RecentDeploymentList from "../components/Dashboard/RecentDeploymentList";
import { Card, Col, Divider, Result, Row, Spin } from "antd";
import { useAppSelector } from "../app/hooks";
import React, { useEffect, useState } from "react";
import type { Dashboard } from "deployment-server";
import DeploymentsOverTimeGraph from "../components/Graphs/DeploymentsOverTimeGraph";

import styles from "./Deployments.module.scss";

export default defineFunctionalComponent(function Deployments() {
  const dashboardState = useAppSelector((state) => state.dashboard);
  const [chartTime, setChartTime] = useState<number>(24)

  return (
    <main style={{ height: "100%" }}>
      <h2>Deployments</h2>
      <Row>
        <Col span={24}>
      <Card style={{maxHeight: "416px", overflow: "auto"}}>
        {dashboardState.loading && !dashboardState.error ? (
          <div className={styles.loadouter}>
            <Spin tip={"Loading..."} />
          </div>
        ) : dashboardState.error ? (
          <Result
            status="error"
            title="Fetch Failed"
            subTitle="Please refresh the page or try again later."
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
      <Card> 
        <DeploymentsOverTimeGraph  data={dashboardState.data ? (dashboardState.data as Dashboard).deploymentsPerBucket : undefined}
                  chartTime={chartTime}/>
      </Card>
    </main>
  );
});
