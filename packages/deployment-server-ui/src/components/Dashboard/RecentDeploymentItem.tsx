/********************************************************************************
    Copyright (c) 2022 EclipseSource and others.

    This program and the accompanying materials are made available under the
    terms of the Eclipse Public License v. 2.0 which is available at
    http://www.eclipse.org/legal/epl-2.0.

    This Source Code may also be made available under the following Secondary
    Licenses when the conditions for such availability set forth in the Eclipse
    Public License v. 2.0 are satisfied: GNU General Public License, version 2
    with the GNU Classpath Exception which is available at
    https://www.gnu.org/software/classpath/license.html.

    SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
********************************************************************************/
import { Button, Col, List, Modal, Row, Tooltip, Typography } from 'antd'
import { CSSTransition } from 'react-transition-group'
import { DeployStatus, DeviceType, Device } from 'deployment-server'
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import { StatusTag } from '../StatusTag'
import { format } from 'date-fns'
import MonitoringTerminal from '../MonitoringTerminal'

import colors from '../../Colors.module.scss'
import styles from './RecentDeploymentItem.module.scss'

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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const createDownloadUrl = async (url: string) => {
  const response = await fetch(url, { method: 'GET' })
  const content = await response.blob()
  return URL.createObjectURL(new Blob([content]))
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const dateFormatter = (timestamp: number) => format(new Date(timestamp), 'LLL-dd - hh:mm:ss')

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const RecentDeploymentItem = (props: Props) => {
  const [showId, setShowId] = useState<boolean>(false)
  const [artifactUrl, setArtifactUrl] = useState<string>()
  const [fileName, setFileName] = useState<string>()
  const [artifactUnavailable, setArtifactUnavailable] = useState<boolean>(false)
  const [monitorOpen, setMonitorOpen] = useState<boolean>(false)

  useEffect(() => {
    if (props.artifactUrl != null) {
      createDownloadUrl(props.artifactUrl)
        .then(setArtifactUrl)
        .catch(() => setArtifactUnavailable(true))
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
    <CSSTransition key={props.id} timeout={750} classNames={'deployment'}>
      <Item
        actions={[
          <Button
            type={'primary'}
            icon={<FontAwesomeIcon icon={'terminal'} style={{ marginRight: '0.5em' }}/>}
            disabled={props.status !== 'RUNNING'}
            onClick={() => setMonitorOpen(true)}
          >
            Monitor
          </Button>,
          <Button
            type="primary"
            href={`/types/${props.device.deviceTypeId}`}
            icon={<FontAwesomeIcon icon={'microchip'} style={{ marginRight: '0.5em' }}/>}
          >
            Inspect Device
          </Button>,
          <Tooltip title={artifactUnavailable ? 'Artifact unavailable for download' : ''}>
            <Button
              type={'primary'}
              disabled={artifactUnavailable}
              icon={<FontAwesomeIcon icon={'download'} style={{ marginRight: '0.5em' }}/>}
              href={artifactUrl}
              download={fileName}
            >
              Artifact
            </Button>
          </Tooltip>
        ]}
      >
        <Modal
          title={`${props.device.type.name} Monitor`}
          centered
          visible={monitorOpen}
          className={styles.modal}
          width={'70%'}
          footer={
            <Button key={'close'} type={'primary'} onClick={() => setMonitorOpen(false)}>
              Close
            </Button>
          }
          onCancel={() => setMonitorOpen(false)}
        >
          <MonitoringTerminal deploymentId={props.id} deployStatus={props.status} deviceName={props.device.type.name}/>
        </Modal>
        <Meta
          style={{ flex: 'auto' }}
          avatar={
            <StatusTag status={props.status} addIcon/>
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
                  style={{ marginLeft: '0.5em' }}
                />
              </Tooltip>
            </>
          }
          description={
            showId
              ? <Typography.Text style={{ color: 'rgba(0, 0, 0, 0.3)' }}>
                {props.id}
              </Typography.Text>
              : <Typography.Link onClick={() => setShowId(true)}>
                Show Deployment Id
              </Typography.Link>
          }
        />
        {(props.details ?? false) && (props.created != null) && (props.updated != null)
          ? <Row style={{ textAlign: 'center', justifyContent: 'center', flex: 'auto' }}>
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
          : undefined
        }
      </Item>
    </CSSTransition>)
}
