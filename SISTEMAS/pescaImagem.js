// gera um cartão (svg → png via sharp) com o estado do jogador,

const sharp = require("sharp");
const Pesca = require("./pesca.js");

function escapar(valor) {
    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

// caixa com cantos 
function cartao(x, y, w, h, r = 18) {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="#0e2c3b" stroke="#1d475b" stroke-width="1.5"/>`;
}

function anelProgresso(cx, cy, raio, pct, corTraco) {
    const circ = 2 * Math.PI * raio;
    const offset = circ * (1 - Math.max(0, Math.min(100, pct)) / 100);
    return `
        <circle cx="${cx}" cy="${cy}" r="${raio}" fill="none" stroke="#173e50" stroke-width="14"/>
        <circle cx="${cx}" cy="${cy}" r="${raio}" fill="none" stroke="${corTraco}" stroke-width="14"
            stroke-linecap="round" stroke-dasharray="${circ}" stroke-dashoffset="${offset}"
            transform="rotate(-90 ${cx} ${cy})"/>
    `;
}

async function gerarPainelPNG(jid) {
    const e = Pesca.estadoPublico(jid);
    const pctXp = Math.min(100, Math.round((e.xpPesca / e.xpProximoNivel) * 100));
    const liberados = e.locaisDisponiveis.filter(l => l.liberado).length;
    const totalLocais = e.locaisDisponiveis.length;
    const pctLocais = Math.round((liberados / totalLocais) * 100);
    const ultimaCaptura = e.bag.peixes[e.bag.peixes.length - 1];

    const statusTexto = e.podePescar ? "pronto pra pescar" : `aguarde ${Math.ceil(e.cooldownRestanteMs / 1000)}s`;
    const statusCor = e.podePescar ? "#4ff0c8" : "#ffb35a";

    const W = 900, H = 980;

    const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0c3448"/>
      <stop offset="100%" stop-color="#071a24"/>
    </linearGradient>
    <radialGradient id="glow" cx="30%" cy="10%" r="60%">
      <stop offset="0%" stop-color="#123a4d"/>
      <stop offset="100%" stop-color="#071a24" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- topo -->
  <circle cx="70" cy="76" r="30" fill="#0e2c3b" stroke="#2a8f78" stroke-width="2"/>
  <path d="M55 76 Q70 58 85 76 Q70 94 55 76 Z" fill="#4ff0c8"/>
  <text x="112" y="66" font-family="Arial, sans-serif" font-size="15" fill="#7fa3ae">system nejire</text>
  <text x="112" y="94" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#e9f6f5">painel de pesca</text>

  <circle cx="${W - 200}" cy="76" r="6" fill="${statusCor}"/>
  <text x="${W - 185}" y="82" font-family="Arial, sans-serif" font-size="18" fill="${statusCor}">${escapar(statusTexto)}</text>

  <!-- anel de nível -->
  ${anelProgresso(150, 250, 78, pctXp, "#4ff0c8")}
  <text x="150" y="240" font-family="Arial, sans-serif" font-size="42" font-weight="700" fill="#e9f6f5" text-anchor="middle">${e.nivel}</text>
  <text x="150" y="268" font-family="Arial, sans-serif" font-size="14" fill="#7fa3ae" text-anchor="middle">nível</text>

  <text x="270" y="220" font-family="Arial, sans-serif" font-size="16" fill="#7fa3ae">progresso de xp</text>
  <text x="270" y="252" font-family="Arial, sans-serif" font-size="26" font-weight="700" fill="#e9f6f5">${e.xpPesca} / ${e.xpProximoNivel}</text>
  <rect x="270" y="266" width="400" height="10" rx="5" fill="#173e50"/>
  <rect x="270" y="266" width="${4 * pctXp}" height="10" rx="5" fill="#4ff0c8"/>

  <!-- grid de status -->
  ${cartao(60, 340, 370, 120)}
  <text x="88" y="378" font-family="Arial, sans-serif" font-size="15" fill="#7fa3ae">saldo</text>
  <text x="88" y="416" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#ffb35a">${e.saldo} moedas</text>

  ${cartao(470, 340, 370, 120)}
  <text x="498" y="378" font-family="Arial, sans-serif" font-size="15" fill="#7fa3ae">local atual</text>
  <text x="498" y="416" font-family="Arial, sans-serif" font-size="26" font-weight="700" fill="#e9f6f5">${escapar(e.local.nome)}</text>

  ${cartao(60, 480, 370, 120)}
  <text x="88" y="518" font-family="Arial, sans-serif" font-size="15" fill="#7fa3ae">vara equipada</text>
  <text x="88" y="556" font-family="Arial, sans-serif" font-size="26" font-weight="700" fill="#e9f6f5">${escapar(e.vara.nome)}</text>

  ${cartao(470, 480, 370, 120)}
  <text x="498" y="518" font-family="Arial, sans-serif" font-size="15" fill="#7fa3ae">bag</text>
  <text x="498" y="556" font-family="Arial, sans-serif" font-size="26" font-weight="700" fill="#e9f6f5">${e.bag.peixes.length}/${e.bag.capacidade} · ${e.bag.valorTotal} moedas</text>

  <!-- locais liberados -->
  <text x="60" y="662" font-family="Arial, sans-serif" font-size="16" fill="#7fa3ae">locais liberados</text>
  <text x="${W - 60}" y="662" font-family="Arial, sans-serif" font-size="16" fill="#e9f6f5" text-anchor="end">${liberados}/${totalLocais}</text>
  <rect x="60" y="674" width="${W - 120}" height="12" rx="6" fill="#173e50"/>
  <rect x="60" y="674" width="${(W - 120) * pctLocais / 100}" height="12" rx="6" fill="#4fb4f0"/>

  <!-- última captura -->
  ${cartao(60, 730, W - 120, 150, 22)}
  <text x="90" y="770" font-family="Arial, sans-serif" font-size="15" fill="#7fa3ae">última captura</text>
  ${ultimaCaptura
      ? `<text x="90" y="820" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#e9f6f5">${escapar(ultimaCaptura.nome)}</text>
         <text x="90" y="854" font-family="Arial, sans-serif" font-size="17" fill="#7fa3ae">${escapar(ultimaCaptura.raridade)} · ${ultimaCaptura.peso}kg · ${ultimaCaptura.valor} moedas</text>`
      : `<text x="90" y="820" font-family="Arial, sans-serif" font-size="22" fill="#7fa3ae">nenhuma captura ainda — toque em pescar pra começar</text>`
  }

  <text x="${W / 2}" y="${H - 40}" font-family="Arial, sans-serif" font-size="14" fill="#4a6b76" text-anchor="middle">gerado agora · toque na lista abaixo pra agir</text>
</svg>`.trim();

    return sharp(Buffer.from(svg)).png().toBuffer();
}

module.exports = { gerarPainelPNG };
