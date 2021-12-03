import axios from "axios";
import { injectable } from "inversify";
import { DeviceTypeService } from "../common/protocol";

@injectable()
export class DeviceTypeServiceImpl implements DeviceTypeService {
  async getDeviceList(): Promise<any[]> {
    const { data } = await axios.get<any[]>(
      "http://localhost:3001/device-types"
    );
    return data;
  }
}
