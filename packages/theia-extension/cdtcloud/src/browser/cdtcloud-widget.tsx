/********************************************************************************
    Copyright (c) 2022 EclipseSource and others.

    This program and the accompanying materials are made available under the
    terms of the Eclipse Public License v. 2.0 which is available at
    http://www.eclipse.org/legal/epl-2.0.

    This Source Code may also be made available under the following Secondary
    Licenses when the conditions for such availability set forth in the Eclipse
    Public License v. 2.0 are satisfied: GNU General Public License, version 2
    with the GNU Classpath Exception which is available at
    https://www.gnu.org/software/classpath/license.html.

    SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
********************************************************************************/

import * as React from 'react'
import { TypeSelect } from './cdtcloud-widget/TypeSelect'
import {
  injectable,
  postConstruct,
  inject
} from '@theia/core/shared/inversify'
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget'
import { MessageService } from '@theia/core'
import {
  CompilationService,
  CompilationServiceSymbol,
  ConfigService,
  ConfigServiceSymbol,
  Deployment,
  DeviceTypeService,
  DeviceTypeServiceSymbol
} from '../common/protocol'
import { EditorManager } from '@theia/editor/lib/browser/editor-manager'
import { WorkspaceService } from '@theia/workspace/lib/browser/workspace-service'
import { FileUri } from '@theia/core/lib/node/file-uri'
import { DeploymentManager } from './monitoring/DeploymentManager'
import { ReactElement } from 'react'
import { HostingPreferences, HostingPreferencesSymbol } from './hosting-service'

@injectable()
export class CdtcloudWidget extends ReactWidget {
  deviceTypeList: any[] = [];
  options: any[] = [];
  selected: { label: string, value: string, status: string };
  static readonly ID = 'cdtcloud:widget';
  static readonly LABEL = 'Cdtcloud Widget';

  private deploymentIds: string[] = [];
  private deployments: Deployment[] = [];

  private interval: number;

  @inject(MessageService)
  protected readonly messageService!: MessageService;

  constructor (
    @inject(HostingPreferencesSymbol)
    protected readonly preferences: HostingPreferences,
    @inject(DeviceTypeServiceSymbol)
    private readonly deviceTypeService: DeviceTypeService,
    @inject(CompilationServiceSymbol)
    private readonly compilationService: CompilationService,
    @inject(EditorManager)
    protected readonly editorManager: EditorManager,
    @inject(WorkspaceService)
    protected readonly workspaceService: WorkspaceService,
    @inject(DeploymentManager)
    protected readonly deploymentManager: DeploymentManager,
    @inject(ConfigServiceSymbol)
    protected readonly configService: ConfigService
  ) {
    super()
    this.toDispose.push(preferences.onPreferenceChanged(async e => {
      if (e.preferenceName === 'Deployment Server Host') {
        await this.configService.setHost(e.newValue)
      }
      if (e.preferenceName === 'Deployment Server Port') {
        await this.configService.setPort(e.newValue)
      }
      if (e.preferenceName === 'Deployment Server Secure') {
        await this.configService.setSecure(e.newValue)
      }
    }))
  }

  @postConstruct()
  protected async init (): Promise<void> {
    this.id = CdtcloudWidget.ID
    this.title.label = CdtcloudWidget.LABEL
    this.title.caption = CdtcloudWidget.LABEL
    this.title.closable = true
    this.title.iconClass = 'fa fa-window-maximize'
    this.update()
    await this.getDeviceList()
    this.startPollingDeployments()
  }

