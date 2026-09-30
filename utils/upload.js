const axios = require("axios");
const FormData = require("form-data");
const config = require("../config.json");

async function uploadToZone(buffer, { name = `arquivo_${Date.now()}`, ext = "bin", temporary = true, expiresIn = 10 } = {}) {
    const caminho = config.zoneApi?.endpoints?.upload;
    if (!caminho) return { status: false, erro: 'endpoint "upload" não configurado em config.json > zoneApi.endpoints' };

    try {
        const form = new FormData();
        form.append("file", buffer, { filename: `${name}.${ext}` });

        const { data } = await axios.post(`${config.zoneApi?.baseUrl || "https://zone.api.br"}${caminho}`, form, {
            headers: { ...form.getHeaders(), "User-Agent": "SystemNejire/2.0" },
            params: { apikey: config.zoneApi?.apikey || " ", name, temporary, expiresIn },
            timeout: 45000,
            maxBodyLength: Infinity,
            maxContentLength: Infinity
        });

        const url = data?.url || data?.result?.url || data?.data?.url || null;
        const status = data?.status === undefined ? !!url : !!data.status;
        return { status: status && !!url, url };
    } catch (err) {
        return { status: false, erro: err?.response?.data?.message || err?.message || "erro no upload" };
    }
}

module.exports = { uploadToZone };
