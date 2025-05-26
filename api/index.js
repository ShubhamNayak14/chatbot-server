// import express from "express";
// import fetch from "node-fetch";
// import cors from "cors";
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// const PORT = 8000;

// const api_key = process.env.OPENROUTER_API_KEY;
// app.post("/api/chat", async (req, res) => {
//   const { question } = req.body;
//   console.log("server run");

//   if (!question) {
//     return res.status(400).json({ error: "Question is required." });
//   }

//   try {
//     const openRouterRes = await fetch(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${api_key}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           model: "deepseek/deepseek-r1:free",
//           messages: [{ role: "user", content: question }],
//         }),
//       }
//     );
//     if (!openRouterRes.ok) {
//       const errorData = await openRouterRes.text();
//       return res
//         .status(500)
//         .json({ error: "OpenRouter error", details: errorData });
//     }

//     const data = await openRouterRes.json();
//     const content =
//       data.choices?.[0]?.message?.content || "No response received.";

//     res.json({ response: content });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.listen(PORT, () =>
//   console.log(`Server running on Port: ${PORT}`)
// );

import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ Fix: Allow your frontend origin
app.use(
  cors({
    origin: "https://chatbot-frontend-theta-gules.vercel.app",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

const PORT = process.env.PORT || 8000;

const api_key = process.env.OPENROUTER_API_KEY;

app.post("/api/chat", async (req, res) => {
  const { question } = req.body;
  console.log("server run");

  if (!question) {
    return res.status(400).json({ error: "Question is required." });
  }

  try {
    const openRouterRes = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${api_key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1:free",
          messages: [{ role: "user", content: question }],
        }),
      }
    );

    if (!openRouterRes.ok) {
      const errorData = await openRouterRes.text();
      return res
        .status(500)
        .json({ error: "OpenRouter error", details: errorData });
    }

    const data = await openRouterRes.json();
    const content =
      data.choices?.[0]?.message?.content || "No response received.";

    res.json({ response: content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () =>
  console.log(`Server running on Port: ${PORT}`)
);
