import { injectable } from "inversify";
import { CompilationService } from "../common/protocol";
import { readdir } from 'fs/promises';
import { createReadStream } from 'fs';
import { RPCClient } from "./rpc-client";
import 'reflect-metadata';
import FormData from 'form-data';
import { join } from 'path';
import got from "got";


@injectable()
export class CompilationServiceImpl implements CompilationService {

  binaryFile: string;
  artifactUri: string;

  async compile(fqbn:string, id: string, sketchPath: string): Promise<void> {
    const client = new RPCClient()
      await client.init()
      await client.createInstance()
      await client.initInstance()

      const buildPath = await client.getBuildPath(fqbn, sketchPath)

      const files = await readdir(buildPath)

      files.forEach((file) => {
          if(file.endsWith('.bin')){
              this.binaryFile = join(buildPath, file)
          }
      })

      let form = new FormData();
      const content = createReadStream(this.binaryFile)
      form.append('file', content)
      const formHeaders = form.getHeaders();

      const uploadResponse =
        await got.post<{artifactUri: string}>(`http://localhost:3001/deployment-artifacts`, {
          headers: {
            ...formHeaders
          },
          body: form,
          responseType: 'json'
        })

      const artifactUri = uploadResponse.body.artifactUri

      await got.post(`http://localhost:3001/deployments`, {
        headers:{
          "Content-Type": "application/json"
        },
        responseType: 'json',
        body: JSON.stringify({
          artifactUri,
          deviceTypeId: id
      })})
  }
}
