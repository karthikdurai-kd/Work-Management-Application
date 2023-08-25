// Register Page

import { useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import formValidationHelper from "../../utils/formValidatioHelper";
import { userRegisterAPI } from "../../apiCalls/userApiCall";

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm(); // Getting an array of values from "Form.useForm()" of Antd Form and destructuring
  // Form Submit Event Listener
  const formSubmitEvent = async (values) => {
    try {
      const userRegisterAPIResponse = await userRegisterAPI(values);
      if (userRegisterAPIResponse.status === "success") {
        // Calling "message antd component success"
        message.success(userRegisterAPIResponse.message);
        form.resetFields(); // Reseting Form values
      } else {
        throw new Error(userRegisterAPIResponse.message);
      }
    } catch (err) {
      // Calling "message antd component failure"
      message.error(err.message);
      form.resetFields(); // Reseting Form values
    }
  };

  useEffect(() => {
    // If there is token already saved in localStorage, then navigate directly to home page
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  });

  // UI
  return (
    <div className="grid grid-cols-2">
      <div className="bg-primary h-screen flex flex-col justify-center items-center">
        <h1 className="text-5xl text-white">Work Management Software</h1>
      </div>
      {/* justify-center -> Centers horizontally, items-center -> centers vertically */}
      <div className="flex justify-center items-center">
        <div className="w-[500px]">
          <h1 className="text-gray-700 text-1xl">REGISTER TO YOUR ACCOUNT</h1>
          {/* <Divider /> */}
          {/* Antd Form Component */}
          <Form form={form} onFinish={formSubmitEvent} layout="vertical">
            <Form.Item
              label="First Name"
              name="firstName"
              rules={formValidationHelper}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={formValidationHelper}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={formValidationHelper}>
              <Input />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={formValidationHelper}
            >
              <Input type="password" />
            </Form.Item>
            <Button type="default" htmlType="submit" block>
              Register
            </Button>
            <div className="flex justify-center mt-5">
              <span className>
                Already have an account? <Link to="/login">Login</Link>
              </span>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Register;
