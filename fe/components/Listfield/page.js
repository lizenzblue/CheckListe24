import React, { useState, useEffect } from "react";
import Taskfield from "../Taskfield/page";
import CreateTaskModal from "../CreateTaskModal/page";
import axios from "axios";

export default function Page({ user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const updateTasks = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const handleCreateButtonClick = () => {
    // Fetch updated data immediately after creating a task
    axios
      .post("http://localhost:8002/api/getTasks", {
        userId: user.userId,
      })
      .then((res) => {
        setTasks(res.data.tasks);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (tasks.length === 0) {
      setTasks(user.tasks || []);
    } else {
      updateTasks();
    }
  }, [user.tasks]);

  return (
    <div className="flex items-center justify-center h-screen font-InterFont mx-auto">
      <div className="bg-white p-2 shadow-lg rounded-lg overflow-hidden max-w-md ">
        <div className="px-4 py-2">
          <h1 className="text-gray-800 pt-3 pl-3 font-bold text-2xl uppercase">
            To-Do List
          </h1>
        </div>
        <form className="w-full max-w-sm mx-auto px-4 py-2">
          <div className="flex items-center border-b-2 border-[#304dff] py-2">
            <button
              className="flex-shrink-0 bg-[#304dff] hover:bg-[#5a71ff] border-[#304dff] hover:border-[#5a71ff] text-sm border-4 text-white py-1 px-2 rounded"
              type="button"
              onClick={openModal}
            >
              Add
            </button>
          </div>
        </form>
        {tasks && tasks.length > 0 && (
          <div className="overflow-auto max-h-60">
            <ul className="bg-white shadow sm:rounded-md max-w-sm mx-auto mt-4">
              {tasks.map((task) => (
                <Taskfield key={task.id} task={task} />
              ))}
            </ul>
          </div>
        )}
      </div>
      {isModalOpen && (
        <CreateTaskModal
          closeModal={closeModal}
          userId={user.userId}
          updateTasks={updateTasks}
          onCreateButtonClick={handleCreateButtonClick}
        />
      )}
    </div>
  );
}
