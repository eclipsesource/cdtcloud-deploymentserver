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
import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit'
import type { Dashboard } from 'deployment-server'

interface ISetDashboardData {
  type: string
  payload: Dashboard
}

interface ISetDashboardError {
  type: string
}

interface State {
  data: Dashboard | null
  error: boolean
  loading: boolean
}

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    loading: true,
    error: false,
    data: null
  },
  reducers: {
    setData: (state: State, action: PayloadAction<Dashboard>) => {
      state.data = action.payload
      state.error = false
      state.loading = false
    },
    setError: (state: State) => {
      state.loading = false
      state.error = true
    }
  }
})

const { setData, setError } = dashboardSlice.actions

export const fetchDashboardAsync = () => async (dispatch: Dispatch<ISetDashboardData | ISetDashboardError>) => {
  try {
    const resp = await fetch('/api/dashboard')
    if (resp.ok) {
      const data = await resp.json()
      dispatch(setData(data))
    } else {
      dispatch(setError())
    }
  } catch (e) {
    dispatch(setError())
  }
}

export default dashboardSlice.reducer
