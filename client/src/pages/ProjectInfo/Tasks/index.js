// Tasks Page

import { Button, Select, Table, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddTaskForm from "../../../components/AddTaskForm";
import { setLoading } from "../../../store/loader/loaderReducer";
import {
  getTasksAPICall,
  deleteTaskAPICall,
  updateTaskAPICall,
} from "../../../apiCalls/taskApiCall";
import { addNotificationAPICall } from "../../../apiCalls/notificationAPICall";
import { dateFormatter } from "../../../utils/dateFormatter";

const Tasks = ({ project }) => {
  // Task Filters
  const [filter, setFilter] = useState({
    status: "All",
    assignedTo: "All",
    assignedBy: "All",
  });

  // Assigned To filter option
  const assignedByFilterOption = project.members
    .filter((member) => {
      return member.role === "Owner" || member.role === "Admin";
    })
    .map((data) => {
      return {
        label: data.user.firstName + " " + data.user.lastName,
        value: data.user._id,
      };
    });

  // Assigned To filter option
  const assignedToFilterOption = project.members
    .filter((member) => {
      return member.role === "Employee";
    })
    .map((data) => {
      return {
        label: data.user.firstName + " " + data.user.lastName,
        value: data.user._id,
      };
    });

  // showAddTaskForm state data
  const [showTaskForm, setShowTaskForm] = useState(false);

  // Task Viewer Role
  const [taskViewerRole, setTaskViewerRole] = useState("");

  // Task State data
  const [task, setTask] = useState(null);

  // useDispatch hook
  const dispatch = useDispatch();

  // Getting user redux store data
  const { user } = useSelector((state) => {
    return state.users;
  });

  // Checking if the user's role [Owner, Admin, Employee]
  const isEmployee = project.members.find((member) => {
    return member.user._id === user._id && member.role === "Employee";
  });

  // Tasks state data
  const [tasks, setTasks] = useState([]);

  // getTasks function
  const getTasksData = async () => {
    try {
      dispatch(setLoading(true)); // Calling setLoading redux action
      const getTasksAPICallResponse = await getTasksAPICall({
        filters: {
          project: project._id,
          ...filter,
        },
      });
      if (getTasksAPICallResponse.status === "success") {
        dispatch(setLoading(false));
        setTasks(getTasksAPICallResponse.data);
      } else {
        throw new Error(getTasksAPICallResponse.message);
      }
    } catch (err) {
      message.error(err.message);
      dispatch(setLoading(false));
    }
  };

  // Delete Task button handle event
  const handleDeleteTaskButtonEvent = async (taskID) => {
    try {
      dispatch(setLoading(true));
      const deleteTaskAPICallResponse = await deleteTaskAPICall({ taskID });
      if (deleteTaskAPICallResponse.status === "success") {
        message.success(deleteTaskAPICallResponse.message);
        getTasksData(); // Getting the updated data after deleting current data
        dispatch(setLoading(false));
      } else {
        throw new Error(deleteTaskAPICallResponse.message);
      }
    } catch (err) {
      message.error(err.message);
      dispatch(setLoading(false));
    }
  };

  // handleStatusChange event
  const handleStatusChange = async (value, record) => {
    try {
      dispatch(setLoading(true));
      const updateTaskAPICallResponse = await updateTaskAPICall({
        ...record,
        _id: record._id,
        status: value,
      });
      if (updateTaskAPICallResponse.status === "success") {
        message.success("Task Status updated successfully");
        addNotificationAPICall({
          user: record.assignedBy._id,
          title: record.name,
          description:
            record.description +
            ` status changed from ${record.status} to ${value}`,
          onClick: `/project/${project._id}`,
        });
        dispatch(setLoading(false));
      } else {
        throw new Error(updateTaskAPICallResponse.message);
      }
    } catch (err) {
      message.error(err.message);
      dispatch(setLoading(false));
    }
  };

  // Task Table columns
  const taskTableNotEmployeeColumns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Assigned To",
      dataIndex: "assignedTo",
      render: (text, record) => {
        return record.assignedTo.firstName;
      },
    },
    {
      title: "Assigned By",
      dataIndex: "assignedBy",
      render: (text, record) => {
        return record.assignedBy.firstName;
      },
    },
    {
      title: "Assigned On",
      dataIndex: "createdAt",
      render: (text, record) => {
        return dateFormatter(text);
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => {
        return (
          <Select
            className="custom-select"
            style={{ width: 120 }}
            defaultValue={record.status}
            options={[
              { value: "Pending", label: "Pending" },
              { value: "In Progress", label: "In Progress" },
              { value: "Completed", label: "Completed" },
              { value: "Closed", label: "Closed" },
            ]}
            onChange={(value) => {
              handleStatusChange(value, record);
            }}
          ></Select>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-2">
            <Button
              className="primary"
              onClick={() => {
                setTask(record); // Saving the clikced task into "task state"
                setShowTaskForm(true); // Opening the task model
                setTaskViewerRole("Not Employee"); // Setting Task Viewer Role
              }}
            >
              Edit
            </Button>
            {!isEmployee && (
              <Button
                type="primary"
                danger
                onClick={() => {
                  handleDeleteTaskButtonEvent(record._id);
                }}
              >
                Delete
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const taskTableEmployeeColumns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Assigned To",
      dataIndex: "assignedTo",
      render: (text, record) => {
        return record.assignedTo.firstName;
      },
    },
    {
      title: "Assigned By",
      dataIndex: "assignedBy",
      render: (text, record) => {
        return record.assignedBy.firstName;
      },
    },
    {
      title: "Assigned On",
      dataIndex: "createdAt",
      render: (text, record) => {
        return dateFormatter(text);
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => {
        return (
          <Select
            className="custom-select"
            disabled={user._id !== record.assignedTo.id ? true : false}
            style={{ width: 120 }}
            defaultValue={record.status}
            options={[
              { value: "Pending", label: "Pending" },
              { value: "In Progress", label: "In Progress" },
              { value: "Completed", label: "Completed" },
              { value: "Closed", label: "Closed" },
            ]}
            onChange={(value) => {
              handleStatusChange(value, record);
            }}
          ></Select>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-2">
            <Button
              className="primary"
              onClick={() => {
                setTask(record); // Saving the clikced task into "task state"
                setShowTaskForm(true); // Opening the task model
                setTaskViewerRole("Employee"); // Setting Task Viewer Role
              }}
            >
              View Task
            </Button>
          </div>
        );
      },
    },
  ];

  // useEffect hook
  useEffect(() => {
    getTasksData();
  }, []);

  useEffect(() => {
    getTasksData();
  }, [filter]);

  // UI
  return (
    <div>
      <div className="flex justify-between">
        <div className="flex flex-row gap-5">
          <div className="flex flex-col">
            <span>Status</span>
            <Select
              className="custom-select"
              value={filter.status}
              style={{
                width: 120,
              }}
              onChange={(value) => {
                setFilter({
                  ...filter,
                  status: value,
                });
              }}
              options={[
                {
                  value: "All",
                  label: "All",
                },
                {
                  value: "Pending",
                  label: "Pending",
                },
                {
                  value: "In Progress",
                  label: "In Progress",
                },
                {
                  value: "Completed",
                  label: "Completed",
                },
              ]}
            />
          </div>
          <div className="flex flex-col">
            <span>Assigned By</span>
            <Select
              className="custom-select"
              value={filter.assignedBy}
              style={{
                width: 130,
              }}
              options={assignedByFilterOption}
              onChange={(value) => {
                setFilter({
                  ...filter,
                  assignedBy: value,
                });
              }}
            />
          </div>
          <div className="flex flex-col">
            <span>Assigned To</span>
            <Select
              className="custom-select"
              value={filter.assignedTo}
              style={{
                width: 130,
              }}
              options={assignedToFilterOption}
              onChange={(value) => {
                setFilter({
                  ...filter,
                  assignedTo: value,
                });
              }}
            />
          </div>
        </div>
        <div className="flex items-end">
          {!isEmployee && (
            <Button
              className="primary"
              onClick={() => {
                setTask(null);
                setShowTaskForm(true);
              }}
            >
              Add Tasks
            </Button>
          )}
        </div>
      </div>

      {/* Task Table */}
      <Table
        dataSource={tasks}
        columns={
          isEmployee ? taskTableEmployeeColumns : taskTableNotEmployeeColumns
        }
        className="mt-6"
      />
      {/* AddTask Form Component */}
      {showTaskForm && (
        <AddTaskForm
          showTaskForm={showTaskForm}
          setShowTaskForm={setShowTaskForm}
          project={project}
          reloadData={getTasksData}
          task={task}
          taskViewerRole={taskViewerRole}
        />
      )}
    </div>
  );
};

export default Tasks;
