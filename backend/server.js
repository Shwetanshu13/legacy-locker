const express = require('express');
const axios = require('axios');
const app = express();
const port = 5000;

// Middleware
app.use(express.json());

// Your HuggingFace API Key (obtain from https://huggingface.co/)
const HF_API_KEY = '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';
const MODEL_URL = 'https://api-inference.huggingface.co/models/bert-base-uncased';

// Post endpoint to handle voice command
app.post('/api/voice-command', async (req, res) => {
  const { voiceText } = req.body;

  // Call HuggingFace API to classify the voiceText
  try {
    const response = await axios.post(
      MODEL_URL,
      {
        inputs: voiceText,
      },
      {
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
        },
      }
    );

    // Parse the result and classify the command
    const prediction = response.data[0];

    if (prediction.label === "edit") {
      res.json({ action: "edit", message: "Edit action triggered" });
    } else if (prediction.label === "delete") {
      res.json({ action: "delete", message: "Delete action triggered" });
    } else {
      res.json({ action: "view", message: "View action triggered" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error processing voice command" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
