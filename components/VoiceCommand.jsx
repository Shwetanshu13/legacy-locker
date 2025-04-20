"use client";
import { useState } from "react";

export default function VoiceCommand() {
  const [listening, setListening] = useState(false);
  const [voiceText, setVoiceText] = useState("");

  const handleVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      setVoiceText(result);
      sendVoiceCommand(result); // Send voice command to backend for intent recognition
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      alert("Error with speech recognition");
      setListening(false);
    };

    recognition.start();
  };

  // Send voice command to backend for processing and intent recognition
  const sendVoiceCommand = async (command) => {
    const response = await fetch(".../backend/server.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ voiceText: command }),
    });

    const data = await response.json();
    handleAction(data); // Handle the action based on the response
  };

  // Handle actions (edit, delete, view) based on recognized intent
  const handleAction = (data) => {
    if (data.action === "edit") {
      // Execute Edit Action
      alert("Editing item");
    } else if (data.action === "delete") {
      // Execute Delete Action
      alert("Deleting item");
    } else if (data.action === "view") {
      // Execute View Action
      alert("Viewing item");
    }
  };

  return (
    <div>
      <button
        onClick={handleVoiceSearch}
        className={`p-2 rounded-full text-white ${listening ? "bg-red-500" : "bg-blue-500"}`}
      >
        {listening ? "Listening..." : "Start Listening"}
      </button>
      <p>Command: {voiceText}</p>
    </div>
  );
}
