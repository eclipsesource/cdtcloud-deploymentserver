import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from '../reducers/DashboardReducer'
import deviceTypesReducer from '../reducers/DeviceTypesReducer'

export const store = configureStore({
  reducer: {
    //devices: devicesReducer,
    deviceTypes: deviceTypesReducer,
    //deployments: deploymentsReducer,
    dashboard: dashboardReducer
  }
});
