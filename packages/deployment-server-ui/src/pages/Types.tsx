import type { DeviceType } from "deployment-server";
import { useState, useEffect } from "react";
import { Card, List, Row, Col } from "antd";
import { BookOutlined, ZoomInOutlined } from "@ant-design/icons";
import { defineFunctionalComponent } from "../util/defineFunctionalComponent";
import { Link } from "react-router-dom";

const { Meta } = Card;

export default defineFunctionalComponent(function Types() {
  const [deviceType, setDeviceType] = useState<DeviceType[]>();

  useEffect(() => {
    const fetchAsync = async () => {
      const typesRes = await fetch(`/api/device-types/`);
      const types = await typesRes.json();
      setDeviceType(types);
    };
    fetchAsync();
  }, []);

  return (
    <>
      <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]} align="middle">
        <Col span={24}>
          <List
            header={<h2>Supported Device Types</h2>}
            style={{
              overflow: "scroll",
              overflowX: "hidden",
              padding: "24px",
              maxHeight: "750px",
            }}
            grid={{ gutter: 32 }}
            dataSource={deviceType}
            renderItem={(deviceData, index) => {
              return (
                <List.Item key={index}>
                  <Card
                    hoverable
                    style={{ width: 220 }}
                    cover={
                      <img
                        alt={`${deviceData.name}`}
                        height={"100px"}
                        src={deviceData.image}
                      />
                    }
                    actions={[
                      <Link to={"/types/" + deviceData.id}>
                        <ZoomInOutlined /> Inspect
                      </Link>,
                      <a href={deviceData.store} target="_blank">
                        <BookOutlined /> Docs
                      </a>,
                    ]}
                  >
                    <Meta
                      title={deviceData.name}
                      description={"FQBN:" + deviceData.fqbn}
                      style={{ padding: "24px" }}
                    />
                  </Card>
                </List.Item>
              );
            }}
          />
        </Col>
      </Row>
    </>
  );
});
