import "reflect-metadata";
import { injectable } from "inversify";
import { CompilationService, Deployment } from "../common/protocol";
import { readdir as readdirCb } from "fs";
import { promisify } from "util";
import { createReadStream } from "fs";
import { RPCClient } from "./rpc-client";
import FormData from "form-data";
import { join, extname } from "path";
import got from "got";

const readdir = promisify(readdirCb);

@injectable()
export class CompilationServiceImpl implements CompilationService {
  binaryFile: string;
  artifactUri: string;

  async compile(
    fqbn: string,
    id: string,
    sketchPath: string
  ): Promise<Deployment> {
    const client = new RPCClient();
    await client.init();
    await client.createInstance();
    await client.initInstance();

    // Method to determine required extension
    const getRequiredExtension = async (fqbn: string): Promise<string> => {
      if (fqbn.startsWith("arduino")) {
        const segments = fqbn.split(":");
        switch (segments[1]) {
          case "avr":
            return ".hex";
          case "sam":
            return ".bin";
          case "mbed_edge":
          case "mbed_nano":
          case "mbed_nicla":
          case "mbed_portenta":
          case "mbed_rp2040":
          case "megaavr":
          case "nrf52":
          case "samd":
          case "mbed":
            throw new Error("No extension specified");
          default:
            throw new Error("Unknown arduino board core");
        }
      } else if (fqbn.startsWith("STMicroelectronics")) {
        const segments = fqbn.split(":");
        switch (segments[1]) {
          case "stm32":
            return ".bin";
          default:
            throw new Error("Unknown STM board core");
        }
      }
      throw new Error("Unknown device");
    };

    const buildPath = await client.getBuildPath(fqbn, sketchPath);
    const files = await readdir(buildPath);
    const ext = await getRequiredExtension(fqbn);

    files.forEach((file) => {
      if (
        extname(file) === ext &&
        !file.endsWith(`with_bootloader${ext}`)
      ) {
        this.binaryFile = join(buildPath, file);
      }
    });

    let form = new FormData();
    const content = createReadStream(this.binaryFile);
    form.append("file", content);
    const formHeaders = form.getHeaders();

    const uploadResponse = await got.post<{ artifactUri: string }>(
      `http://localhost:3001/api/deployment-artifacts`,
      {
        headers: {
          ...formHeaders,
        },
        body: form,
        responseType: "json",
      }
    );

    const artifactUri = uploadResponse.body.artifactUri;

    const { body } = await got.post(`http://localhost:3001/api/deployments`, {
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "json",
      body: JSON.stringify({
        artifactUri,
        deviceTypeId: id,
      }),
    });

    return body as Deployment;
  }
}
