import { Button, List, Tag, Tooltip, Typography } from 'antd'
import { CSSTransition } from 'react-transition-group'
import { DeployStatus, DeviceType } from 'deployment-server'
import { useState } from 'react'
import { Device } from '@prisma/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'

const { Item } = List;
const { Meta } = Item;

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

interface Props {
  id: string,
  status: DeployStatus,
  device: Device & {
    type: DeviceType
  },
}

export const RecentDeploymentItem = (props: Props) => {
  const [showId, setShowId] = useState<boolean>(false)

  return (
    <CSSTransition key={props.id} timeout={750} classNames="deployment">
    <Item
      actions={[
        <Button type="primary">View Deployment</Button>,
        <Button type="primary">View Device</Button>,
        <Button type="primary">Artifact</Button>,
      ]}
    >
      <Meta
        avatar={
          <Tag color={formatStatus[props.status].color}>
            {formatStatus[props.status].text}
          </Tag>
        }
        title={
          <>
            <Link to={"https://ant.design"}>{props.device.type.name}</Link>
            <Tooltip title={`Device: ${props.device.id}`}>{<FontAwesomeIcon icon={'info-circle'} color={'#40a9ff'} style={{marginLeft: '0.5em'}}/>}</Tooltip>
          </>
        }
        description={
          showId ? <Typography.Text style={{color: 'rgba(0, 0, 0, 0.3)'}}>{props.id}</Typography.Text> : <Typography.Link onClick={() => setShowId(true)}>Show Deployment Id</Typography.Link>
      }
      />
    </Item>
  </CSSTransition>)
}
