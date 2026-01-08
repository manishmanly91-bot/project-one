const express = require("express");
const client = require("prom-client");

const app = express();
const PORT = process.env.PORT || 3000;

// Create a registry and collect default Node.js/process metrics
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status"],
});

const httpRequestDurationSeconds = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
});

register.registerMetric(httpRequestsTotal);
register.registerMetric(httpRequestDurationSeconds);

// Middleware to capture metrics for all routes
app.use((req, res, next) => {
  const route = req.path; // simple route label
  const endTimer = httpRequestDurationSeconds.startTimer({ method: req.method, route });

  res.on("finish", () => {
    const status = String(res.statusCode);
    httpRequestsTotal.inc({ method: req.method, route, status });
    endTimer({ status });
  });

  next();
});

// Your app route
app.get("/", (req, res) => {
  res.send("Hello from Node.js on Kubernetes!");
});

// Prometheus metrics endpoint
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType);
    res.send(await register.metrics());
  } catch (err) {
    res.status(500).send(err?.message || "Failed to generate metrics");
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));