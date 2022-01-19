import defineFunctionalComponent from "../util/defineFunctionalComponent";
import RecentDeploymentList from "../components/Dashboard/RecentDeploymentList";
import { Typography } from "antd";

export default defineFunctionalComponent(function Deployments() {
  return (
    <main>
      <h2>Deployments</h2>
      <Typography>To be replaced with full list of recent deployments</Typography>
      <RecentDeploymentList/>
    </main>
  );
});
