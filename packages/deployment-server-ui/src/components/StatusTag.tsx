import { DeployRequest, DeployStatus } from "deployment-server";
import { Tag } from "antd";

export function StatusTag(deployment: DeployRequest) {
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
  
  return (
    <Tag color={status[deployment.status].color}>
      {status[deployment.status].text}
    </Tag>
  );
}
