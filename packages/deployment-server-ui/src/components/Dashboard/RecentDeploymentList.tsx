import { List, Button, Tag } from "antd";
import { useState, useEffect } from "react";
import { useInterval } from "react-use";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./RecentDeploymentList.css";

import { DeployStatus, RecentDeployment } from "deployment-server";
import defineFunctionalComponent from "../../util/defineFunctionalComponent";

const { Item } = List;
const { Meta } = Item;

const status: Record<DeployStatus, { color: string; text: string }> = {
  SUCCESS: {
    color: "green",
    text: "SUCCESS",
  },
  TERMINATED: {
    color: "yellow",
    text: "TERMINATED",
  },
  FAILED: {
    color: "red",
    text: "ERROR",
  },
  PENDING: {
    color: "blue",
    text: "PENDING",
  },
  RUNNING: {
    color: "grey",
    text: "RUNNING",
  },
};

export default defineFunctionalComponent(function RecentDeploymentList() {
  const [data, setData] = useState<RecentDeployment[]>([]);
  let [refreshFlip, setRefetchFlip] = useState(false);

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
        {data.map((item) => (
          <CSSTransition key={item.id} timeout={750} classNames="deployment">
            <Item
              actions={[
                <Button type="primary">View Deployment</Button>,
                <Button type="primary">View Device</Button>,
                <Button type="primary">Artifact</Button>,
              ]}
            >
              <Meta
                avatar={
                  <Tag color={status[item.status].color}>
                    {status[item.status].text}
                  </Tag>
                }
                title={<a href="https://ant.design">{item.device.type.name}</a>}
                description={item.id}
              />
            </Item>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </List>
  );
});
