import * as React from "react";
import { TypeSelect } from "./cdtcloud-widget/TypeSelect";
import {
  injectable,
  postConstruct,
  inject,
} from "@theia/core/shared/inversify";
import { AlertMessage } from "@theia/core/lib/browser/widgets/alert-message";
import { ReactWidget } from "@theia/core/lib/browser/widgets/react-widget";
import { MessageService } from "@theia/core";
import {
  CompilationService,
  Deployment,
  DeviceTypeService,
} from "../common/protocol";
import { EditorManager } from "@theia/editor/lib/browser/editor-manager";
import { WorkspaceService } from "@theia/workspace/lib/browser/workspace-service";
import { FileUri } from "@theia/core/lib/node/file-uri";
import { DeploymentManager } from "./monitoring/DeploymentManager";

@injectable()
export class CdtcloudWidget extends ReactWidget {
  deviceList: any[] = [];
  options: any[] = [];
  selected: { label: string; value: string };
  static readonly ID = "cdtcloud:widget";
  static readonly LABEL = "Cdtcloud Widget";

  private deploymentIds: string[] = [];
  private deployments: Deployment[] = [];

  private interval: number;

  @inject(MessageService)
  protected readonly messageService!: MessageService;

  constructor(
    @inject(DeviceTypeService)
    private readonly deviceTypeService: DeviceTypeService,
    @inject(CompilationService)
    private readonly compilationService: CompilationService,
    @inject(EditorManager)
    protected readonly editorManager: EditorManager,
    @inject(WorkspaceService)
    protected readonly workspaceService: WorkspaceService,
    @inject(DeploymentManager)
    protected readonly deploymentManager: DeploymentManager
  ) {
    super();
  }

  @postConstruct()
  protected async init(): Promise<void> {
    this.id = CdtcloudWidget.ID;
    this.title.label = CdtcloudWidget.LABEL;
    this.title.caption = CdtcloudWidget.LABEL;
    this.title.closable = true;
    this.title.iconClass = "fa fa-window-maximize";
    this.update();
    this.getDeviceList();
    this.startPollingDeployments();
  }

  render() {
    const header = `This widget enables you to deploy your code on a remote (Arduino-)board.`;

    return (
      <>
        <div id="widget-container">
          <AlertMessage type="INFO" header={header} />

          <h2> Select a Board to deploy your code on from this list</h2>
          <TypeSelect
            options={this.options}
            deployOnBoard={this.deployOnBoard.bind(this)}
          />
        </div>

        <div id="past-deployments">
          <h2> Past Deployments</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Artifact URL</th>
                <th>Device ID</th>
              </tr>
            </thead>
            <tbody>
              {this.deployments.map((deployment) => {
                return (
                  <tr>
                    <td>{deployment.id}</td>
                    <td>{deployment.status}</td>
                    <td>{deployment.createdAt}</td>
                    <td>{deployment.updatedAt}</td>
                    <td>{deployment.artifactUrl}</td>
                    <td>{deployment.deviceId}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  protected handleChange(option: { label: string; value: string }): void {
    this.selected = option;
  }

  protected async getDeviceList(): Promise<void> {
    try {
      this.deviceList = await this.deviceTypeService.getDeviceList();
      this.options = this.deviceList.map(({ id, name }) => ({
        label: name,
        value: id,
      }));
      this.update();
    } catch (err) {
      console.log(err);
    }
  }

  protected async deployOnBoard(board: any): Promise<void> {
    const selectedBoard = this.deviceList.find((obj) => {
      return obj.id === board.value;
    });
    const sketchUri = this.workspaceService.workspace?.resource;
    if (sketchUri === undefined) {
      throw new Error("No Sketch found");
    }
    const sketchPath = FileUri.fsPath(sketchUri);
    const deployment = await this.compilationService.compile(
      selectedBoard.fqbn,
      board.value,
      sketchPath
    );

    await this.deploymentManager.postDeploy(deployment);
    this.deploymentIds = [...this.deploymentIds, deployment.id];
    this.update();
  }

  private startPollingDeployments(): void {
    this.interval = setInterval(async () => {
      try {
        const request = await fetch("http://localhost:3001/api/deployments");

        const deployments = (await request.json()) as Deployment[];

        this.deployments = deployments.filter((deployment) =>
          this.deploymentIds.includes(deployment.id)
        );
        this.update();
      } catch (err) {
        console.log(err);
      }
    }, 5000) as unknown as number;
  }

  dispose(): void {
    clearInterval(this.interval);
    super.dispose();
  }
}
