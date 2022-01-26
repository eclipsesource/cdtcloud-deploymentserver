import { DeployStatus, DeviceStatus } from 'deployment-server'
import { Tag } from 'antd'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DesktopOutlined,
  ExclamationCircleOutlined,
  PlayCircleOutlined,
  SyncOutlined
} from '@ant-design/icons'
import classnames from 'classnames'

import styles from './StatusTag.module.scss'

interface Props {
  status: DeployStatus | DeviceStatus
  addIcon?: boolean
}

export const StatusTag = (props: Props): JSX.Element => {
  const formatStatus: Record<DeployStatus | DeviceStatus, { icon: JSX.Element }> = {
    SUCCESS: {
      icon: <CheckCircleOutlined />
    },
    TERMINATED: {
      icon: <ExclamationCircleOutlined />
    },
    FAILED: {
      icon: <CloseCircleOutlined />
    },
    PENDING: {
      icon: <ClockCircleOutlined />
    },
    RUNNING: {
      icon: <SyncOutlined spin />
    },
    AVAILABLE: {
      icon: <CheckCircleOutlined />
    },
    UNAVAILABLE: {
      icon: <CloseCircleOutlined />
    },
    DEPLOYING: {
      icon: <PlayCircleOutlined />
    },
    MONITORING: {
      icon: <DesktopOutlined />
    }
  }

  return (
    <Tag
      className={classnames(styles.label, styles[props.status.toLowerCase()])}
      icon={props.addIcon === true ? formatStatus[props.status].icon : undefined}
    >
      {props.status}
    </Tag>
  )
}
