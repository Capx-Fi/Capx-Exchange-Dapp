import React from "react";
import "./ProjectInfo.scss";

import infoIcon from "../../assets/info.svg";

function OuterContainer({ icon, content, title }) {
  return (
    <div className="outerContainer">
      <div className="outerContainer_maincontainer">
        <div className="outerContainer_maincontainer_body">
          <div className="outerContainer_maincontainer_body_title">
            <img
              src={icon}
              className="mr-2 h-4 phone:hidden tablet:block phone:w-3 phone:mt-0.5 phone:h-3 phone:-ml-3 desktop:mt-1"
              alt="project icon"
            />{" "}
            {title}
          </div>
          <div className="outerContainer_maincontainer_body_innercontainer">
            <div className="outerContainer_maincontainer_body_innercontainer_box">
              {content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OuterContainer;
