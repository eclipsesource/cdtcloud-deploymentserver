import { DeployRequest, DeployStatus, DeviceType } from "deployment-server";
import { useEffect, useState } from "react";
import defineFunctionalComponent from "../util/defineFunctionalComponent";
import { Card, Col, Row, Tag } from "antd";
import axios from "axios";
import { Device } from ".prisma/client";
import { useInterval } from "react-use";

export default defineFunctionalComponent(function TypeId() {
  let [devices, setDevices] = useState<Device[]>([]);
  let [deviceType, setDeviceType] = useState<DeviceType | null>(null);
  let [deployments, setDeployments] = useState<DeployRequest[]>([
    {
      id: "1234",
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date(),
      artifactUrl: null,
      deviceId: "e6cdc2b2-0558-415d-90c5-3301d016eeae",
    },
    {
      id: "12345",
      status: "SUCCESS",
      createdAt: new Date(),
      updatedAt: new Date(),
      artifactUrl: null,
      deviceId: "e6cdc2b2-0558-415d-90c5-3301d016eeae",
    },
    {
      id: "123",
      status: "RUNNING",
      createdAt: new Date(),
      updatedAt: new Date(),
      artifactUrl: null,
      deviceId: "e6cdc2b2-0558-415d-90c5-3301d016eeae",
    },
    {
      id: "12",
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date(),
      artifactUrl: null,
      deviceId: "e6cdc2b2-0558-415d-90c5-3301d016eeae",
    },
    {
      id: "123456",
      status: "FAILED",
      createdAt: new Date(),
      updatedAt: new Date(),
      artifactUrl: null,
      deviceId: "e6cdc2b2-0558-415d-90c5-3301d016eeae",
    },
  ]);
  let [refetchFlip, setRefetchFlip] = useState(false);

  useInterval(function () {
    setRefetchFlip(!refetchFlip);
  }, 5000);

  const url = window.location.href;
  const strs = url.split("/");
  const deviceTypeId = strs.at(-1);

  const status: Record<DeployStatus, { color: string; text: string }> = {
    SUCCESS: {
      color: "green",
      text: "SUCCESS",
    },
    TERMINATED: {
      color: "yellow",
      text: "TERMINATED",
    },
    FAILED: {
      color: "red",
      text: "ERROR",
    },
    PENDING: {
      color: "blue",
      text: "PENDING",
    },
    RUNNING: {
      color: "grey",
      text: "RUNNING",
    },
  };

  useEffect(() => {
    fetch(`/api/device-types/${deviceTypeId}`).then(async (res) => {
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
          res.filter((device) => device.deviceTypeId === deviceTypeId)
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
  console.log(devices)
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
            <Tag color={status[deployment.status].color}>
              {" "}
              {status[deployment.status].text}{" "}
            </Tag>
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
              <Tag color={status[deployment.status].color}>
                {" "}
                {status[deployment.status].text}{" "}
              </Tag>
            </p>
          </Card>
        </Row>
      </div>
    ));

  //const deviceType = deviceTypes.find((type) => type.id === device?.deviceTypeId)

  return (
    <main>
      <Row justify="space-between">
        <Col>
          <h2>{deviceType ? deviceType.name : ""}</h2>
          <li>Number of connected devices: {devices.length}</li>
          <li>FQBN: {deviceType ? deviceType.fqbn : ""}</li>
          <Row>{pendingCards}</Row>
        </Col>
        <Col>{otherCards}</Col>
      </Row>
    </main>
  );
});
