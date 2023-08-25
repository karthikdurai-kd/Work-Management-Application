// AddTaskForm component

import { Button, Form, Input, Modal, message } from "antd";
import { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import TextArea from "antd/es/input/TextArea";
import formValidatioHelper from "../utils/formValidatioHelper";
import { createTaskAPICall, updateTaskAPICall } from "../apiCalls/taskApiCall";
import { setLoading } from "../store/loader/loaderReducer";
import { addNotificationAPICall } from "../apiCalls/notificationAPICall";

const AddTaskForm = ({
  showTaskForm,
  setShowTaskForm,
  project,
  task,
  reloadData,
  taskViewerRole,
}) => {
  // useRef hook for form
  const formRef = useRef(null);

  // useSelector hook
  const { user } = useSelector((state) => {
    return state.users;
  });

  // useDispatch hook
  const dispatch = useDispatch();

  // Email state data
  const [email, setEmail] = useState(null);

  // Validate Email
  const validateEmail = (values) => {
    // Getting list of employees in the project
    const projectEmployees = project.members.filter((data) => {
      return data.role === "Employee";
    });
    // Checking if the email ID of employee entered by the user in the employee List of the project
    const isEmailValid = projectEmployees.find((data) => {
      return data.user.email === values.assignedTo;
    });
    return isEmailValid;
  };

  // Form submit event
  const handleAddTaskFormSubmit = async (values) => {
    try {
      let response = null;
      let assignedToUserID = "";
      let assignedByUserID = "";
      if (task) {
        response = await updateTaskAPICall({
          ...values,
          project: project._id,
          assignedTo: task.assignedTo._id,
          assignedBy: task.assignedBy._id,
          _id: task._id,
        });
      } else {
        // Add Task
        // Validating task member present in that particular project or not
        const isMemberEmailValid = validateEmail(values);
        if (!isMemberEmailValid) {
          throw new Error("Employee does not exists");
        } else {
          dispatch(setLoading(true));
          const assignedToUser = project.members.find((data) => {
            return data.user.email === email;
          });
          // Step-2: Get the task member userID
          assignedToUserID = assignedToUser.user._id;
          // Step-3: GEt the taskAssigned person's userID
          assignedByUserID = user?._id;
          // Call the API
          response = await createTaskAPICall({
            ...values,
            project: project._id,
            assignedTo: assignedToUserID,
            assignedBy: assignedByUserID,
          });
        }
      }
      if (response.status === "success") {
        message.success(response.message);
        if (!task) {
          // Adding notification while opening "Add Task Model is opened"
          await addNotificationAPICall({
            user: assignedToUserID,
            title: "New task created",
            description: `Task is created for you in Project ${project.name}`,
            onClick: `/project/${project._id}`,
          });
        }
        dispatch(setLoading(false));
        setShowTaskForm(false); // Closing the model
        reloadData(); // Calling "reloadData" method in Tasks page
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      message.error(err.message);
      dispatch(setLoading(false));
    }
  };

  // Validate email
  const setEmailDataEvent = (event) => {
    setEmail(event.target.value);
  };

  // UI
  return (
    <Modal
      title={task ? "EDIT TASK" : "ADD TASK"}
      open={showTaskForm}
      onCancel={() => {
        setShowTaskForm(false);
      }}
      onOk={() => {
        if (taskViewerRole === "Employee") {
          setShowTaskForm(false);
        } else {
          formRef.current.submit();
        }
      }}
      footer={
        taskViewerRole === "Employee" ? null : (
          <div>
            <Button onClick={() => setShowTaskForm(false)}>Cancel</Button>
            <Button type="primary" onClick={() => formRef.current.submit()}>
              {task ? "Update" : "Create"}
            </Button>
          </div>
        )
      }
      centered
    >
      <Form
        layout="vertical"
        ref={formRef}
        onFinish={handleAddTaskFormSubmit}
        initialValues={{
          ...task,
          assignedTo: task ? task.assignedTo.email : "",
        }}
      >
        <Form.Item label="Task Name" name="name" rules={formValidatioHelper}>
          <Input disabled={taskViewerRole === "Employee" ? true : false} />
        </Form.Item>
        <Form.Item
          label="Task Description"
          name="description"
          rules={formValidatioHelper}
        >
          <TextArea disabled={taskViewerRole === "Employee" ? true : false} />
        </Form.Item>
        <Form.Item
          label="Assign To"
          name="assignedTo"
          rules={formValidatioHelper}
        >
          <Input onChange={setEmailDataEvent} disabled={task ? true : false} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTaskForm;
