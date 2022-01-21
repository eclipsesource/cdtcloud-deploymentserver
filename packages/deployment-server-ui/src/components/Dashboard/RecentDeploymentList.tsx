import { List } from "antd";
import React, { useState, useEffect } from "react";
import { useInterval } from "react-use";
import { TransitionGroup } from "react-transition-group";
import "./RecentDeploymentList.css";

import { RecentDeployment } from "deployment-server";
import defineFunctionalComponent from "../../util/defineFunctionalComponent";
import { RecentDeploymentItem } from './RecentDeploymentItem'


export default defineFunctionalComponent(function RecentDeploymentList() {
  const [data, setData] = useState<RecentDeployment[]>([]);
  const [refreshFlip, setRefetchFlip] = useState<boolean>(false);

  useInterval(function () {
    setRefetchFlip(!refreshFlip);
  }, 3000);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((res) => setData(res.recentDeployments));
  }, [refreshFlip]);

  return (
    <List itemLayout="horizontal">
      <TransitionGroup>
        {data.map((item: RecentDeployment) => (
          <RecentDeploymentItem id={item.id} status={item.status} device={item.device}/>
        ))}
      </TransitionGroup>
    </List>
  );
});
