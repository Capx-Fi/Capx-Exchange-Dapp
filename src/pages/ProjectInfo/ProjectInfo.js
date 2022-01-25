import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { hideSideNav } from "../../redux/actions/sideNav";
import BuyScreen from "./Buy";
import ProjectDescription from "./ProjectDescription";

import liquidDiamond from "../../assets/Capx-Diamond-Liquid.svg";
import InfoHeader from "./InfoHeader";
import { fetchProjectDetails } from "../../utils/fetchProjectDetails";
import { useState } from "react";
import { fetchOrderForTicker } from "../../utils/fetchOrderForTicker";

function ProjectInfo({ match }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hideSideNav());
  }, []);
  const [projectDetails, setProjectDetails] = useState({});
  const [activeOrders, setActiveOrders] = useState([]);
  const [completeOrders, setCompleteOrders] = useState([]);

  useEffect(() => {
    getProjectDetails(match.params.ticker);
  }, []);
  const getProjectDetails = async () => {
    const _projectDetails = await fetchProjectDetails(match.params.ticker);
    
    setProjectDetails(_projectDetails);
    const _activeOrders = await fetchOrderForTicker(_projectDetails.id, setActiveOrders, setCompleteOrders);
    console.log(projectDetails);
    console.log(activeOrders);
    console.log(completeOrders);
  };
  return (
    <div className="w-82v mx-auto">
      <div className="main-container">
        <div className="main-container_left">
          <InfoHeader ticker={projectDetails?.projectName} />
          <ProjectDescription projectDetails={projectDetails} activeOrders={activeOrders} completeOrders={completeOrders} />
        </div>
        <BuyScreen />
      </div>
    </div>
  );
}

export default ProjectInfo;
