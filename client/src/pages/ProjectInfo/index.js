// Project Info Page

import { useParams } from "react-router-dom";
import { getProjectByIDAPICall } from "../../apiCalls/projectApiCall";
import { useEffect, useState } from "react";
import { Tabs, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Tasks from "../ProjectInfo/Tasks";
import Members from "../ProjectInfo/Members";
import { setLoading } from "../../store/loader/loaderReducer";
import { dateFormatter } from "../../utils/dateFormatter";

const ProjectInfo = () => {
  // useParams hook
  const params = useParams();

  // Current user role
  const [currentUserRole, setCurrentUserRole] = useState("");

  // useDispatch hook
  const dispatch = useDispatch();

  // Getting project id from url using "useParams" hook
  const projectID = params.id;

  // Project state
  const [project, setProject] = useState(null);

  // Logged In user state
  const { user } = useSelector((state) => {
    return state.users;
  });

  // fetchProject
  const fetchProject = async () => {
    try {
      dispatch(setLoading(true)); // Calling "setLoading" action to load spinner component
      const fetchProjectAPIResponse = await getProjectByIDAPICall(projectID);

      if (fetchProjectAPIResponse.status === "success") {
        setProject(fetchProjectAPIResponse.data);
        // Getting logged in user role
        const currentUser = fetchProjectAPIResponse.data.members.find(
          (member) => {
            return member.user._id === user._id;
          }
        );
        setCurrentUserRole(currentUser.role);
        dispatch(setLoading(false)); // Calling "setLoading" action to close spinner component
      } else {
        throw new Error(fetchProjectAPIResponse.message);
      }
    } catch (err) {
      dispatch(setLoading(false)); // Calling "setLoading" action to close spinner component
      message.error(err.message);
    }
  };

  // useEffect hook
  useEffect(() => {
    // calling fetchProject function
    fetchProject();
  }, []);

  // TabPane items
  const tabItems = [
    { label: "Tasks", key: "1", children: <Tasks project={project} /> },
    {
      label: "Members",
      key: "2",
      children: <Members project={project} fetchProject={fetchProject} />,
    },
  ];

  // UI
  return (
    project && (
      <div>
        {/* Project Description Data Div*/}
        <div className="flex justify-between">
          <div>
            <h1 className="text-primary text-2xl font-semibold uppercase mb-2">
              {project.name}
            </h1>
            <span className="text-gray-600 text-sm">{project.description}</span>
          </div>

          <div>
            <div className="flex gap-5 mt-5">
              <span className="text-gray-600 text-sm font-semibold">
                Created At
              </span>
              <span className="text-gray-600 text-sm">
                {dateFormatter(project.createdAt)}
              </span>
            </div>
            <div className="flex gap-5">
              <span className="text-gray-600 text-sm font-semibold">
                Created By
              </span>
              <span className="text-gray-600 text-sm">
                {project.owner.firstName} {project.owner.lastName}
              </span>
            </div>
            <div
              className="flex gap-12
            "
            >
              <span className="text-gray-600 text-sm font-semibold w-12">
                Role
              </span>
              <span className="text-gray-600 text-sm">{currentUserRole}</span>
            </div>
          </div>
        </div>

        {/* Tabs Div */}
        <div className="mt-5">
          <Tabs defaultActiveKey="1" items={tabItems} />
        </div>
      </div>
    )
  );
};

export default ProjectInfo;
