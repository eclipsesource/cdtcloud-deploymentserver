import { DeployStatus, Device, DeviceType } from "deployment-server";
import { Tag } from "antd";

interface Props {
  id: string,
  status: DeployStatus,
  device?: Device & {
    type: DeviceType
  },
}

export const StatusTag = (props: Props) => {
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
    <Tag color={formatStatus[props.status].color}>
      {formatStatus[props.status].text}
    </Tag>
  );
}
