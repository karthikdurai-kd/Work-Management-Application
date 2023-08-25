// Add Member Form Component

import { useRef } from "react";
import { Form, Input, Modal, Select, message } from "antd";
import { addProjectMemberAPICall } from "../apiCalls/projectApiCall";
import { useDispatch } from "react-redux";
import { setLoading } from "../store/loader/loaderReducer";
import formValidationHelper from "../utils/formValidatioHelper";

const AddMemberForm = ({
  addMemberForm,
  setAddMemberForm,
  fetchProject,
  project,
}) => {
  // useRef hook for creating form reference
  const formRef = useRef(null);

  // useDispatch hook
  const dispatch = useDispatch();

  // Form Submit event
  const formSubmitEvent = async (values) => {
    try {
      // Check if member is already added in the current project by checking email ID
      const checkMember = project.members.find((member) => {
        return member.user.email === values.email;
      });
      if (checkMember) {
        throw new Error("Member already exists in the project");
      } else {
        dispatch(setLoading(true)); // Calling "setLoading" action in loader reducer in redux store
        // Call addProjectMemberAPICall to add project member in the database
        const addProjectMemberAPICallResponse = await addProjectMemberAPICall({
          memberEmailID: values.email,
          memberRole: values.role,
          projectID: project._id,
        });
        if (addProjectMemberAPICallResponse.status === "success") {
          dispatch(setLoading(false)); // Calling "setLoading" action in loader reducer in redux store
          message.success(addProjectMemberAPICallResponse.message);
          fetchProject(); // Reloading the data in "Members" page to get the new added project member
          setAddMemberForm(false); // closing the model
        } else {
          throw new Error(addProjectMemberAPICallResponse.message);
        }
      }
    } catch (err) {
      dispatch(setLoading(false)); // Calling "setLoading" action in loader reducer in redux store
      message.error(err.message);
    }
  };

  // UI
  return (
    <Modal
      title="Add Member"
      open={addMemberForm}
      onCancel={() => {
        setAddMemberForm(false);
      }}
      okText="Add Memeber"
      onOk={() => {
        formRef.current.submit(); // Clicking "Ok" button model will submit the form
      }}
      centered
    >
      <Form layout="vertical" ref={formRef} onFinish={formSubmitEvent}>
        <Form.Item label="Email" name="email" rules={formValidationHelper}>
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item label="Role" name="role" rules={formValidationHelper}>
          <Select placeholder="Select Role" className="custom-select">
            <Select.Option value="Admin">Admin</Select.Option>
            <Select.Option value="Employee">Employee</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddMemberForm;
