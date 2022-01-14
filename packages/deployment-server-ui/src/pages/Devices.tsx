import { Device, DeviceType } from ".prisma/client";
import { Table, TablePaginationConfig } from "antd";
import { FilterValue } from "antd/lib/table/interface";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import defineFunctionalComponent from "../util/defineFunctionalComponent";

export default defineFunctionalComponent(function Devices() {
  const [devices, setDevices] = useState<Device[]>(
    Array(15).fill({})
  );
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>(
    Array(15).fill({})
  );

  const [filters, setFilters] = useState<Record<string, FilterValue | null>>({status: [], deviceTypeId: []});

  let [searchParams, setSearchParams] = useSearchParams();
  
  function handleChange (_pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>) {
    let params: Record<string, string | string[]> = {status: [], deviceTypeId: []}
    setFilters(filters);
    for (const [key, value] of Object.entries(filters)) {
      if (value != null) params[key] = value.map(val => '' + val)
    }
      setSearchParams(params);
    }

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
