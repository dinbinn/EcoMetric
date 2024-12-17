import React, { useState, useEffect } from "react";
import axios from "axios";
import "./valuechain.css";

const API_URL = "https://ma3la05bq1.execute-api.ap-southeast-1.amazonaws.com/Post/postPartner";

const ValueChain = () => {
  const [partners, setPartners] = useState([]);
  const [selectedPartners, setSelectedPartners] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const userId = sessionStorage.getItem("userSub");

  const fetchPartners = async () => {
    try {
      const response = await axios.get(`${API_URL}?user_id=${userId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setPartners(response.data);
    } catch (error) {
      console.error("Error fetching partners:", error);
      alert("Failed to fetch partners from the database.");
    }
  };

  const addPartner = async () => {
    if (!name || !email) {
      alert("Please fill in both Name and Email fields.");
      return;
    }

    const newPartner = { user_id: userId, name, email, notes };

    try {
      const response = await axios.post(API_URL, JSON.stringify(newPartner), {
        headers: {
          "Content-Type": "application/json",
        },
      });
      alert(response.data.message);
      setName("");
      setEmail("");
      setNotes("");
      fetchPartners();
    } catch (error) {
      console.error("Error adding partner:", error);
      alert("Failed to add partner to the database.");
    }
  };

  const toggleSelectPartner = (email) => {
    if (selectedPartners.includes(email)) {
      setSelectedPartners(selectedPartners.filter((partnerEmail) => partnerEmail !== email));
    } else {
      setSelectedPartners([...selectedPartners, email]);
    }
  };

  const sendRequest = () => {
    if (selectedPartners.length === 0) {
      alert("Please select at least one partner to send the form.");
      return;
    }

    alert(`Form request sent to: ${selectedPartners.join(", ")}`);
    setSelectedPartners([]);
  };

  useEffect(() => {
    if (userId) {
      fetchPartners();
    } else {
      alert("User ID not found. Please log in.");
    }
  }, [userId]);

  return (
    <div className="value-chain">
      <div className="header">
        <h2>Value Chain Integration</h2>
        <p>Manage your value chain partners effectively and request emissions data.</p>
      </div>

      <div className="form-container">
        <div className="form">
          <input
            type="text"
            placeholder="Partner Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Partner Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Relation to Company (Optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <button className="add-partner-button" onClick={addPartner}>
            Add Partner
          </button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th style={{ width: "60px", textAlign: "center" }}>Select</th>
              <th>Name</th>
              <th>Email</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((partner, index) => (
              <tr key={index}>
                <td style={{ textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={selectedPartners.includes(partner.email)}
                    onChange={() => toggleSelectPartner(partner.email)}
                  />
                </td>
                <td>{partner.name}</td>
                <td>{partner.email}</td>
                <td>{partner.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="request-container">
        <button className="send-request-button" onClick={sendRequest}>
          Request Emissions Data
        </button>
      </div>
    </div>
  );
};

export default ValueChain;
