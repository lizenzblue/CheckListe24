import React, { useState, useEffect } from "react";
import axios from "axios";
import Selector from "../Selector/page";
import UserSelector from "../UserSelector/page";

export default function Page({
  task,
  tasks,
  userId,
  closeModal,
  updateTasks,
  onEditButtonClick,
}) {
  const [users, setUsers] = useState([]);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);
  const [selectedUsers, setSelectedUsers] = useState(task.users);
  const [taskName, setTaskName] = useState(task.title);

  const handleTaskNameChange = (e) => setTaskName(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleUserSelect = (user) => setSelectedUsers([...selectedUsers, user]);
  const removeUser = (userId) =>
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
  const handleStatusChange = (e) => setStatus(e);

  const handleOkClick = () => {
    const updatedTask = {
      taskId: task.id,
      userId,
      taskName,
      description,
      status,
      users: selectedUsers,
    };

    axios
      .post("http://localhost:8002/api/updateTask", updatedTask)
      .then((res) => {
        updateTasks(res.data.createdTask);
        closeModal();
        onEditButtonClick();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteClick = () => {
    axios
      .post("http://localhost:8002/api/deleteTask", {
        taskId: task.id,
      })
      .then((res) => {
        updateTasks(res.data.deletedTask);
        closeModal();
        onEditButtonClick();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:8002/api/getUsersForForm")
      .then((response) => {
        setUsers(removeLoggedInUser(response.data));
      })
      .catch((err) => console.log(err));
  }, [userId]);

  const removeLoggedInUser = (response) => {
    return response.users.filter((user) => user.id !== userId);
  };

  return (
    <div className="fixed z-20 inset-0 mt-20 font-InterFont">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={closeModal}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className="inline-block align-bottom bg-white w-1/2 mx-auto p-4 rounded-md shadow-lg transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <h1 className="text-2xl font-bold text-black mb-4">Create Task</h1>

          <input
            type="text"
            onChange={handleTaskNameChange}
            placeholder="Task Name"
            value={taskName}
            className="w-full border p-2 rounded mb-4"
          />
          <input
            type="text"
            placeholder="Description"
            className="w-full border p-2 rounded mb-4"
            onChange={handleDescriptionChange}
            value={description}
          />

          <Selector
            chooseWhat={"Status"}
            options={["Not Started", "In Progress", "Completed"]}
            handleStatusChange={handleStatusChange}
            insertSelectedUStaus={task.status}
          />
          <UserSelector
            options={users}
            handleUserSelect={handleUserSelect}
            removeUser={removeUser}
            userId={userId}
            selectedUsersInsert={selectedUsers}
          />
          <div className="text-right mt-1">
            <button
              onClick={handleDeleteClick}
              className="inline-block bg-[#ff4235] hover:bg-[#ff4335] py-2 px-4 text-white rounded-md font-semibold uppercase text-sm mr-2"
            >
              Delete
            </button>
            <button
              onClick={handleOkClick}
              className="inline-block bg-[#304dff] py-2 px-4 text-white rounded-md font-semibold uppercase text-sm"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
