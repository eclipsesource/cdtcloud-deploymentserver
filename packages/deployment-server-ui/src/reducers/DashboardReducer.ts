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
