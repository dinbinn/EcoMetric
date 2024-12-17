import React from "react";
import "./survey.css";

const Survey = () => {
  return (
    <div className="survey-management">
      <h2>Survey Management</h2>
      <p>Create and manage surveys for your partners</p>
      <div className="form">
        <label>Survey Title</label>
        <input type="text" placeholder="Enter survey title" />
        <label>Message</label>
        <textarea placeholder="Enter survey description or message" />
        <button>Create Survey</button>
      </div>
      <h3>Sent Surveys</h3>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Responses</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Survey 1</td>
            <td>Pending</td>
            <td>0</td>
          </tr>
          {/* Add dynamic survey data here */}
        </tbody>
      </table>
    </div>
  );
};

export default Survey;
