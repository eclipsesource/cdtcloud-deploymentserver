import { Header } from "antd/lib/layout/layout";
import "./CdtCloudHeader.css";

export function CdtCloudHeader() {
  return (
    <Header className="header">
      <h2 style={{ color: "rgba(255, 255, 255, 0.65)", textAlign: "center" }}>
        Embedded Cloud Development - Admin Dashboard 
      </h2>
    </Header>
  );
}
