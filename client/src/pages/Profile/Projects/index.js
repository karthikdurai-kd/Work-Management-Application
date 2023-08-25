// This Project Form page present inside the Profile Page

import { Button, Table, message } from "antd";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProjectForm from "../../../components/ProjectForm";
import { setLoading } from "../../../store/loader/loaderReducer";
import {
  getProjectAPICall,
  deleteProjectAPICall,
} from "../../../apiCalls/projectApiCall";
import { dateFormatter } from "../../../utils/dateFormatter";

const Projects = () => {
  // Handling Modal State
  const [show, setShow] = useState(false);

  // Edit Selected project state
  const [editSelectedProject, setEditSelectedProject] = useState(null);

  // Dispatch hook
  const dispatch = useDispatch();

  // project state which has list of projects fetched from backend
  const [projects, setProjects] = useState(null);

  // Getting users state from redux store
  const { user } = useSelector((state) => {
    return state.users;
  });

  // Antd Table columns
  const tableColumns = [
    {
      title: "Name",
      dataIndex: "name", // this must match the Mongoose Model key
    },
    {
      title: "Description",
      dataIndex: "description", // this must match the Mongoose Model key
    },
    {
      title: "Status",
      dataIndex: "status", // this must match the Mongoose Model key,
      render: (text) => {
        return text.toUpperCase();
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt", // this must match the Mongoose Model key
      render: (text) => {
        return dateFormatter(text);
      },
    },
    {
      title: "Action",
      dateIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-5">
            <i
              className="delete-icon ri-delete-bin-line"
              onClick={() => {
                deleteProject(record._id);
              }}
            />
            <i
              className="edit-icon ri-pencil-line"
              onClick={() => {
                setEditSelectedProject(record); // Setting the "editSelectedProject" state after clicking edit button
                setShow(true);
              }}
            />
          </div>
        );
      },
    },
  ];

  // fetchProjects - this is used to fetch projects from backend
  const fetchProjects = async () => {
    try {
      dispatch(setLoading(true)); // setting loader redux state to true while doing API Call
      // Setting up filter - that is getting projects created by that particular owner
      const projectFilters = {
        owner: user?._id,
      };
      // getProjectAPICall - getting projects from backend
      const getProjectAPICallResult = await getProjectAPICall(projectFilters);

      if (getProjectAPICallResult.status === "success") {
        dispatch(setLoading(false)); // setting loader redux state to true while doing API Call
        setProjects(getProjectAPICallResult.data); // Saving the "getProjectAPICall" results into "project" state of this component
      } else {
        throw new Error(getProjectAPICallResult.message);
      }
    } catch (err) {
      dispatch(setLoading(false));
      message.error(err.message);
    }
  };

  // Delete Project
  const deleteProject = async (projectID) => {
    try {
      dispatch(setLoading(true));
      const deleteProjectAPIResponse = await deleteProjectAPICall(projectID);
      if (deleteProjectAPIResponse.status === "success") {
        dispatch(setLoading(false));
        message.success(deleteProjectAPIResponse.message);
        fetchProjects(); // Fetching the project from servr after deleting the current project
      } else {
        throw new Error(deleteProjectAPIResponse.message);
      }
    } catch (err) {
      dispatch(setLoading(false));
      message.error(err.message);
    }
  };

  // useEffect hook
  useEffect(() => {
    fetchProjects();
  }, []);

  // UI
  return (
    <div>
      <div className="flex justify-end">
        <Button
          type="default"
          onClick={() => {
            setEditSelectedProject(null);
            setShow(true);
          }}
        >
          Add Project
        </Button>
      </div>
      {/* Project Table */}
      <Table className="mt-4" columns={tableColumns} dataSource={projects} />
      {show && (
        <ProjectForm
          show={show}
          setShow={setShow}
          fetchProjects={fetchProjects}
          project={editSelectedProject}
        />
      )}
    </div>
  );
};

export default Projects;
