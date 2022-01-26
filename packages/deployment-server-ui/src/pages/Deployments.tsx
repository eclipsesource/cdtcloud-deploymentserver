import defineFunctionalComponent from "../util/defineFunctionalComponent"
import RecentDeploymentList from "../components/Dashboard/RecentDeploymentList"
import { Result, Spin } from "antd"
import { useAppSelector } from "../app/hooks"
import React from "react"
import type { Dashboard } from "deployment-server"

import styles from "./Deployments.module.scss"

export default defineFunctionalComponent(function Deployments() {
  const dashboardState = useAppSelector((state) => state.dashboard)

  return (
    <main style={{height: "100%"}}>
      <h2>Deployments</h2>
      {dashboardState.loading && !dashboardState.error ?
        <div className={styles.loadouter}>
          <Spin tip={"Loading..."}/>
        </div>
        :
        dashboardState.error ?
          <Result
            status="error"
            title="Fetch Failed"
            subTitle="Please refresh the page or try again later."
          />
          :
          <RecentDeploymentList
            details
            data={dashboardState.data ? (dashboardState.data as Dashboard).recentDeployments : undefined}
          />
      }
    </main>
  )
})
