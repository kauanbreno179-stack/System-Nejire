const path = require("path");
const Db = require("../../utils/db.js");
const Jid = require("../../utils/jid.js");

const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const chance = (p) => Math.random() < p;
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
const fmt = (n) => Math.round(Number(n) || 0).toLocaleString("pt-BR");
const dia = () => new Date(Date.now() - 3 * 3600000).toISOString().slice(0, 10);
const horaBR = () => new Date(Date.now() - 3 * 3600000).getUTCHours();

function fmtTempo(ms) {
    const s = Math.ceil(ms / 1000);
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}min ${s % 60}s`;
    const h = Math.floor(m / 60);
    return `${h}h ${m % 60}min`;
}

function barra(v, max, n = 10) {
    const cheio = clamp(Math.round((v / Math.max(1, max)) * n), 0, n);
    return "▰".repeat(cheio) + "▱".repeat(n - cheio);
}

function criar(cfg) {
    const DB = path.join(__dirname, "../../database", `rpg_${cfg.id}.json`);
    Db.ensure(DB, { jogadores: {}, global: {} });
    const ITENS = cfg.itens;
    const pf = cfg.pf;
    const TABELA = {};
    const M = { cfg, TABELA, rand, pick, chance, clamp, norm, fmt, fmtTempo, barra, dia, horaBR };
    const $ = cfg.moeda.e;

    // ── ITENS / INVENTÁRIO ───────────────────────────────
    M.item = (id) => ITENS[id] || null;
    M.nome = (id) => { const it = ITENS[id]; return it ? `${it.e || "📦"} ${it.n}` : String(id); };
    M.achar = (txt) => {
        const t = norm(txt);
        if (!t) return null;
        if (ITENS[t]) return t;
        const ids = Object.keys(ITENS);
        return ids.find(i => norm(ITENS[i].n) === t) || ids.find(i => i.startsWith(t)) || ids.find(i => norm(ITENS[i].n).includes(t)) || null;
    };
    M.qtd = (p, id) => p.inv[id] || 0;
    M.tem = (p, obj) => Object.entries(obj || {}).every(([i, n]) => M.qtd(p, i) >= n);
    M.add = (p, id, n = 1) => { p.inv[id] = (p.inv[id] || 0) + n; if (p.inv[id] <= 0) delete p.inv[id]; };
    M.rem = (p, obj) => { for (const [i, n] of Object.entries(obj || {})) M.add(p, i, -n); };
    M.txtItens = (obj) => Object.entries(obj || {}).map(([i, n]) => `${n}x ${M.nome(i)}`).join(", ");
    M.falta = (p, obj) => Object.entries(obj || {}).filter(([i, n]) => M.qtd(p, i) < n).map(([i, n]) => `${n - M.qtd(p, i)}x ${M.nome(i)}`).join(", ");
    M.stat = (p, k, n = 1) => { p.stats[k] = (p.stats[k] || 0) + n; };
    M.box = (titulo, linhas) => `╭─❍ ${cfg.emoji} *${titulo}* ❍─╮\n${linhas.map(l => `│ ${l}`).join("\n")}\n╰──────────────╯`;
    M.rodape = (p) => `❤️ ${Math.max(0, Math.round(p.hp))}/${p.hpMax} · ⚡ ${Math.round(p.en)}/${p.enMax}`;
    M.cmd = (p, nome) => `${p ? "" : ""}${nome}`;

    // parse "nome do item [qtd]" → { id, n }
    M.semAlvo = (a) => a.args.filter(t => !/^@/.test(t) && !/^\d{8,}$/.test(t));
    M.parseItem = (args) => {
        const arr = [...args];
        let n = 1, tudo = false;
        if (arr.length && /^\d+$/.test(arr[arr.length - 1]) && arr.length > 1) n = Math.max(1, parseInt(arr.pop(), 10));
        else if (arr.length && /^(tudo|todos|all)$/i.test(arr[arr.length - 1]) && arr.length > 1) { tudo = true; arr.pop(); }
        return { id: M.achar(arr.join(" ")), n, tudo, txt: arr.join(" ") };
    };
    M.alvo = (a) => Jid.resolverAlvo({ info: a.ctx.info, args: a.args, q: a.q, sender: a.ctx.sender, participantes: [] });

    // ── JOGADOR ──────────────────────────────────────────
    M.novo = (nome) => {
        const b = cfg.inicio;
        const agora = Date.now();
        const p = {
            nome, criado: agora, nivel: 1, xp: 0,
            hp: b.hp, hpMax: b.hp, en: b.en, enMax: b.en, atk: b.atk, def: b.def,
            moeda: b.moeda, banco: 0, inv: { ...(b.inv || {}) }, equip: {}, dur: {}, cd: {}, buffs: {},
            stats: {}, conquistas: [], flags: {}, pets: [], base: 0, plantio: [], bau: {}, missoes: null,
            cap: 0, local: cfg.localInicial || null, x: cfg.extras ? cfg.extras() : {},
            uh: agora, ue: agora, ut: agora
        };
        return p;
    };

    function tick(p) {
        const agora = Date.now();
        const r = cfg.regen || { hp: 90000, en: 60000 };
        if (p.hp < p.hpMax) {
            const g = Math.floor((agora - p.uh) / r.hp);
            if (g > 0) { p.hp = Math.min(p.hpMax, p.hp + g); p.uh += g * r.hp; }
        }
        if (p.hp >= p.hpMax) p.uh = agora;
        if (p.en < p.enMax) {
            const g = Math.floor((agora - p.ue) / r.en);
            if (g > 0) { p.en = Math.min(p.enMax, p.en + g); p.ue += g * r.en; }
        }
        if (p.en >= p.enMax) p.ue = agora;
        if (cfg.tick && agora - p.ut >= 60000) { cfg.tick(p, agora - p.ut, M); p.ut = agora; }
    }
    M.tick = tick;

    M.xpProx = (p) => Math.floor(30 * Math.pow(p.nivel, 1.7) + 20);
    M.buff = (p, k) => { const b = p.buffs[k]; if (!b) return 0; if (b.ate < Date.now()) { delete p.buffs[k]; return 0; } return b.v; };
    M.addBuff = (p, k, v, ms) => { p.buffs[k] = { v, ate: Date.now() + ms }; };
    M.ganharXp = (p, n) => {
        const bx = M.buff(p, "xp");
        if (bx) n = Math.round(n * (1 + bx / 100));
        p.xp += n;
        let msg = "";
        const g = cfg.nivelGanho || { hp: 4, en: 1, atk: 1, def: 0 };
        while (p.xp >= M.xpProx(p)) {
            p.xp -= M.xpProx(p);
            p.nivel++;
            p.hpMax += g.hp || 0; p.enMax += g.en || 0; p.atk += g.atk || 0; p.def += g.def || 0;
            p.hp = p.hpMax; p.en = p.enMax;
            msg += `\n🆙 *subiu pro nível ${p.nivel}!* (vida e energia restauradas)`;
            if (cfg.aoSubir) msg += cfg.aoSubir(p, M) || "";
        }
        return msg;
    };
    M.petBonus = (p) => (p.pets || []).reduce((s, pt) => {
        const def = (cfg.pets || {})[pt.id];
        return def && M.petFome(pt) > 20 ? s + Math.floor(def.atk * (1 + pt.nivel * 0.15)) : s;
    }, 0);
    const somaEquip = (p, campo) => Object.values(p.equip).reduce((s, id) => s + ((ITENS[id] && ITENS[id][campo]) || 0), 0);
    M.atk = (p) => p.atk + somaEquip(p, "atk") + M.buff(p, "atk") + M.petBonus(p) + (cfg.bonusAtk ? cfg.bonusAtk(p) : 0);
    M.defesa = (p) => p.def + somaEquip(p, "def") + M.buff(p, "def") + (cfg.bonusDef ? cfg.bonusDef(p) : 0);
    M.morrer = (p) => {
        const perda = Math.floor(p.moeda * ((cfg.morte && cfg.morte.perda) ?? 0.1));
        p.moeda -= perda;
        p.hp = Math.max(1, Math.floor(p.hpMax * 0.3));
        M.stat(p, "mortes");
        return `${pick(cfg.morte.txt)}\n💸 perdeu ${fmt(perda)} ${$}`;
    };
    M.cd = (p, k) => Math.max(0, (p.cd[k] || 0) - Date.now());
    M.setCd = (p, k, ms) => { p.cd[k] = Date.now() + ms; };
    M.msgCd = (f) => `⏳ calma! espera *${fmtTempo(f)}* pra fazer isso de novo.`;
    M.local = (p) => (cfg.locais && cfg.locais[p.local]) || null;
    M.exigeLocal = (p, lista) => (!lista || lista.includes(p.local)) ? null : `📍 você precisa estar em: ${lista.map(l => (cfg.locais[l] ? cfg.locais[l].n : l)).join(" ou ")}. use *${pf}viajar*`;

    // ── LOOT ─────────────────────────────────────────────
    M.rolar = (p, drops, mult = 1, tier = 99) => {
        const got = {};
        for (const [i, pr, a, b, tmin] of (drops || [])) {
            if (tmin && tier < tmin) continue;
            if (chance(Math.min(1, pr * mult))) { const n = rand(a ?? 1, b ?? a ?? 1); M.add(p, i, n); got[i] = (got[i] || 0) + n; }
        }
        return got;
    };
    M.melhorFerr = (p, grupo) => {
        let best = null, t = -1;
        for (const id of Object.keys(p.inv)) { const it = ITENS[id]; if (it && it.grupo === grupo && it.tier > t) { best = id; t = it.tier; } }
        return best ? { id: best, tier: t } : null;
    };
    M.gastar = (p, ferr, n = 1) => {
        const it = ITENS[ferr.id];
        if (!it.dur) return "";
        if (p.dur[ferr.id] === undefined) p.dur[ferr.id] = it.dur;
        p.dur[ferr.id] -= n;
        if (p.dur[ferr.id] <= 0) { M.add(p, ferr.id, -1); delete p.dur[ferr.id]; return `\n💥 seu(sua) ${it.n} quebrou!`; }
        return "";
    };

    // ── COMBATE ──────────────────────────────────────────
    M.lutar = (p, mob, opt = {}) => {
        let mhp = mob.hp, hp = p.hp, rounds = 0, causado = 0, sofrido = 0;
        const atk = opt.atk ?? M.atk(p), def = opt.def ?? M.defesa(p);
        while (mhp > 0 && hp > 0 && rounds < 40) {
            rounds++;
            let d = Math.max(1, atk + rand(0, Math.ceil(atk / 2)) - (mob.def || 0));
            if (chance(0.12)) d = Math.round(d * 1.7);
            mhp -= d; causado += d;
            if (mhp <= 0) break;
            const dm = Math.max(0, mob.atk + rand(0, Math.ceil(mob.atk / 3)) - def);
            hp -= dm; sofrido += dm;
        }
        const venceu = mhp <= 0 && hp > 0;
        p.hp = Math.max(0, hp);
        return { venceu, rounds, causado, sofrido };
    };

    // ── CONQUISTAS ───────────────────────────────────────
    function checarConquistas(p) {
        let msg = "";
        for (const c of (cfg.conquistas || [])) {
            if (p.conquistas.includes(c.id)) continue;
            let ok = false;
            try { ok = c.ok(p); } catch { ok = false; }
            if (!ok) continue;
            p.conquistas.push(c.id);
            p.moeda += c.moeda || 0;
            msg += `\n\n🏆 *conquista desbloqueada:* ${c.n}${c.moeda ? ` (+${fmt(c.moeda)} ${$})` : ""}`;
            if (c.xp) msg += M.ganharXp(p, c.xp);
        }
        return msg;
    }

    // ── REGISTRO DE COMANDOS ─────────────────────────────
    M.def = (nome, fn, opts = {}) => {
        const chave = pf + nome;
        if (TABELA[chave]) throw new Error(`comando duplicado: ${chave}`);
        TABELA[chave] = async (ctx) => {
            const bd = Db.read(DB, null) || {};
            bd.jogadores = bd.jogadores || {};
            bd.global = bd.global || {};
            const p = bd.jogadores[ctx.sender];
            if (!p && !opts.livre) {
                await ctx.reply(`${cfg.emoji} você ainda não tem personagem em *${cfg.titulo}*!\ncrie o seu com *${ctx.prefix}${pf}comecar*`);
                return;
            }
            if (p) tick(p);
            const a = { ctx, p, bd, args: ctx.args || [], q: ctx.q || "", pf: ctx.prefix, me: ctx.sender, cmd: (n) => `${ctx.prefix}${pf}${n}` };
            const out = fn(a);
            let extra = "";
            if (p) extra = checarConquistas(p);
            Db.write(DB, bd);
            if (out) await ctx.reply(out + extra);
        };
    };

    // ── criar personagem ─────────────────────────────────
    M.fnComecar = (escolhas = []) => (a) => {
        if (a.p) return `${cfg.emoji} você já tem um personagem: *${a.p.nome}* (nível ${a.p.nivel}). use *${a.cmd("perfil")}*`;
        const nomePadrao = (a.ctx.info && a.ctx.info.pushName) || "Jogador";
        const nome = (a.args[0] || nomePadrao).slice(0, 20);
        const escolhido = {};
        for (let i = 0; i < escolhas.length; i++) {
            const e = escolhas[i];
            const v = norm(a.args[i + 1] || "");
            if (!e.ops[v]) {
                const lista = Object.entries(e.ops).map(([k, o]) => `• *${k}* — ${o.d}`).join("\n");
                return `${cfg.emoji} *${cfg.titulo}*\nuse: ${a.cmd("comecar")} <nome> ${escolhas.map(x => `<${x.k}>`).join(" ")}\n\n*${e.k}s disponíveis:*\n${lista}`;
            }
            escolhido[e.k] = v;
        }
        const p = M.novo(nome);
        for (const [k, v] of Object.entries(escolhido)) {
            p.x[k] = v;
            const o = escolhas.find(e => e.k === k).ops[v];
            const b = o.bonus || {};
            p.hpMax += b.hp || 0; p.hp = p.hpMax; p.enMax += b.en || 0; p.en = p.enMax; p.atk += b.atk || 0; p.def += b.def || 0; p.moeda += b.moeda || 0;
            for (const [i, n] of Object.entries(o.inv || {})) M.add(p, i, n);
        }
        if (cfg.aoCriar) cfg.aoCriar(p, escolhido, M);
        a.bd.jogadores[a.me] = p;
        return `${cfg.emoji} *personagem criado!*\n\n👤 ${nome}${Object.entries(escolhido).map(([k, v]) => ` · ${k}: ${v}`).join("")}\n${cfg.boasVindas || ""}\n\nveja os comandos com *${a.cmd("ajuda")}*`;
    };

    M.fnAjuda = (secoes) => (a) => {
        const linhas = [`${cfg.emoji} *${cfg.titulo}* — todos os comandos\n`];
        for (const s of secoes) linhas.push(`*${s.t}*\n${s.c.map(c => `${a.pf}${pf}${c}`).join(" · ")}\n`);
        return linhas.join("\n").trim();
    };

    M.fnPerfil = () => (a) => {
        const p = a.p;
        const eq = Object.entries(p.equip).map(([s, id]) => `${s}: ${M.nome(id)}`).join(" | ") || "nada equipado";
        const linhas = [
            `👤 ${p.nome}${p.local && cfg.locais && cfg.locais[p.local] ? ` · 📍 ${cfg.locais[p.local].n}` : ""}`,
            `🎖️ nível ${p.nivel} — xp ${p.xp}/${M.xpProx(p)}`,
            `❤️ ${barra(p.hp, p.hpMax)} ${Math.round(p.hp)}/${p.hpMax}`,
            `⚡ ${barra(p.en, p.enMax)} ${Math.round(p.en)}/${p.enMax}`,
            `⚔️ ataque ${M.atk(p)} · 🛡️ defesa ${M.defesa(p)}`,
            `${$} ${cfg.moeda.n}: ${fmt(p.moeda)}${p.banco ? ` (banco: ${fmt(p.banco)})` : ""}`,
            `🎒 ${eq}`
        ];
        if (cfg.perfilExtra) linhas.push(...cfg.perfilExtra(p, M));
        if (p.pets.length) linhas.push(`🐾 pets: ${p.pets.map(pt => pt.nome).join(", ")}`);
        linhas.push(`🏆 conquistas: ${p.conquistas.length}/${(cfg.conquistas || []).length}`);
        return M.box(`perfil`, linhas);
    };

    M.fnStatus = () => (a) => {
        const p = a.p;
        const linhas = [`❤️ ${barra(p.hp, p.hpMax, 12)} ${Math.round(p.hp)}/${p.hpMax}`, `⚡ ${barra(p.en, p.enMax, 12)} ${Math.round(p.en)}/${p.enMax}`];
        if (cfg.statusExtra) linhas.push(...cfg.statusExtra(p, M));
        const bf = Object.keys(p.buffs).filter(k => M.buff(p, k) !== 0).map(k => `✨ ${k} +${p.buffs[k].v} (${fmtTempo(p.buffs[k].ate - Date.now())})`);
        if (bf.length) linhas.push(...bf);
        const cds = Object.keys(p.cd).filter(k => M.cd(p, k) > 0).map(k => `⏳ ${k}: ${fmtTempo(M.cd(p, k))}`);
        if (cds.length) linhas.push(...cds.slice(0, 8));
        return M.box("status", linhas);
    };

    M.fnInv = () => (a) => {
        const p = a.p;
        const ids = Object.keys(p.inv);
        if (!ids.length) return `🎒 sua mochila tá vazia!`;
        const grupos = {};
        for (const id of ids) { const t = (ITENS[id] && ITENS[id].tipo) || "outros"; (grupos[t] = grupos[t] || []).push(id); }
        const nomesTipo = cfg.tipos || {};
        const linhas = [];
        for (const [t, lista] of Object.entries(grupos)) {
            linhas.push(`*${nomesTipo[t] || t}*`);
            linhas.push(lista.map(i => `${M.nome(i)} x${p.inv[i]}`).join(" · "));
        }
        return M.box("mochila", linhas);
    };

    M.fnEquipar = () => (a) => {
        const { id } = M.parseItem(a.args);
        if (!id || !M.qtd(a.p, id)) return `usa: ${a.cmd("equipar")} <item que você tem>`;
        const it = ITENS[id];
        if (!it.slot) return `${M.nome(id)} não dá pra equipar.`;
        if (it.nv && a.p.nivel < it.nv) return `🔒 precisa de nível ${it.nv} pra equipar ${M.nome(id)}.`;
        a.p.equip[it.slot] = id;
        return `🎽 equipou ${M.nome(id)} no slot *${it.slot}*!\n⚔️ ataque ${M.atk(a.p)} · 🛡️ defesa ${M.defesa(a.p)}`;
    };
    M.fnDesequipar = () => (a) => {
        const slot = norm(a.args[0]);
        if (!slot || !a.p.equip[slot]) return `usa: ${a.cmd("desequipar")} <slot>\nequipado: ${Object.keys(a.p.equip).join(", ") || "nada"}`;
        const id = a.p.equip[slot]; delete a.p.equip[slot];
        return `📦 ${M.nome(id)} foi guardado.`;
    };
    M.fnEquip = () => (a) => {
        const e = Object.entries(a.p.equip);
        if (!e.length) return `🎽 você não tem nada equipado. use *${a.cmd("equipar")}*`;
        return M.box("equipamento", [...e.map(([s, id]) => `${s}: ${M.nome(id)}${ITENS[id].dur && a.p.dur[id] !== undefined ? ` (${a.p.dur[id]}/${ITENS[id].dur})` : ""}`), `⚔️ ${M.atk(a.p)} · 🛡️ ${M.defesa(a.p)}`]);
    };

    M.fnUsar = (tipos) => (a) => {
        const { id, n } = M.parseItem(a.args);
        if (!id || !M.qtd(a.p, id)) return `usa: ${a.cmd(a.usoNome || "usar")} <item> — você precisa ter o item na mochila.`;
        const it = ITENS[id];
        if (!it.ef || (tipos && !tipos.includes(it.tipo))) return `${M.nome(id)} não serve pra isso.`;
        const vezes = Math.min(n, M.qtd(a.p, id), 10);
        const out = [];
        for (let i = 0; i < vezes; i++) {
            const ef = it.ef;
            if (ef.hp) a.p.hp = clamp(a.p.hp + ef.hp, 1, a.p.hpMax);
            if (ef.en) a.p.en = clamp(a.p.en + ef.en, 0, a.p.enMax);
            if (ef.buff) M.addBuff(a.p, ef.buff[0], ef.buff[1], ef.buff[2]);
            if (ef.xp) out.push(M.ganharXp(a.p, ef.xp));
            if (ef.needs && cfg.aplicarNeeds) cfg.aplicarNeeds(a.p, ef.needs);
        }
        M.add(a.p, id, -vezes);
        M.stat(a.p, "usou_" + (it.tipo || "item"), vezes);
        const parte = [];
        if (it.ef.needs && cfg.txtNeeds) parte.push(cfg.txtNeeds(it.ef.needs, vezes));
        if (it.ef.hp) parte.push(`❤️ ${it.ef.hp > 0 ? "+" : ""}${it.ef.hp * vezes}`);
        if (it.ef.en) parte.push(`⚡ ${it.ef.en > 0 ? "+" : ""}${it.ef.en * vezes}`);
        if (it.ef.buff) parte.push(`✨ ${it.ef.buff[0]} +${it.ef.buff[1]}`);
        return `${M.nome(id)} x${vezes} usado!${it.ef.msg ? `\n${it.ef.msg}` : ""}\n${parte.join(" · ")}\n${M.rodape(a.p)}${out.join("")}`;
    };

    M.fnDescartar = () => (a) => {
        const { id, n, tudo } = M.parseItem(a.args);
        if (!id || !M.qtd(a.p, id)) return `usa: ${a.cmd("descartar")} <item> [qtd]`;
        const q = tudo ? M.qtd(a.p, id) : Math.min(n, M.qtd(a.p, id));
        M.add(a.p, id, -q);
        return `🗑️ jogou fora ${q}x ${M.nome(id)}.`;
    };

    // ── loja ─────────────────────────────────────────────
    M.fnLoja = (cat, titulo, nvMin = 0) => (a) => {
        if (a.p.nivel < nvMin) return `🔒 essa loja abre no nível ${nvMin}.`;
        const linhas = Object.entries(cat).map(([id, pr]) => `${M.nome(id)} — ${$} ${fmt(pr)}`);
        return M.box(titulo, [...linhas, ``, `compre: ${a.cmd("comprar")} <item> [qtd]`, `seu saldo: ${$} ${fmt(a.p.moeda)}`]);
    };
    M.fnComprar = (cats, comando) => (a) => {
        const { id, n } = M.parseItem(a.args);
        const cat = id && cats.find(c => c[id] !== undefined);
        if (!id || !cat) return `usa: ${a.cmd(comando || "comprar")} <item> [qtd]\nveja o que tem à venda na loja!`;
        const q = Math.min(n, 999);
        const total = cat[id] * q;
        if (a.p.moeda < total) return `💸 ${q}x ${M.nome(id)} custa ${$} ${fmt(total)} e você tem ${$} ${fmt(a.p.moeda)}.`;
        a.p.moeda -= total;
        M.add(a.p, id, q);
        M.stat(a.p, "compras", q);
        return `🛒 comprou ${q}x ${M.nome(id)} por ${$} ${fmt(total)}!\nsaldo: ${$} ${fmt(a.p.moeda)}`;
    };
    M.fnVender = () => (a) => {
        const { id, n, tudo, txt } = M.parseItem(a.args);
        const vendavel = (i) => ITENS[i] && ITENS[i].v && !Object.values(a.p.equip).includes(i);
        if (/^(tudo|todos|materiais)$/i.test(norm(a.args[0] || ""))) {
            let total = 0, qt = 0;
            for (const i of Object.keys(a.p.inv)) if (vendavel(i) && ITENS[i].tipo === "material") { total += ITENS[i].v * a.p.inv[i]; qt += a.p.inv[i]; delete a.p.inv[i]; }
            if (!qt) return `você não tem materiais pra vender.`;
            a.p.moeda += total;
            return `💰 vendeu ${qt} materiais por ${$} ${fmt(total)}!`;
        }
        if (!id || !M.qtd(a.p, id)) return `usa: ${a.cmd("vender")} <item> [qtd|tudo]  ou  ${a.cmd("vender")} materiais`;
        if (!vendavel(id)) return `${M.nome(id)} não pode ser vendido.`;
        const q = tudo ? M.qtd(a.p, id) : Math.min(n, M.qtd(a.p, id));
        M.add(a.p, id, -q);
        const total = ITENS[id].v * q;
        a.p.moeda += total;
        M.stat(a.p, "vendas", q);
        return `💰 vendeu ${q}x ${M.nome(id)} por ${$} ${fmt(total)}!`;
    };

    // ── craft ────────────────────────────────────────────
    M.fnCraft = (receitas, verbo = "criou") => (a) => {
        const { id, n } = M.parseItem(a.args);
        const r = id && receitas[id];
        if (!r) return `usa: ${a.cmd("craftar")} <item> [qtd]\nveja as receitas com *${a.cmd("receitas")}*`;
        if (r.nv && a.p.nivel < r.nv) return `🔒 receita liberada no nível ${r.nv}.`;
        if (r.est && !M.qtd(a.p, r.est)) return `🧰 você precisa ter ${M.nome(r.est)} pra fazer isso.`;
        const q = Math.min(n, 64);
        const need = {}; for (const [i, c] of Object.entries(r.i)) need[i] = c * q;
        if (!M.tem(a.p, need)) return `❌ faltam: ${M.falta(a.p, need)}`;
        M.rem(a.p, need);
        M.add(a.p, id, (r.q || 1) * q);
        M.stat(a.p, "criou", q); M.stat(a.p, "craft_" + id, q);
        return `🔨 ${verbo} ${(r.q || 1) * q}x ${M.nome(id)}!${M.ganharXp(a.p, (r.xp || 3) * q)}`;
    };
    M.fnReceitas = (receitas, titulo) => (a) => {
        const alvo = a.q ? M.achar(a.q) : null;
        if (alvo && receitas[alvo]) { const r = receitas[alvo]; return M.box(`receita`, [`${M.nome(alvo)} x${r.q || 1}`, `📋 ${M.txtItens(r.i)}`, r.est ? `🧰 precisa de ${M.nome(r.est)}` : `🧰 sem estação`, r.nv ? `🔒 nível ${r.nv}` : ""].filter(Boolean)); }
        const pag = Math.max(1, parseInt(a.args[0], 10) || 1);
        const todas = Object.entries(receitas);
        const porPag = 12, totalPag = Math.ceil(todas.length / porPag);
        const fatia = todas.slice((pag - 1) * porPag, pag * porPag);
        if (!fatia.length) return `só existem ${totalPag} página(s) de receitas.`;
        return M.box(`${titulo} (pág ${pag}/${totalPag})`, [...fatia.map(([i, r]) => `${M.nome(i)} ← ${M.txtItens(r.i)}`), `use ${a.cmd("receitas")} <pág> ou <item>`]);
    };

    // ── atividade (coletar/trabalhar) ───────────────────
    M.atividade = (s) => (a) => {
        const p = a.p, chave = s.chave || s.titulo;
        if (s.nv && p.nivel < s.nv) return `🔒 precisa ser nível *${s.nv}* pra isso (você é ${p.nivel}).`;
        const errLocal = M.exigeLocal(p, s.local); if (errLocal) return errLocal;
        let ferr = null;
        if (s.ferr) {
            ferr = M.melhorFerr(p, s.ferr);
            if (!ferr && s.ferrOpc) ferr = null;
            else if (!ferr || ferr.tier < (s.ferrMin || 0)) return `🔧 você precisa de ${s.ferrNome || s.ferr}${s.ferrMin ? " melhor" : ""} pra isso.`;
        }
        if (s.requer && !M.tem(p, s.requer)) return `🎒 você precisa ter: ${M.txtItens(s.requer)}`;
        if (s.exige && !M.tem(p, s.exige)) return `🎒 faltam: ${M.falta(p, s.exige)}`;
        if (p.en < (s.en || 0)) return `⚡ energia insuficiente (${Math.round(p.en)}/${s.en}). use *${a.cmd(cfg.cmdDescanso || "descansar")}*!`;
        if (p.hp < (s.hpMin || 1)) return `💔 você tá ferido demais pra isso! cure-se antes.`;
        const f = M.cd(p, chave); if (f) return M.msgCd(f);
        p.en -= s.en || 0; M.setCd(p, chave, s.cd ?? 30000);
        if (s.exige) M.rem(p, s.exige);
        M.stat(p, s.stat || chave);
        const linhas = [`${s.e || cfg.emoji} *${s.titulo}*`, pick(s.frases || ["você se esforçou bastante!"])];
        let desgaste = "";
        if (ferr) desgaste = M.gastar(p, ferr, s.desgaste || 1);
        if (s.risco && chance(s.risco.c)) {
            const d = rand(...s.risco.dano);
            p.hp -= d;
            linhas.push(`⚠️ ${pick(s.risco.frases)} (-${d}❤️)`);
            if (p.hp <= 0) return `${linhas.join("\n")}\n${M.morrer(p)}${desgaste}`;
            if (s.risco.falha !== false) return `${linhas.join("\n")}\n😖 você não conseguiu nada dessa vez.\n${M.rodape(p)}${desgaste}`;
        }
        const mult = (ferr ? 1 + ferr.tier * 0.12 : 1) * (1 + M.buff(p, "sorte") / 100) * (s.mult || 1);
        const got = M.rolar(p, s.drops, mult, ferr ? ferr.tier : 99);
        if (Object.keys(got).length) linhas.push(`🎁 ${M.txtItens(got)}`);
        else if (!s.moeda) linhas.push(`🕳️ não achou nada de valor.`);
        if (s.moeda) { const g = Math.round(rand(...s.moeda) * (1 + M.buff(p, "moeda") / 100)); p.moeda += g; linhas.push(`${$} +${fmt(g)} ${cfg.moeda.n}`); }
        if (s.en_gan) { p.en = Math.min(p.enMax, p.en + s.en_gan); }
        let xpMsg = "";
        if (s.xp) { linhas.push(`✨ +${s.xp} xp`); xpMsg = M.ganharXp(p, s.xp); }
        if (s.aoFim) { const extra = s.aoFim(p, M); if (extra) linhas.push(extra); }
        linhas.push(M.rodape(p));
        return linhas.join("\n") + xpMsg + desgaste;
    };

    // ── combate contra mobs ──────────────────────────────
    M.resultadoLuta = (p, mob, r, titulo, emoji) => {
        const linhas = [`${emoji || "⚔️"} *${titulo}* — contra ${mob.e || ""} *${mob.n}*`, `🗡️ ${r.rounds} rounds · causou ${r.causado} · sofreu ${r.sofrido}`];
        if (r.venceu) {
            const got = M.rolar(p, mob.drops, 1 + M.buff(p, "sorte") / 100);
            const g = mob.moeda ? Math.round(rand(...mob.moeda) * (1 + M.buff(p, "moeda") / 100)) : 0;
            p.moeda += g;
            M.stat(p, "vitorias"); M.stat(p, "abate_" + norm(mob.n));
            linhas.push(`🏅 *vitória!*`);
            if (Object.keys(got).length) linhas.push(`🎁 ${M.txtItens(got)}`);
            if (g) linhas.push(`${$} +${fmt(g)}`);
            linhas.push(`✨ +${mob.xp} xp`);
            linhas.push(M.rodape(p));
            return linhas.join("\n") + M.ganharXp(p, mob.xp);
        }
        M.stat(p, "derrotas");
        linhas.push(`💀 *derrota...*`);
        linhas.push(M.morrer(p));
        return linhas.join("\n");
    };
    M.combate = (s) => (a) => {
        const p = a.p;
        if (s.nv && p.nivel < s.nv) return `🔒 precisa ser nível *${s.nv}*.`;
        const errLocal = M.exigeLocal(p, s.local); if (errLocal) return errLocal;
        if (s.requer && !M.tem(p, s.requer)) return `🎒 você precisa ter: ${M.txtItens(s.requer)}`;
        const elig = s.mobs.filter(m => (m.nv || 1) <= p.nivel);
        if (!elig.length) return `🔒 nenhum inimigo disponível pro seu nível ainda.`;
        if (p.hp < 4) return `💔 você tá muito ferido! cure-se antes de lutar.`;
        if (p.en < (s.en || 0)) return `⚡ energia insuficiente (${Math.round(p.en)}/${s.en}).`;
        const chave = s.chave || s.titulo;
        const f = M.cd(p, chave); if (f) return M.msgCd(f);
        let mob = null;
        const alvo = norm(a.q);
        if (alvo) mob = elig.find(m => norm(m.n).includes(alvo));
        if (!mob) mob = pick(elig);
        p.en -= s.en || 0; M.setCd(p, chave, s.cd ?? 40000);
        if (s.exige) { if (!M.tem(p, s.exige)) return `🎒 faltam: ${M.falta(p, s.exige)}`; M.rem(p, s.exige); }
        const r = M.lutar(p, mob);
        return M.resultadoLuta(p, mob, r, s.titulo, s.e);
    };
    M.boss = (s) => (a) => {
        const p = a.p, b = s.chefe;
        if (s.nv && p.nivel < s.nv) return `🔒 *${b.n}* exige nível *${s.nv}*.`;
        const errLocal = M.exigeLocal(p, s.local); if (errLocal) return errLocal;
        if (s.exige && !M.tem(p, s.exige)) return `🎒 pra enfrentar ${b.n} você precisa de: ${M.txtItens(s.exige)}`;
        if (p.hp < p.hpMax * 0.6) return `💔 encare o chefe com pelo menos 60% de vida! (${Math.round(p.hp)}/${p.hpMax})`;
        if (p.en < (s.en || 0)) return `⚡ energia insuficiente (${Math.round(p.en)}/${s.en}).`;
        const chave = s.chave || "boss_" + norm(b.n);
        const f = M.cd(p, chave); if (f) return M.msgCd(f);
        p.en -= s.en || 0; M.setCd(p, chave, s.cd ?? 3600000);
        if (s.exige) M.rem(p, s.exige);
        const r = M.lutar(p, b);
        if (r.venceu) M.stat(p, "chefes");
        const primeira = r.venceu && !p.flags["boss_" + chave];
        let txt = M.resultadoLuta(p, b, r, s.titulo, s.e || "👑");
        if (primeira) {
            p.flags["boss_" + chave] = true;
            const bonus = s.primeira || { moeda: 200, xp: 100 };
            p.moeda += bonus.moeda || 0;
            for (const [i, q] of Object.entries(bonus.itens || {})) M.add(p, i, q);
            txt += `\n\n🌟 *primeira vez derrotando ${b.n}!* bônus: ${$} +${fmt(bonus.moeda || 0)}${bonus.itens ? ", " + M.txtItens(bonus.itens) : ""}${M.ganharXp(p, bonus.xp || 0)}`;
        }
        return txt;
    };

    // ── eventos aleatórios (exploração) ──────────────────
    M.evento = (s) => (a) => {
        const p = a.p, chave = s.chave || s.titulo;
        if (s.nv && p.nivel < s.nv) return `🔒 precisa ser nível *${s.nv}*.`;
        const errLocal = M.exigeLocal(p, s.local); if (errLocal) return errLocal;
        if (s.requer && !M.tem(p, s.requer)) return `🎒 você precisa ter: ${M.txtItens(s.requer)}`;
        if (s.exige && !M.tem(p, s.exige)) return `🎒 faltam: ${M.falta(p, s.exige)}`;
        if (p.en < (s.en || 0)) return `⚡ energia insuficiente (${Math.round(p.en)}/${s.en}).`;
        if (p.hp < (s.hpMin || 1)) return `💔 você tá ferido demais! cure-se antes.`;
        const f = M.cd(p, chave); if (f) return M.msgCd(f);
        p.en -= s.en || 0; M.setCd(p, chave, s.cd ?? 60000);
        if (s.exige) M.rem(p, s.exige);
        M.stat(p, s.stat || chave);
        const total = s.pool.reduce((t, e) => t + (e.w || 1), 0);
        let r = Math.random() * total, ev = s.pool[0];
        for (const e of s.pool) { r -= e.w || 1; if (r <= 0) { ev = e; break; } }
        const linhas = [`${s.e || cfg.emoji} *${s.titulo}*`, ev.t];
        if (ev.hp) { p.hp = clamp(p.hp + ev.hp, 0, p.hpMax); linhas.push(`❤️ ${ev.hp > 0 ? "+" : ""}${ev.hp}`); }
        if (ev.en) { p.en = clamp(p.en + ev.en, 0, p.enMax); linhas.push(`⚡ ${ev.en > 0 ? "+" : ""}${ev.en}`); }
        if (ev.moeda) { const mv = Array.isArray(ev.moeda) ? rand(...ev.moeda) : ev.moeda; p.moeda = Math.max(0, p.moeda + mv); linhas.push(`${$} ${mv > 0 ? "+" : ""}${fmt(mv)}`); }
        if (ev.item) { const [i, n] = ev.item; M.add(p, i, n); linhas.push(`🎁 ${n}x ${M.nome(i)}`); }
        if (ev.drops) { const got = M.rolar(p, ev.drops); if (Object.keys(got).length) linhas.push(`🎁 ${M.txtItens(got)}`); }
        if (ev.buff) { M.addBuff(p, ev.buff[0], ev.buff[1], ev.buff[2]); linhas.push(`✨ ${ev.buff[0]} +${ev.buff[1]}`); }
        if (ev.flag) p.flags[ev.flag] = true;
        if (cfg.aoEvento && ev.efeito) cfg.aoEvento(p, ev.efeito, M);
        if (p.hp <= 0) return `${linhas.join("\n")}\n${M.morrer(p)}`;
        let xpMsg = "";
        const xp = ev.xp ?? s.xp ?? 0;
        if (xp) { linhas.push(`✨ +${xp} xp`); xpMsg = M.ganharXp(p, xp); }
        linhas.push(M.rodape(p));
        return linhas.join("\n") + xpMsg;
    };

    // ── descanso / treino / aposta ───────────────────────
    M.fnDescansar = (s = {}) => (a) => {
        const p = a.p;
        const f = M.cd(p, "descansar"); if (f) return M.msgCd(f);
        if (s.custo && p.moeda < s.custo) return `💸 custa ${$} ${fmt(s.custo)} e você tem ${$} ${fmt(p.moeda)}.`;
        if (p.hp >= p.hpMax && p.en >= p.enMax) return `✨ você já tá com tudo cheio!`;
        p.moeda -= s.custo || 0;
        p.hp = Math.min(p.hpMax, p.hp + Math.ceil(p.hpMax * (s.cura ?? 0.6)));
        p.en = Math.min(p.enMax, p.en + Math.ceil(p.enMax * (s.curaEn ?? 0.6)));
        M.setCd(p, "descansar", s.cd ?? 300000);
        if (s.aoFim) s.aoFim(p, M);
        return `${s.e || "🛏️"} ${s.txt || "você descansou um pouco."}\n${M.rodape(p)}${s.custo ? `\n💸 -${$} ${fmt(s.custo)}` : ""}`;
    };
    M.fnTreinar = (s) => (a) => {
        const p = a.p;
        const f = M.cd(p, s.chave); if (f) return M.msgCd(f);
        if (p.en < (s.en || 5)) return `⚡ energia insuficiente (precisa de ${s.en || 5}).`;
        const custo = Math.round((s.custo || 0) * (1 + (p.flags["tr_" + s.chave] || 0) * 0.25));
        if (p.moeda < custo) return `💸 esse treino custa ${$} ${fmt(custo)} agora.`;
        p.moeda -= custo; p.en -= s.en || 5; M.setCd(p, s.chave, s.cd ?? 600000);
        p.flags["tr_" + s.chave] = (p.flags["tr_" + s.chave] || 0) + 1;
        const g = rand(...(s.ganho || [1, 1]));
        p[s.stat] += g;
        if (s.stat === "hpMax") p.hp += g;
        M.stat(p, "treinos");
        return `${s.e || "💪"} ${s.txt || "você treinou pesado!"}\n${s.rotulo || s.stat} +${g}${custo ? ` (custou ${$} ${fmt(custo)})` : ""}${M.ganharXp(p, s.xp || 10)}`;
    };
    M.fnApostar = (s = {}) => (a) => {
        const p = a.p;
        const v = /^(tudo|all)$/i.test(a.args[0] || "") ? p.moeda : parseInt(a.args[0], 10);
        if (!v || v <= 0) return `usa: ${a.cmd(s.nome || "apostar")} <valor>`;
        if (v > p.moeda) return `💸 você só tem ${$} ${fmt(p.moeda)}.`;
        if (v > (s.max || 5000)) return `🎰 aposta máxima: ${$} ${fmt(s.max || 5000)}.`;
        const f = M.cd(p, "aposta"); if (f) return M.msgCd(f);
        M.setCd(p, "aposta", 15000);
        const r = Math.random();
        M.stat(p, "apostas");
        if (r < 0.02) { p.moeda += v * 4; return `${s.e || "🎰"} 💎 *JACKPOT!!!* você ganhou ${$} ${fmt(v * 4)}!`; }
        if (r < 0.45) { p.moeda += v; return `${s.e || "🎰"} 🍀 você ganhou ${$} ${fmt(v)}!\nsaldo: ${fmt(p.moeda)}`; }
        p.moeda -= v;
        return `${s.e || "🎰"} 😵 você perdeu ${$} ${fmt(v)}...\nsaldo: ${fmt(p.moeda)}`;
    };
    M.fnDiario = (s) => (a) => {
        const p = a.p, hoje = dia();
        if (p.flags.dsData === hoje) return `🎁 você já pegou o presente de hoje! volta amanhã.`;
        const ontem = new Date(Date.now() - 3 * 3600000 - 86400000).toISOString().slice(0, 10);
        p.flags.streak = p.flags.dsData === ontem ? (p.flags.streak || 0) + 1 : 1;
        p.flags.dsData = hoje;
        const mult = 1 + Math.min(p.flags.streak - 1, 10) * 0.1;
        const g = Math.round(rand(...s.moeda) * mult);
        p.moeda += g;
        const got = {};
        for (const [i, mn, mx] of (s.itens || [])) { const q = rand(mn, mx); if (q > 0) { M.add(p, i, q); got[i] = q; } }
        return `🎁 *presente diário!*\n${$} +${fmt(g)}${Object.keys(got).length ? `\n🎁 ${M.txtItens(got)}` : ""}\n🔥 sequência: ${p.flags.streak} dia(s) (bônus x${mult.toFixed(1)})${M.ganharXp(p, s.xp || 10)}`;
    };
    M.fnRanking = () => (a) => {
        const lista = Object.values(a.bd.jogadores).sort((x, y) => y.nivel - x.nivel || y.xp - x.xp).slice(0, 10);
        if (!lista.length) return `ninguém jogou ainda!`;
        const med = ["🥇", "🥈", "🥉"];
        return M.box(`ranking`, lista.map((j, i) => `${med[i] || `${i + 1}.`} ${j.nome} — nível ${j.nivel}`));
    };
    M.fnResetar = () => (a) => {
        if (!/^confirmar$/i.test(a.args[0] || "")) return `⚠️ isso apaga TODO o seu progresso em *${cfg.titulo}*!\npra confirmar: ${a.cmd("resetar")} confirmar`;
        delete a.bd.jogadores[a.me];
        return `🗑️ seu personagem foi apagado. comece de novo com *${a.cmd("comecar")}*`;
    };

    // ── banco / baú ──────────────────────────────────────
    M.fnDepositar = () => (a) => {
        const v = /^(tudo|all)$/i.test(a.args[0] || "") ? a.p.moeda : parseInt(a.args[0], 10);
        if (!v || v <= 0 || v > a.p.moeda) return `usa: ${a.cmd("depositar")} <valor|tudo> (você tem ${$} ${fmt(a.p.moeda)})`;
        a.p.moeda -= v; a.p.banco += v;
        return `🏦 depositou ${$} ${fmt(v)}. no banco: ${$} ${fmt(a.p.banco)}`;
    };
    M.fnSacar = () => (a) => {
        const v = /^(tudo|all)$/i.test(a.args[0] || "") ? a.p.banco : parseInt(a.args[0], 10);
        if (!v || v <= 0 || v > a.p.banco) return `usa: ${a.cmd("sacar")} <valor|tudo> (banco: ${$} ${fmt(a.p.banco)})`;
        a.p.banco -= v; a.p.moeda += v;
        return `🏦 sacou ${$} ${fmt(v)}. na carteira: ${$} ${fmt(a.p.moeda)}`;
    };
    M.fnSaldo = () => (a) => `${$} carteira: ${fmt(a.p.moeda)}\n🏦 banco: ${fmt(a.p.banco)}\n📊 total: ${fmt(a.p.moeda + a.p.banco)}`;
    M.fnGuardar = () => (a) => {
        const { id, n, tudo } = M.parseItem(a.args);
        if (!id || !M.qtd(a.p, id)) return `usa: ${a.cmd("guardar")} <item> [qtd|tudo]`;
        const q = tudo ? M.qtd(a.p, id) : Math.min(n, M.qtd(a.p, id));
        M.add(a.p, id, -q); a.p.bau[id] = (a.p.bau[id] || 0) + q;
        return `📦 guardou ${q}x ${M.nome(id)} no baú.`;
    };
    M.fnRetirar = () => (a) => {
        const { id, n, tudo } = M.parseItem(a.args);
        if (!id || !a.p.bau[id]) return `usa: ${a.cmd("retirar")} <item> [qtd|tudo]`;
        const q = tudo ? a.p.bau[id] : Math.min(n, a.p.bau[id]);
        a.p.bau[id] -= q; if (a.p.bau[id] <= 0) delete a.p.bau[id];
        M.add(a.p, id, q);
        return `📤 retirou ${q}x ${M.nome(id)} do baú.`;
    };
    M.fnBau = () => (a) => {
        const e = Object.entries(a.p.bau);
        return e.length ? M.box("baú", e.map(([i, n]) => `${M.nome(i)} x${n}`)) : `📦 seu baú tá vazio.`;
    };

    // ── social ───────────────────────────────────────────
    M.fnPresentear = () => (a) => {
        const alvo = M.alvo(a);
        if (!alvo) return `marca (ou responde) quem vai receber! ex: ${a.cmd("presentear")} @pessoa <item> [qtd]`;
        const outro = a.bd.jogadores[alvo];
        if (!outro) return `essa pessoa ainda não joga *${cfg.titulo}*.`;
        const { id, n } = M.parseItem(M.semAlvo(a));
        if (!id || !M.qtd(a.p, id)) return `você não tem esse item. ex: ${a.cmd("presentear")} @pessoa <item> [qtd]`;
        const q = Math.min(n, M.qtd(a.p, id));
        M.add(a.p, id, -q); M.add(outro, id, q);
        M.stat(a.p, "presentes", q);
        return `🎁 você deu ${q}x ${M.nome(id)} pra *${outro.nome}*!`;
    };
    M.fnTransferir = () => (a) => {
        const alvo = M.alvo(a);
        const v = parseInt(M.semAlvo(a).find(t => /^\d+$/.test(t)), 10);
        if (!alvo || !v) return `usa: ${a.cmd("transferir")} @pessoa <valor>`;
        const outro = a.bd.jogadores[alvo];
        if (!outro) return `essa pessoa ainda não joga *${cfg.titulo}*.`;
        if (v <= 0 || v > a.p.moeda) return `💸 você tem só ${$} ${fmt(a.p.moeda)}.`;
        a.p.moeda -= v; outro.moeda += Math.floor(v * 0.95);
        return `💸 você enviou ${$} ${fmt(v)} pra *${outro.nome}* (taxa de 5%).`;
    };
    M.fnDuelo = () => (a) => {
        const alvo = M.alvo(a);
        if (!alvo) return `marca (ou responde) quem você quer desafiar! ex: ${a.cmd("duelo")} @pessoa [aposta]`;
        const o = a.bd.jogadores[alvo];
        if (!o) return `essa pessoa ainda não joga *${cfg.titulo}*.`;
        const p = a.p;
        const aposta = parseInt(M.semAlvo(a).find(t => /^\d+$/.test(t)), 10) || 0;
        if (aposta > p.moeda || aposta > o.moeda) return `💸 a aposta é maior que o saldo de um dos dois.`;
        if (p.hp < p.hpMax * 0.3 || o.hp < o.hpMax * 0.3) return `💔 os dois precisam ter pelo menos 30% de vida pra duelar.`;
        const f = M.cd(p, "duelo"); if (f) return M.msgCd(f);
        M.setCd(p, "duelo", 120000);
        const hp1 = p.hp, hp2 = o.hp;
        const r = M.lutar(p, { hp: hp2, atk: M.atk(o), def: M.defesa(o) });
        p.hp = Math.max(1, Math.min(hp1, Math.round(hp1 - r.sofrido)));
        o.hp = Math.max(1, Math.round(hp2 - r.causado));
        M.stat(p, "duelos");
        const ganhou = r.venceu;
        if (aposta) { if (ganhou) { p.moeda += aposta; o.moeda -= aposta; } else { p.moeda -= aposta; o.moeda += aposta; } }
        const xp = ganhou ? 25 : 8;
        if (ganhou) M.stat(p, "duelos_ganhos");
        return `🤺 *duelo!* ${p.nome} vs ${o.nome}\n🗡️ ${r.rounds} rounds · ${r.causado} de dano causado · ${r.sofrido} sofrido\n${ganhou ? `🏅 *${p.nome} venceu!*` : `💀 *${o.nome} venceu!*`}${aposta ? `\n${$} aposta: ${fmt(aposta)}` : ""}${M.ganharXp(p, xp)}`;
    };

    // ── base / renda passiva ─────────────────────────────
    M.fnBase = () => (a) => {
        const p = a.p, bs = cfg.bases;
        const atual = bs[p.base], prox = bs[p.base + 1];
        const linhas = [`${atual.e || "🏠"} *${atual.n}* (nível ${p.base + 1}/${bs.length})`, `📈 renda: ${$} ${atual.renda}/hora`];
        if (cfg.cmdPlantacao) linhas.push(`🌱 espaços de plantio: ${M.slots(p)}`);
        if (prox) linhas.push(``, `⬆️ próximo: *${prox.n}*`, `📋 custo: ${$} ${fmt(prox.custo.moeda || 0)}${Object.keys(prox.custo.i || {}).length ? ", " + M.txtItens(prox.custo.i) : ""}`, `use ${a.cmd(cfg.cmdMelhorar || "melhorar")}`);
        else linhas.push(``, `🌟 nível máximo!`);
        return M.box(cfg.baseTitulo || "base", linhas);
    };
    M.fnMelhorarBase = () => (a) => {
        const p = a.p, prox = cfg.bases[p.base + 1];
        if (!prox) return `🌟 sua base já está no nível máximo!`;
        if (p.nivel < (prox.nv || 1)) return `🔒 precisa de nível ${prox.nv}.`;
        if (p.moeda < (prox.custo.moeda || 0)) return `💸 faltam ${$} ${fmt((prox.custo.moeda || 0) - p.moeda)}.`;
        if (!M.tem(p, prox.custo.i)) return `🎒 faltam: ${M.falta(p, prox.custo.i)}`;
        p.moeda -= prox.custo.moeda || 0; M.rem(p, prox.custo.i);
        p.base++; p.flags.rendaUlt = p.flags.rendaUlt || Date.now();
        M.stat(p, "melhorias");
        return `🏗️ *${prox.n}* construído(a)!\n📈 renda agora: ${$} ${prox.renda}/hora${M.ganharXp(p, 30 + p.base * 10)}`;
    };
    M.fnRenda = () => (a) => {
        const p = a.p, b = cfg.bases[p.base];
        if (!b.renda && !(b.drops || []).length) return `📉 sua base atual não produz nada ainda. melhore com *${a.cmd(cfg.cmdMelhorar || "melhorar")}*!`;
        const ult = p.flags.rendaUlt || Date.now();
        const horas = Math.min(cfg.rendaMaxH || 12, (Date.now() - ult) / 3600000);
        if (horas < 0.05) return `⏳ ainda não tem nada pra coletar. volte mais tarde!`;
        const g = Math.floor(horas * b.renda);
        p.moeda += g; p.flags.rendaUlt = Date.now();
        const got = {};
        for (let i = 0; i < Math.floor(horas); i++) Object.entries(M.rolar(p, b.drops)).forEach(([k, v]) => { got[k] = (got[k] || 0) + v; });
        M.stat(p, "coletas_renda");
        return `📦 *renda coletada* (${horas.toFixed(1)}h)\n${$} +${fmt(g)}${Object.keys(got).length ? `\n🎁 ${M.txtItens(got)}` : ""}`;
    };
    M.slots = (p) => (cfg.slotsPlantio ? cfg.slotsPlantio(p) : 2 + p.base);

    // ── plantio ──────────────────────────────────────────
    M.fnPlantar = (cultivos) => (a) => {
        const p = a.p;
        const id = norm(a.args[0] || "");
        const key = Object.keys(cultivos).find(k => k === id || norm(cultivos[k].n) === id || k.startsWith(id)) || null;
        if (!id || !key) return `usa: ${a.cmd("plantar")} <cultivo>\n🌱 opções: ${Object.entries(cultivos).map(([k, c]) => `${k} (${c.n})`).join(", ")}`;
        const c = cultivos[key];
        if (p.nivel < (c.nv || 1)) return `🔒 precisa de nível ${c.nv}.`;
        if (p.plantio.length >= M.slots(p)) return `🌾 seus ${M.slots(p)} espaços estão ocupados! colha algo primeiro (ou melhore a base).`;
        if (c.custo && !M.tem(p, c.custo)) return `🎒 faltam: ${M.falta(p, c.custo)}`;
        if (c.custo) M.rem(p, c.custo);
        p.plantio.push({ c: key, pronto: Date.now() + c.ms });
        M.stat(p, "plantou");
        return `${c.e || "🌱"} você plantou *${c.n}*! fica pronto em ${fmtTempo(c.ms)}.`;
    };
    M.fnColher = (cultivos) => (a) => {
        const p = a.p, agora = Date.now();
        const prontos = p.plantio.filter(x => x.pronto <= agora);
        if (!prontos.length) return p.plantio.length ? `⏳ nada tá pronto ainda. veja *${a.cmd(cfg.cmdPlantacao || "plantacao")}*` : `🌾 você não plantou nada! use *${a.cmd("plantar")}*`;
        const got = {}; let xp = 0, g = 0;
        for (const x of prontos) {
            const c = cultivos[x.c];
            for (const [i, mn, mx] of c.colheita) { const q = rand(mn, mx) + (M.buff(p, "sorte") > 0 ? 1 : 0); M.add(p, i, q); got[i] = (got[i] || 0) + q; }
            xp += c.xp || 5; g += c.moeda ? rand(...c.moeda) : 0;
        }
        p.plantio = p.plantio.filter(x => x.pronto > agora);
        p.moeda += g; M.stat(p, "colheitas", prontos.length);
        return `🧺 *colheita!*\n🎁 ${M.txtItens(got)}${g ? `\n${$} +${fmt(g)}` : ""}\n✨ +${xp} xp${M.ganharXp(p, xp)}`;
    };
    M.fnPlantacao = (cultivos) => (a) => {
        const p = a.p, agora = Date.now();
        const linhas = p.plantio.map((x, i) => `${i + 1}. ${cultivos[x.c].e || "🌱"} ${cultivos[x.c].n} — ${x.pronto <= agora ? "✅ pronto!" : `⏳ ${fmtTempo(x.pronto - agora)}`}`);
        for (let i = p.plantio.length; i < M.slots(p); i++) linhas.push(`${i + 1}. ⬜ livre`);
        return M.box("plantação", linhas);
    };

    // ── pets ─────────────────────────────────────────────
    M.petFome = (pt) => Math.max(0, pt.fome - Math.floor((Date.now() - pt.uf) / 1800000) * 5);
    M.fnAdotar = () => (a) => {
        const p = a.p, pets = cfg.pets;
        const id = norm(a.args[0] || "");
        const key = Object.keys(pets).find(k => k === id || norm(pets[k].n) === id);
        if (!key) return M.box("pets disponíveis", [...Object.entries(pets).map(([k, d]) => `${d.e} *${k}* — ${d.n} · ${[d.custo.moeda ? `${$} ${d.custo.moeda}` : "", d.custo.i ? M.txtItens(d.custo.i) : ""].filter(Boolean).join(" + ")}${d.atk ? ` · +${d.atk} atk` : ""}`), `use ${a.cmd(cfg.cmdAdotar || "adotar")} <tipo> [nome]`]);
        const d = pets[key];
        if (p.pets.length >= 2 + Math.floor(p.base / 2)) return `🐾 você já tem ${p.pets.length} pets (o limite aumenta com a base).`;
        if (d.nv && p.nivel < d.nv) return `🔒 precisa de nível ${d.nv}.`;
        if (p.moeda < (d.custo.moeda || 0)) return `💸 custa ${$} ${fmt(d.custo.moeda)}.`;
        if (!M.tem(p, d.custo.i)) return `🎒 faltam: ${M.falta(p, d.custo.i)}`;
        p.moeda -= d.custo.moeda || 0; M.rem(p, d.custo.i);
        const nome = (a.args.slice(1).join(" ") || d.n).slice(0, 16);
        p.pets.push({ id: key, nome, fome: 80, afeto: 50, nivel: 1, xp: 0, uf: Date.now() });
        M.stat(p, "adotou");
        return `${d.e} você adotou *${nome}* (${d.n})! cuide bem com *${a.cmd("alimentarpet")}* e *${a.cmd("brincarpet")}*.`;
    };
    M.achaPet = (p, txt) => { const t = norm(txt); return p.pets.find(x => norm(x.nome) === t) || p.pets[parseInt(txt, 10) - 1] || null; };
    M.fnAlimentarPet = () => (a) => {
        const p = a.p;
        if (!p.pets.length) return `🐾 você não tem pets.`;
        const pet = M.achaPet(p, a.args[0]) || p.pets[0];
        const def = cfg.pets[pet.id];
        const comida = def.dieta.find(i => M.qtd(p, i));
        if (!comida) return `🍖 você não tem comida pro(a) ${pet.nome}! ele(a) come: ${def.dieta.map(M.nome).join(", ")}`;
        M.add(p, comida, -1);
        pet.fome = Math.min(100, M.petFome(pet) + 30); pet.uf = Date.now(); pet.afeto = Math.min(100, pet.afeto + 5);
        pet.xp += 10;
        let lv = "";
        if (pet.xp >= pet.nivel * 40) { pet.xp = 0; pet.nivel++; lv = `\n🆙 *${pet.nome}* subiu pro nível ${pet.nivel}!`; }
        return `${def.e} ${pet.nome} comeu ${M.nome(comida)}!\n🍖 fome: ${pet.fome}/100${lv}`;
    };
    M.fnBrincarPet = () => (a) => {
        const p = a.p;
        if (!p.pets.length) return `🐾 você não tem pets.`;
        const pet = M.achaPet(p, a.args[0]) || p.pets[0];
        const f = M.cd(p, "brincar_" + pet.nome); if (f) return M.msgCd(f);
        M.setCd(p, "brincar_" + pet.nome, 600000);
        pet.afeto = Math.min(100, pet.afeto + rand(6, 12));
        const def = cfg.pets[pet.id];
        return `${def.e} você brincou com *${pet.nome}*!\n💗 afeto: ${pet.afeto}/100${M.ganharXp(p, 6)}`;
    };
    M.fnPets = () => (a) => {
        if (!a.p.pets.length) return `🐾 você ainda não tem pets. veja *${a.cmd(cfg.cmdAdotar || "adotar")}*`;
        return M.box("seus pets", a.p.pets.map((pt, i) => `${i + 1}. ${cfg.pets[pt.id].e} *${pt.nome}* (nv ${pt.nivel}) · 🍖 ${M.petFome(pt)} · 💗 ${pt.afeto}${cfg.pets[pt.id].atk ? ` · +${Math.floor(cfg.pets[pt.id].atk * (1 + pt.nivel * 0.15))} atk` : ""}`));
    };

    // ── viagem ───────────────────────────────────────────
    M.fnLocais = () => (a) => M.box(cfg.tituloLocais || "locais", Object.entries(cfg.locais).map(([k, l]) => `${l.e} *${k}* — ${l.n}${l.nv ? ` (nv ${l.nv})` : ""}${a.p.local === k ? " 📍" : ""}`).concat([`viaje: ${a.cmd("viajar")} <local>`]));
    M.fnViajar = () => (a) => {
        const id = norm(a.args[0] || "");
        const key = Object.keys(cfg.locais).find(k => k === id || norm(cfg.locais[k].n) === id);
        if (!key) return `usa: ${a.cmd("viajar")} <local>\nveja a lista em *${a.cmd(cfg.cmdLocais || "locais")}*`;
        const l = cfg.locais[key];
        if (a.p.nivel < (l.nv || 1)) return `🔒 ${l.n} exige nível ${l.nv}.`;
        if (l.exige && !M.tem(a.p, l.exige)) return `🎒 pra ir pra ${l.n} você precisa de: ${M.txtItens(l.exige)}`;
        if (a.p.local === key) return `📍 você já está em ${l.n}!`;
        const custo = l.en ?? 3;
        if (a.p.en < custo) return `⚡ precisa de ${custo} de energia pra viajar.`;
        a.p.en -= custo; a.p.local = key; M.stat(a.p, "viagens");
        return `${l.e} você chegou em *${l.n}*!\n${l.d || ""}${M.ganharXp(a.p, 4)}`;
    };

    // ── missões / história ───────────────────────────────
    M.fnMissoes = () => (a) => {
        const p = a.p, hoje = dia();
        if (!p.missoes || p.missoes.d !== hoje) {
            const pool = [...cfg.missoes].map((m, i) => i).sort(() => Math.random() - 0.5).slice(0, 3);
            p.missoes = { d: hoje, l: pool.map(i => ({ i, b: p.stats[cfg.missoes[i].stat] || 0, ok: false })) };
        }
        const linhas = []; let premio = "";
        for (const m of p.missoes.l) {
            const q = cfg.missoes[m.i];
            const prog = Math.min(q.meta, (p.stats[q.stat] || 0) - m.b);
            if (!m.ok && prog >= q.meta) {
                m.ok = true; p.moeda += q.moeda || 0;
                if (q.item) M.add(p, q.item[0], q.item[1]);
                premio += `\n🎉 missão cumprida: *${q.d}* (+${fmt(q.moeda || 0)} ${$}${q.item ? `, ${q.item[1]}x ${M.nome(q.item[0])}` : ""}, +${q.xp} xp)` + M.ganharXp(p, q.xp);
            }
            linhas.push(`${m.ok ? "✅" : "⬜"} ${q.d} — ${prog}/${q.meta}`);
        }
        return M.box("missões de hoje", linhas) + premio;
    };
    M.fnHistoria = () => (a) => {
        const p = a.p, cap = cfg.historia[p.cap];
        if (!cap) return `📖 você completou toda a história de *${cfg.titulo}*! 🌟`;
        const prog = p.stats[cap.stat] || 0;
        if (prog >= cap.meta) {
            p.cap++; p.moeda += cap.moeda || 0;
            if (cap.item) M.add(p, cap.item[0], cap.item[1]);
            const prox = cfg.historia[p.cap];
            return `📖 *capítulo ${p.cap} concluído: ${cap.t}!*\n${$} +${fmt(cap.moeda || 0)}${cap.item ? `\n🎁 ${cap.item[1]}x ${M.nome(cap.item[0])}` : ""}${M.ganharXp(p, cap.xp || 50)}\n\n${prox ? `➡️ próximo: *${prox.t}* — ${prox.d}` : `🌟 fim da história principal!`}`;
        }
        return M.box(`capítulo ${p.cap + 1}: ${cap.t}`, [cap.d, `📊 progresso: ${prog}/${cap.meta}`, `use ${a.cmd("historia")} de novo quando cumprir!`]);
    };
    M.fnConquistas = () => (a) => M.box("conquistas", (cfg.conquistas || []).map(c => `${a.p.conquistas.includes(c.id) ? "🏆" : "🔒"} ${c.n} — ${c.d}`));

    // ── texto livre (info / curiosidade / dica) ──────────
    M.fnTexto = (fnOuLista) => (a) => (typeof fnOuLista === "function" ? fnOuLista(a, M) : pick(fnOuLista));

    return M;
}

module.exports = { criar, rand, pick, chance, clamp, norm, fmt, fmtTempo, barra, dia, horaBR };
