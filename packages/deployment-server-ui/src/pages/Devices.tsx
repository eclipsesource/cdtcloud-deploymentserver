import { Device, DeviceType, DeployRequest } from 'deployment-server'
import { Card, Table, TablePaginationConfig } from 'antd'
import { FilterValue } from 'antd/lib/table/interface'
import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useInterval } from "react-use";
import defineFunctionalComponent from '../util/defineFunctionalComponent'
import { typeIdToName } from '../util/deviceMapping'
import classnames from 'classnames'
import { StatusTag } from '../components/StatusTag'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './Devices.module.scss'

type DevicesItem = { deviceTypeName: string, deployCount: number } & Device

export const DeviceStatus = {
  UNAVAILABLE: 'UNAVAILABLE',
  AVAILABLE: 'AVAILABLE',
  DEPLOYING: 'DEPLOYING',
  RUNNING: 'RUNNING',
  MONITORING: 'MONITORING'
}

const removeUnavailable = (devices: Device[]): Device[] => {
  return devices.filter((device) => device.status !== DeviceStatus.UNAVAILABLE)
}

const formatDevices = async (devices: Device[]): Promise<DevicesItem[]> => {
  return await Promise.all(
    devices.map<Promise<DevicesItem>>(async (device) => {
      const statusTag = <StatusTag status={device.status}/>
      try {
        const deviceTypeName = await typeIdToName(device.deviceTypeId)
        return { ...device, deviceTypeName, statusTag, deployCount: 0 }
      } catch {
        return { ...device, deviceTypeName: 'Unknown', statusTag, deployCount: 0 }
      }
    })
  )
}

export default defineFunctionalComponent(function Devices() {
  const [devices, setDevices] = useState<DevicesItem[]>()
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>(Array(15).fill({}))
  const [loading, setLoading] = useState<boolean>(true)
  const [showUnavailable, setShowUnavailable] = useState<boolean>(false)
  const [hover, setHover] = useState<boolean>(false)
  const [refetchFlip, setRefetchFlip] = useState<boolean>(false)

  const [filters, setFilters] = useState<Record<string, FilterValue | null>>({
    status: [],
    deviceTypeId: []
  })

  let [searchParams, setSearchParams] = useSearchParams()

  useInterval(function () {
    setRefetchFlip(!refetchFlip);
  }, 1500);

  function handleChange(
    _pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>
  ) {
    let params: Record<string, string | string[]> = {
      status: [],
      deviceTypeId: []
    }
    setFilters(filters)
    for (const [key, value] of Object.entries(filters)) {
      if (value != null) params[key] = value.map((val) => '' + val)
    }
    setSearchParams(params)
  }

  useEffect(() => {
    fetch('/api/device-types').then(async (res) => {
      const types = await res.json()
      const sortedTypes = types.sort((x: DeviceType, y: DeviceType) => x.name < y.name ? -1 : x.name > y.name ? 1 : 0)
      setDeviceTypes(sortedTypes)
    })
  }, [refetchFlip])

  useEffect(() => {
    const asyncFetch = async () => {
      if (devices != null) {
        const res = await fetch('/api/deployments')
        const deploys = await res.json()
        const amounts = devices.reduce<Record<string, number>>((acc, device) => {
          return {
            ...acc,
            [device.id]: 0
          }
        }, {})
        deploys.map((deploy: DeployRequest) => {
          amounts[deploy.deviceId]++
        })
        const withAmount = devices.map((device) => {
          return { ...device, deployCount: amounts[device.id] }
        })
        setDevices(withAmount)
        setLoading(false)
      }
    }

    asyncFetch()
  }, [refetchFlip])

  const columns: any[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 350
    },
    {
      title: 'Connector',
      dataIndex: 'connectorId',
      key: 'connectorId',
      width: 350
    },
    {
      title: 'Device Type',
      dataIndex: 'deviceTypeName',
      key: 'deviceTypeId',
      render: (name: string, record: DevicesItem) => <Link to={`/types/${record.deviceTypeId}`}>{name}</Link>,
      filters: deviceTypes.map((deviceType: DeviceType) => {
        return { text: deviceType.name, value: deviceType.id }
      }),
      filteredValue: filters.deviceTypeId || null,
      onFilter: (value: string, record: Device) => {
        return record.deviceTypeId === value
      }
    },
    {
      title: 'Total Deployments',
      dataIndex: 'deployCount',
      key: 'deploys',
      sorter: (x: DevicesItem, y: DevicesItem) => x.deployCount - y.deployCount,
    },
    {
      title: 'Status',
      dataIndex: 'statusTag',
      key: 'status',
      width: 180,
      fixed: 'right',
      filters: (
        Object.entries(DeviceStatus) as Array<[
          keyof typeof DeviceStatus,
          typeof DeviceStatus[keyof typeof DeviceStatus]
        ]>
      ).reduce<Array<{
        text: keyof typeof DeviceStatus;
        value: typeof DeviceStatus[keyof typeof DeviceStatus];
      }>>((acc, [key, value]) => {
        if (key === DeviceStatus.UNAVAILABLE && !showUnavailable) {
          return acc
        }
        return [...acc, { text: key, value: value }]
      }, []),
      filteredValue: filters.status || null,
      onFilter: (value: string, record: Device) => {
        return record.status === value
      }
    }
  ]

  useEffect(() => {
    fetch('/api/devices')
      .then((res) => res.json())
      .then(async (res) => {
        const devicesWithNames = await formatDevices(showUnavailable ? res : removeUnavailable(res))
        setDevices(devicesWithNames)
      })
  }, [showUnavailable, refetchFlip])

  return (
    <main>
      <Card
        title={'Connected Devices'}
        extra={
          <div className={styles.topline}>
            <div className={styles.dchooser}>
              <div className={classnames(styles.dunavailable, { [styles.selected]: showUnavailable })}
                   onClick={() => setShowUnavailable(!showUnavailable)}
                   onPointerEnter={() => setHover(true)}
                   onPointerLeave={() => setHover(false)}
              >
                <FontAwesomeIcon
                  icon={showUnavailable || hover ? 'check' : 'square-full'}
                  className={classnames(styles.dcheckicon, {
                    [styles.hovering]: hover,
                    [styles.selected]: showUnavailable
                  })}
                />
                Include Unavailable Devices
              </div>
            </div>
          </div>
        }
      >
        <Table dataSource={devices} rowKey={'id'} columns={columns} onChange={handleChange} loading={loading}
               tableLayout={'fixed'}/>
      </Card>
    </main>
  )
})
