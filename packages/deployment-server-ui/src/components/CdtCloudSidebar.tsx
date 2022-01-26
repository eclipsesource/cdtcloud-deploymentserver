import { Menu } from 'antd'
import Sider from 'antd/lib/layout/Sider'
import {
  DashboardOutlined,
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export function CdtCloudSidebar () {
  const [current, setCurrent] = useState(location.pathname)

  useEffect(() => {
    if (location) {
      if (current !== location.pathname) {
        setCurrent(location.pathname)
      }
    }
  }, [location, current])
  function handleClick (e: any) {
    setCurrent(e.key)
  }
  return (
    <Sider width={200} className='site-layout-background'>
      <Menu
        onClick={handleClick}
        theme='dark'
        selectedKeys={[current]}
        mode='inline'
        style={{ height: '100%', borderRight: 0 }}
      >
        <Menu.Item key='/' icon={<DashboardOutlined />}>
          <Link to='/'>Dashboard</Link>
        </Menu.Item>
        <Menu.Item key='/deployments' icon={<PieChartOutlined />}>
          <Link to='/deployments'>Deployments</Link>
        </Menu.Item>
        <Menu.Item key='/devices' icon={<DesktopOutlined />}>
          <Link to='/devices'>Connected Boards</Link>
        </Menu.Item>
        <Menu.Item key='/types' icon={<FileOutlined />}>
          <Link to='/types'>Board Types</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  )
}
