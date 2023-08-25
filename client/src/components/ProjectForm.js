// ProjectForm Component - Shows Model with Form Fields

import { Modal, Form, Input, message, Button } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../store/loader/loaderReducer";
import {
  createProjectAPICall,
  editProjectAPICall,
} from "../apiCalls/projectApiCall";
import formValidationHelper from "../utils/formValidatioHelper";

const ProjectForm = ({ show, setShow, fetchProjects, project }) => {
  // useRef hook for form
  const formRef = useRef(null);

  // Dispatch Hook
  const dispatch = useDispatch();

  // Getting users state from Redux Store
  const { user } = useSelector((state) => {
    return state.users;
  });

  // Handling Form Submit
  const formSubmitEve = async (values) => {
    try {
      if (project) {
        // Edit Project
        dispatch(setLoading(true)); // Calling "loading" action before doing API Call
        values._id = project._id; // Setting up the project ID before calling "editProjectAPICall"
        const editProjectResponse = await editProjectAPICall(values);
        if (editProjectResponse.status === "success") {
          dispatch(setLoading(false)); // Calling "loading" action
          message.success(editProjectResponse.message);
          fetchProjects(); // Calling "fetchProjects()" function from "Projects Page" after editing the current project
        } else {
          throw new Error(editProjectResponse.message);
        }
      } else {
        // Create Project
        // Addind additional fields for form values before calling "getProjectAPICall"
        values.owner = user._id;
        values.members = [
          {
            // Initially person who create project is the owner, so we are adding him as owner
            user: user._id,
            role: "Owner",
          },
        ];
        dispatch(setLoading(true)); // Calling "loading" action before doing API Call
        const getProjectAPICallResult = await createProjectAPICall(values);

        if (getProjectAPICallResult.status === "success") {
          dispatch(setLoading(false)); // Calling "loading" action
          message.success(getProjectAPICallResult.message); // message antD component
          fetchProjects(); // Calling "fetchProjects()" function from "Projects Page" after saving the current project
        } else {
          throw new Error(getProjectAPICallResult.message);
        }
      }
    } catch (err) {
      dispatch(setLoading(false)); // Calling "loading" action
      message.error(err.message); // message antD component
    }
  };

  // UI
  return (
    <Modal
      title={project ? "Edit Project" : "Add Project"}
      open={show}
      onCancel={() => {
        setShow(false);
      }}
      onOk={() => {
        formRef.current.submit();
        setShow(false);
      }}
      footer={
        <div>
          <Button onClick={() => setShow(false)}>Cancel</Button>
          <Button
            type="primary"
            onClick={() => {
              formRef.current.submit();
              setShow(false);
            }}
          >
            Create
          </Button>
        </div>
      }
      centered
      width={700}
    >
      <Form
        layout="vertical"
        ref={formRef}
        onFinish={formSubmitEve}
        initialValues={project}
      >
        <Form.Item
          label="Project Name"
          name="name"
          rules={formValidationHelper}
        >
          <Input placeholder="Project Name" />
        </Form.Item>
        <Form.Item
          label="Project Description"
          name="description"
          rules={formValidationHelper}
        >
          <TextArea placeholder="Project Description" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProjectForm;
