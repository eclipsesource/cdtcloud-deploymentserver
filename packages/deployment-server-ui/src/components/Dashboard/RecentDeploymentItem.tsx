import { Button, Col, List, Row, Tooltip, Typography } from 'antd'
import { CSSTransition } from 'react-transition-group'
import { DeployStatus, DeviceType, Device } from 'deployment-server'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import { StatusTag } from '../StatusTag'
import MonitoringTerminal from '../MonitoringTerminal'

import colors from '../../Colors.module.scss'
import { dateFormatter } from '../../util/dateFormatter'

const { Item } = List
const { Meta } = Item

interface Props {
  id: string
  status: DeployStatus
  device: Device & {
    type: DeviceType
  }
  artifactUrl: string | null
  details?: boolean
  created?: Date
  updated?: Date
}

const createDownloadUrl = async (url: string): Promise<string> => {
  const response = await fetch(url, { method: 'GET' })
  const content = await response.blob()
  return URL.createObjectURL(new Blob([content]))
}

export const RecentDeploymentItem = (props: Props): JSX.Element => {
  const [showId, setShowId] = useState<boolean>(false)
  const [artifactUrl, setArtifactUrl] = useState<string>()
  const [fileName, setFileName] = useState<string>()
  const [artifactUnavailable, setArtifactUnavailable] = useState<boolean>(false)
  const [monitorOpen, setMonitorOpen] = useState<boolean>(false)

  useEffect(() => {
    if (props.artifactUrl != null) {
      createDownloadUrl(props.artifactUrl)
        .then(setArtifactUrl)
        .catch((e) => {
          console.log(e)
          setArtifactUnavailable(true)
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
    <CSSTransition key={props.id} timeout={750} classNames='deployment'>
      <Item
        actions={[
          <Button
            key='monitor'
            type='primary'
            icon={<FontAwesomeIcon icon='terminal' style={{ marginRight: '0.5em' }} />}
            disabled={props.status !== 'RUNNING'}
            onClick={() => setMonitorOpen(true)}
          >
            Monitor
          </Button>,
          <Button
            key='view'
            type='primary'
            href={`/device/${props.device.id}`}
            icon={<FontAwesomeIcon icon='microchip' style={{ marginRight: '0.5em' }} />}
          >
            View Device
          </Button>,
          <Tooltip title={artifactUnavailable ? 'Artifact unavailable for download' : ''} key='download'>
            <Button
              type='primary'
              disabled={artifactUnavailable}
              icon={<FontAwesomeIcon icon='download' style={{ marginRight: '0.5em' }} />}
              href={artifactUrl}
              download={fileName}
            >
              Artifact
            </Button>
          </Tooltip>
        ]}
      >
        <MonitoringTerminal deploymentId={props.id} deployStatus={props.status} open={monitorOpen} deviceName={props.device.type.name} />
        <Meta
          style={{ flex: 'auto' }}
          avatar={
            <StatusTag status={props.status} addIcon />
          }
          title={
            <>
              <Link to={`/device/${props.device.id}`}>
                {props.device.type.name}
              </Link>
              <Tooltip title={`Device: ${props.device.id}`}>
                <FontAwesomeIcon
                  icon='info-circle'
                  color={colors.info}
                  style={{ marginLeft: '0.5em' }}
                />
              </Tooltip>
            </>
          }
          description={
            showId
              ? (
                <Typography.Text style={{ color: 'rgba(0, 0, 0, 0.3)' }}>
                  {props.id}
                </Typography.Text>
                )
              : (
                <Typography.Link onClick={() => setShowId(true)}>
                  Show Deployment Id
                </Typography.Link>
                )
          }
        />
        {props.details != null && (props.created != null) && (props.updated != null)
          ? (
            <Row style={{ textAlign: 'center', justifyContent: 'center', flex: 'auto' }}>
              <Col span={8}>
                <div>
                  Created
                  <br />
                  {dateFormatter(Date.parse(props.created.toString()))}
                </div>
              </Col>
              <Col span={8}>
                <div>
                  Last Update
                  <br />
                  {dateFormatter(Date.parse(props.updated.toString()))}
                </div>
              </Col>
            </Row>
            )
          : undefined}
      </Item>
    </CSSTransition>
  )
}
