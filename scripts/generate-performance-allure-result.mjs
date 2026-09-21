import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

const summaryPath = process.argv[2] ?? "performance-summary.json";
const outputDirectory = process.argv[3] ?? "allure-results";
const summary = existsSync(summaryPath)
  ? JSON.parse(readFileSync(summaryPath, "utf8"))
  : { metrics: {}, root_group: { groups: {}, checks: {} } };

const metrics = summary.metrics ?? {};
const failedRate = metricValue("http_req_failed", "value", 1);
const p95 = metricValue("http_req_duration", "p(95)", 0);
const p99 = metricValue("http_req_duration", "p(99)", 0);
const checksRate = metricValue("checks", "value", 0);
const checksPassed = metricValue("checks", "passes", 0);
const checksFailed = metricValue("checks", "fails", 0);
const httpRequests = metricValue("http_reqs", "count", 0);
const iterations = metricValue("iterations", "count", 0);
const now = Date.now();

mkdirSync(outputDirectory, { recursive: true });

const checkResults = collectChecks(summary.root_group);
const generatedResults =
  checkResults.length > 0 ? checkResults : [fallbackCheck()];
const attachmentSource = writeSummaryAttachment(generatedResults[0].uuid);

for (const checkResult of generatedResults) {
  writeResult(checkResult);
}

writeContainer(generatedResults, attachmentSource);

console.log(
  `Generated ${generatedResults.length} Allure performance result(s) in ${outputDirectory}`,
);

function metricValue(metricName, valueName, fallback) {
  return metrics[metricName]?.[valueName] ?? fallback;
}

function collectChecks(group, parentPath = "Performance") {
  if (!group) {
    return [];
  }

  const groupName = group.name || parentPath;
  const checks = Object.values(group.checks ?? {}).map((check) =>
    toAllureCheckResult(check, groupName),
  );
  const childChecks = Object.values(group.groups ?? {}).flatMap((childGroup) =>
    collectChecks(childGroup, childGroup.name || groupName),
  );

  return [...checks, ...childChecks];
}

function toAllureCheckResult(check, groupName) {
  const resultUuid = randomUUID();
  const passed = check.fails === 0 && check.passes > 0;

  return {
    uuid: resultUuid,
    historyId: `k6-${check.id}`,
    testCaseId: `TC-PERF-${check.id}`,
    name: check.name,
    fullName:
      check.path?.replace(/^::/, "performance.").replaceAll("::", ".") ??
      check.name,
    status: passed ? "passed" : "failed",
    stage: "finished",
    start: now,
    stop: now,
    labels: [
      { name: "suite", value: "Performance" },
      { name: "parentSuite", value: "K6" },
      { name: "subSuite", value: groupName },
      { name: "framework", value: "k6" },
      { name: "language", value: "javascript" },
      { name: "tag", value: "performance" },
      { name: "tag", value: "smoke" },
    ],
    parameters: [
      { name: "check.passes", value: String(check.passes) },
      { name: "check.fails", value: String(check.fails) },
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
}

function fallbackCheck() {
  const resultUuid = randomUUID();
  const passed = failedRate < 0.01 && p95 < 1000 && checksRate === 1;

  return {
    uuid: resultUuid,
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
      { name: "checks.rate", value: String(checksRate) },
    ],
  };
}

function writeResult(result) {
  writeFileSync(
    `${outputDirectory}/${result.uuid}-result.json`,
    JSON.stringify(result, null, 2),
  );
}

function writeSummaryAttachment(sourceUuid) {
  const attachmentSource = `${sourceUuid}-performance-summary-attachment.json`;
  writeFileSync(
    `${outputDirectory}/${attachmentSource}`,
    JSON.stringify(summary, null, 2),
  );
  return attachmentSource;
}

function writeContainer(results, attachmentSource) {
  writeFileSync(
    `${outputDirectory}/${randomUUID()}-container.json`,
    JSON.stringify(
      {
        uuid: randomUUID(),
        name: "K6 performance testcases",
        children: results.map((result) => result.uuid),
        attachments: [
          {
            name: "performance-summary.json",
            source: attachmentSource,
            type: "application/json",
          },
        ],
      },
      null,
      2,
    ),
  );
}
