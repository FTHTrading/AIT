#!/usr/bin/env node

const primaryUrls = [
  "https://ait.unykorn.org/",
  "https://ait.unykorn.org/ait",
  "https://ait.unykorn.org/ait/docs",
  "https://ait.unykorn.org/ait/media",
  "https://ait.unykorn.org/ait/videos",
  "https://ait.unykorn.org/ait/brand",
  "https://ait.unykorn.org/ait/voice",
  "https://ait.unykorn.org/systems/ait-biofield",
  "https://ait.unykorn.org/protocol",
  "https://ait.unykorn.org/demo/proof-vault"
];

const legacyUrls = [
  "https://bio.unykorn.org/",
  "https://bio.unykorn.org/ait",
  "https://bio.unykorn.org/ait/docs",
  "https://bio.unykorn.org/ait/media",
  "https://bio.unykorn.org/ait/videos",
  "https://bio.unykorn.org/ait/brand",
  "https://bio.unykorn.org/ait/voice",
  "https://bio.unykorn.org/systems/ait-biofield",
  "https://bio.unykorn.org/protocol",
  "https://bio.unykorn.org/demo/proof-vault"
];

function classify(status) {
  if (status >= 200 && status < 300) return "PASS";
  if (status >= 300 && status < 400) return "REDIRECT";
  return "FAIL";
}

async function check(url) {
  try {
    const response = await fetch(url, { method: "GET", redirect: "manual" });
    const status = response.status;
    const location = response.headers.get("location");
    return {
      url,
      status,
      result: classify(status),
      location: location || ""
    };
  } catch (error) {
    return {
      url,
      status: "ERR",
      result: "FAIL",
      location: "",
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

(async () => {
  console.log("Public Route Healthcheck (Primary: ait.unykorn.org)");
  console.log("=".repeat(72));

  let failures = 0;

  for (const url of primaryUrls) {
    const r = await check(url);
    const extra = r.location ? ` -> ${r.location}` : r.error ? ` -> ${r.error}` : "";
    console.log(`${r.result.padEnd(8)} ${String(r.status).padEnd(4)} ${r.url}${extra}`);
    if (r.result === "FAIL") failures += 1;
  }

  console.log("=".repeat(72));
  console.log("Legacy checks (bio.unykorn.org)");
  console.log("-".repeat(72));
  for (const url of legacyUrls) {
    const r = await check(url);
    const extra = r.location ? ` -> ${r.location}` : r.error ? ` -> ${r.error}` : "";
    console.log(`${r.result.padEnd(8)} ${String(r.status).padEnd(4)} ${r.url}${extra}`);
  }

  console.log("=".repeat(72));
  if (failures > 0) {
    console.log(`FAILURES: ${failures}`);
    process.exitCode = 1;
  } else {
    console.log("All public routes healthy.");
  }
})();
