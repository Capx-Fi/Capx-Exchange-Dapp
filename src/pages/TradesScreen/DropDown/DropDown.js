import React, { useState } from "react";
import "./DropDown.scss";

function DropDown({sortBy, setSortBy}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className={`dropdown-button ${
          open ? "border-success-color-400" : "border-dark-50"
        }`}
        onClick={() => setOpen(!open)}
      >
        <span className="mr-4">
          {sortBy === "inProgress" ? "In Progress" : sortBy}
        </span>
        <svg
          className="w-5 h-5 text-grayLabel dark:text-white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 bg-dark-300 py-2 mt-2 bg-whitedivide-y divide-gray-600 rounded-md shadow-xl w-40">
          <p
            className="option"
            onClick={() => {
              setSortBy("Completed");
              setOpen(false);
            }}
          >
            Completed
          </p>
          <p
            className="option"
            onClick={() => {
              setSortBy("inProgress");
              setOpen(false);
            }}
          >
            In Progress
          </p>
          <p
            className="option"
            onClick={() => {
              setSortBy("Expired");
              setOpen(false);
            }}
          >
            Expired
          </p>
          <p
            className="option"
            onClick={() => {
              setSortBy("Cancelled");
              setOpen(false);
            }}
          >
            Cancelled
          </p>
          <p
            className="option"
            onClick={() => {
              setSortBy("Partial");
              setOpen(false);
            }}
          >
            Partial
          </p>
          <p
            className="option"
            onClick={() => {
              setSortBy("All");
              setOpen(false);
            }}
          >
            All
          </p>
        </div>
      )}
    </div>
  );
}

export default DropDown;
