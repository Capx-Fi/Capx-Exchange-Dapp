import React, { useEffect } from "react";
import Select from "react-select";

import { useHistory } from "react-router-dom";

function HeaderDropdown({
  verifyInput,
  selectedValue,
  dropdownData,
  placeholderComponent,
  placeholderText,
  handleChange,
  handleInputChange,
  tokenInputValue,
}) {
  useEffect(() => {
    verifyInput && verifyInput();
  }, [tokenInputValue]);

  const history = useHistory();
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#151517",
      boxShadow: state.isFocused ? 0 : 0,
      borderRadius: 12,
      borderColor: state.isFocused ? "#97D10A" : "#4A6269",
      borderWidth: 1,
      "&:hover": {
        borderColor: state.isFocused ? "#97D10A" : "#4A6269",
      },
    }),
    option: (provided, { isFocused, isSelected }) => ({
      ...provided,
      backgroundColor: isFocused ? "#2A383C" : "#151517",
      color: "#FFF",
      borderRadius: 7,
    }),
    menuList: (provided, state) => ({
      ...provided,
      paddingTop: 0,
      paddingBottom: 10,
      "::-webkit-scrollbar": {
        width: "5px",
        height: "0px",
      },
      "::-webkit-scrollbar-track": {
        background: "#2A3B3F",
      },
      "::-webkit-scrollbar-thumb": {
        background: "#49C574",
        borderRadius: 20,
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: "#555",
      },
    }),
    input: (provided, { isFocused }) => ({
      ...provided,
      padding: 5,
      borderRadius: 30,
      color: "white",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#F1FAF2",
      alignItems: "start",
      marginLeft: "12px",
      textAlign: "left",
    }),
    menu: (provided, state) => ({
      ...provided,
      padding: 10,
      paddingTop: 20,
      paddingRight: 5,
      backgroundColor: "#151517",
      borderBottom: "2px #2C432E",
    }),
  };

  return (
    <Select
      components={{
        IndicatorSeparator: () => null,
      }}
      placeholder={
        placeholderComponent ? placeholderComponent : placeholderText
      }
      className="w-96 hidden breakpoint:block breakpoint:w-80 desktop:w-96 rounded-lg"
      value={selectedValue}
      inputValue={tokenInputValue}
      options={dropdownData}
      onChange={(e) => history.push(`/info/${e.tokenAddress}`)}
      styles={customStyles}
      maxMenuHeight={120}
      onInputChange={handleInputChange}
      getOptionValue={(option) => option.tokenAddress}
      getOptionLabel={(e) => (
        <div className="ml-2" style={{ display: "flex", alignItems: "center" }}>
          <span style={{ marginLeft: 10, color: "white" }}>
            {`${e?.projectName} (${e?.tokenTicker})`}
          </span>
        </div>
      )}
    />
  );
}

export default HeaderDropdown;
