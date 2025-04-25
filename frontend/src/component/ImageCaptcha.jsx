import React, { useEffect, useState } from "react";

import { get, post } from "../services/api";

const App = () => {
  const [captcha, setCaptcha] = useState({
    question: "",
    target: "",
    options: [],
  });
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const fetchCaptcha = async () => {
    const res = await get("/image-captcha");
    setCaptcha(res);
  };

  const reFetchCaptcha = async () => {
    const res = await get("/refresh-image-captcha");
    setCaptcha(res);
  };

  const handleImageClick = async (label) => {
    const res = await post("/validate-image-captcha", {
      selected: label,
      target: captcha.target,
    });

    setMessage(
      res.success ? "✅ Verified as human!" : "❌ Wrong selection. Try again."
    );
    res.success && reFetchCaptcha();
    setTimeout(() => {
      setMessage("");
    }, 1000);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial", textAlign: "center" }}>
      <h2>Image CAPTCHA</h2>
      <p>
        <strong className="sub-title-text">{captcha.question}</strong>
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        {captcha.options.map((opt, index) => (
          <div
            key={index}
            onClick={() => handleImageClick(opt.label)}
            style={{
              border:
                selectedLabel === opt.label
                  ? "2px solid green"
                  : "2px solid #ccc",
              borderRadius: "20px",
              padding: "5px",
              cursor: "pointer",
            }}
          >
            <img src={opt.url} alt={opt.label} width="200" height="200" />
            <p style={{ margin: "0.5rem 0 0", textTransform: "capitalize" }}>
              {opt.label}
            </p>
          </div>
        ))}
      </div>
      <button onClick={reFetchCaptcha} className="refresh-captcha">
        🔄 Refresh Captcha
      </button>
      {message && (
        <p style={{ marginTop: "1rem", fontWeight: "bold" }}>{message}</p>
      )}
    </div>
  );
};

export default App;
