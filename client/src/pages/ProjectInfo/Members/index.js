// Memebers page

import { Button, Select, Table, message } from "antd";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AddMemberForm from "../../../components/AddMemberForm";
import { setLoading } from "../../../store/loader/loaderReducer";
import { deleteProjectMemberAPICall } from "../../../apiCalls/projectApiCall";

const Members = ({ project, fetchProject }) => {
  // Add Member form state data
  const [addMemberForm, setAddMemberForm] = useState(false);

  // Members filter
  const [member, setMember] = useState("All");

  // handleAddMemberButtonEvent function
  const handleAddMemberButtonEvent = () => {
    setAddMemberForm(true);
  };

  // useDispatch hook
  const dispatch = useDispatch();

  // useSelector hook
  const { user } = useSelector((state) => {
    return state.users;
  });

  // Checking if current user is owner or not
  const isOwner = project.owner._id === user._id;

  // Handling Remove Member button event
  const handleRemoveMemberButtonEvent = async (memberID) => {
    try {
      dispatch(setLoading(true)); // Calling "setLoading" action in redux store
      const deleteProjectMemberAPICallResponse =
        await deleteProjectMemberAPICall({
          projectID: project._id,
          memberID,
        });
      if (deleteProjectMemberAPICallResponse.status === "success") {
        message.success(deleteProjectMemberAPICallResponse.message);
        fetchProject(); // After deleting the project member , calling "fetchProject()" function in "Project Info page"
        dispatch(setLoading(false));
      } else {
        throw new Error(deleteProjectMemberAPICallResponse.message);
      }
    } catch (err) {
      message.error(err.message);
      dispatch(setLoading(false));
    }
  };

  // Project Members list table columns
  const projectMembersTableColumns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      render: (text, record) => {
        return record.user.firstName;
      },
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      render: (text, record) => {
        return record.user.lastName;
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text, record) => {
        return record.user.email;
      },
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (text, record) => {
        return record.role.toUpperCase();
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <Button
            type="primary"
            danger
            onClick={() => {
              handleRemoveMemberButtonEvent(record._id);
            }}
          >
            {" "}
            Remove
          </Button>
        );
      },
    },
  ];

  // Removing "Action" column in table if the user is not owner
  if (!isOwner) {
    projectMembersTableColumns.pop();
  }

  // UI
  return (
    <div>
      <div className="flex justify-between">
        <div className="flex flex-col w-48">
          <span>Members</span>
          <Select
            className="custom-select"
            value={member}
            onChange={(value) => {
              setMember(value);
            }}
            options={[
              {
                label: "All",
                value: "All",
              },
              {
                label: "Owner",
                value: "Owner",
              },
              {
                label: "Admin",
                value: "Admin",
              },
              {
                label: "Employee",
                value: "Employee",
              },
            ]}
          />
        </div>
        <div className="flex items-end">
          {isOwner && (
            <Button className="primary" onClick={handleAddMemberButtonEvent}>
              Add Member
            </Button>
          )}
        </div>
      </div>

      <Table
        columns={projectMembersTableColumns}
        dataSource={project.members.filter((m) => {
          if (member === "All") {
            return true;
          } else {
            return m.role === member;
          }
        })}
        className="mt-6"
      />
      {addMemberForm && (
        <AddMemberForm
          addMemberForm={addMemberForm}
          setAddMemberForm={setAddMemberForm}
          fetchProject={fetchProject}
          project={project}
        />
      )}
    </div>
  );
};

export default Members;
