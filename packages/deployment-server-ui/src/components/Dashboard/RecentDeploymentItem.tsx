import { Button, Col, List, message, Row, Tag, Tooltip, Typography } from 'antd'
import { CSSTransition } from 'react-transition-group'
import { DeployStatus, DeviceType } from 'deployment-server'
import React, { useEffect, useState } from 'react'
import { Device } from '@prisma/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import colors from '../../Colors.module.scss'
import classnames from 'classnames'
import styles from './RecentDeploymentItem.module.scss'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  SyncOutlined
} from '@ant-design/icons'
import { format } from 'date-fns'

const {Item} = List
const {Meta} = Item

const formatStatus: Record<DeployStatus, { color: string; text: string, icon: JSX.Element }> = {
  SUCCESS: {
    color: 'success',
    text: "SUCCESS",
    icon: <CheckCircleOutlined/>
  },
  TERMINATED: {
    color: "warning",
    text: "TERMINATED",
    icon: <ExclamationCircleOutlined/>
  },
  FAILED: {
    color: "red",
    text: "FAILED",
    icon: <CloseCircleOutlined/>
  },
  PENDING: {
    color: "processing",
    text: "PENDING",
    icon: <ClockCircleOutlined/>
  },
  RUNNING: {
    color: "grey",
    text: "RUNNING",
    icon: <SyncOutlined spin/>
  }
}

interface Props {
  id: string,
  status: DeployStatus,
  device: Device & {
    type: DeviceType
  },
  artifactUrl: string | null,
  details?: boolean,
  created?: Date,
  updated?: Date
}

const createDownloadUrl = async (url: string) => {
  const response = await fetch(url, {method: 'GET'})
  const content = await response.blob()
  return URL.createObjectURL(new Blob([content]))
}

const dateFormatter = (timestamp: number) => format(new Date(timestamp), 'LLL-dd - hh:mm:ss')

export const RecentDeploymentItem = (props: Props) => {
  const [showId, setShowId] = useState<boolean>(false)
  const [artifactUrl, setArtifactUrl] = useState<string>()
  const [fileName, setFileName] = useState<string>()
  const [artifactUnavailable, setArtifactUnavailable] = useState<boolean>(false)

  useEffect(() => {
    if (props.artifactUrl != null) {
      createDownloadUrl(props.artifactUrl)
        .then(setArtifactUrl)
        .catch((e) => {
          console.log(e)
          message.error('Download failed. Please try again.', 5)
        })
      setFileName(props.artifactUrl.split('/').pop())
    } else {
      setArtifactUnavailable(true)
    }

    return () => {
      if (artifactUrl != null) {
        URL.revokeObjectURL(artifactUrl)
      }
    }
  }, [])

  return (
    <CSSTransition timeout={750} classNames={"deployment"}>
      <Item
        actions={[
          <Button
            type="primary"
            href={`/deployment/${props.id}`}
          >
            View Deployment
          </Button>,
          <Button
            type="primary"
            href={`/device/${props.device.id}`}
          >
            View Device
          </Button>,
          <Tooltip title={artifactUnavailable ? "Artifact unavailable for download" : ""}>
            <Button
              type={"primary"}
              disabled={artifactUnavailable}
              icon={<DownloadOutlined/>}
              href={artifactUrl}
              download={fileName}
            >
              Artifact
            </Button>
          </Tooltip>
        ]}
      >
        <Meta
          style={{flex: "auto"}}
          avatar={
            <Tag
              className={classnames(styles.label, styles[props.status.toLowerCase()])}
               icon={formatStatus[props.status].icon}
            >
              {props.status}
            </Tag>
          }
          title={
            <>
              <Link to={`/device/${props.device.id}`}>
                {props.device.type.name}
              </Link>
              <Tooltip title={`Device: ${props.device.id}`}>
                <FontAwesomeIcon
                  icon={'info-circle'}
                  color={colors.info}
                  style={{marginLeft: '0.5em'}}
                />
              </Tooltip>
            </>
          }
          description={
            showId ?
              <Typography.Text style={{color: 'rgba(0, 0, 0, 0.3)'}}>
                {props.id}
              </Typography.Text>
              :
              <Typography.Link onClick={() => setShowId(true)}>
                Show Deployment Id
              </Typography.Link>
          }
        />
        {props.details && props.created && props.updated ?
          <Row style={{textAlign: 'center', justifyContent: 'center', flex: "auto"}}>
            <Col span={8}>
              <div>
                Created
                <br/>
                {dateFormatter(Date.parse(props.created.toString()))}
              </div>
            </Col>
            <Col span={8}>
              <div>
                Last Update
                <br/>
                {dateFormatter(Date.parse(props.updated.toString()))}
              </div>
            </Col>
          </Row>
          :
          undefined
        }
      </Item>
    </CSSTransition>)
}
