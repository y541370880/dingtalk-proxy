const express = require("express");
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

let messageQueue = [];

app.post("/api/receive", (req, res) => {
  const msg = req.body;
  let content = "";
  if (msg && msg.text) {
    content = msg.text;
  } else if (msg && msg.message) {
    content = msg.message;
  }
  if (content) {
    messageQueue.push({
      id: Date.now(),
      message: content,
      sender: msg.sender || "",
      group: msg.group || "",
      time: new Date().toISOString(),
    });
    console.log("Received:", content);
  }
  res.json({ status: "ok" });
});

app.get("/api/poll", (req, res) => {
  if (messageQueue.length > 0) {
    const msg = messageQueue.shift();
    res.json({ status: "ok", data: msg });
  } else {
    res.json({ status: "ok", data: null });
  }
});

app.get("/", (req, res) => {
  res.json({ status: "running", queue: messageQueue.length });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Proxy running on port", PORT));
