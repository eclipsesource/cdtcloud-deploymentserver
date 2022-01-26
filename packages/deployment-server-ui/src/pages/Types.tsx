import type { DeviceTypeWithCount } from "deployment-server";

import { useState, useEffect } from "react";
import { Card, Divider, List, Skeleton } from "antd";
import { FilterOutlined, InfoOutlined } from "@ant-design/icons";

import { defineFunctionalComponent } from "../util/defineFunctionalComponent";
import SkeletonButton from "antd/lib/skeleton/Button";
import MegaTest from "../ressources/mega.svg";
import { AutoComplete, Row, Col } from "antd";
import DeploymentsByTypeGraph from "../components/Graphs/DeploymentsByTypeGraph";

const { Meta } = Card;

const isType = (
  type: DeviceTypeWithCount | {}
): type is DeviceTypeWithCount => {
  return typeof type === "object" && "id" in type;
};

export default defineFunctionalComponent(function Types() {
  const [types, setTypes] = useState<DeviceTypeWithCount[] | {}[]>(
    Array(15).fill({})
  );

  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    fetch("/api/deployments/")
      .then((res) => res.json())
      .then((res) => setGraphData(res.history));
  }, []);


  useEffect(() => {
    fetch("/api/device-types")
      .then((res) => res.json())
      .then(setTypes);
  }, []);

  return (
    <>
      <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]} align="middle">
        <Col span={12}>
          <Card title="Graph 1" style={{ height: "100%" }}>
            <DeploymentsByTypeGraph data={graphData} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Graph B" style={{ height: "100%" }}>
            <DeploymentsByTypeGraph data={graphData} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]} align="middle">
        <Divider />
        <Col span={24}>
          <Card>
            <List
              style={{
                overflow: "scroll",
                overflowX: "hidden",
                padding: "24px",
                maxHeight: "520px",
              }}
              grid={{ gutter: 32 }}
              dataSource={types}
              renderItem={(type, index) => {
                if (isType(type)) {
                  return (
                    <List.Item key={type.id}>
                      <Card
                        size="small"
                        hoverable
                        style={{ width: 240 }}
                        cover={
                          <img
                            alt={`${type.name} example image`}
                            height={"100%"}
                            src={MegaTest}
                          />
                        }
                        actions={[<FilterOutlined />, <InfoOutlined />]}
                      >
                        <Meta
                          title={type.name}
                          description={"FQBN:" + type.fqbn}
                          style={{ padding: "24px px" }}
                        />
                      </Card>
                    </List.Item>
                  );
                } else {
                  return (
                    <List.Item key={`placeholder-${index}`}>
                      <Card
                        hoverable
                        cover={
                          <Skeleton.Image
                            style={{ width: "300px", height: "220px" }}
                          />
                        }
                        actions={[<SkeletonButton />, <SkeletonButton />]}
                      >
                        <Skeleton
                          loading={true}
                          paragraph={{ rows: 1 }}
                        ></Skeleton>
                      </Card>
                    </List.Item>
                  );
                }
              }}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
});
