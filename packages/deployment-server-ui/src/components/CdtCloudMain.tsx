import { Layout } from "antd";
import { CdtCloudHeader } from "./CdtCloudHeader";
import { CdtCloudSidebar } from "./CdtCloudSidebar";
import type { FunctionComponent } from "react";
import { useWebsocket } from '../services/WebsocketService'
import { useEffect } from 'react'
import { connectorEvent, deviceEvent } from './Notification'

const { Content } = Layout;

import "./CdtCloudMain.css";

export const CdtCloudMain: FunctionComponent<{}> = ({ children }) => {
  const { open, subscribe, subs } = useWebsocket('/api/dashboard/notifications')

  useEffect(() => {
    if (open) {
      subscribe(connectorEvent)
      subscribe(deviceEvent)
    }
  }, [open, subs])

  return (
    <Layout style={{ height: "100vh" }}>
      <CdtCloudHeader />
      <Layout hasSider={true}>
        <CdtCloudSidebar />
        <Layout style={{ padding: "24px 24px 24px" }}>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
