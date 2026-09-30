"use strict";
const { parentPort, workerData } = require("worker_threads");
const { gerar } = require("./render.js");

gerar(workerData).then(
    ({ buffer, info }) => parentPort.postMessage({ ok: true, buffer, info }),
    err => parentPort.postMessage({ ok: false, erro: err?.message || String(err) })
);
