import React, { useState, useEffect } from "react";
import Taskfield from "../Taskfield/page";
import CreateTaskModal from "../CreateTaskModal/page";
import axios from "axios";

export default function Page({ user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = () => {
    axios
      .post("http://localhost:8002/api/getTaskUpdates", {
        userId: user.userId,
      })
      .then((res) => {
        setTasks(res.data.tasks);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const moveTaskUp = (index) => {
    if (index > 0) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index - 1]] = [
        updatedTasks[index - 1],
        updatedTasks[index],
      ];
      setTasks(updatedTasks);
    }
  };

  const moveTaskDown = (index) => {
    if (index < tasks.length - 1) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index + 1]] = [
        updatedTasks[index + 1],
        updatedTasks[index],
      ];
      setTasks(updatedTasks);
    }
  };

  const updateTasks = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const handleSubmitButtonClick = () => {
    getTasks();
  };

  useEffect(() => {
    if (tasks.length === 0) {
      setTasks(user.tasks || []);
    } else {
      updateTasks();
    }
  }, [user.tasks]);

  return (
    <div className="flex items-center justify-center font-InterFont mx-auto h-screen">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-screen-3xl ">
        <div className="flex items-center justify-between border-b-4 border-[#304dff] py-2">
          <form className="max-w-lg mx-1 ">
            <button
              className="flex-shrink-0 text-xl bg-[#304dff] hover:bg-[#5a71ff] border-[#304dff] hover:border-[#5a71ff] border-2 text-white px-2 rounded cursor-pointer items-right"
              type="button"
              onClick={openModal}
            >
              +
            </button>
          </form>
        </div>
        <div className="mt-1 mb-2"></div>
        {tasks && tasks.length > 0 && (
          <div className="overflow-auto ml-2 mb-3 mr-2 max-h-[31rem] flex">
            {" "}
            <ul className="bg-white shadow sm:rounded-md w-full mt-2">
              {tasks.map((task, index) =>
                task && task.id ? (
                  <Taskfield
                    key={task.id}
                    task={task}
                    userId={user.userId}
                    updateTasks={updateTasks}
                    onEditButtonClick={handleSubmitButtonClick}
                    onMoveUp={() => moveTaskUp(index)}
                    onMoveDown={() => moveTaskDown(index)}
                  />
                ) : (
                  console.log("Task not found")
                )
              )}
            </ul>
          </div>
        )}
      </div>
      {isModalOpen && (
        <CreateTaskModal
          closeModal={closeModal}
          userId={user.userId}
          updateTasks={updateTasks}
          onCreateButtonClick={handleSubmitButtonClick}
        />
      )}
    </div>
  );
}
