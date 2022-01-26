import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit"
import type { DeviceTypeResource } from "deployment-server"

interface ISetDeviceTypes {
  type: string,
  payload: DeviceTypeResource
}

interface State {
  data: DeviceTypeResource | null
}

export const deviceTypesSlice = createSlice({
  name: "deviceTypes",
  initialState: {
    data: null
  },
  reducers: {
    setDeviceTypes: (state: State, action:PayloadAction<DeviceTypeResource>) => {
      state.data = action.payload;
    }
  }
});

const { setDeviceTypes } = deviceTypesSlice.actions;

export const fetchDeviceTypesAsync = () => async (dispatch: Dispatch<ISetDeviceTypes>) => {
  try {
    const resp = await fetch("/api/device-types")
    const data = await resp.json()
    dispatch(setDeviceTypes(data))
  } catch (e) {
    console.log(e)
  }
};

export default deviceTypesSlice.reducer;
