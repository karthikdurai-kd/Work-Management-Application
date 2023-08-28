// This is User's Profile Page

import { Tabs } from "antd";
import Projects from "./Projects";
import General from "./General";

const Profile = () => {
  // Tab Contents
  const tabContents = [
    {
      key: "1",
      label: "Projects",
      children: <Projects />,
    },
    {
      key: "2",
      label: "General",
      children: <General />,
    },
  ];

  // UI
  return (
    <div>
      <Tabs defaultActiveKey="1" items={tabContents} />
    </div>
  );
};

export default Profile;
