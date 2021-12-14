-- DropForeignKey
ALTER TABLE "DeployRequest" DROP CONSTRAINT "DeployRequest_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "Device" DROP CONSTRAINT "Device_connectorId_fkey";

-- DropForeignKey
ALTER TABLE "Device" DROP CONSTRAINT "Device_deviceTypeId_fkey";

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_connectorId_fkey" FOREIGN KEY ("connectorId") REFERENCES "Connector"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_deviceTypeId_fkey" FOREIGN KEY ("deviceTypeId") REFERENCES "DeviceType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeployRequest" ADD CONSTRAINT "DeployRequest_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;
