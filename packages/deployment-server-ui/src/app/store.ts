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
import { configureStore } from '@reduxjs/toolkit'
import dashboardReducer from '../reducers/DashboardReducer'
import deviceTypesReducer from '../reducers/DeviceTypesReducer'

export const store = configureStore({
  reducer: {
    // devices: devicesReducer,
    deviceTypes: deviceTypesReducer,
    // deployments: deploymentsReducer,
    dashboard: dashboardReducer
  }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
