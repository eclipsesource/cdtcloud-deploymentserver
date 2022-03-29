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

import { Menu } from 'antd'
import Sider from 'antd/lib/layout/Sider'
import {
  DashboardOutlined,
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { ReactElement, useEffect, useState } from 'react'

export function CdtCloudSidebar (): ReactElement {
  const [current, setCurrent] = useState(location.pathname)

  useEffect(() => {
    if (location) {
      if (current !== location.pathname) {
        setCurrent(location.pathname)
      }
    }
  }, [location, current])
  function handleClick (e: any): void {
    setCurrent(e.key)
  }
  return (
    <Sider width={200} className="site-layout-background">
      <Menu
        onClick={handleClick}
        theme="dark"
        selectedKeys={[current]}
        mode="inline"
        style={{ height: '100%', borderRight: 0 }}
      >
        <Menu.Item key="/" icon={<DashboardOutlined />}>
          <Link to={'/'}>Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="/deployments" icon={<PieChartOutlined />}>
          <Link to={'/deployments'}>Deployments</Link>
        </Menu.Item>
        <Menu.Item key="/devices" icon={<DesktopOutlined />}>
          <Link to={'/devices'}>Connected Devices</Link>
        </Menu.Item>
        <Menu.Item key="/types" icon={<FileOutlined />}>
          <Link to={'/types'}>Devices Types</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  )
}
