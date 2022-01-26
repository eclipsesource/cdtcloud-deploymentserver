import { Layout } from 'antd'
import { CdtCloudHeader } from './CdtCloudHeader'
import { CdtCloudSidebar } from './CdtCloudSidebar'
import type { FunctionComponent } from 'react'
import { useWebsocket } from '../services/WebsocketService'
import { useEffect, useState } from 'react'
import { connectorEvent, deviceEvent } from './Notification'
import { fetchDashboardAsync } from '../reducers/DashboardReducer'
import { useAppDispatch } from '../app/hooks'

import './CdtCloudMain.css'
import { useInterval } from 'react-use'

const { Content } = Layout

export const CdtCloudMain: FunctionComponent<{}> = ({ children }) => {
  const [refreshFlip, setRefreshFlip] = useState<boolean>(false)
  const [ready, setReady] = useState<boolean>(false)
  const { open, subscribe, subs } = useWebsocket('/api/dashboard/notifications', ready)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (open) {
      subscribe(connectorEvent)
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
      <Layout hasSider>
        <CdtCloudSidebar />
        <Layout style={{ padding: '24px 24px 24px' }}>
          <Content
            className='site-layout-background'
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}
