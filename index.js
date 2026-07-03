const express = require("express");
const app = express();
app.use(express.json());

let messageQueue = [];

app.post("/api/receive", (req, res) => {
  const msg = req.body;
  if (msg && msg.message) {
    messageQueue.push({
      id: Date.now(),
      message: msg.message,
      sender: msg.sender || "",
      group: msg.group || "",
      time: new Date().toISOString(),
    });
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
