// User General Page View

import { useSelector } from "react-redux";
import { Descriptions } from "antd";
import { dateFormatterWithoutTime } from "../../../utils/dateFormatter";

const General = () => {
  // useSelector hook
  const { user } = useSelector((state) => {
    return state.users;
  });

  // Description AntD component data
  const descriptonsData = [
    {
      key: "1",
      label: "First Name",
      children: user.firstName,
    },
    {
      key: "2",
      label: "Last Name",
      children: user.lastName,
      span: 2,
    },
    {
      key: "3",
      label: "Email",
      children: user.email,
    },
    {
      key: 4,
      label: "User Profile created on",
      children: dateFormatterWithoutTime(user.createdAt),
    },
  ];

  return (
    <div>
      <Descriptions
        title="User Info"
        bordered
        items={descriptonsData}
        layout="horizontal"
      />
    </div>
  );
};

export default General;
