import React from "react";
import "./surveyreview.css";

const GOOGLE_SHEET_URL = "https://docs.google.com/forms/d/1Zm59K4eLodHZ0uFWRgGDnaNRRxeqnX3HJSgbI4MdMZU/edit?pli=1#responses"; // Replace with Google Sheets link

const SurveyReview = () => {
  return (
    <div className="survey-review">
      <header>
        <h2>Survey Review</h2>
        <p>Access and review the survey results from the link below.</p>
      </header>

      <div className="button-container">
        <button
          className="view-results-button"
          onClick={() => window.open(GOOGLE_SHEET_URL, "_blank")}
        >
          View Survey Results
        </button>
      </div>
    </div>
  );
};

export default SurveyReview;
