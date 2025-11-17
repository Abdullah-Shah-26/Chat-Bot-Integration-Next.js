"use client";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMessage = { text: prompt, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setLoading(true);

    try {
      const response = await fetch("api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt }),
      });

      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      const data = await response.json();
      const botMessage = { text: data.text, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.log("Fetch error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, something went wrong", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ padding: "32px", maxWidth: "900px", margin: "auto" }}>
      <h1>Testing Gemini ChatBot</h1>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "18px",
          height: "600px",
          overflowY: "scroll",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              margin: "5px 0",
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                background: msg.sender === "user" ? "#e0f7fa" : "#f1f8e9",
                color: "#333",
                padding: "8px 12px",
                borderRadius: "4px",
                maxWidth: "70%",
                textAlign: msg.sender === "user" ? "right" : "left",
                border: "1px solid #bbb",
              }}
            >
              <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong>{" "}
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ textAlign: "left", margin: "5px 0" }}>Typing...</div>
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", marginTop: "10px" }}
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
          style={{ flex: "1", padding: "10px", borderWidth: 2 }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ padding: "10px", borderWidth: 2 }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
