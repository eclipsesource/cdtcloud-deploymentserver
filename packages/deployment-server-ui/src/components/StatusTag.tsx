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
import React, { ReactElement } from 'react'

interface Props {
  status: DeployStatus | DeviceStatus
  addIcon?: boolean
}

export const StatusTag = (props: Props): ReactElement => {
  const formatStatus: Record<DeployStatus | DeviceStatus, { icon: JSX.Element }> = {
    SUCCESS: {
      icon: <CheckCircleOutlined/>
    },
    TERMINATED: {
      icon: <ExclamationCircleOutlined/>
    },
    FAILED: {
      icon: <CloseCircleOutlined/>
    },
    PENDING: {
      icon: <ClockCircleOutlined/>
    },
    RUNNING: {
      icon: <SyncOutlined spin/>
    },
    AVAILABLE: {
      icon: <CheckCircleOutlined/>
    },
    UNAVAILABLE: {
      icon: <CloseCircleOutlined/>
    },
    DEPLOYING: {
      icon: <PlayCircleOutlined/>
    },
    MONITORING: {
      icon: <DesktopOutlined/>
    }
  }

  return (
    <Tag
      className={classnames(styles.label, styles[props.status.toLowerCase()])}
      icon={props.addIcon !== undefined ? formatStatus[props.status].icon : undefined}
    >
      {props.status}
    </Tag>
  )
}
