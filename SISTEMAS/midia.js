const Ffmpeg = require("../utils/ffmpeg.js");

// qualquer áudio/vídeo → mp3 (tira o vídeo, se tiver)
function paraMp3(buffer) {
    return Ffmpeg.converter(buffer, "bin", "mp3", (i, o) =>
        ["-i", i, "-vn", "-c:a", "libmp3lame", "-b:a", "128k", "-ar", "44100", "-ac", "2", o],
        { timeoutMs: 180000 });
}

// qualquer áudio/vídeo → nota de voz do whatsapp (opus em ogg, mono)
function paraPtt(buffer) {
    return Ffmpeg.converter(buffer, "bin", "ogg", (i, o) =>
        ["-i", i, "-vn", "-c:a", "libopus", "-b:a", "40k", "-ar", "48000", "-ac", "1", "-application", "voip", "-f", "ogg", o],
        { timeoutMs: 180000 });
}

module.exports = { paraMp3, paraPtt };
