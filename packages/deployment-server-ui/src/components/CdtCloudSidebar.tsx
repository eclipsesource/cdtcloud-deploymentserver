import { Menu } from "antd";
import Sider from "antd/lib/layout/Sider";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./CdtCloudSidebar.css";

export function CdtCloudSidebar() {
  return (
    <Sider width={200} className="site-layout-background">
      <Menu
        theme="dark"
        defaultSelectedKeys={["1"]}
        mode="inline"
        style={{ height: "100%", borderRight: 0 }}
      >
        <Menu.Item key="1" icon={<PieChartOutlined />}>
          <Link to={"/"}>Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<PieChartOutlined />}>
          <Link to={"/deployments"}>Deployments</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<DesktopOutlined />}>
          <Link to={"/devices"}>Devices</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<FileOutlined />}>
          <Link to={"/types"}>Types</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
}
