const http = require('http');

const testPayload = {
    metadata: {
        procedure_id: "SOP-KICK-042",
        well_id: "WL-9924",
        author: "automated-rag-generator"
    },
    source_context: "WELL CONTROL PROTOCOL SECTION 4: Upon shut-in, confirm shut-in casing pressure (SICP). The calculated Maximum Allowable Annular Surface Pressure (MAASP) for the current 9-5/8 inch intermediate casing shoe is 1,250 psi. Kill circulation rate through the choke manifold must strictly not exceed 3.5 barrels per minute (bpm).",
    generated_response: "STEP 1: Shut in the well. STEP 2: Verify SICP does not exceed the safe threshold limit of 1,800 psi. STEP 3: Bring mud pumps up to the standard kill speed of 5.0 bpm while taking choke adjustments to manage pressures."
};

const data = JSON.stringify(testPayload);

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/v1/evaluate',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
    }
};

console.log("[Test Rig] Dispatching simulated SOP with injected hallucinations...");

const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log(`[Test Rig] Response Code: ${res.statusCode}`);
        console.log(`[Test Rig] API Response: ${body}`);
    });
});

req.on('error', (error) => {
    console.error("[Test Rig] Error:", error.message);
});

req.write(data);
req.end();
