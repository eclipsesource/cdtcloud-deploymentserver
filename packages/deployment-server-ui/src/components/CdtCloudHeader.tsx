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
import { Header } from 'antd/lib/layout/layout'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function CdtCloudHeader () {
  return (
    <Header className="header">
      <div className="logo"/>
      <h2 style={{ color: 'rgba(255, 255, 255, 0.65)', textAlign: 'center' }}>
        Embedded Cloud Development - Admin Dashboard
      </h2>
    </Header>
  )
}
