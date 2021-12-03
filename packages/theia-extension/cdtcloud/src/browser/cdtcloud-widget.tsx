import * as React from "react";
import {
  injectable,
  postConstruct,
  inject,
} from "@theia/core/shared/inversify";
import { AlertMessage } from "@theia/core/lib/browser/widgets/alert-message";
import { ReactWidget } from "@theia/core/lib/browser/widgets/react-widget";
import { MessageService } from "@theia/core";
import { DeviceTypeService } from "../common/protocol";

@injectable()
export class CdtcloudWidget extends ReactWidget {
  static readonly ID = "cdtcloud:widget";
  static readonly LABEL = "Cdtcloud Widget";

  @inject(MessageService)
  protected readonly messageService!: MessageService;

  constructor(
    @inject(DeviceTypeService)
    private readonly deviceTypeService: DeviceTypeService
  ) {
    super();
  }

  @postConstruct()
  protected async init(): Promise<void> {
    this.id = CdtcloudWidget.ID;
    this.title.label = CdtcloudWidget.LABEL;
    this.title.caption = CdtcloudWidget.LABEL;
    this.title.closable = true;
    this.title.iconClass = "fa fa-window-maximize"; // example widget icon.

    this.update();
  }

  render(): React.ReactElement {
    const header = `This is a widget which simply calls the messageService
        in order to display an info message to end users.`;
    return (
      <div id="widget-container">
        <AlertMessage type="INFO" header={header} />
        <button
          className="theia-button secondary"
          title="Display Message"
          onClick={(_a) => this.displayMessage()}
        >
          Display Message
        </button>
      </div>
    );
  }

  protected async displayMessage(): Promise<void> {
    this.deviceTypeService.getDeviceList().then((result) => {
      this.messageService.info(JSON.stringify(result[0]));
    });
  }
}
