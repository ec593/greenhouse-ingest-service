import express from "express";
import db from "./db/index.js";
import Redis from "ioredis";
import { verifyInternalSecret } from "./auth.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const insertData = db.prepare(`
  INSERT INTO sensor_data (deviceId, timestamp, payload)
  VALUES (?, ?, ?)
`);

const redis = new Redis();

app.post("/data", verifyInternalSecret, (req, res) => {
    const { deviceId, timestamp, ...payload } = req.body;
    try {
        const payloadString = JSON.stringify(payload);
        insertData.run(deviceId, timestamp, payloadString);
        redis.publish("data.new", JSON.stringify(req.body));
        res.json({ status: "ok", received: req.body });
    } catch (err) {
        console.error("DB error:", err.message);
        res.status(500).json({ error: "db insert failed" });
    }
});

app.listen(3001, "127.0.0.1",  () => console.log("Ingest service listening on 3001"));