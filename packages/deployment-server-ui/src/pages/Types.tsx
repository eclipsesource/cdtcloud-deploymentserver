import type {
  DeployRequest,
  Device,
  DeviceTypeResource,
} from "deployment-server";

import { useState, useEffect } from "react";
import { Card, List, Skeleton } from "antd";
import { BookOutlined, ZoomInOutlined } from "@ant-design/icons";

import { defineFunctionalComponent } from "../util/defineFunctionalComponent";
import SkeletonButton from "antd/lib/skeleton/Button";

import { Row, Col } from "antd";
import { useInterval } from "react-use";
import { Link, useParams } from "react-router-dom";
import typesData from "../resources/typesDataReduced.json";

const { Meta } = Card;

export default defineFunctionalComponent(function Types() {
  const [loading, setLoading] = useState<boolean>(true);
  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceType, setDeviceType] = useState<DeviceTypeResource>();
  const [deployments, setDeployments] = useState<DeployRequest[]>([]);
  const [refetchFlip, setRefetchFlip] = useState(false);

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
          // @ts-ignore: ignore type warning
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
          // @ts-ignore: Unreachable code error
          (deployment) =>
            deployment.deviceId === findDeviceById(deployment.deviceId)?.id
        )
      );
    };

    fetchAsync();
  }, [refetchFlip]);

  return (
    <>
      <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]} align="middle">
        <Col span={24}>
          <List
            header={<h2>Supported Board Types</h2>}
            style={{
              overflow: "scroll",
              overflowX: "hidden",
              padding: "24px",
              maxHeight: "750px",
            }}
            grid={{ gutter: 32 }}
            dataSource={typesData.data}
            renderItem={(type, index) => {
              return (
                <List.Item key={index}>
                  <Card
                    hoverable
                    style={{ width: 220 }}
                    cover={
                      <img
                        alt={`${type.Name}`}
                        height={"100px"}
                        src={type.SVG}
                      />
                    }
                    actions={[
                      <Link to={"/types/" + type.ID}>
                        <ZoomInOutlined /> Inspect
                      </Link>,
                      <a href={type.Link} target="_blank">
                        <BookOutlined /> Docs
                      </a>,
                    ]}
                  >
                    <Meta
                      title={type.Name}
                      description={"FQBN:" + type.FQBN}
                      style={{ padding: "24px px" }}
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
