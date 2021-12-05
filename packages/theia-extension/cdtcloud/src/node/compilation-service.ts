import { injectable } from "inversify";
import { CompilationService } from "../common/protocol";
import { readFile, readdir } from 'fs/promises';
import axios from 'axios';
import { RPCClient } from "./rpc-client";
import 'reflect-metadata';



@injectable()
export class CompilationServiceImpl implements CompilationService {
  
  binaryFile: string;
  binaryFileContent: Buffer;
  artifactUrl: string;

  async compile(fqbn:string, id: string, sketchPath: string): Promise<void> {
    const client = new RPCClient()
      await client.init()
      await client.createInstance()
      await client.initInstance()

      const buildPath = await client.getBuildPath(fqbn, sketchPath)


      console.log(buildPath)
  
      const files = await readdir(buildPath)

      files.forEach((file: any) => {
          if(file.endsWith('.bin')){
              this.binaryFile = buildPath + "/" + file
          }
      }) 

      console.log('binary file: ' + this.binaryFile)

      this.binaryFileContent = await readFile(this.binaryFile)

      console.log(this.binaryFileContent)
      const arraybuffer = Uint8Array.from(this.binaryFileContent)
      const artifact = new File([arraybuffer], 'artifact', { type: 'text/plain' })
      let form = new FormData();

      form.append('file', artifact)

      const response = await axios.post(`http://localhost:3001/deployment-artifacts`, form, {headers:{"Content-Type": "multipart/form-data"}})
        console.log(response)
        /*const json = await response.json() as { artifactUrl: string}
        console.log(json)
        this.artifactUrl = json.artifactUrl
        */
        this.artifactUrl = response.data.artifactUrl


        console.log(this.artifactUrl)

      form.append('artifactUrl', this.artifactUrl)
      form.append('id', id)

      /*const res = await fetch(`http://localhost:3001/deploymentRequests`, {
          method: 'POST',
          body: form
        })
        const data = await response.json() as { artifactUri: string}
      */
  }
}
