import { injectable } from "inversify";
import { CompilationService } from "../common/protocol";
import { readdir } from 'fs/promises';
import { createReadStream } from 'fs';
import axios from 'axios';
import { RPCClient } from "./rpc-client";
import 'reflect-metadata';
import FormData from 'form-data';
import { join } from 'path';


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

      files.forEach((file) => {
          if(file.endsWith('.bin')){
              this.binaryFile = join(buildPath, file)
          }
      }) 

      console.log('binary file: ' + this.binaryFile)

      let form = new FormData();
      const content = createReadStream(this.binaryFile)
      form.append('file', content)
      const formHeaders = form.getHeaders();
      console.log(formHeaders)

      await new Promise<void>((resolve, reject) => {
          form.getLength(async (err, length) => {
          const response = await axios.post(`http://localhost:3001/deployment-artifacts`, form, {headers: {...formHeaders, "Content-Length": "" + 261657}, validateStatus:  () => true})
          
          console.log(response.data)
          this.artifactUri = response.data.artifactUri

          console.log(this.artifactUri)
          const data = {'deviceTypeId': id, 'artifactUri': this.artifactUri}
          const resp = await axios.post(`http://localhost:3001/deployments`, data, {headers:{"Content-Type": "application/json"}})
          console.log(resp) 
          resolve()
        })
      })
           
  }
}
