import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

const summaryPath = process.argv[2] ?? "performance-summary.json";
const outputDirectory = process.argv[3] ?? "allure-results";
const summary = existsSync(summaryPath)
  ? JSON.parse(readFileSync(summaryPath, "utf8"))
  : { metrics: {} };

const metrics = summary.metrics ?? {};
const failedRate = metrics.http_req_failed?.values?.rate ?? 1;
const p95 = metrics.http_req_duration?.values?.["p(95)"] ?? 0;
const p99 = metrics.http_req_duration?.values?.["p(99)"] ?? 0;
const checksRate = metrics.checks?.values?.rate ?? 0;
const checksPassed = metrics.checks?.values?.passes ?? 0;
const checksFailed = metrics.checks?.values?.fails ?? 0;
const httpRequests = metrics.http_reqs?.values?.count ?? 0;
const iterations = metrics.iterations?.values?.count ?? 0;
const passed = failedRate < 0.01 && p95 < 1000 && checksRate === 1;
const uuid = randomUUID();
const now = Date.now();

mkdirSync(outputDirectory, { recursive: true });

const result = {
  uuid,
  historyId: "k6-demoblaze-smoke-performance",
  testCaseId: "TC-PERF-SMOKE-001",
  name: "K6 smoke performance test",
  fullName: "performance.scenarios.demoblaze-smoke",
  status: passed ? "passed" : "failed",
  stage: "finished",
  start: now,
  stop: now,
  labels: [
    { name: "suite", value: "Performance" },
    { name: "parentSuite", value: "K6" },
    { name: "subSuite", value: "Demoblaze API" },
    { name: "framework", value: "k6" },
    { name: "language", value: "javascript" },
    { name: "tag", value: "performance" },
    { name: "tag", value: "smoke" },
  ],
  parameters: [
    { name: "http_req_failed.rate", value: String(failedRate) },
    { name: "http_req_duration.p95", value: `${p95} ms` },
    { name: "http_req_duration.p99", value: `${p99} ms` },
    { name: "checks.rate", value: String(checksRate) },
    { name: "checks.passed", value: String(checksPassed) },
    { name: "checks.failed", value: String(checksFailed) },
    { name: "http_reqs.count", value: String(httpRequests) },
    { name: "iterations.count", value: String(iterations) },
  ],
};

writeFileSync(
  `${outputDirectory}/${uuid}-result.json`,
  JSON.stringify(result, null, 2),
);

writeFileSync(
  `${outputDirectory}/${uuid}-performance-summary-attachment.json`,
  JSON.stringify(summary, null, 2),
);

writeFileSync(
  `${outputDirectory}/${uuid}-container.json`,
  JSON.stringify(
    {
      uuid: randomUUID(),
      name: "K6 performance summary",
      children: [uuid],
      attachments: [
        {
          name: "performance-summary.json",
          source: `${uuid}-performance-summary-attachment.json`,
          type: "application/json",
        },
      ],
    },
    null,
    2,
  ),
);

console.log(`Generated Allure performance result: ${outputDirectory}/${uuid}-result.json`);
