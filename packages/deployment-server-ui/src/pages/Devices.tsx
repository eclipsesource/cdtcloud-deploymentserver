import { Device, DeviceType } from ".prisma/client";
import { Table } from "antd";
import { useEffect, useState } from "react";
import defineFunctionalComponent from "../util/defineFunctionalComponent";

export default defineFunctionalComponent(function Devices() {
  const [devices, setDevices] = useState<Device[]>(
    Array(15).fill({})
  );
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>(
    Array(15).fill({})
  );

  const [filters, setFilters] = useState<any>({});
  
  function handleChange (pagination: any, filters: any, sorter: any) {
    console.log('Various parameters', pagination, filters, sorter);
    setFilters(filters);
    window.history.replaceState(null, "Filtered Results", "/devices?type-" + filters.deviceTypeId + "&status=" + filters.status)
  };
  useEffect(() => {
    fetch("/api/device-types")
      .then(async (res) => { 
        setDeviceTypes(await res.json())
      })
    }, []);
  const columns: any[] = [
    {
      title: 'Device ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        {
          text: 'AVAILABLE',
          value: 'AVAILABLE'
        },{
          text: 'SUCCESS',
          value: 'SUCCESS'
        },
        {
          text: 'TERMINATED',
          value: 'TERMINATED'
        },
        {
          text: 'FAILED',
          value: 'FAILED'
        }
      ],
      filteredValue: filters.status || null,
      onFilter: (value: string, record: Device) => {
        return record.status === value
      },
    },
    {
      title: 'Connector ID',
      dataIndex: 'connectorId',
      key: 'connectorId',
    },
    {
      title: 'Device Type ID',
      dataIndex: 'deviceTypeId',
      key: 'deviceTypeId',
      filters: deviceTypes.map((deviceType: DeviceType) => {
        return {text: deviceType.name, value: deviceType.id}
      }),
      filteredValue: filters.deviceTypeId || null,
      onFilter: (value: string, record: Device) => {
        return record.deviceTypeId === value
      },
    },
  ];

  useEffect(() => {
    fetch("/api/devices")
      .then((res) => res.json())
      .then(setDevices);
  }, []);

  return (
    <main>
      <h2>Devices</h2>
      <Table dataSource={devices} columns={columns} onChange={handleChange}/>;
    </main>
  );
});
