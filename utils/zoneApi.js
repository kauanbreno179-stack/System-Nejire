const axios = require("axios");
const config = require("../config.json");

function client() {
    return axios.create({
        baseURL: config.zoneApi?.baseUrl || "https://zone.api.br",
        timeout: 45000,
        headers: { "User-Agent": "SystemNejire/2.0" }
    });
}

function caminhoEndpoint(chave) {
    const caminho = config.zoneApi?.endpoints?.[chave];
    if (!caminho) {
        throw new Error(`Endpoint "${chave}" não configurado em config.json > zoneApi.endpoints.`);
    }
    return caminho;
}

async function zoneGet(chave, params = {}, { comApikey = true } = {}) {
    const caminho = caminhoEndpoint(chave);

    const query = { ...params };
    if (comApikey) query.apikey = config.zoneApi?.apikey || " ";

    try {
        const resp = await client().get(caminho, { params: query, responseType: "arraybuffer" });
        const tipo = resp.headers?.["content-type"] || "";

        if (tipo.includes("json")) {
            const texto = Buffer.from(resp.data).toString("utf-8");
            return { ok: true, tipo: "json", data: JSON.parse(texto) };
        }

        if (tipo.includes("image") || tipo.includes("audio") || tipo.includes("video") || tipo.includes("gif") || tipo.includes("octet-stream")) {
            return { ok: true, tipo: "binario", buffer: Buffer.from(resp.data), contentType: tipo };
        }

        try {
            const texto = Buffer.from(resp.data).toString("utf-8");
            return { ok: true, tipo: "json", data: JSON.parse(texto) };
        } catch {
            return { ok: true, tipo: "binario", buffer: Buffer.from(resp.data), contentType: tipo };
        }
    } catch (err) {
        const status = err?.response?.status;
        const msg = err?.response?.data?.message || err?.message || "erro desconhecido";
        return { ok: false, status, erro: msg };
    }
}

module.exports = { zoneGet, client, caminhoEndpoint };
