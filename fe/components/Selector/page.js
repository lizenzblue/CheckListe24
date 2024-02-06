import React, { useState, useEffect } from "react";

export default function Page({
  chooseWhat,
  options,
  handleStatusChange,
  insertSelectedUStaus,
}) {
  const [selectedOption, setSelectedOption] = useState(options[0]);

  useEffect(() => {
    if (insertSelectedUStaus) {
      setSelectedOption(insertSelectedUStaus);
    }
  }, [insertSelectedUStaus]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    handleStatusChange(event.target.value);
  };

  return (
    <div className="font-InterFont border rounded-md p-4 w-full mx-auto max-w-2xl">
      <h4 className="text-xl lg:text-2xl font-semibold">
        Select Your {chooseWhat}
      </h4>

      <div>
        {options.map((option, index) => (
          <label
            key={index}
            className="flex bg-gray-100 text-gray-700 rounded-md px-3 py-2 my-3 hover:bg-[#5a71ff] cursor-pointer"
          >
            <input
              type="radio"
              name={chooseWhat}
              value={option}
              checked={selectedOption === option}
              onChange={handleOptionChange}
            />
            <i className="pl-2">{option}</i>
          </label>
        ))}
      </div>
    </div>
  );
}
