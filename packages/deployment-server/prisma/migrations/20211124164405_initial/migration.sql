-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('UNAVAILABLE', 'AVAILABLE', 'DEPLOYING', 'RUNNING');

-- CreateTable
CREATE TABLE "Connector" (
    "id" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "DeviceType" (
    "id" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "Device" (
    "id" UUID NOT NULL,
    "status" "DeviceStatus" NOT NULL DEFAULT E'UNAVAILABLE',
    "connectorId" UUID NOT NULL,
    "deviceTypeId" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Connector_id_key" ON "Connector"("id");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceType_id_key" ON "DeviceType"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Device_id_key" ON "Device"("id");

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_connectorId_fkey" FOREIGN KEY ("connectorId") REFERENCES "Connector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_deviceTypeId_fkey" FOREIGN KEY ("deviceTypeId") REFERENCES "DeviceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
