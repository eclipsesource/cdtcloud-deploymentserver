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

import './index.css'
import 'antd/dist/antd.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'

import App from './App'
import Types from './pages/Types'
import TypeId from './pages/TypeId'
import Devices from './pages/Devices'
import Deployments from './pages/Deployments'
import NotFound from './pages/NotFound'

import { CdtCloudMain } from './components/CdtCloudMain'
import { init as InitIcons } from './util/iconLibrary'
import { store } from './app/store'

InitIcons()

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <CdtCloudMain>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="types" element={<Types />} />
            <Route path="types/:id" element={<TypeId />} />
            <Route path="devices" element={<Devices />} />
            <Route path="deployments" element={<Deployments />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CdtCloudMain>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
