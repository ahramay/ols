import React from "react";
import DashboardSideBar from "../components/DashboardSideBar";

import ProfileSettings from "./ProfileSettings";
const Dashboard = (props) => {
  return (
    <section className="dash_board">
      <div className="row m-0">
        <DashboardSideBar activeTab="user" />
        <div className="col-lg-11  col-12">
          <div className="tab-content" id="DashboardContent">
            <div className="col-lg-11 pt-5 col-12">
              <div className="tab-content" id="DashboardContent">
                <ProfileSettings />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
