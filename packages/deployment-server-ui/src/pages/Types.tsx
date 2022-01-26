import type {
  DeployRequest,
  Device,
  DeviceTypeResource,
  DeviceTypeWithCount,
} from "deployment-server";

import { useState, useEffect } from "react";
import { Card, Divider, List, Skeleton } from "antd";
import {
  BookOutlined,
  FilterOutlined,
  InfoOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

import { defineFunctionalComponent } from "../util/defineFunctionalComponent";
import SkeletonButton from "antd/lib/skeleton/Button";

import { Row, Col } from "antd";
import { useInterval } from "react-use";
import { useParams } from "react-router-dom";
import typesData from "../resources/typesData.json";


const { Meta } = Card;

export default defineFunctionalComponent(function Types() {
  const [loading, setLoading] = useState<boolean>(true);
  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceType, setDeviceType] = useState<DeviceTypeResource>();
  const [deployments, setDeployments] = useState<DeployRequest[]>([]);
  const [refetchFlip, setRefetchFlip] = useState(false);

  const listData = typesData.data.entries.toString();

  const { id } = useParams();
  function findDeviceById(id: string) {
    return devices.find((device) => id === device.id);
  }

  useInterval(function () {
    setRefetchFlip(!refetchFlip);
  }, 1000);

  useEffect(() => {
    const fetchAsync = async () => {
      const typesRes = await fetch(`/api/device-types/${id}`);
      const types = await typesRes.json();
      setDeviceType(types);

      const devRes = await fetch(`/api/devices`);
      const devs = await devRes.json();
      setDevices(devs.filter((dev: Device) => dev.deviceTypeId === id));

      const deployRes = await fetch("/api/deployments");
      const deploys = await deployRes.json();
      setDeployments(
        deploys.filter(
          (deployment) =>
            deployment.deviceId === findDeviceById(deployment.deviceId)?.id
        )
      );
    };

    fetchAsync();
  }, []);

  useEffect(() => {
    if (
      devices != null &&
      deviceType != null &&
      deployments != null &&
      loading
    ) {
      setLoading(false);
      console.log(deviceType);
    }
  }, [devices, deviceType, deployments]);

  useEffect(() => {
    const fetchAsync = async () => {
      const typesRes = await fetch(`/api/device-types/${id}`);
      const types = await typesRes.json();
      setDeviceType(types);

      const deployRes = await fetch("/api/deployments");
      const deploys = await deployRes.json();
      setDeployments(
        deploys.filter(
          (deployment) =>
            deployment.deviceId === findDeviceById(deployment.deviceId)?.id
        )
      );
    };

    fetchAsync();
  }, [refetchFlip]);

  return (
    <>
      {/*    <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]} align="middle">
        <Col span={12}>
          <Card title="Graph 1" style={{ height: "100%" }}>
            <DeploymentsByTypeGraph data={deviceType?.history} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Graph B" style={{ height: "100%" }}>
            <DeploymentStatusPie data={deployments} />
          </Card>
        </Col>
      </Row> */}
      <Divider />
      <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]} align="middle">
        <Col span={24}>
          <Card>
            <List
            header={<h2>Supported Board Types</h2>}
              style={{
                overflow: "scroll",
                overflowX: "hidden",
                padding: "24px",
                maxHeight: "620px",
              }}
              grid={{ gutter: 32 }}
              dataSource={typesData.data}
              renderItem={(type, index) => {
                if (true) {
                  return (
                    <List.Item key={index}>
                      <Card
                        size="small"
                        hoverable
                        style={{ width: 240 }}
                        cover={
                          <img
                            alt={`${type.Name}`}
                            height={"100px"}
                            src={type.SVG}
                          />
                        }
                        actions={[
                          <a href={type.Link} target="_blank">
                            <InfoOutlined />
                          </a>,
                          <a href={type.Link} target="_blank">
                            <BookOutlined />
                          </a>,
                        ]}
                      >
                        <Meta
                          title={type.Name}
                          description={"Click to inspect"}
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