  render (): ReactElement {
    function getColor (status: string): {color: string, background: string, border: string} {
      switch (status) {
        case 'PENDING':
          return { color: 'var(--theia-terminal-ansiBrightBlack)', background: 'transparent', border: 'var(--theia-terminal-ansiBrightBlack)' }
        case 'RUNNING':
          return { color: 'var(--theia-terminal-ansiBrightBlue', background: 'var(--theia-inputOption-activeBackground)', border: 'var(--theia-terminal-ansiBrightBlue)' }
        case 'TERMINATED':
          return { color: 'var(--theia-terminal-ansiBrightYellow)', background: 'var(--theia-editor-rangeHighlightBackground)', border: 'var(--theia-terminal-ansiBrightYellow)' }
        case 'SUCCESS':
          return { color: 'var(--theia-terminal-ansiBrightGreen)', background: 'var(--theia-diffEditor-insertedTextBackground)', border: 'var(--theia-terminal-ansiBrightGreen)' }
        case 'FAILED':
          return { color: 'var(--theia-terminal-ansiBrightRed)', background: 'var(--theia-searchEditor-findMatchBackground)', border: 'var(--theia-terminal-ansiBrightRed)' }
        default:
          return { color: '#ffffff', background: '#ffffff', border: '#ffffff' }
      }
    }

    return (
      <>
        <div id="widget-container">
          <h2> Select a device to deploy your code on from this list</h2>
          <TypeSelect
            options={this.options}
            deployOnBoard={this.deployOnBoard.bind(this)}
          />

          <div id="deployments">
            <h2>Recent Deployments</h2>
            {this.deployments.length > 0
              ? (
              <table>
                <thead>
                  <tr key="head">
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                  </tr>
                </thead>
                <tbody>
                  {this.deployments.map((deployment) => {
                    return (
                      <tr key={deployment.id}>
                        <td>
                          <div
                            style={{
                              display: 'flex',
                              width: '95%',
                              height: '100%',
                              color: getColor(deployment.status).color,
                              backgroundColor: getColor(deployment.status)
                                .background,
                              borderRadius: '5px',
                              border: `2px solid ${
                                getColor(deployment.status).border
                              }`,
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}
                          >
                            {deployment.status}
                          </div>
                        </td>
                        <td>{deployment.createdAt}</td>
                        <td>{deployment.updatedAt}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
                )
              : (
              <p>No deployments have been sent so far.</p>
                )}
          </div>
        </div>
      </>
    )
  }

  protected handleChange (option: {
    label: string
    value: string
    status: string
  }): void {
    this.selected = option
  }

  protected async getDeviceList (): Promise<void> {
    try {
      this.deviceTypeList = await this.deviceTypeService.getDeviceList()
      this.options = this.deviceTypeList.map(({ id, name, status }) => ({
        label: name,
        value: id,
        status: status
      }))
      this.update()
    } catch (err) {
      console.log(err)
    }
  }

  protected async deployOnBoard (board: any): Promise<void> {
    const selectedBoard = this.deviceTypeList.find((obj) => {
      return obj.id === board.value
    })
    const sketchUri = this.workspaceService.workspace?.resource
    if (sketchUri === undefined) {
      throw new Error('No Sketch found')
    }
    const sketchPath = FileUri.fsPath(sketchUri)
    const deploymentResponse = await this.compilationService.compile(
      selectedBoard.fqbn,
      board.value,
      sketchPath
    )

    if (deploymentResponse.kind === 'deployment') {
      await this.deploymentManager.postDeploy(deploymentResponse)
      this.deploymentIds = [...this.deploymentIds, deploymentResponse.id]
      this.update()
    } else {
      await this.messageService.error(
        deploymentResponse.data.message ??
          deploymentResponse.statusMessage ??
          'Unknown deployment error'
      )
    }
  }

  private startPollingDeployments (): void {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.interval = setInterval(async () => {
      const request = await fetch(
        `${await this.configService.getDeploymentServerHost()}/api/deployments`
      )
      const deployments = (await request.json()) as Deployment[]
      this.deployments = deployments.filter((deployment) => this.deploymentIds.includes(deployment.id)
      )
      await this.getDeviceList()
    }, 1500) as unknown as number
  }

  dispose (): void {
    clearInterval(this.interval)
    super.dispose()
  }
}
