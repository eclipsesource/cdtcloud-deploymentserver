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
  artifactUri: string;

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

      //const arraybuffer = Uint8Array.from(this.binaryFileContent)
      const artifact = new File([this.binaryFileContent], 'artifact', { type: 'text/plain' })
      let form = new FormData();
      console.log(artifact)
      form.append('file', artifact)

      const response = await axios.post(`http://localhost:3001/deployment-artifacts`, form, {headers:{"Content-Type": "multipart/form-data"}})
        console.log(response)
        /*const json = await response.json() as { artifactUrl: string}
        console.log(json)
        this.artifactUrl = json.artifactUrl
        */
        this.artifactUri = response.data.artifactUri


        console.log(this.artifactUri)

      /* form = new FormData();
      form.append('artifactUri', this.artifactUri)
      form.append('deviceTypeId', id)

      console.log('geschafft: ' + form) */

      const data = {'deviceTypeId': id, 'artifactUri': this.artifactUri}

      const resp = await axios.post(`http://localhost:3001/deployments`, data, {headers:{"Content-Type": "application/json"}})
      console.log(resp)


      /* const data = {'deviceTypeId': id, 'artifactUri': this.artifactUri}

      const res = await fetch(`http://localhost:3001/deployments`, {
          method: 'POST',
          body: JSON.stringify(data)
        })
      console.log(res) */
      //  const data = await response.json() as { artifactUri: string}
      
  }
}
