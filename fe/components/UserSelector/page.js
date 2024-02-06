import { useState, useEffect, useRef } from "react";
import React from "react";

export default function Page({
  options,
  handleUserSelect,
  removeUser,
  userId,
  selectedUsersInsert,
}) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (selectedUsersInsert) {
      setSelectedUsers(selectedUsersInsert);
    }
  }, [selectedUsersInsert]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (event, option) => {
    event.stopPropagation();
    if (!selectedUsers.find((user) => user.id === option.id)) {
      setSelectedUsers([...selectedUsers, option]);
      handleUserSelect(option);
    }
  };

  const handleRemoveUser = (userId) => {
    const updatedUsers = selectedUsers.filter((user) => user.id !== userId);
    setSelectedUsers(updatedUsers);
    removeUser(userId);
  };

  const filteredOptions =
    options?.users?.filter(
      (option) => !selectedUsers.find((user) => user.id === option.id)
    ) || [];

  return (
    <div
      className="mt-4 relative w-full border p-2 rounded mb-4"
      ref={dropdownRef}
    >
      <div onClick={toggleDropdown} className="cursor-pointer">
        {selectedUsers.length > 0
          ? selectedUsers.map((user) => (
              <span
                key={user.id}
                className="bg-[#304dff] text-white p-2 rounded m-1"
              >
                {user.username}
                <button
                  onClick={() => handleRemoveUser(user.id)}
                  className="ml-2 text-sm font-semibold focus:outline-none"
                >
                  X
                </button>
              </span>
            ))
          : `Select Users to Assign`}
      </div>
      {isDropdownOpen && (
        <div className="absolute w-full mt-2 bg-white rounded-md shadow-lg z-10 overflow-y-auto max-h-40">
          {filteredOptions.map((option) => (
            <div
              key={option.id}
              onClick={(event) => handleOptionClick(event, option)}
              className="cursor-pointer p-2 hover:bg-[#5a71ff]"
            >
              {option.username}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
