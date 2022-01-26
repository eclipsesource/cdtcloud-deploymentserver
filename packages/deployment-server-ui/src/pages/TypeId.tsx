import { DeployRequest, DeviceType, Device } from 'deployment-server'
import { useEffect, useState } from 'react'
import defineFunctionalComponent from '../util/defineFunctionalComponent'
import { Card, Col, Row } from 'antd'
import { useInterval } from 'react-use'
import { useParams } from 'react-router-dom'
import { StatusTag } from '../components/StatusTag'

export default defineFunctionalComponent(function TypeId () {
  const [devices, setDevices] = useState<Device[]>([])
  const [deviceType, setDeviceType] = useState<DeviceType | null>(null)
  const [deployments, setDeployments] = useState<DeployRequest[]>([])
  const [refetchFlip, setRefetchFlip] = useState(false)

  const { id = '' } = useParams()

  function findDeviceById (id: string): Device | undefined {
    return devices.find((device) => id === device.id)
  }
  useInterval(function () {
    setRefetchFlip(!refetchFlip)
  }, 5000)

  useEffect(() => {
    fetch(`/api/device-types/${id}`).then(async (res) => {
      setDeviceType(await res.json())
    })
      .catch(console.error)
  }, [])

  useEffect(() => {
    fetch('/api/devices')
      .then(async (res) => {
        const devices: Device[] = await res.json()
        return devices
      })
      .then((res) => {
        setDevices(
          res.filter((device) => device.deviceTypeId === id)
        )
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    fetch('/api/deployments').then(async (res) => {
      const deployments: DeployRequest[] = await res.json()
      return deployments
    })
      .then(res => {
        setDeployments(
          res.filter(deployment => ((deployment.deviceId) === findDeviceById(deployment.deviceId)?.id))
        )
      })
      .catch(console.error)
  }, [refetchFlip])

  const pendingCards = deployments
    .filter(
      (deployment) =>
        deployment.status === 'PENDING' &&
        findDeviceById(deployment.deviceId)
    )
    .map((deployment: DeployRequest) => (
      <div key={deployment.id}>
        <Card title={deployment.id} bordered style={{ width: 200 }}>
          <p>
            <StatusTag status={deployment.status} addIcon />
          </p>
        </Card>
      </div>
    ))

  const otherCards = deployments
    .filter(
      (deployment) =>
        deployment.status !== 'PENDING' &&
        findDeviceById(deployment.deviceId)
    )
    .map((deployment: DeployRequest) => (
      <div key={deployment.id}>
        <Row gutter={[0, 16]}>
          <Card title={deployment.id} bordered style={{ width: 200 }}>
            <p>
              <StatusTag status={deployment.status} addIcon />
            </p>
          </Card>
        </Row>
      </div>
    ))

  return (
    <main>
      <Row justify='space-between'>
        <Col>
          <h2>{(deviceType != null) ? deviceType.name : ''}</h2>
          <li>Number of devices: {devices.length}</li>
          <li>FQBN: {(deviceType != null) ? deviceType.fqbn : ''}</li>
          <li>{(deviceType != null) ? deviceType.fqbn : ''}</li>
          <Row>{pendingCards}</Row>
        </Col>
        <Col>{otherCards}</Col>
      </Row>
    </main>
  )
})
