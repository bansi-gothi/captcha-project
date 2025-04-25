// src/components/TextCaptcha.js
import React, { useEffect, useState } from "react";
import { BASE_URL, post } from "../services/api";

const TextCaptcha = () => {
  const [captcha, setCaptcha] = useState(""); // Captcha image (base64)
  const [userInput, setUserInput] = useState(""); // User input for CAPTCHA
  const [message, setMessage] = useState(""); // Feedback message

  const loadCaptcha = async () => {
    try {
      setCaptcha(`${BASE_URL}/text-captcha?${new Date().getTime()}`); // Set the image source
      setUserInput(""); // Reset user input
      setMessage(""); // Reset message
    } catch (error) {
      console.error("Error fetching CAPTCHA:", error);
      setMessage("❌ Failed to load CAPTCHA. Please try again.");
    }
  };

  // Initial CAPTCHA load when component mounts
  useEffect(() => {
    loadCaptcha();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await post("/validate-text-captcha", { userInput });
      if (res.success) {
        loadCaptcha();
        setMessage("✅ Verified as human!");
      } else {
        setMessage("❌ Incorrect text. Try again.");
      }
      setTimeout(() => {
        setMessage("");
      }, 1000);
      setUserInput("");
    } catch (error) {
      console.error("Error validating CAPTCHA:", error);
      setMessage("❌ An error occurred during validation. Try again.");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>Text-Based CAPTCHA</h2>
      {/* Display CAPTCHA image */}
      <img
        src={captcha}
        alt="CAPTCHA"
        style={{ display: "block", marginBottom: "1rem", maxWidth: "100%" }}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter text shown above"
          required
          style={{ padding: "0.5rem", fontSize: "1rem", width: "100%" }}
        />

        <div style={{ display: "flex", columnGap: "16px" }}>
          <button type="submit" className="refresh-captcha">
            Verify
          </button>
          <button
            type="button"
            onClick={loadCaptcha}
            className="refresh-captcha"
          >
            🔄 Refresh Captcha
          </button>
        </div>
      </form>

      {/* Display validation result message */}
      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </div>
  );
};

export default TextCaptcha;
