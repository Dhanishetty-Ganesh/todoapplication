import React, { useState, useEffect } from "react";
import "./App.css"
import axios from "axios";

const App = () => {
  const [layout, setLayout] = useState("");
  const [emailConfig, setEmailConfig] = useState({
    title: "",
    content: "",
    footer: "",
    imageUrl: "",
  });

  useEffect(() => {
    axios.get("http://localhost:3001/getEmailLayout").then((response) => {
      setLayout(response.data.layout);
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmailConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    axios.post("http://localhost:3001/uploadImage", formData).then((response) => {
      setEmailConfig((prev) => ({ ...prev, imageUrl: response.data.imageUrl }));
    });
  };

  const saveTemplate = () => {
    axios.post("http://localhost:3001/uploadEmailConfig", emailConfig).then(() => {
      alert("Template saved successfully!");
    });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Email Builder</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          type="text"
          placeholder="Title"
          name="title"
          value={emailConfig.title}
          onChange={handleInputChange}
        />
        <textarea
          placeholder="Content"
          name="content"
          value={emailConfig.content}
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="Footer"
          name="footer"
          value={emailConfig.footer}
          onChange={handleInputChange}
        />
        <input type="file" onChange={handleImageUpload} />
        {emailConfig.imageUrl && (
          <img src={`http://localhost:3001${emailConfig.imageUrl}`} alt="Uploaded" width="200" />
        )}
        <button onClick={saveTemplate}>Save Template</button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h2>Preview</h2>
        <div dangerouslySetInnerHTML={{ __html: layout }} />
      </div>
    </div>
  );
};

export default App;
