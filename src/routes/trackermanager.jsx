import React from "react";
import ValueChainIntegration from "../components/valuechain";
import SurveyManagement from "../components/survey";
import SurveyReview from "../components/surveyreview";
import "../routes/trackermanager.css";

const Dashboard = () => {
  const [currentTab, setCurrentTab] = React.useState(0);

  const handleTabChange = (index) => {
    setCurrentTab(index);
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Emissions Management Dashboard</h1>
      <div className="custom-tabs">
        <div
          className={`custom-tab ${currentTab === 0 ? "active-tab" : ""}`}
          onClick={() => handleTabChange(0)}
        >
          Value Chain Integration
        </div>
        <div
          className={`custom-tab ${currentTab === 2 ? "active-tab" : ""}`}
          onClick={() => handleTabChange(2)}
        >
          Survey Review
        </div>
      </div>

      <div className="dashboard-content">
        {currentTab === 0 && <ValueChainIntegration />}
        {currentTab === 1 && <SurveyManagement />}
        {currentTab === 2 && <SurveyReview />}
      </div>
    </div>
  );
};

export default Dashboard;
