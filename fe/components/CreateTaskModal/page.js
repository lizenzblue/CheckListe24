import React, { useState, useEffect } from "react";
import Selector from "../Selector/page";
import UserSelector from "../UserSelector/page";
import axios from "axios";

export default function Page({
  closeModal,
  userId,
  updateTasks,
  onCreateButtonClick,
}) {
  const [users, setUsers] = useState([]);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Not Started");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [taskName, setTaskName] = useState("");

  const handleTaskNameChange = (e) => setTaskName(e);
  const handleUserSelect = (user) => setSelectedUsers([...selectedUsers, user]);
  const removeUser = (userId) => {
    const updatedUsers = selectedUsers.filter((user) => user.id !== userId);
    setSelectedUsers(updatedUsers);
  };
  const handleStatusChange = (e) => setStatus(e);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  const removeLoggedInUser = (response) => {
    console.log(response.users);
    for (let i = 0; i < response.users.length; i++) {
      if (response.users[i].id === userId) {
        response.users.splice(i, 1);
      }
    }
    return response;
  };

  useEffect(() => {
    axios
      .get("http://localhost:8002/api/getUsersForForm")
      .then((response) => {
        setUsers(response.data.users);
      })
      .catch((err) => console.log(err));
  }, [userId]);

  const handleOkClick = () => {
    axios
      .post("http://localhost:8002/api/createTask", {
        userId,
        taskName,
        description,
        status,
        users: selectedUsers,
      })
      .then((res) => {
        updateTasks(res.data.createdTask);
        closeModal();
        onCreateButtonClick();
      })
      .catch((err) => {
        console.log(err);
      });
    closeModal();
  };

  return (
    <div className="fixed z-20 inset-0  mt-20 font-InterFont">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={closeModal}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className="inline-block align-bottom bg-white w-1/2 mx-auto p-4 rounded-md shadow-lg transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <h1 className="text-2xl font-bold text-black mb-4">Create Task</h1>
          <input
            type="text"
            onChange={(e) => handleTaskNameChange(e.target.value)}
            placeholder="Task Name"
            className="w-full border p-2 rounded mb-4"
          />
          <input
            type="text"
            placeholder="Description"
            className="w-full border p-2 rounded mb-4"
            onChange={handleDescriptionChange}
          />
          <Selector
            chooseWhat={"Status"}
            options={["Not Started", "In Progress", "Completed"]}
            handleStatusChange={handleStatusChange}
          />
          <UserSelector
            options={users}
            handleUserSelect={handleUserSelect}
            removeUser={removeUser}
            userId={userId}
          />
          <div className="text-right mt-1">
            <button
              onClick={handleOkClick}
              className="inline-block bg-[#304dff] py-2 px-4 text-white rounded-md font-semibold uppercase text-sm"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
