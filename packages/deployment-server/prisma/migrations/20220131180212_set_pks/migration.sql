
-- AlterTable
ALTER TABLE "Connector" ADD CONSTRAINT "Connector_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "DeployRequest" ADD CONSTRAINT "DeployRequest_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Device" ADD CONSTRAINT "Device_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "DeviceType" ADD CONSTRAINT "DeviceType_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_pkey" PRIMARY KEY ("id");

-- DropIndex
DROP INDEX "Connector_id_key" CASCADE;

-- DropIndex
DROP INDEX "DeployRequest_id_key" CASCADE;

-- DropIndex
DROP INDEX "Device_id_key" CASCADE;

-- DropIndex
DROP INDEX "DeviceType_id_key" CASCADE;

-- DropIndex
DROP INDEX "Issue_id_key" CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_connectorId_fkey" FOREIGN KEY ("connectorId") REFERENCES "Connector"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_deviceTypeId_fkey" FOREIGN KEY ("deviceTypeId") REFERENCES "DeviceType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeployRequest" ADD CONSTRAINT "DeployRequest_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_deviceTypeId_fkey" FOREIGN KEY ("deviceTypeId") REFERENCES "DeviceType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
