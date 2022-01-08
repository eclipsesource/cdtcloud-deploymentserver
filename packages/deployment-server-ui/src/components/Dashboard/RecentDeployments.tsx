import { Button, Table, Tag } from "antd";
import { defineFunctionalComponent } from "../../util/defineFunctionalComponent";
import type { DeployStatus, RecentDeployment } from "deployment-server";
import { useState } from "react";
import { useInterval, useTimeoutFn } from "react-use";
import { Link } from "react-router-dom";

import "./RecentDeployments.css";
import { useEffect } from "react";

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

export default defineFunctionalComponent(function RecentDeployments() {
  const columns = [
    {
      title: "NAME",
      dataIndex: "id",
    },
    {
      title: "TYPE",
      dataIndex: "device.type.fqbn",
      render: (
        _: DeployStatus,
        {
          device: {
            type: { name },
          },
        }: RecentDeployment
      ) => <Tag>{name}</Tag>,
    },
    {
      title: "DEVICE",
      dataIndex: "device.id",
      render: (_: DeployStatus, { device: { id } }: RecentDeployment) => (
        <Link to={`/devices/${id}`}>
          <Button>Click</Button>
        </Link>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      render: (text: DeployStatus) => (
        <Tag color={status[text].color}>{status[text].text}</Tag>
      ),
    },
    {
      title: "LAST UPDATED AT",
      dataIndex: "updatedAt",
      render: (text: DeployStatus) => text,
    },
    {
      title: "ARTIFACT",
      dataIndex: "artifactUrl",
      render: (_text: DeployStatus, { artifactUrl }: RecentDeployment) => (
        <Button href={"" + artifactUrl}>Click</Button>
      ),
    },
  ];

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
    <Table pagination={false} columns={columns} rowKey="id" dataSource={data} />
  );
});
