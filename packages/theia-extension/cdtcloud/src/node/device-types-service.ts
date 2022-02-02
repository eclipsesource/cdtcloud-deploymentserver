import axios from "axios";
import { inject, injectable } from "@theia/core/shared/inversify";
import { ConfigService, DeviceTypeService } from "../common/protocol";

@injectable()
export class DeviceTypeServiceImpl implements DeviceTypeService {

  @inject(ConfigService)
  protected readonly configService: ConfigService;

  async getDeviceList(): Promise<any[]> {
    const { data } = await axios.get<any[]>(
      `${await this.configService.getDeploymentServerHost()}/api/device-types`,
      { params: { deployable: true } }
    );
    return data;
  }
}
