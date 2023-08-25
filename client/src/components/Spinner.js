// Spinner component for showing loading icon while making API Calls

import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);
const Spinner = () => {
  // UI
  return (
    // "fixed - denotes it must take entire screen size", "inset-0 denoted matrgin 0 all four sides"
    <div className="fixed inset-0 bg-black opacity-70 flex justify-center items-center z-[9999]">
      <Spin className="text-white" indicator={antIcon} />
    </div>
  );
};
export default Spinner;
