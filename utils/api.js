const axios = require("axios");
const config = require("../config.json");

function client() {
    return axios.create({
        baseURL: config.lopesApi?.baseUrl || "https://lopes-api.store",
        timeout: config.lopesApi?.timeoutMs || 30000,
        headers: { "User-Agent": "SystemNejire/2.0" }
    });
}

async function lopesGet(chave, params = {}, consulta = null) {
    const caminho = config.lopesApi?.endpoints?.[chave];

    if (!caminho) {
        throw new Error(
            `Endpoint "${chave}" não configurado em config.json > lopesApi.endpoints. Confira os caminhos certos em https://lopes-api.store/docs`
        );
    }

    const query = { ...params };
    query[config.lopesApi?.parametroToken || "apikey"] = config.lopesApi?.token || "freekey";

    if (consulta !== null && consulta !== undefined) {
        query[config.lopesApi?.parametroConsulta || "url"] = consulta;
    }

    try {
        const { data } = await client().get(caminho, { params: query });
        return { ok: true, data };
    } catch (err) {
        const status = err?.response?.status;
        const msg = err?.response?.data?.message || err?.message || "erro desconhecido";
        return { ok: false, status, erro: msg };
    }
}

module.exports = { lopesGet, client };
