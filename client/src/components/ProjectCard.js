// This is Card Component

import { Card } from "antd";
import { useNavigate } from "react-router-dom";
import { dateFormatter } from "../utils/dateFormatter";
import Divider from "./Divider";

const ProjectCard = ({ data }) => {
  // Navigator hook
  const navigate = useNavigate();

  // UI
  return (
    <Card
      title={data.name}
      className="border-solid border-gray-300 cursor-pointer"
      onClick={() => {
        navigate(`/project/${data._id}`);
      }}
    >
      {/* Card Contents */}
      <div className="flex justify-between">
        <span className="text-gray-600 text-sm font-semibold">Created At</span>
        <span className="text-gray-600 text-sm">
          {dateFormatter(data.createdAt)}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-600 text-sm font-semibold">Owner</span>
        <span className="text-gray-600 text-sm">{data.owner.firstName}</span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-600 text-sm font-semibold">Status</span>
        <span className="text-gray-600 text-sm uppercase">{data.status}</span>
      </div>
    </Card>
  );
};

export default ProjectCard;
