import React, { useState } from "react";
import EditTaskModal from "../EditTaskModal/page";
import axios from "axios";

export default function Page({
  task,
  userId,
  updateTasks,
  onEditButtonClick,
  onMoveUp,
  onMoveDown,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isContentExpanded, setIsContentExpanded] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const markAsDone = () => {
    console.log("markAsDone");
    axios
      .post("http://localhost:8002/api/markTaskAsDone", {
        taskId: task.id,
      })
      .then((res) => {
        updateTasks(res.data.updatedTask);
        onEditButtonClick();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleToggleContent = () => {
    setIsContentExpanded(!isContentExpanded);
  };

  const handleOpenEditModal = () => {
    axios
      .post("http://localhost:8002/api/getTaskUpdates", {
        userId: userId,
      })
      .then((res) => {
        setTasks(res.data.tasks);
      })
      .catch((err) => {
        console.log(err);
      });
    openModal();
  };

  return (
    <li
      className={`mb-4 "h-24 overflow-hidden"
      }`}
    >
      <div className="px-6 py-4 bg-white border rounded-lg shadow-md relative">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
            <p className=" text-sm text-gray-500 max-w-2xl">
              {task.description}
            </p>
          </div>
          <div className="cursor-pointer absolute top-0 right-0 mt-4 mr-2">
            <a onClick={onMoveUp}>▲</a>
            <a onClick={onMoveDown}>▼</a>
          </div>
        </div>
        <div className=" flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Status:{" "}
              <span
                className={`${
                  task.status === "Not Started"
                    ? "text-red-600"
                    : task.status === "In Progress"
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {task.status}
              </span>
            </p>
          </div>
          <div className="flex ml-5 justify-end items-end">
            <a
              className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer mr-4"
              onClick={openModal}
            >
              Edit
            </a>
            <a
              className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer mr-1"
              onClick={markAsDone}
            >
              Done
            </a>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <EditTaskModal
          userId={userId}
          task={task}
          tasks={tasks}
          closeModal={closeModal}
          updateTasks={updateTasks}
          onEditButtonClick={onEditButtonClick}
        />
      )}
    </li>
  );
}
