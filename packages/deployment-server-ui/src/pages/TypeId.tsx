import { DeployRequest, Device, DeviceTypeResource } from "deployment-server";
import React, { useEffect, useState } from "react";
import defineFunctionalComponent from "../util/defineFunctionalComponent";
import { Card, Col, Row, Spin, Statistic } from "antd";
import { useInterval } from "react-use";
import { useParams } from "react-router-dom";
import { StatusTag } from "../components/StatusTag";
import DeploymentsByTypeGraph from "../components/Graphs/DeploymentsByTypeGraph";
import DeploymentsStatusGraph from "../components/Graphs/DeploymentsStatusGraph";

export default defineFunctionalComponent(function TypeId() {
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

  const pendingCards = deployments
    .filter(
      (deployment) =>
        deployment.status === "PENDING" && findDeviceById(deployment.deviceId)
    )
    .map((deployment: DeployRequest) => (
      <div key={deployment.id}>
        <Row gutter={[0, 16]}>
          <Card title={deployment.id} bordered={true} style={{ width: 320 }}>
            <p>
              <StatusTag status={deployment.status} addIcon />
            </p>
          </Card>
        </Row>
      </div>
    ));

  const otherCards = deployments
    .filter(
      (deployment) =>
        deployment.status !== "PENDING" && findDeviceById(deployment.deviceId)
    )
    .map((deployment: DeployRequest) => (
      <div key={deployment.id}>
        <Card title={deployment.id} bordered={true} style={{ width: 320 }}>
          <p>
            <StatusTag status={deployment.status} addIcon />
          </p>
        </Card>
      </div>
    ));

  return (
    <main>
      {loading ? (
        <Spin tip={"Loading..."} />
      ) : (
        <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 16 }, 20]}>
          <Col span={12}>
            <Card title={deviceType ? deviceType.name : ""}>
              <Statistic
                title="Number of devices"
                value={devices.length}
                prefix={""}
                valueStyle={{ color: "black" }}
              />
              <Statistic
                title="Total Deploys"
                value={""}
                prefix={""}
                valueStyle={{ color: "black" }}
              />
              <li>: {deviceType ? deviceType.fqbn : ""}</li>
              <li>{deviceType ? deviceType.fqbn : ""}</li>
            </Card>

            <Card title="Graph 1">
              <DeploymentsStatusGraph
                data={deviceType!.history
                }
              />
            </Card>
            <Card title="Graph 2">
              <DeploymentsByTypeGraph
                data={deviceType!.history
                }
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card
              title="Pending Deployments"
              style={{ height: "850px", overflow: "auto" }}
            >
              <Row>{pendingCards}</Row>
            </Card>
          </Col>
          <Col span={6}>
            <Card
              title="Finished Deployments"
              style={{ height: "850px", overflow: "auto" }}
            >
              <Row align="middle">{otherCards}</Row>
            </Card>
          </Col>
        </Row>
      )}
    </main>
  );
});
