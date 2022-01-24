import React from "react";
import { DebounceInput } from "react-debounce-input";
import ValidIcon from "../../assets/done.png";

import WarningIcon from "../../assets/error.png";

function InputField({
  label,
  placeholder,
  valid,
  value,
  setValue,
  className,
  maxLength,
  disabled,
}) {
  return (
    <div className={className}>
      <div className="relative">
        <DebounceInput
          className={`${
            value && valid && "shadow-input-validated"
          } appearance-none text-caption-3 desktop:text-caption-2  ${
            value && valid
              ? "ring-2 ring-success-color-400"
              : "ring-2 ring-warning-color-400"
          } ${
            !disabled
              ? ""
              : "pointer-events-none opacity-50 z-10 cursor-not-allowed"
          } focus:border-transparent rounded-lg w-full py-2 px-3 text-white bg-dark-300 h-8 tablet:h-10 laptop:h-14 focus:outline-none focus:shadow-outline text-caption-4 leading-caption-4 tablet:text-paragraph-2 tablet:leading-paragraph-2 laptop:text-paragraph-2 laptop:leading-paragraph-2 desktop:text-paragraph-1 desktop:leading-paragraph-1`}
          id={label}
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          maxLength={`${maxLength ? 42 : ""}`}
        />
        {
          <div className="w-16 flex text-primary-green-100 pointer-events-none absolute top-1/2 transform -translate-y-1/2 right-6">
            {" "}
            <svg
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12.5" r="12" fill="#A0B2F8" />
              <circle cx="12" cy="12.5" r="9" fill="#8162F4" />
              <circle
                cx="12"
                cy="12.5"
                r="9"
                fill="url(#paint0_linear_1989_38464)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_1989_38464"
                  x1="12"
                  y1="23.75"
                  x2="12"
                  y2="2.85714"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#301E47" />
                  <stop offset="1" stop-opacity="0" />
                </linearGradient>
              </defs>
            </svg>
            <span style={{ marginLeft: 5 }}>XRTX</span>
          </div>
        }
      </div>
    </div>
  );
}

export default InputField;
