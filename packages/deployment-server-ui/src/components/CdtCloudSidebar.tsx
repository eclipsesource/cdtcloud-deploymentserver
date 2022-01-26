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

export function CdtCloudSidebar (): JSX.Element {
  const [current, setCurrent] = useState(location.pathname)

  useEffect(() => {
    if (current !== location.pathname) {
      setCurrent(location.pathname)
    }
  }, [location, current])

  const handleClick = (e: any): void => {
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
