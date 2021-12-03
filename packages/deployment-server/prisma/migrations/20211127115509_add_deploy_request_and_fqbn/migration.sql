/*
  Warnings:

  - A unique constraint covering the columns `[fqbn]` on the table `DeviceType` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fqbn` to the `DeviceType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `DeviceType` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DeployStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCESS', 'FAILED', 'TERMINATED');

-- AlterTable
ALTER TABLE "DeviceType" ADD COLUMN     "fqbn" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "DeployRequest" (
    "id" UUID NOT NULL,
    "status" "DeployStatus" NOT NULL DEFAULT E'PENDING',
    "artifactUrl" TEXT,
    "deviceId" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "DeployRequest_id_key" ON "DeployRequest"("id");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceType_fqbn_key" ON "DeviceType"("fqbn");

-- AddForeignKey
ALTER TABLE "DeployRequest" ADD CONSTRAINT "DeployRequest_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
