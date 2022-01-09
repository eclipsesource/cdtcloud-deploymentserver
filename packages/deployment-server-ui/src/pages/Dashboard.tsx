import { Divider } from "antd";
import RecentDeploymentList from "../components/Dashboard/RecentDeploymentList";
import defineFunctionalComponent from "../util/defineFunctionalComponent";

export default defineFunctionalComponent(function Dasboard() {
  return (
    <main>
      <h2> Dashboard </h2>
      <Divider />
      <RecentDeploymentList />
    </main>
  );
});
