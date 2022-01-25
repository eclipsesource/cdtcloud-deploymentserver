import { DeployStatus } from "deployment-server";
import { Tag } from "antd";

export function StatusTag(status: DeployStatus) {
  const formatStatus: Record<DeployStatus, { color: string; text: string }> = {
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
    <Tag color={formatStatus[status].color}>
      {formatStatus[status].text}
    </Tag>
  );
}
