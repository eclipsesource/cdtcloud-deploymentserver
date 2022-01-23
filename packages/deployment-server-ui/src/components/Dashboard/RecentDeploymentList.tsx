import { List } from "antd"
import React, { useEffect, useState } from "react"
import { TransitionGroup } from "react-transition-group"
import "./RecentDeploymentList.css"

import { RecentDeployment } from "deployment-server"
import defineFunctionalComponent from "../../util/defineFunctionalComponent"
import { RecentDeploymentItem } from './RecentDeploymentItem'
import { useInterval } from 'react-use'

interface Props {
  //data: RecentDeployment[] | undefined,
  details?: boolean
}

export default defineFunctionalComponent(function RecentDeploymentList(props: Props) {
  // TODO: Remove
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
    <List itemLayout="horizontal" loading={!data}>
      <TransitionGroup>
        {data.map((item: RecentDeployment) => (
          <RecentDeploymentItem
            key={item.id}
            id={item.id}
            status={item.status}
            device={item.device}
            artifactUrl={item.artifactUrl}
            details={props.details}
            created={props.details ? item.createdAt : undefined}
            updated={props.details ? item.updatedAt : undefined}
          />
        ))}
      </TransitionGroup>
    </List>
  )
})
