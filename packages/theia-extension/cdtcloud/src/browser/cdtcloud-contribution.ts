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
import { injectable } from '@theia/core/shared/inversify'
import { MenuModelRegistry } from '@theia/core'
import { CdtcloudWidget } from './cdtcloud-widget'
import { AbstractViewContribution } from '@theia/core/lib/browser'
import { Command, CommandRegistry } from '@theia/core/lib/common/command'

export const CdtcloudCommand: Command = { id: 'cdtcloud:command' }

@injectable()
export class CdtcloudContribution extends AbstractViewContribution<CdtcloudWidget> {
  /**
     * `AbstractViewContribution` handles the creation and registering
     *  of the widget including commands, menus, and keybindings.
     *
     * We can pass `defaultWidgetOptions` which define widget properties such as
     * its location `area` (`main`, `left`, `right`, `bottom`), `mode`, and `ref`.
     *
     */
  constructor () {
    super({
      widgetId: CdtcloudWidget.ID,
      widgetName: CdtcloudWidget.LABEL,
      defaultWidgetOptions: { area: 'left' },
      toggleCommandId: CdtcloudCommand.id
    })
  }

  /**
     * Example command registration to open the widget from the menu, and quick-open.
     * For a simpler use case, it is possible to simply call:
     ```ts
        super.registerCommands(commands)
     ```
     *
     * For more flexibility, we can pass `OpenViewArguments` which define
     * options on how to handle opening the widget:
     *
     ```ts
        toggle?: boolean
        activate?: boolean;
        reveal?: boolean;
     ```
     *
     * @param commands
     */
  registerCommands (commands: CommandRegistry): void {
    commands.registerCommand(CdtcloudCommand, {
      execute: async () => await super.openView({ activate: false, reveal: true })
    })
  }

  /**
     * Example menu registration to contribute a menu item used to open the widget.
     * Default location when extending the `AbstractViewContribution` is the `View` main-menu item.
     *
     * We can however define new menu path locations in the following way:
     ```ts
        menus.registerMenuAction(CommonMenus.HELP, {
            commandId: 'id',
            label: 'label'
        });
     ```
     *
     * @param menus
     */
  registerMenus (menus: MenuModelRegistry): void {
    super.registerMenus(menus)
  }
}
