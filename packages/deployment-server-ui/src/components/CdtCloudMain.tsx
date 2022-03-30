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

import { Layout } from 'antd'
import { CdtCloudHeader } from './CdtCloudHeader'
import { CdtCloudSidebar } from './CdtCloudSidebar'
import type { FunctionComponent } from 'react'
import { useWebsocketFunction } from '../services/WebsocketService'
import React, { useEffect, useState } from 'react'
import { connectorEvent, deviceEvent } from './Notification'
import { fetchDashboardAsync } from '../reducers/DashboardReducer'
import { useAppDispatch } from '../app/hooks'

import './CdtCloudMain.css'
import { useInterval } from 'react-use'

const { Content } = Layout

export const CdtCloudMain: FunctionComponent<{}> = ({ children }) => {
  const [refreshFlip, setRefreshFlip] = useState<boolean>(false)
  const [ready, setReady] = useState<boolean>(false)
  const { open, subscribe, subs } = useWebsocketFunction('/api/dashboard/notifications', ready)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      subscribe(connectorEvent)
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      subscribe(deviceEvent)
    }
  }, [open, subs])

  useEffect(() => {
    dispatch(fetchDashboardAsync())
      .then(() => setReady(true))
      .catch(console.log)
  }, [dispatch, refreshFlip])

  useInterval(() => {
    setRefreshFlip(!refreshFlip)
  }, 3000)

  return (
    <Layout style={{ height: '100vh' }}>
      <CdtCloudHeader />
      <Layout hasSider={true}>
        <CdtCloudSidebar />
        <Layout style={{ padding: '24px 24px 24px' }}>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              maxHeight: '95vh'
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}
