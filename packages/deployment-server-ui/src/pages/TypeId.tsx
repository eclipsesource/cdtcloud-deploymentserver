import { DeployRequest, DeviceType } from "deployment-server";
import { useEffect, useState } from "react";
import defineFunctionalComponent from "../util/defineFunctionalComponent";
import { Card, Col, Row } from "antd";
import { useInterval } from "react-use";
import { Device } from "@prisma/client";
import { useParams } from "react-router-dom";
import { StatusTag } from "../components/StatusTag";

export default defineFunctionalComponent(function TypeId() {
  let [devices, setDevices] = useState<Device[]>([]);
  let [deviceType, setDeviceType] = useState<DeviceType | null>(null);
  let [deployments, setDeployments] = useState<DeployRequest[]>([]);
  let [refetchFlip, setRefetchFlip] = useState(false);

  const { id } = useParams()

  useInterval(function () {
    setRefetchFlip(!refetchFlip);
  }, 5000);

  useEffect(() => {
    fetch(`/api/device-types/${id}`).then(async (res) => {
      setDeviceType(await res.json());
    });
  }, []);

  useEffect(() => {
    fetch(`/api/devices`)
      .then(async (res) => {
        const devices: Device[] = await res.json();
        return devices;
      })
      .then((res) => {
        setDevices(
          res.filter((device) => device.deviceTypeId === id)
        );
      });
  }, []);

  useEffect(() => {
    fetch(`/api/deployments`).then(async (res) => {
      const deployments: DeployRequest[] = await res.json()
      return deployments
    })
    .then(res => {
      setDeployments(
        res.filter(deployment => ((deployment.deviceId) === devices.find(device => (deployment.deviceId === device.id))?.id))
      )
    });
  }, [refetchFlip]);
  
  const pendingCards = deployments
    .filter(
      (deployment) =>
        deployment.status === "PENDING" &&
        devices.find((device) => deployment.deviceId === device.id)
    )
    .map((deployment: DeployRequest) => (
      <div key={deployment.id}>
        <Card title={deployment.id} bordered={true} style={{ width: 200 }}>
          <p>
            <StatusTag {...deployment}/>
          </p>
        </Card>
      </div>
    ));

  const otherCards = deployments
    .filter(
      (deployment) =>
        deployment.status !== "PENDING" &&
        devices.find((device) => deployment.deviceId === device.id)
    )
    .map((deployment: DeployRequest) => (
      <div key={deployment.id}>
        <Row gutter={[0, 16]}>
          <Card title={deployment.id} bordered={true} style={{ width: 200 }}>
            <p>
              <StatusTag {...deployment} />
            </p>
          </Card>
        </Row>
      </div>
    ));

  return (
    <main>
      <Row justify="space-between">
        <Col>
          <h2>{deviceType ? deviceType.name : ""}</h2>
          <li>Number of connected devices: {devices.length}</li>
          <li>FQBN: {deviceType ? deviceType.fqbn : ""}</li>
          <li>{deviceType ? deviceType.fqbn : ""}</li>
          <Row>{pendingCards}</Row>
        </Col>
        <Col>{otherCards}</Col>
      </Row>
    </main>
  );
});
