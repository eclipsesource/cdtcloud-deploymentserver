import { Divider } from "antd";
import RecentDeployments from "../components/Dashboard/RecentDeployments";
import defineFunctionalComponent from "../util/defineFunctionalComponent";

export default defineFunctionalComponent(function Dasboard() {
  return (
    <main>
      <h2> Dashboard </h2>
      <Divider />
      <RecentDeployments />
    </main>
  );
});
