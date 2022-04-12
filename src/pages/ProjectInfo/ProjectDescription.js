import React from "react";
import "./ProjectInfo.scss";

import infoIcon from "../../assets/info.svg";
import marketActivity from "../../assets/marketActivity.svg";

import OuterContainer from "./OuterContainer";
import TokenListTable from "./TokenListTable";
import TokenActivityTable from "./TokenActivityTable";
import MobileMarketActivity from "./MobileMarketActivity";
import useWindowSize from "../../utils/windowSize";

function ProjectDescription({
  projectDetails,
  completeOrders,
  activeOrders,
  loading,
}) {
  const windowWidth = useWindowSize().width;
  return (
    <>
      {windowWidth > 768 ? (
        <>
          <OuterContainer
            title={"PROJECT DESCRIPTION"}
            icon={infoIcon}
            content={
              projectDetails?.projectDescription ? (
                <p className="p-4 max-h-32 w-full overflow-y-scroll">
                  {projectDetails?.projectDescription}
                </p>
              ) : (
                <div className="h-20 bg-loadingBG text-loadingBG bg-opacity-40 animate-pulse w-full"></div>
              )
            }
          />
          <OuterContainer
            title={"MARKET ACTIVITY"}
            icon={marketActivity}
            completeOrders={completeOrders}
            content={<TokenActivityTable completeOrders={completeOrders} />}
          />
          <OuterContainer
            title={`TOKENS WITH \$${(projectDetails?.projectName)?.toUpperCase()}`}
            icon={marketActivity}
            activeOrders={activeOrders}
            content={<TokenListTable activeOrders={activeOrders} />}
          />
        </>
      ) : (
        <>
          <OuterContainer
            title={"PROJECT DESCRIPTION"}
            icon={infoIcon}
            content={
              projectDetails?.projectDescription ? (
                <p className="p-4 max-h-32 w-full overflow-y-scroll">
                  {projectDetails?.projectDescription}
                </p>
              ) : (
                <div className="h-20 bg-loadingBG text-loadingBG bg-opacity-40 animate-pulse w-full"></div>
              )
            }
          />
          
          <MobileMarketActivity
          completeOrders={completeOrders}
          loading={loading}
          />
          
          <TokenListTable
          projectDetails={projectDetails}
          activeOrders={activeOrders} 
          loading={loading} 
          />

        </>
      )}
    </>
  );
}

export default ProjectDescription;
