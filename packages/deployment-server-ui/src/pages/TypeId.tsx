import { DeployRequest, Device, DeviceTypeResource } from "deployment-server";
import React, { useEffect, useState } from "react";
import defineFunctionalComponent from "../util/defineFunctionalComponent";
import { Card, Col, Divider, Row, Spin, Statistic } from "antd";
import { useInterval } from "react-use";
import { useParams } from "react-router-dom";
import { StatusTag } from "../components/StatusTag";
import DeploymentsByTypeGraph from "../components/Graphs/DeploymentsByTypeGraph";
import DeploymentsStatusGraph from "../components/Graphs/DeploymentsStatusGraph";
import IssueCountGraph from "../components/Graphs/IssueCountGraph";

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
          // @ts-ignore: Unreachable code error
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
        <div>
          <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 16 }, 20]} align="middle">
            <Col span={12}>
              <Card title={deviceType ? deviceType.name : ""} style={{ height: "400px", overflow: "auto" }}>
                <Row>
                  <Col span={8}>
                    <Statistic
                      title="Number of devices"
                      value={devices.length}
                      prefix={""}
                      valueStyle={{ color: "black" }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Current Queue Length"
                      value={deviceType ? deviceType.queueLength : "0"}
                      prefix={""}
                      valueStyle={{ color: "black" }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="FQBN"
                      value={deviceType ? deviceType.fqbn : "0"}
                      prefix={""}
                      valueStyle={{ color: "black" }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <Statistic
                      title="Status"
                      value={deviceType ? deviceType.status : ""}
                      prefix={""}
                      valueStyle={{ color: "black" }}
                    />
                  </Col>
                  <Col span={16}>
                    <Statistic
                      title="Device Type ID"
                      value={deviceType ? deviceType.id : "0"}
                      prefix={""}
                      valueStyle={{ color: "black" }}
                    />
                  </Col>
                 
                </Row>
              </Card>
            </Col>
            <Col span={6}>
              <Card
                title="Pending Deployments"
                style={{ height: "400px", overflow: "auto" }}
              >
                <Row>{pendingCards}</Row>
              </Card>
            </Col>
            <Col span={6}>
              <Card
                title="Finished Deployments"
                style={{ maxHeight: "400px", overflow: "auto" }}
              >
                <Row>{otherCards}</Row>
              </Card>
            </Col>
          </Row>
          <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 16 }, 20]}>
            <Col span={12}>
              <Card title="Deployments Status">
                <DeploymentsStatusGraph data={deviceType!.history} />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Issues Over Time">
                <IssueCountGraph data={deviceType!.history} />
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </main>
  );
});
