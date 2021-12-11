import axios from "axios";
import { injectable } from "inversify";
import { DeviceTypeService } from "../common/protocol";

@injectable()
export class DeviceTypeServiceImpl implements DeviceTypeService {
  //get (query parameter, deployable= true)
  async getDeviceList(): Promise<any[]> {
    const { data } = await axios.get<any[]>(
      "http://localhost:3001/device-types",
      { params: { deployable: true } }
    );
    return data;
  }
}
