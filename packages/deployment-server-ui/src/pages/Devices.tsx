import { Device, DeviceType, DeviceStatus } from "@prisma/client";
import { Table, TablePaginationConfig } from "antd";
import { FilterValue } from "antd/lib/table/interface";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import defineFunctionalComponent from "../util/defineFunctionalComponent";
import { typeIdToName } from "../util/deviceMapping"

type DevicesItem = { deviceTypeName: string } & Device

const addNameToDevices = async (devices: Device[]): Promise<DevicesItem[]> => {
  return await Promise.all(
    devices.map(async (device) => {
      try {
        const deviceTypeName = await typeIdToName(device.deviceTypeId)
        return {...device, deviceTypeName}
      } catch {
        return {...device, deviceTypeName: "Unknown"}
      }
    })
  )
}

export default defineFunctionalComponent(function Devices() {
  const [devices, setDevices] = useState<DevicesItem[]>(Array(15).fill({}));
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>(
    Array(15).fill({})
  );

  const [filters, setFilters] = useState<Record<string, FilterValue | null>>({
    status: [],
    deviceTypeId: [],
  });

  let [searchParams, setSearchParams] = useSearchParams();

  function handleChange(
    _pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>
  ) {
    let params: Record<string, string | string[]> = {
      status: [],
      deviceTypeId: [],
    };
    setFilters(filters);
    for (const [key, value] of Object.entries(filters)) {
      if (value != null) params[key] = value.map((val) => "" + val);
    }
    setSearchParams(params);
  }

  useEffect(() => {
    fetch("/api/device-types").then(async (res) => {
      const types = await res.json()
      const sortedTypes = types.sort((x: DeviceType, y: DeviceType) => x.name < y.name ? -1 : x.name > y.name ? 1 : 0)
      setDeviceTypes(sortedTypes);
    });
  }, []);

  const columns: any[] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: (
        Object.entries(DeviceStatus) as Array<
          [
            keyof typeof DeviceStatus,
            typeof DeviceStatus[keyof typeof DeviceStatus]
          ]
        >
      ).reduce<
        Array<{
          text: keyof typeof DeviceStatus;
          value: typeof DeviceStatus[keyof typeof DeviceStatus];
        }>
      >((acc, [key, value]) => [...acc, { text: key, value: value }], []),
      filteredValue: filters.status || null,
      onFilter: (value: string, record: Device) => {
        return record.status === value;
      },
    },
    {
      title: "Connector",
      dataIndex: "connectorId",
      key: "connectorId",
    },
    {
      title: "Device Type",
      dataIndex: "deviceTypeName",
      key: "deviceTypeId",
      filters: deviceTypes.map((deviceType: DeviceType) => {
        return { text: deviceType.name, value: deviceType.id };
      }),
      filteredValue: filters.deviceTypeId || null,
      onFilter: (value: string, record: Device) => {
        return record.deviceTypeId === value;
      },
    },
  ];

  useEffect(() => {
    fetch("/api/devices")
      .then((res) => res.json())
      .then(async (res) => {
        const devicesWithNames = await addNameToDevices(res)
        setDevices(devicesWithNames)
      });
  }, []);

  return (
    <main>
      <h2>Devices</h2>
      <Table dataSource={devices} columns={columns} onChange={handleChange} />;
    </main>
  );
});
