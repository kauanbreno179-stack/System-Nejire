/*
╭─❍ 𓆩🩵𓆪 ⋆｡° SYSTEM NEJIRE °｡⋆ 𓆩🩵𓆪 ❍─╮

  🩵 Obrigado por baixar essa base! 🩵

  Ela foi feita com muito carinho, com mais de 1k de comandos,
  4 RPGs, pesca, economia, IA, downloader e muito mais.
  Espero que você aproveite e se divirta bastante!

  📌 SUPORTE
  Qualquer dúvida, erro ou ajuda com a base, chama no suporte:
  ➜ wa.me/5567998229189

  📢 CANAL OFICIAL
  Siga o canal para receber ATUALIZAÇÕES, novidades e avisos:
  ➜ https://whatsapp.com/channel/0029Vb8rVXsDOQIWsbKuAd34

  ⚠️ REGRAS DE USO
  ✖ É PROIBIDO VENDER esta base, total ou parcialmente.
  ✖ É PROIBIDO FAZER QUALQUER COISA QUE IRA PREJUDICAR A BASE.
  ✖ É PROIBIDO REMOVER USAR ELA PARA FAZER BOTS INADEQUADOS , EX: BOT DE PUXADAS.
  ✔ Pode usar, estudar, editar e personalizar para uso próprio.
  ✔ Ao compartilhar, mantenha os créditos.
  ✔ Deixar do sue jeito, mas lembre da Nejire 🫐

  💙 Base criada por: Lopes

  Se você pagou por esta base, foi enganado(a). Ela é gratuita!

╰─ 𓇼 𓂃𓈒𓏸 💙 𓏸𓈒𓂃 𓇼 ─╯
*/
const baileys = require("@systemzero/baileys");
const { jidNormalizedUser, getContentType, downloadContentFromMessage } = baileys;

const fs = require("fs-extra");
const path = require("path");

const config = require("./config.json");
let prefix = config.prefixo || "#";

const {
  menuNejireLista,
  respostaNejire,
  cardPerfil,
  textoRanking,
  CURIOSIDADES,
  todosComandos,
  secoesPrincipalBotao,
  secoesMenuCompleto,
  menuNejireCard,
  menuCategoriaTexto,
  categoriaPorSlug,
  slugCategoria,
  menuNejireIOS,
  avisoModoIOS
} = require("./menu/nejiremenu.js");

const { enviarInteligente, enviarMenuHD, enviarMenuNativo, botaoUrl, botaoLista, botaoCanal, contextInfoCanal } = require("./menu/botoes.js");
const { montarMenuZero } = require("./menu/menuzero.js");

const {
  getPerfil,
  salvarPerfil,
  registrarComando,
  darPontoCuriosidade,
  ranking
} = require("./SISTEMAS/perfil.js");

const { criarFigurinhaImagem, criarFigurinhaVideo } = require("./SISTEMAS/figurinha.js");
const GrupoSistema = require("./SISTEMAS/grupo.js");
const BoasVindas = require("./SISTEMAS/boasvindas.js");
const VipSistema = require("./SISTEMAS/vip.js");
const AluguelSistema = require("./SISTEMAS/aluguel.js");
const Economia = require("./SISTEMAS/economia.js");
const Ia = require("./SISTEMAS/ia.js");
const Modoai = require("./SISTEMAS/modoai.js");
const ZoneExtras = require("./SISTEMAS/zoneextras.js");
const Scraper = require("./SISTEMAS/scraper.js");
const Sugestao = require("./SISTEMAS/sugestao.js");
const BotSistema = require("./SISTEMAS/bot.js");
const Moderacao = require("./SISTEMAS/moderacao.js");
const Afk = require("./SISTEMAS/afk.js");
const Utilidades = require("./SISTEMAS/utilidades.js");
const Jogos = require("./SISTEMAS/jogos.js");
const Pesca = require("./SISTEMAS/pesca.js");
const ComandosNovos = require("./SISTEMAS/comandosnovos.js");
const Lote2 = require("./SISTEMAS/lote2/index.js");
const Lote3 = require("./SISTEMAS/lote3/index.js");
const PostarStatus = require("./SISTEMAS/postarstatus.js");
const MenuAudio = require("./SISTEMAS/menuaudio.js");
const CasesIA = require("./SISTEMAS/casesia.js");
const Antis = require("./SISTEMAS/antis.js");
const DonoExtra = require("./SISTEMAS/donoextra.js");
const PescaImagem = require("./SISTEMAS/pescaImagem.js");
const Geral = require("./SISTEMAS/geral.js");
const Dono = require("./SISTEMAS/dono.js");
const Device = require("./utils/device.js");
const Jid = require("./utils/jid.js");
const { pequeno } = require("./utils/texto.js");

const NejireSubbot = require("./subbot.js");
const Detetive = require("./SISTEMAS/detetive.js");
const DetetiveIA = require("./SISTEMAS/detetiveIA.js");

const Romanos = require("./SISTEMAS/romanos.js");
const TituloCaso = require("./SISTEMAS/titulocaso.js");
const CamelCase = require("./SISTEMAS/camelcase.js");
const Validadores = require("./SISTEMAS/validadores.js");
const GeoConversor = require("./SISTEMAS/geoconversor.js");
const UnidadesVolume = require("./SISTEMAS/unidadesvolume.js");
const UnidadesPeso = require("./SISTEMAS/unidadespeso.js");
const Velocidade = require("./SISTEMAS/velocidade.js");
const AreaConversor = require("./SISTEMAS/areaconversor.js");
const TempoConversor = require("./SISTEMAS/tempoconversor.js");
const NumeroExtenso = require("./SISTEMAS/numeroextenso.js");
const CifraCesar = require("./SISTEMAS/cifracesar.js");
const Vigenere = require("./SISTEMAS/vigenere.js");
const Contadores2 = require("./SISTEMAS/contadores2.js");
const GerarSenhas2 = require("./SISTEMAS/gerarsenhas2.js");
const Matematica2 = require("./SISTEMAS/matematica2.js");
const SorteioExtra = require("./SISTEMAS/sorteioextra.js");
const Rpg = require("./SISTEMAS/rpg.js");
const Sinuca = require("./SISTEMAS/sinuca.js")
const Cartas = require("./SISTEMAS/cartas.js");
const Dados2 = require("./SISTEMAS/dados2.js");
const QuizTipos = require("./SISTEMAS/quiztipos.js");
const NomeFiccao = require("./SISTEMAS/nomeificcao.js");
const Combate = require("./SISTEMAS/combate.js");
const LoteriaExtra = require("./SISTEMAS/loteriaextra.js");
const Roleta2 = require("./SISTEMAS/roleta2.js");
const Desafios2 = require("./SISTEMAS/desafios2.js");
const Piadas2 = require("./SISTEMAS/piadas2.js");
const Fanfic = require("./SISTEMAS/fanfic.js");
const MemesGen = require("./SISTEMAS/memesgen.js");
const Signos2 = require("./SISTEMAS/signos2.js");
const Personalidade2 = require("./SISTEMAS/personalidade2.js");
const Citacoes2 = require("./SISTEMAS/citacoes2.js");
const NomesGen2 = require("./SISTEMAS/nomesgen2.js");
const Curiosidades3 = require("./SISTEMAS/curiosidades3.js");
const Receitas = require("./SISTEMAS/receitas.js");
const Filmes = require("./SISTEMAS/filmes.js");
const Musica2 = require("./SISTEMAS/musica2.js");
const Viagem = require("./SISTEMAS/viagem.js");
const Esportes = require("./SISTEMAS/esportes.js");
const Profissoes2 = require("./SISTEMAS/profissoes2.js");
const Frases2 = require("./SISTEMAS/frasesmotivacionais2.js");
const Elogios2 = require("./SISTEMAS/compliments.js");
const Calendario2 = require("./SISTEMAS/calendario2.js");
const Tempo2 = require("./SISTEMAS/tempo2.js");
const IdadeExtra = require("./SISTEMAS/idadeextra.js");
const FusoHorario = require("./SISTEMAS/fusohorario.js");
const Aniversario = require("./SISTEMAS/aniversario.js");
const Numerologia2 = require("./SISTEMAS/numerologia2.js");
const Estacoes2 = require("./SISTEMAS/estacoes2.js");
const CuriosidadesData = require("./SISTEMAS/curiosidadesdata.js");

const EMOJIS_PRAIA = ["🏖️", "🌊", "🐚", "☀️", "🌴", "🐠"];
const EMOJIS_AZUL = ["💙", "🩵", "🔵", "💎", "🫐"];
const emojiPraia = () => EMOJIS_PRAIA[Math.floor(Math.random() * EMOJIS_PRAIA.length)];
const emojiAzul = () => EMOJIS_AZUL[Math.floor(Math.random() * EMOJIS_AZUL.length)];

const FotoNejire = fs.readFileSync(
  path.join(__dirname, "menu", "foto", "nejire-menu.jpg")
);

async function getMediaBuffer(mediaMsg, tipo) {
  const stream = await downloadContentFromMessage(mediaMsg, tipo);
  let buffer = Buffer.from([]);
  for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
  return buffer;
}

function extrairIdBotaoTocado(mensagem) {
  try {
    const paramsJson = mensagem?.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson;
    if (paramsJson) {
      const dados = JSON.parse(paramsJson);
      if (dados?.id) return dados.id;
      if (dados?.selectedId) return dados.selectedId;
    }
  } catch {}
  return (
    mensagem?.listResponseMessage?.singleSelectReply?.selectedRowId ||
    mensagem?.buttonsResponseMessage?.selectedButtonId ||
    mensagem?.templateButtonReplyMessage?.selectedId ||
    null
  );
}

function enviar(conn, jid, content, opts = {}) {
  if (typeof conn.nejireSend === "function") return conn.nejireSend(jid, content, opts);
  return conn.sendMessage(jid, content, opts);
}

async function enviarCanvas(conn, jid, info, { buffer, url, contentType = "" }, legenda = "") {
  const ehGif = contentType.includes("gif") || contentType.includes("video");
  const conteudo = ehGif
    ? { video: buffer || { url }, caption: legenda, gifPlayback: true }
    : { image: buffer || { url }, caption: legenda };

  return enviar(conn, jid, conteudo, { quoted: info });
}

async function responderPrefixo(conn, jid, info, sender, prefix) {
  const textoPrefixo = pequeno(`meu prefixo atual é *${prefix}*! coloca ele antes de qualquer comando, tipo *${prefix}menu* ${config.emojiPrincipal}`);

  try {
    if (Device.usarBotoes(sender, info)) {
      const { generateWAMessageFromContent, proto } = baileys;

      const conteudo = {
        viewOnceMessage: {
          message: {
            interactiveMessage: proto.Message.InteractiveMessage.create({
              header: { title: pequeno(`🐚 ${config.nome}`), hasMediaAttachment: false },
              body: { text: textoPrefixo },
              footer: { text: pequeno(`${config.nome} v${config.versao}`) },
              nativeFlowMessage: {
                buttons: [
                  { name: "cta_copy", buttonParamsJson: JSON.stringify({ display_text: `📋 copiar prefixo [ ${prefix} ]`, copy_code: prefix }) }
                ]
              }
            })
          }
        }
      };

      const msg = generateWAMessageFromContent(jid, conteudo, { quoted: info, userJid: conn.user.id });
      await conn.relayMessage(jid, msg.message, { messageId: msg.key.id });
    } else {
      await enviar(conn, jid, { text: `meu prefixo atual é: *${prefix}* ${config.emojiPrincipal}` }, { quoted: info });
    }
  } catch (err) {
    console.error(err);
    await enviar(conn, jid, { text: `o meu prefixo é: *${prefix}* ${config.emojiPrincipal}` }, { quoted: info });
  }
}

module.exports = async function (conn, upsert) {
  try {
    const info = upsert?.messages && upsert.messages[0];
    if (!info || !info.message) return;

    const from = info.key?.remoteJid;
    if (!from || from === "status@broadcast") return;

    const isGroup = from.endsWith("@g.us");

    // normalizador que resolve @lid pro número de telefone real —
    // sem isso o bot nunca reconhece o dono quando o whatsapp manda o
    // participant como lid em vez do jid com o número
    const sender = Jid.resolverSender(info, isGroup, from);

    const isDono = Jid.ehDono(sender);

    if (!isDono && Moderacao.estaBloqueado(sender)) return;

    // antis do bot inteiro (privado) e do grupo (mídia/texto proibidos) —
    // rodam antes de qualquer outra coisa; se agirem (ignorar/apagar), para por aqui
    if (await Antis.aplicarPv(conn, info, { from, sender, isDono })) return;
    if (await Antis.aplicarGrupo(conn, info, { from, sender, isDono })) return;

    if (DonoExtra.autoler()) {
      try { await conn.readMessages([info.key]); } catch {}
    }

    const body =
      info.message?.conversation ||
      info.message?.extendedTextMessage?.text ||
      info.message?.imageMessage?.caption ||
      info.message?.videoMessage?.caption ||
      extrairIdBotaoTocado(info.message) ||
      "";

    async function reply(texto) {
      try {
        return await enviar(conn, from, { text: pequeno(texto) }, { quoted: info });
      } catch (err) {
        console.error("[NEJIRE] erro ao responder:", err);
      }
    }

    async function reagir(emoji) {
      try {
        await enviar(conn, from, { react: { text: emoji, key: info.key } });
      } catch {}
    }

    if (isGroup && body) {
      try {
        const cfgGrupo = GrupoSistema.configGrupo(from);
        if (cfgGrupo.antilink && GrupoSistema.REGEX_LINK.test(body) && !isDono) {
          const souAdmin = await GrupoSistema.ehAdmin(conn, from, sender);
          if (!souAdmin) {
            await enviar(conn, from, { delete: info.key });
            await GrupoSistema.removerParticipante(conn, from, sender);
            await enviar(conn, from, { text: pequeno(`🚫 removi @${sender.split("@")[0]} por mandar link com anti-link ativo`), mentions: [sender] });
            return;
          }
        }

        if (!isDono && Moderacao.estaMutado(from, sender)) {
          await enviar(conn, from, { delete: info.key }).catch(() => null);
          return;
        }
      
        if (!isDono && Moderacao.antifloodAtivo(from)) {
          const flodou = Moderacao.registrarMensagemFlood(from, sender);
          if (flodou) {
            const souAdmin = await GrupoSistema.ehAdmin(conn, from, sender);
            if (!souAdmin) {
              Moderacao.mutar(from, sender);
              await enviar(conn, from, { text: pequeno(`🌊 @${sender.split("@")[0]} tá floodando, mutei automaticamente! usa ${prefix}desmutar pra liberar`), mentions: [sender] });
              return;
            }
          }
        }

 
        const afkRegistro = Afk.obterAfk(sender);
        if (afkRegistro) {
          Afk.removerAfk(sender);
          await reply(`🗣️ bem-vindo(a) de volta @${sender.split("@")[0]}! você tava afk há ${Economia.formatarTempo(Date.now() - afkRegistro.desde)}`);
        }

        const contextInfoAfk = info.message?.extendedTextMessage?.contextInfo;
        const mencionados = contextInfoAfk?.mentionedJid || [];
        for (const jidMencionado of mencionados) {
          const afkAlvo = Afk.obterAfk(jidMencionado);
          if (afkAlvo) {
            await reply(`🐚 @${jidMencionado.split("@")[0]} tá afk: _${afkAlvo.motivo}_ (há ${Economia.formatarTempo(Date.now() - afkAlvo.desde)})`);
          }
        }
      } catch (err) {
        console.error("[NEJIRE] erro no antilink:", err);
      }
    }

    // atalho sem prefixo: se a pessoa mandar só a palavra "prefixo" (sem
    // colocar o prefixo antes, já que ela nem sabe qual é), a gente
    // responde mesmo assim — é basicamente a única exceção que faz sentido
    if (!body.trim().startsWith(prefix)) {
  const textoSolto = body.trim();

  // RPG de detetive: fluxo de liberação de caso por conversa, só no PV.
  // se a pessoa já tá no meio do fluxo (aguardando ID+código), a próxima
  // mensagem solta dela é tratada como a resposta. se não tá no meio de
  // nada mas fala sobre "caso"/"detetive"/etc, a gente inicia o fluxo.
  if (!isGroup && textoSolto) {
    try {
      const estadoDetetive = Detetive.getEstado(sender);
      if (estadoDetetive.aguardandoAcesso) {
        if (!BotSistema.botEstaAtivo() && !isDono) return;
        await reagir("🔑");
        const resultado = await Detetive.processarRespostaAcesso(sender, textoSolto);
        if (resultado.texto) await reply(resultado.texto);
        if (resultado.ok && resultado.zipPath) {
          const bufferZip = fs.readFileSync(resultado.zipPath);
          await conn.sendMessage(from, {
            document: bufferZip,
            mimetype: "application/zip",
            fileName: resultado.fileName,
            caption: "📁 pacote de evidências do caso — abre e investiga!"
          });
          fs.unlink(resultado.zipPath, () => {});
        }
        return;
      }

      if (!estadoDetetive.casoAtivo && Detetive.pareceQueQuerFalarSobreCaso(textoSolto)) {
        if (!BotSistema.botEstaAtivo() && !isDono) return;
        await reagir("🕵️");
        await reply(Detetive.iniciarConversaAcesso(sender));
        return;
      }
    } catch (err) {
      console.error("[DETETIVE] erro no fluxo de acesso:", err);
    }
  }

  // modoai: quem ativou o modo ia fala com a persona escolhida sem precisar de
  // prefixo nenhum. isso é escopado por remetente (sender), então em
  // grupo só quem ligou o modoai pra si mesmo dispara essa resposta —
  // o resto do grupo continua conversando normal, sem interferência.
  if (textoSolto && Modoai.estaAtivo(sender)) {
    try {
      if (!BotSistema.botEstaAtivo() && !isDono) return;

      await reagir("💭");

      const respostaTexto = await Modoai.perguntar(sender, textoSolto);

      if (!respostaTexto) {
        await reply("hm... travei aqui agora, tenta de novo daqui a pouco 😵‍💫");
        return;
      }

      // sub-resposta: uma "rubrica de cena" baseada na persona ativa
      await enviar(conn, from, { text: `> _${Modoai.subresposta(sender)}_` }, { quoted: info });

      // gera o áudio passando o 'sender' para identificar se é Nejire ou Zero Two
      const audioBuffer = await Modoai.gerarAudio(sender, respostaTexto);

      if (audioBuffer) {
        await enviar(conn, from, { audio: audioBuffer, mimetype: "audio/mpeg", ptt: true }, { quoted: info });
      } else {
        // se o tts falhar por qualquer motivo, garante que a pessoa
        // pelo menos recebe a resposta em texto
        await reply(respostaTexto);
      }
    } catch (err) {
      console.error("[MODOAI] erro no modoai:", err);
      await reply("❌ deu ruim aqui no meu modo ia, tenta de novo!");
    }
    return;
  }

      const textoSoltoLower = textoSolto.toLowerCase();
      if (["prefixo", "prefix", "qual o prefixo", "qual é o prefixo", "qual meu prefixo", "qual seu prefixo"].includes(textoSoltoLower)) {
        try {
          if (!BotSistema.botEstaAtivo() && !isDono) return;
          await responderPrefixo(conn, from, info, sender, prefix);
        } catch (err) {
          console.error(err);
        }
      }
      return;
    }

    const args = body.trim().split(/ +/).slice(1);
    const command = body.trim().slice(prefix.length).split(/ +/)[0]?.toLowerCase();
    const q = args.join(" ");

    if (!BotSistema.botEstaAtivo() && !isDono) return;

    if (command) {
      registrarComando(sender);
      Economia.ganharXp(sender, 2);
    }

    async function exigirGrupo() {
      if (!isGroup) {
        await reply("esse comando só funciona dentro de um grupo, mb");
        return false;
      }
      return true;
    }

    async function exigirAdmin() {
      if (isDono) return true;
      const souAdmin = await GrupoSistema.ehAdmin(conn, from, sender);
      if (!souAdmin) await reply("você precisa ser admin do grupo pra usar esse comando! 🏊");
      return souAdmin;
    }

    function exigirDono() {
      if (!isDono) reply("esse comando é só pro meu dono/criador usar!");
      return isDono;
    }

    if (command && (command.startsWith("menucat_") || command === "menucases" || command === "casesia")) {
      try {
        const cat = categoriaPorSlug(command.startsWith("menucat_") ? command.slice("menucat_".length) : "casesia");
        if (!cat) {
          await reply("não achei esse menu, tenta de novo com " + prefix + "menu 🤔");
        } else {
          await reagir(cat.emoji || config.emojiPrincipal);

          // no modo ios (sem botão) o texto já traz a lista inteira de
          // comandos — mandar as seções junto repetia tudo duas vezes
          const comBotao = Device.usarBotoes(sender, info);
          await enviarInteligente(conn, from, info, {
            texto: menuCategoriaTexto(prefix, cat),
            footer: pequeno(`${config.nome} v${config.versao}`),
            imagem: FotoNejire,
            secoes: comBotao ? [{
              titulo: `${cat.emoji} ${pequeno(cat.nome)}`,
              linhas: cat.comandos.map(c => ({
                titulo: `${prefix}${c.cmd}`,
                descricao: c.desc,
                id: `${prefix}${c.cmd}`
              }))
            }] : null,
            tituloBotao: "🐚 ver comandos 🌀"
          });
        }
      } catch (err) {
        console.error(err);
        await reply("❌ deu erro pra abrir esse menu.");
      }
      return;
    }

    global.chamadasAtivas = global.chamadasAtivas || {};

    // comando desligado globalmente (×cmdoff) — o dono sempre passa
    if (DonoExtra.comandoDesativado(command) && !isDono) {
      await reply("🔒 esse comando tá desligado no momento!");
      return;
    }

    DonoExtra.aplicarPresenca(conn, from);
    DonoExtra.contarUso(command);

    if (await Sinuca({
  conn, info, from, sender, isGroup, isDono, args, q, command, prefix, config,
  reply, reagir, enviar, getMediaBuffer,
  exigirGrupo, exigirAdmin, exigirDono
})) return;
      
    if (await ComandosNovos.tratar({
      conn, info, from, sender, isGroup, isDono, args, q, command, prefix, config,
      reply, reagir, enviar, getMediaBuffer,
      exigirGrupo, exigirAdmin, exigirDono,
      emojiAzul, emojiPraia, todosComandos
    })) return;

    if (await Lote2.tratar({
      conn, info, from, sender, isGroup, isDono, args, q, command, prefix, config,
      reply, reagir, enviar, getMediaBuffer,
      exigirGrupo, exigirAdmin, exigirDono
    })) return;

    if (await Lote3.tratar({
      conn, info, from, sender, isGroup, isDono, args, q, command, prefix, config,
      reply, reagir, enviar, getMediaBuffer,
      exigirGrupo, exigirAdmin, exigirDono
    })) return;

    if (await MenuAudio.tratar({
      conn, info, from, sender, isGroup, isDono, args, q, command, prefix, config,
      reply, reagir, enviar, getMediaBuffer,
      exigirGrupo, exigirAdmin, exigirDono
    })) return;

    if (await PostarStatus.tratar({
      conn, info, from, sender, isGroup, isDono, args, q, command, prefix, config,
      reply, reagir, enviar, getMediaBuffer,
      exigirGrupo, exigirAdmin, exigirDono
    })) return;

    if (await CasesIA.tratar({
      conn, info, from, sender, isGroup, isDono, args, q, command, prefix, config,
      reply, reagir, enviar, getMediaBuffer,
      exigirGrupo, exigirAdmin, exigirDono,
      todosComandos
    })) return;

    switch (command) {

    case "playcall": // de uma olhada nessa case
    case "callmusic": {
      const axios = require("axios");
      const { exec } = require("child_process");
      const idTmp = require("crypto").randomBytes(4).toString("hex");
      const tmpAudio = `./chamada_sessao_${idTmp}.mp3`;
      const tmpPcm = `./chamada_sessao_${idTmp}.pcm`;

      const limparArquivos = () => {
        try { fs.unlinkSync(tmpAudio); } catch {}
        try { fs.unlinkSync(tmpPcm); } catch {}
      };

      const obterDuracaoRealMs = (caminho) => new Promise((resolve) => {
        const ffprobeBin = fs.existsSync("./lib/ffprobe.exe") ? "./lib/ffprobe.exe" : "ffprobe";
        exec(`"${ffprobeBin}" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${caminho}"`, (err, stdout) => {
          if (err || !stdout) return resolve(null);
          const s = parseFloat(stdout.trim());
          resolve(isNaN(s) ? null : Math.ceil(s * 1000));
        });
      });

      const aguardarAceite = (callIdAlvo, timeoutMs = 30000) => new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          conn.ev.off("call", listener);
          reject(new Error("Tempo esgotado para atendimento"));
        }, timeoutMs);

        const listener = (calls) => {
          for (const call of calls) {
            if (call.id !== callIdAlvo) continue;
            if (call.status === "accept") {
              clearTimeout(timeout); conn.ev.off("call", listener); resolve(true);
            } else if (["reject", "timeout", "busy", "offline", "terminate"].includes(call.status)) {
              clearTimeout(timeout); conn.ev.off("call", listener);
              reject(new Error("Chamada recusada ou não atendida"));
            }
          }
        };
        conn.ev.on("call", listener);
      });

      const monitorarEncerramento = (callIdAlvo, aoEncerrar) => {
        const listener = (calls) => {
          for (const call of calls) {
            if (call.id === callIdAlvo && ["reject", "timeout", "terminate"].includes(call.status)) {
              conn.ev.off("call", listener);
              aoEncerrar();
            }
          }
        };
        conn.ev.on("call", listener);
        return () => conn.ev.off("call", listener);
      };

      try {
        const quotedMsg = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const alvoAudio = info.message?.audioMessage || quotedMsg?.audioMessage;
        const quoted = alvoAudio ? await getMediaBuffer(alvoAudio, "audio") : null;

        if (!quoted && !q) {
          await reply(
            `*Formato incorreto!*\n\n📌 Grupo: ${prefix}playcall nome da música\n📌 Link: ${prefix}playcall <link> nome da música\n📌 PV: ${prefix}playcall nome da música`
          );
          break;
        }

        // --- DETECÇÃO DE LINK + MODO (uma vez só) ---
        const argsMusica = q ? q.trim().split(/\s+/) : [];
        const regexLinkCall = /^https?:\/\/(call\.)?whatsapp\.com\/.+/i;
        let linkChamada = null, restoArgs = argsMusica;

        if (argsMusica.length > 0 && regexLinkCall.test(argsMusica[0])) {
          linkChamada = argsMusica[0];
          restoArgs = argsMusica.slice(1);
        }

        let queryMusica = restoArgs.join(" ");
        const modo = linkChamada ? "link" : (isGroup ? "grupo" : "pv");

        // --- IDENTIFICAÇÃO: nome de exibição + cargo (dono/admin/membro) ---
        const nomeQuemPediu = Jid.nomeUsuario(info, sender);
        let souAdminGrupo = false;
        if (isGroup) {
          try { souAdminGrupo = await GrupoSistema.ehAdmin(conn, from, sender); } catch {}
        }
        const cargo = isDono ? "Dono" : (souAdminGrupo ? "Admin" : "Membro");
        console.log(`[playcall] pedido de ${nomeQuemPediu} (${sender}) | cargo: ${cargo} | modo: ${modo}`);

        // Ligar pro grupo inteiro ou entrar num link externo afeta todo mundo —
        // só dono/admin pode. Ligar só pra si mesmo (pv) é liberado geral.
        if ((modo === "grupo" || modo === "link") && !isDono && !souAdminGrupo) {
          await reply(`esse comando só pode ser usado por *admin* ou *dono* do grupo, ${nomeQuemPediu}! 🚫`);
          break;
        }

        if (!quoted && !queryMusica.trim()) {
          await reply(`*Informe o nome da música ou responda a um áudio!*`);
          break;
        }

        await reagir("📞");

        let musica = null;
        if (quoted) {
          fs.writeFileSync(tmpAudio, quoted);
        } else {
          try {
            const { data } = await axios.get("https://zone.api.br/v2/player", {
              params: { text: queryMusica.trim(), query: queryMusica.trim() },
              timeout: 30000
            });
            musica = data;
          } catch (e) {
            await reagir("❌");
            await reply("*Erro ao buscar a música (API fora do ar ou timeout).*");
            break;
          }

          const audioUrl = musica?.download_url || musica?.url || musica?.result?.download_url || musica?.result?.url || musica?.data?.download_url || musica?.data?.url;
          if (!musica || !audioUrl) {
            await reagir("❌");
            await reply(`*Não encontrei nenhuma música para:* "${queryMusica.trim()}"`);
            break;
          }

          try {
            const audioRes = await axios.get(audioUrl, { responseType: "arraybuffer", timeout: 60000 });
            fs.writeFileSync(tmpAudio, audioRes.data);
          } catch (e) {
            await reagir("❌");
            await reply("*Erro ao baixar o áudio da música.*");
            break;
          }
        }

        let duracaoExataMs = await obterDuracaoRealMs(tmpAudio);
        const ffmpegBin = fs.existsSync("./lib/ffmpeg.exe") ? "./lib/ffmpeg.exe" : "ffmpeg";

        try {
          await new Promise((resolve, reject) => {
            exec(`"${ffmpegBin}" -y -i "${tmpAudio}" -f s16le -ac 1 -ar 16000 "${tmpPcm}"`, (err) => err ? reject(err) : resolve());
          });
        } catch (e) {
          await reagir("❌"); limparArquivos();
          await reply("*Erro ao converter o áudio.*");
          break;
        }

        if (!fs.existsSync(tmpPcm) || fs.statSync(tmpPcm).size === 0) {
          await reagir("❌"); limparArquivos();
          await reply("*Erro na conversão do arquivo de áudio.*");
          break;
        }

        const pcmBuffer = fs.readFileSync(tmpPcm);
        if (!duracaoExataMs || duracaoExataMs <= 0) {
          duracaoExataMs = Math.ceil((pcmBuffer.length / 32000) * 1000);
        }

        let callId, autoHangupTimer = null, fallbackTimeout = null, pararMonitor = null, destinoLabel = "";

        const limparTudo = () => {
          if (autoHangupTimer) clearTimeout(autoHangupTimer);
          if (fallbackTimeout) clearTimeout(fallbackTimeout);
          if (pararMonitor) pararMonitor();
          limparArquivos();
          if (callId) delete global.chamadasAtivas[sender];
        };

        try {
          if (modo === "link") {
            const resultado = await conn.joinCallLink(linkChamada);
            if (!resultado?.ok) {
              await reagir("❌"); limparArquivos();
              await reply(`*Não foi possível entrar na chamada:* ${resultado?.reason || "motivo desconhecido"}`);
              break;
            }
            callId = resultado.callId;
            destinoLabel = `Link: ${linkChamada}`;
            await new Promise((r) => setTimeout(r, 8000));

          } else if (modo === "grupo") {
            const resultado = await conn.startGroupCall(from);
            callId = resultado?.callId;
            destinoLabel = `Grupo (${resultado?.participantCount ?? "?"} participantes)`;
            if (!callId) {
              await reagir("❌"); limparArquivos();
              await reply("*Não foi possível iniciar a chamada de grupo.*");
              break;
            }
            await new Promise((r) => setTimeout(r, 8000));

          } else {
            // startCall precisa do LID, não do JID de telefone que o
            // resolverSender() devolve — converte de volta antes de ligar
            const alvoLid = Jid.paraLidChamada(sender);
            console.log(`[playcall] (pv) sender: ${sender} | alvo LID usado pra ligar: ${alvoLid}`);

            const resultado = await conn.startCall(alvoLid);
            callId = resultado?.callId;
            destinoLabel = nomeQuemPediu;
            if (!callId) {
              await reagir("❌"); limparArquivos();
              await reply("*Não foi possível obter o ID da chamada.*");
              break;
            }
            await aguardarAceite(callId, 30000);
          }
        } catch (e) {
          await reagir("❌");
          try { if (callId) await conn.endCall(callId); } catch {}
          limparArquivos();
          await reply(`*${["Chamada recusada ou não atendida", "Tempo esgotado para atendimento"].includes(e.message) ? e.message : "Erro ao iniciar a chamada: " + e.message}*`);
          break;
        }

        try { conn.playCallAudio(callId, pcmBuffer); } catch {}

        pararMonitor = monitorarEncerramento(callId, limparTudo);

        autoHangupTimer = setTimeout(async () => {
          try { await conn.endCall(callId); } catch {}
          limparTudo();
        }, duracaoExataMs + 3500);

        if (!global.chamadasAtivas) global.chamadasAtivas = {};
        global.chamadasAtivas[sender] = callId;

        fallbackTimeout = setTimeout(async () => {
          try { await conn.endCall(callId); } catch {}
          limparTudo();
        }, duracaoExataMs + 120000);

        const titulo = musica?.title || musica?.name || queryMusica || "Áudio enviado";
        const tempoFormatado = `${Math.floor(duracaoExataMs / 60000)}m ${Math.floor((duracaoExataMs % 60000) / 1000)}s`;
        const msgStatus = `🎶 *Chamada Iniciada!*\n\n📞 *Destino:* \`${destinoLabel}\`\n👤 *Pedido por:* ${nomeQuemPediu} (${cargo})\n📌 *Música:* ${titulo}\n⏱️ *Duração exata:* ${tempoFormatado}\n\n💡 A chamada desligará automaticamente após o término da música.`;

        if (isGroup) {
          await enviar(conn, sender, { text: msgStatus });
        } else {
          await reply(msgStatus);
        }

      } catch (e) {
        console.error("[playcall] erro geral:", e);
        await reagir("❌");
        reply("*Erro interno ao executar a chamada.*");
      }
      break;
    }

    case "menu":
    case "nejire":
    case "help":
    case "ajuda": {
      try {
        await reagir(config.emojiPrincipal);

        const dadosMenu = {
          status: isDono ? "dono" : (VipSistema.ehVip(sender) ? "vip" : "free user"),
          uptime: BotSistema.uptimeTexto()
        };

        if (Device.usarBotoes(sender, info)) {
          // menu de botões: mesma estrutura do menu de referência (foto,
          // lista de menus, mini games, alugar, painel, copiar prefixo...)
          let painelUrl = null;
          const urlPublica = config.webapp?.urlPublica;
          if (urlPublica && !/SEU[-_]/i.test(urlPublica)) {
            try {
              painelUrl = `${urlPublica}/pesca.html?token=${Pesca.gerarTokenPainel(sender)}`;
            } catch (e) {
              console.error("[NEJIRE] não deu pra gerar o link do painel:", e?.message || e);
            }
          }

          await enviarMenuNativo(conn, from, info, {
            ...montarMenuZero(prefix, { ...dadosMenu, painelUrl }),
            imagemBuffer: FotoNejire,
            // se o envio nativo falhar, cai no menu em lista de antes
            fallback: () => enviarMenuHD(conn, from, info, {
              texto: menuNejireCard(prefix, sender, {
                status: BotSistema.botEstaAtivo() ? "ligada ✅" : "desligada 💤",
                uptime: dadosMenu.uptime
              }),
              footer: pequeno(`${config.nome} v${config.versao}`),
              imagemBuffer: FotoNejire,
              secoes: secoesMenuCompleto(prefix),
              tituloBotao: `🐚 ${pequeno("abrir menu completo")} 🩵`
            })
          });
        } else {
          // modo ios: sem botão, menu decorado com os menucat_<categoria>
          await enviarInteligente(conn, from, info, {
            texto: menuNejireIOS(prefix, sender, dadosMenu),
            footer: pequeno(`${config.nome} v${config.versao}`),
            imagem: FotoNejire,
            comCanal: true
          });
        }

        // áudio do menu (×definiraudiomenu) — vai logo depois do menu
        await MenuAudio.enviarAposMenu(conn, from, info);
      } catch (err) {
        console.error(err);
        await reply("❌ deu erro pra abrir o menu.");
      }
      break;
    }

    case "oi":
    case "ola":
    case "olá": {
      try {
        await reagir("💙");
        await reply(`oiii!! tudo bem?? eu tava aqui pensando em curiosidades, quer ouvir uma? manda ${prefix}curiosidade!`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "sobre":
    case "quemsoueu": {
      try {
        await reagir(config.emojiPrincipal);
        await reply(respostaNejire());
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "ping": {
      try {
        const inicio = Date.now();
        await reagir("🌊");
        const demora = Date.now() - inicio;
        await reply(`${demora === 0 ? "<1" : demora}ms! rápida, né?? NÉ?? ${config.emojiPrincipal}⚡`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    // ══════════════════════════════════════════════
    // RPG DE DETETIVE
    // ══════════════════════════════════════════════
    case "casos":
    case "detetivecasos": {
      try {
        await reagir("🔎");
        await reply(Detetive.listarCasosTexto());
      } catch (err) {
        console.error(err);
        await reply("❌ deu erro ao listar os casos, tenta de novo!");
      }
      break;
    }

    case "caso": {
      try {
        if (!q.trim()) {
          await reply(`me diz o número do caso! Ex: ${prefix}caso 1\n\nmanda ${prefix}casos pra ver os que existem`);
          break;
        }
        await reagir("📦");
        const resultado = await Detetive.iniciarCasoComVerificacao(sender, q.trim());
        if (!resultado.ok) { await reply(resultado.texto); break; }
        await reply(resultado.texto);
        const bufferZip = fs.readFileSync(resultado.zipPath);
        await conn.sendMessage(from, {
          document: bufferZip,
          mimetype: "application/zip",
          fileName: resultado.fileName,
          caption: "📁 pacote de evidências do caso — abre e investiga!"
        });
        fs.unlink(resultado.zipPath, () => {});
      } catch (err) {
        console.error(err);
        await reply("❌ deu ruim gerando o pacote do caso, tenta de novo daqui a pouco!");
      }
      break;
    }

    case "gerarcodigo": {
      try {
        if (!exigirDono()) break;
        if (!q.trim()) { await reply(`me diz o número do caso! Ex: ${prefix}gerarcodigo 1`); break; }
        const resultado = Detetive.gerarCodigoAcesso(q.trim());
        await reply(resultado.texto);
      } catch (err) {
        console.error(err);
        await reply("❌ deu erro gerando o código de acesso.");
      }
      break;
    }

    case "codigosativos": {
      try {
        if (!exigirDono()) break;
        await reply(Detetive.listarCodigosAtivos(q.trim() || null));
      } catch (err) {
        console.error(err);
        await reply("❌ deu erro listando os códigos ativos.");
      }
      break;
    }

    case "suspeitos": {
      try {
        await reply(Detetive.listarSuspeitosTexto(sender));
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "evidencias": {
      try {
        await reply(Detetive.listarEvidenciasTexto(sender));
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "interrogar": {
      try {
        if (!args.length) {
          await reply(`fala assim: ${prefix}interrogar <nome do suspeito> <sua pergunta>\n\nEx: ${prefix}interrogar Diego onde você estava na hora do crime\n\nPode perguntar literalmente qualquer coisa — o suspeito responde na hora.`);
          break;
        }
        const nomeAlvo = args[0];
        const pergunta = args.slice(1).join(" ");
        await reagir("🗣️");
        const resultado = await Detetive.interrogar(sender, nomeAlvo, pergunta);
        await reply(resultado.texto);

        // se deu pra identificar o suspeito, manda a resposta também em
        // áudio (voz do personagem) — se a TTS falhar, sem problema, já
        // mandou em texto de qualquer jeito
        if (resultado.suspeito && resultado.falaCrua) {
          const audioBuffer = await DetetiveIA.gerarVozSuspeito(resultado.suspeito, resultado.falaCrua);
          if (audioBuffer) {
            await enviar(conn, from, { audio: audioBuffer, mimetype: "audio/mpeg", ptt: true }, { quoted: info });
          }
        }
      } catch (err) {
        console.error(err);
        await reply("❌ deu erro no interrogatório, tenta de novo!");
      }
      break;
    }

    case "pista": {
      try {
        await reagir("💡");
        await reply(Detetive.pedirPista(sender));
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "dicasenha": {
      try {
        await reply(Detetive.dicaSenha(sender));
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "acusar": {
      try {
        if (!q.trim()) {
          await reply(`fala assim: ${prefix}acusar <suspeito> ; <arma/método> ; <local>\n\nEx: ${prefix}acusar Diego Ferraz ; estatueta de bronze ; sala de curadoria`);
          break;
        }
        await reagir("⚖️");
        await reply(Detetive.acusar(sender, q));
      } catch (err) {
        console.error(err);
        await reply("❌ deu erro processando sua acusação, tenta de novo!");
      }
      break;
    }

    case "abandonarcaso": {
      try {
        await reply(Detetive.abandonarCaso(sender));
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "statuscaso":
    case "progressocaso": {
      try {
        await reply(Detetive.statusCaso(sender));
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "curiosidade":
    case "fato":
    case "curiosa": {
      try {
        await reagir("✨");
        const fato = CURIOSIDADES[Math.floor(Math.random() * CURIOSIDADES.length)];
        const perfil = darPontoCuriosidade(sender);
        await reply(`✨ ei, ei — ${fato}!\n\n(+1 ponto de curiosidade — total: ${perfil.pontosCuriosidade} 💠)`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "prefixo": {
      try {
        await responderPrefixo(conn, from, info, sender, prefix);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "clima": {
      try {
        if (!q.trim()) { await reply(`me diz a cidade! Ex: ${prefix}clima Campo Grande`); break; }
        await reagir("🌤️");
        const resp = await Scraper.buscarClima(q.trim());
        if (!resp.ok) { await reply(`não consegui pegar o clima agora :( (${resp.erro})`); break; }
        await reply(`🌤️ *clima de ${q.trim()}*\n\n${JSON.stringify(resp.dados, null, 2).slice(0, 800)}`);
      } catch (err) {
        console.error(err);
        await reply("❌ deu erro pra buscar o clima.");
      }
      break;
    }

    case "suicidio": {
      try {
        await reagir("💥");
        await reply("nãooo, mentira, era só brincadeira!! eu nunca ia sumir assim, rlxxx 💙 (esse comando é só uma zoeirinha clássica de bot, tá tudo bem por aqui!)");
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "ban":
    case "kick":
    case "remover": {
      try {
        if (!(await exigirGrupo())) break;
        if (!(await exigirAdmin())) break;

        const alvos = await GrupoSistema.pegarAlvo(conn, from, info, args, q, sender);
        if (!alvos.length) { await reply(`marca, responde ou manda o número de quem eu devo remover.\nEx: ${prefix}ban 5511999999999`); break; }

        await reagir(config.emojiPrincipal);
        await GrupoSistema.removerParticipante(conn, from, alvos[0]);
        await reply(`✅ removi @${alvos[0].split("@")[0]} ess* fdp do grupo`);
      } catch (err) {
        console.error(err);
        await reply("❌ não consegui remover esse ser — confere se eu sou admin do grupo!");
      }
      break;
    }

    case "promover": {
      try {
        if (!(await exigirGrupo())) break;
        if (!(await exigirAdmin())) break;

        const alvos = await GrupoSistema.pegarAlvo(conn, from, info, args, q, sender);
        if (!alvos.length) { await reply(`marca, responde ou manda o número de quem devo promover.`); break; }

        await GrupoSistema.promoverParticipante(conn, from, alvos[0]);
        await reply(`⬆️ @${alvos[0].split("@")[0]} agora é admin!`);
      } catch (err) {
        console.error(err);
        await reply("❌ não consegui promover — confere se eu sou admin!");
      }
      break;
    }

    case "rebaixar": {
      try {
        if (!(await exigirGrupo())) break;
        if (!(await exigirAdmin())) break;

        const alvos = await GrupoSistema.pegarAlvo(conn, from, info, args, q, sender);
        if (!alvos.length) { await reply(`marca, responde ou manda o número de quem devo rebaixar.`); break; }

        await GrupoSistema.rebaixarParticipante(conn, from, alvos[0]);
        await reply(`⬇️ @${alvos[0].split("@")[0]} não é mais admin.`);
      } catch (err) {
        console.error(err);
        await reply("❌ não consegui rebaixar — confere se eu sou admin!");
      }
      break;
    }

    case "mutar":
    case "mute": {
      try {
        if (!(await exigirGrupo())) break;
        if (!(await exigirAdmin())) break;

        const alvos = await GrupoSistema.pegarAlvo(conn, from, info, args, q, sender);
        if (!alvos.length) { await reply(`marca, responde ou manda o número de quem eu devo mutar.\nEx: ${prefix}mutar 5511999999999`); break; }

        Moderacao.mutar(from, alvos[0]);
        await reagir(emojiAzul());
        await reply(`🔇 @${alvos[0].split("@")[0]} foi mutado(a) ${emojiPraia()} (as mensagens del* vão ser apagadas até desmutar)`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "desmutar":
    case "unmute": {
      try {
        if (!(await exigirGrupo())) break;
        if (!(await exigirAdmin())) break;

        const alvos = await GrupoSistema.pegarAlvo(conn, from, info, args, q, sender);
        if (!alvos.length) { await reply(`marca, responde ou manda o número de quem eu devo desmutar.`); break; }

        Moderacao.desmutar(from, alvos[0]);
        await reagir(emojiAzul());
        await reply(`🔊 @${alvos[0].split("@")[0]} foi desmutado(a) ${emojiAzul()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "aviso":
    case "avisar": {
      try {
        if (!(await exigirGrupo())) break;
        if (!(await exigirAdmin())) break;

        const alvos = await GrupoSistema.pegarAlvo(conn, from, info, args, q, sender);
        if (!alvos.length) { await reply(`marca, responde ou manda o número de quem eu devo avisar.\nEx: ${prefix}aviso 5511999999999 parou de brigar!`); break; }

        const total = Moderacao.darAviso(from, alvos[0]);
        await reagir("🌊");

        if (total >= Moderacao.LIMITE_AVISOS) {
          Moderacao.resetarAvisos(from, alvos[0]);
          await GrupoSistema.removerParticipante(conn, from, alvos[0]);
          await reply(`🚫 @${alvos[0].split("@")[0]} bateu ${Moderacao.LIMITE_AVISOS} avisos e foi removido(a) do grupo!`);
        } else {
          await reply(`⚠️ @${alvos[0].split("@")[0]} recebeu um aviso (${total}/${Moderacao.LIMITE_AVISOS}) ${emojiPraia()}`);
        }
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "avisos": {
      try {
        if (!(await exigirGrupo())) break;

        const alvos = await GrupoSistema.pegarAlvo(conn, from, info, args, q, sender);
        const alvoFinal = alvos[0] || sender;
        const total = Moderacao.verAvisos(from, alvoFinal);
        await reply(`🐚 @${alvoFinal.split("@")[0]} tem *${total}/${Moderacao.LIMITE_AVISOS}* avisos`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "resetavisos": {
      try {
        if (!(await exigirGrupo())) break;
        if (!(await exigirAdmin())) break;

        const alvos = await GrupoSistema.pegarAlvo(conn, from, info, args, q, sender);
        if (!alvos.length) { await reply(`marca, responde ou manda o número de quem eu devo resetar os avisos.`); break; }

        Moderacao.resetarAvisos(from, alvos[0]);
        await reagir(emojiAzul());
        await reply(`✅ avisos de @${alvos[0].split("@")[0]} foram zerados ${emojiPraia()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "apagar":
    case "del": {
      try {
        if (!(await exigirGrupo())) break;
        if (!(await exigirAdmin())) break;

        const contextInfo = info.message?.extendedTextMessage?.contextInfo;
        const idQuotado = contextInfo?.stanzaId;
        const participantQuotado = contextInfo?.participant;

        if (!idQuotado) { await reply(`responde a mensagem que eu devo apagar com ${prefix}del!`); break; }

        await enviar(conn, from, {
          delete: {
            remoteJid: from,
            fromMe: false,
            id: idQuotado,
            participant: participantQuotado
          }
        });
        await reagir("☀️");
      } catch (err) {
        console.error(err);
        await reply("❌ não consegui apagar — confere se eu sou admin!");
      }
      break;
    }

    case "antiflood": {
      try {
        if (!(await exigirGrupo())) break;
        if (!(await exigirAdmin())) break;

        const modo = args[0]?.toLowerCase();
        if (!["on", "off"].includes(modo)) { await reply(`usa: ${prefix}antiflood on  ou  ${prefix}antiflood off`); break; }

        Moderacao.definirAntiflood(from, modo === "on");
        await reagir(emojiPraia());
        await reply(`🌊 antiflood agora tá *${modo === "on" ? "ativado" : "desativado"}* ${emojiAzul()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "bloquear": {
      try {
        if (!exigirDono()) break;

        const alvos = await GrupoSistema.pegarAlvo(conn, from, info, args, q, sender);
        if (!alvos.length) { await reply(`marca, responde ou manda o número de quem eu devo bloquear.`); break; }

        Moderacao.bloquear(alvos[0]);
        await reagir(emojiAzul());
        await reply(`🚫 @${alvos[0].split("@")[0]} foi bloqueado(a), não vou mais responder el* em lugar nenhum`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "desbloquear": {
      try {
        if (!exigirDono()) break;

        const alvos = await GrupoSistema.pegarAlvo(conn, from, info, args, q, sender);
        if (!alvos.length) { await reply(`marca, responde ou manda o número de quem eu devo desbloquear.`); break; }

        Moderacao.desbloquear(alvos[0]);
        await reagir(emojiPraia());
        await reply(`✅ @${alvos[0].split("@")[0]} foi desbloqueado(a) ${emojiPraia()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "marcartodos":
    case "all": {
      try {
        if (!(await exigirGrupo())) break;
        if (!(await exigirAdmin())) break;

        const participantes = await GrupoSistema.pegarParticipantes(conn, from);
        const ids = participantes.map(p => p.id || p.jid).filter(Boolean);
        await enviar(conn, from, {
          text: pequeno(GrupoSistema.textoMarcarTodos(participantes, q.trim() || "🌨️ marcando todo mundo!")),
          mentions: ids
        }, {});
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "hidetag": {
      try {
        if (!(await exigirGrupo())) break;
        if (!(await exigirAdmin())) break;
        if (!q.trim()) { await reply(`manda o texto! Ex: ${prefix}hidetag boa noite gente`); break; }

        const participantes = await GrupoSistema.pegarParticipantes(conn, from);
        const ids = participantes.map(p => p.id || p.jid).filter(Boolean);
        await enviar(conn, from, { text: pequeno(q.trim()), mentions: ids }, {});
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "listaadms": {
      try {
        if (!(await exigirGrupo())) break;

        const admins = await GrupoSistema.listarAdmins(conn, from);
        if (!admins.length) { await reply("não achei nenhum admin aqui, estranho :o"); break; }

        const linhas = admins.map(a => `▸ @${String(a.id || a.jid).split("@")[0]}`).join("\n");
        await enviar(conn, from, { text: pequeno(`🫐 admins do grupo:\n\n${linhas}`), mentions: admins.map(a => a.id || a.jid) }, {});
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "nomegrupo": {
      try {
        if (!(await exigirGrupo())) break;
        if (!(await exigirAdmin())) break;
        if (!q.trim()) { await reply(`manda o novo nome! Ex: ${prefix}nomegrupo Praia dos Amigos`); break; }

        await GrupoSistema.definirNomeGrupo(conn, from, q.trim().slice(0, 100));
        await reagir(emojiPraia());
        await reply(`✅ nome do grupo atualizado pra: *${q.trim()}*`);
      } catch (err) {
        console.error(err);
        await reply("❌ não consegui trocar o nome — confere se eu sou admin!");
      }
      break;
    }

    case "descgrupo": {
      try {
        if (!(await exigirGrupo())) break;
        if (!(await exigirAdmin())) break;
        if (!q.trim()) { await reply(`manda a nova descrição!`); break; }

        await GrupoSistema.definirDescricaoGrupo(conn, from, q.trim());
        await reagir(emojiAzul());
        await reply("✅ descrição do grupo atualizada!");
      } catch (err) {
        console.error(err);
        await reply("❌ não consegui trocar a descrição — confere se eu sou admin!");
      }
      break;
    }

    case "fotogrupo": {
      try {
        if (!(await exigirGrupo())) break;
        if (!(await exigirAdmin())) break;

        const quotedMsg = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const alvoImg = info.message?.imageMessage || quotedMsg?.imageMessage;
        if (!alvoImg) { await reply(`manda ou responde uma imagem com ${prefix}fotogrupo!`); break; }

        const buffer = await getMediaBuffer(alvoImg, "image");
        await GrupoSistema.definirFotoGrupo(conn, from, buffer);
        await reagir(emojiPraia());
        await reply("✅ foto do grupo atualizada!");
      } catch (err) {
        console.error(err);
        await reply("❌ não consegui trocar a foto — confere se eu sou admin!");
      }
      break;
    }

    case "revogarlink": {
      try {
        if (!(await exigirGrupo())) break;
        if (!(await exigirAdmin())) break;

        const novoLink = await GrupoSistema.revogarLinkGrupo(conn, from);
        await reagir(emojiAzul());
        await reply(`🔗 link antigo foi revogado! novo link:\n${novoLink}`);
      } catch (err) {
        console.error(err);
        await reply("❌ não consegui revogar o link — confere se eu sou admin!");
      }
      break;
    }

    // ══════════════════════════════════════════════════════

    case "linkgp": {
      try {
        if (!(await exigirGrupo())) break;
        if (!(await exigirAdmin())) break;

        const link = await GrupoSistema.pegarLinkGrupo(conn, from);
        await reply(`🔗 link do grupo:\n${link}`);
      } catch (err) {
        console.error(err);
        await reply("❌ não consegui pegar o link — confere se eu sou admin!");
      }
      break;
    }

    case "antilink": {
      try {
        if (!(await exigirGrupo())) break;
        if (!(await exigirAdmin())) break;

        const modo = args[0]?.toLowerCase();
        if (!["on", "off"].includes(modo)) { await reply(`usa: ${prefix}antilink on  ou  ${prefix}antilink off`); break; }

        GrupoSistema.salvarConfigGrupo(from, { antilink: modo === "on" });
        await reply(`🔗 anti-link agora tá *${modo === "on" ? "ativado" : "desativado"}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "abrirgrupo":
    case "fechargrupo": {
      try {
        if (!(await exigirGrupo())) break;
        if (!(await exigirAdmin())) break;

        const abrir = command === "abrirgrupo";
        await GrupoSistema.alterarGrupo(conn, from, abrir);
        await reply(abrir ? "🔓 grupo aberto — todo mundo pode falar!" : "🔒 grupo fechado — só admin fala agora.");
      } catch (err) {
        console.error(err);
        await reply("❌ não consegui alterar — confere se eu sou admin!");
      }
      break;
    }

    case "infogrupo": {
      try {
        if (!(await exigirGrupo())) break;

        const meta = await conn.groupMetadata(from);
        await reply(`╭─❍ 𝒈𝒓𝒐𝒖𝒑 𝒊𝒏𝒇𝒐 ❍─╮\n│ 💠 nome: ${meta.subject}\n│ 👥 membros: ${meta.participants.length}\n│ 🆔 id: ${from}\n╰────────────╯`);
      } catch (err) {
        console.error(err);
        await reply("❌ não consegui pegar as infos do grupo.");
      }
      break;
    }

    case "bemvindo": {
      try {
        if (!(await exigirGrupo())) break;
        if (!(await exigirAdmin())) break;

        const modo = args[0]?.toLowerCase();
        if (!["on", "off"].includes(modo)) { await reply(`usa: ${prefix}bemvindo on  ou  ${prefix}bemvindo off`); break; }

        BoasVindas.alternarBoasVindas(from, modo === "on");
        await reply(`🎊 boas-vindas agora tá *${modo === "on" ? "ativado" : "desativado"}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "legendabv":
    case "legendasaiu": {
      try {
        if (!(await exigirGrupo())) break;
        if (!(await exigirAdmin())) break;
        if (!q.trim()) { await reply(`manda o texto! use @user, @group e @membros que eu troco automático.\nEx: ${prefix + command} seja bem-vindo @user!`); break; }

        const campo = command === "legendabv" ? "legendaEntrada" : "legendaSaida";
        BoasVindas.salvarConfigGrupo(from, { [campo]: q });
        await reply("✅ legenda salva!");
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "regras": {
      try {
        if (!(await exigirGrupo())) break;
        if (!(await exigirAdmin())) break;
        if (!q.trim()) { await reply(`manda o texto das regras! Ex: ${prefix}regras 1. respeito acima de tudo`); break; }

        BoasVindas.definirRegras(from, q.trim());
        await reagir(emojiPraia());
        await reply("✅ regras do grupo salvas!");
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "verregras": {
      try {
        if (!(await exigirGrupo())) break;

        const regras = BoasVindas.obterRegras(from);
        if (!regras) { await reply(`ainda não tem regras salvas aqui. um admin pode definir com ${prefix}regras`); break; }

        await reply(`📜 *regras do grupo:*\n\n${regras}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "testarbv": {
      try {
        if (!(await exigirGrupo())) break;
        if (!(await exigirAdmin())) break;

        const meta = await conn.groupMetadata(from);
        const cfg = BoasVindas.configGrupo(from);
        const modelo = cfg.legendaEntrada || config.boasVindas?.legendaEntrada;
        if (!modelo) { await reply(`não tem legenda de entrada configurada. define com ${prefix}legendabv`); break; }

        const texto = BoasVindas.montarTexto(modelo, { userJid: sender, groupName: meta.subject, membros: meta.participants.length });
        await reply(`🧪 *simulação da mensagem de entrada:*\n\n${texto}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "autodelbv": {
      try {
        if (!(await exigirGrupo())) break;
        if (!(await exigirAdmin())) break;

        const modo = args[0]?.toLowerCase();
        if (!["on", "off"].includes(modo)) { await reply(`usa: ${prefix}autodelbv on  ou  ${prefix}autodelbv off`); break; }

        BoasVindas.alternarAutoDelBv(from, modo === "on");
        await reagir(emojiAzul());
        await reply(`🐚 apagar boas-vindas automático tá *${modo === "on" ? "ativado" : "desativado"}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "sticker":
    case "s":
    case "figurinha": {
      try {
        await reagir("🩵");

        const quotedMsg = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const alvoImg = info.message?.imageMessage || quotedMsg?.imageMessage;
        const alvoVid = info.message?.videoMessage || quotedMsg?.videoMessage;

        if (!alvoImg && !alvoVid) { await reply(`manda ou responde uma imagem/vídeo com ${prefix}sticker!`); break; }

        const buffer = alvoImg
          ? await getMediaBuffer(alvoImg, "image")
          : await getMediaBuffer(alvoVid, "video");

        const figurinha = alvoImg
          ? await criarFigurinhaImagem(buffer, config.figurinha)
          : await criarFigurinhaVideo(buffer, config.figurinha);

        await enviar(conn, from, { sticker: figurinha }, { quoted: info });
      } catch (err) {
        console.error(err);
        await reply("ah não, deu erro pra fazer a figurinha :(");
      }
      break;
    }

    case "toimg": {
      try {
        const quotedMsg = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const alvoSticker = info.message?.stickerMessage || quotedMsg?.stickerMessage;

        if (!alvoSticker) { await reply(`responde uma figurinha com ${prefix}toimg!`); break; }

        await reagir("🖼️");
        const buffer = await getMediaBuffer(alvoSticker, "sticker");
        const imagem = await BotSistema.figurinhaParaImagem(buffer);
        await enviar(conn, from, { image: imagem, caption: "prontinho! 🩵" }, { quoted: info });
      } catch (err) {
        console.error(err);
        await reply("não consegui converter essa figurinha :(");
      }
      break;
    }

    case "figurinhas": {
      try {
        await reply(`╭─❍ 𝒑𝒂𝒄𝒐𝒕𝒆 𝒂𝒕𝒖𝒂𝒍 ❍─╮\n│ 📦 nome: ${config.figurinha?.packname}\n│ ✍️ autor: ${config.figurinha?.author}\n╰────────────╯`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "figu_memes": {
      try {
        await reagir("😂");
        const busca = await Scraper.buscarPinterest("meme funny");
        if (!busca.ok || !busca.imagens.length) { await reply("não achei nenhum meme agora, tenta de novo :("); break; }

        const escolhido = busca.imagens[Math.floor(Math.random() * busca.imagens.length)];
        const url = escolhido?.url || escolhido?.image || escolhido;
        const resp = await require("axios").get(url, { responseType: "arraybuffer" });
        const figurinha = await criarFigurinhaImagem(Buffer.from(resp.data), config.figurinha);
        await enviar(conn, from, { sticker: figurinha }, { quoted: info });
      } catch (err) {
        console.error(err);
        await reply("deu erro pra transformar o meme em figurinha :(");
      }
      break;
    }

    case "setpack": {
      try {
        if (!exigirDono()) break;
        if (!q.trim()) { await reply(`manda o novo nome do pacote! Ex: ${prefix}setpack Praia Nejire`); break; }

        BotSistema.definirFigurinhaPack(q.trim());
        await reagir(emojiPraia());
        await reply(`✅ pacote de figurinha agora é: *${q.trim()}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "setautor": {
      try {
        if (!exigirDono()) break;
        if (!q.trim()) { await reply(`manda o novo autor das figurinhas!`); break; }

        BotSistema.definirFigurinhaAutor(q.trim());
        await reagir(emojiAzul());
        await reply(`✅ autor das figurinhas agora é: *${q.trim()}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "resetfigurinha": {
      try {
        if (!exigirDono()) break;

        BotSistema.resetarFigurinha();
        await reagir(emojiPraia());
        await reply("✅ pacote e autor das figurinhas voltaram ao padrão!");
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "play": {
      try {
        if (!q.trim()) { await reply(`me diz o nome da música! Ex: ${prefix}play never gonna give you up`); break; }
        await reagir("🎵");
        const resp = await Scraper.buscarMusica(q.trim());
        if (!resp.ok || !resp.url) { await reply(`não achei essa música :( ${resp.erro ? `(${resp.erro})` : ""}`); break; }
        await enviar(conn, from, { audio: { url: resp.url }, mimetype: "audio/mpeg", fileName: `${resp.titulo}.mp3` }, { quoted: info });
      } catch (err) {
        console.error(err);
        await reply("❌ deu erro pra buscar essa música.");
      }
      break;
    }

    case "playvid": {
      try {
        if (!q.trim()) { await reply(`me diz o nome do vídeo! Ex: ${prefix}playvid trailer`); break; }
        await reagir("🎬");
        const resp = await Scraper.buscarVideo(q.trim());
        if (!resp.ok || !resp.url) { await reply(`não achei esse vídeo :( ${resp.erro ? `(${resp.erro})` : ""}`); break; }
        await enviar(conn, from, { video: { url: resp.url }, caption: resp.titulo }, { quoted: info });
      } catch (err) {
        console.error(err);
        await reply("❌ deu erro pra buscar esse vídeo.");
      }
      break;
    }

    case "tiktok": {
      try {
        if (!q.trim()) { await reply(`manda o link do tiktok!`); break; }
        await reagir("🎬");
        const resp = await Scraper.baixarTiktok(q.trim());
        if (!resp.ok || !resp.url) { await reply(`não consegui baixar esse tiktok :( ${resp.erro ? `(${resp.erro})` : ""}`); break; }
        await enviar(conn, from, { video: { url: resp.url }, caption: "🎬 prontinho, sem marca d'água!" }, { quoted: info });
      } catch (err) {
        console.error(err);
        await reply("❌ deu erro pra baixar esse tiktok.");
      }
      break;
    }

    case "ig": {
      try {
        if (!q.trim()) { await reply(`manda o link do instagram!`); break; }
        await reagir("📸");
        const resp = await Scraper.baixarInstagram(q.trim());
        if (!resp.ok || !resp.url) { await reply(`não consegui baixar esse instagram :( ${resp.erro ? `(${resp.erro})` : ""}`); break; }

        try {
          await enviar(conn, from, { video: { url: resp.url }, caption: "📸 prontinho!" }, { quoted: info });
        } catch {
          await enviar(conn, from, { image: { url: resp.url }, caption: "📸 prontinho!" }, { quoted: info });
        }
      } catch (err) {
        console.error(err);
        await reply("❌ deu erro pra baixar esse instagram.");
      }
      break;
    }

    case "spotify": {
      try {
        if (!q.trim()) { await reply(`manda o link (ou nome) da música do spotify!`); break; }
        await reagir("🎧");
        const resp = await Scraper.baixarSpotify(q.trim());
        if (!resp.ok || !resp.url) { await reply(`não consegui baixar essa música :( ${resp.erro ? `(${resp.erro})` : ""}`); break; }
        await enviar(conn, from, { audio: { url: resp.url }, mimetype: "audio/mpeg", fileName: `${resp.titulo || "musica"}.mp3` }, { quoted: info });
      } catch (err) {
        console.error(err);
        await reply("❌ deu erro pra baixar essa música.");
      }
      break;
    }

    case "pinterest": {
      try {
        if (!q.trim()) { await reply(`me diz o que você quer buscar!`); break; }
        await reagir("🖼️");
        const resp = await Scraper.buscarPinterest(q.trim());
        if (!resp.ok || !resp.imagens.length) { await reply(`não achei nada com esse termo :(`); break; }

        for (const item of resp.imagens.slice(0, 3)) {
          const url = item?.url || item?.image || item;
          await enviar(conn, from, { image: { url }, caption: `🖼️ ${q.trim()}` }, { quoted: info }).catch(() => null);
        }
      } catch (err) {
        console.error(err);
        await reply("❌ deu erro pra buscar no pinterest.");
      }
      break;
    }

    case "letra": {
      try {
        if (!q.trim()) { await reply(`me diz o nome da música!`); break; }
        await reagir("📝");
        const resp = await Scraper.buscarLetra(q.trim());
        if (!resp.ok || !resp.letra) { await reply(`não achei a letra dessa música :(`); break; }
        await reply(`📝 *${q.trim()}*\n\n${String(resp.letra).slice(0, 3500)}`);
      } catch (err) {
        console.error(err);
        await reply("❌ deu erro pra buscar a letra.");
      }
      break;
    }

    case "gpt": {
      try {
        if (!q.trim()) { await reply(`me pergunta alguma coisa! Ex: ${prefix}gpt por que o céu é azul?`); break; }
        await reagir("🤔");
        const resposta = await Ia.perguntarGpt(q.trim());
        await reply(resposta || "hmm, não consegui pensar em nada agora :(");
      } catch (err) {
        console.error(err);
        await reply("❌ deu erro na IA agora.");
      }
      break;
    }

    case "modoai": {
    try {
        const args = q.trim().split(/ +/);
        const subcomando = args[0]?.toLowerCase();
        const nomeInformado = args.slice(1).join(" ") || null;
        const nomePadrao = info.pushName || null;

        const desligarPedido = ["off", "desligar", "sair", "parar"].includes(subcomando);

        // ── DESLIGAR ──────────────────────────────────────────
        if (desligarPedido) {
            Modoai.desligar(sender);
            await reply("💤 modoai desligado! voltei ao normal, chama com o prefixo de novo quando quiser 🐚");
            break;
        }

        // ── MENU DE OPÇÕES (Quando digita apenas /modoai) ─────
        if (!subcomando) {
            await reply(
                `🎭 *ESCOLHA A PERSONA DO MODO IA* 🎭\n\n` +
                `1️⃣ *${prefix}modoai nejire*\n` +
                `   ▸ *Nejire:* Adolescente (14 anos), bem humorada, fofoqueira e debochada.\n\n` +
                `2️⃣ *${prefix}modoai zerotwo*\n` +
                `   ▸ *Zero Two:* Séria, dominante, fria, arrogante e provocadora.\n\n` +
                `💡 *Exemplo de uso:* \`${prefix}modoai nejire\` ou \`${prefix}modoai zerotwo SeuNome\`\n` +
                `🛑 *Para desligar:* \`${prefix}modoai off\``
            );
            break;
        }

        // ── VERIFICAÇÃO DE PERSONA VÁLIDA ─────────────────────
        if (!["nejire", "zerotwo"].includes(subcomando)) {
            await reply(
                `❌ Persona inválida!\n\n` +
                `Escolha entre:\n` +
                `▸ *${prefix}modoai nejire*\n` +
                `▸ *${prefix}modoai zerotwo*\n\n` +
                `Ou desligue com *${prefix}modoai off*`
            );
            break;
        }

        // ── ATIVAR OU ALTERNAR PERSONA ────────────────────────
        const resultado = Modoai.alternar(sender, subcomando, nomeInformado, nomePadrao);

        if (resultado.desligou) {
            await reply("💤 modoai desligado! voltei ao normal, chama com o prefixo de novo quando quiser 🐚");
            break;
        }

        const personaAtiva = Modoai.PERSONAS[resultado.persona] || Modoai.PERSONAS.nejire;
        const emojiPersona = resultado.persona === "zerotwo" ? "🥀" : "💙";

        await reagir(resultado.persona === "zerotwo" ? "🥀" : "🐚");

        await reply(
            `oiii ativei o *modoai* com a persona *${personaAtiva.nome}*! ${emojiPersona}\n\n` +
            `agora pode falar direto comigo, sem precisar do ${prefix} — eu te respondo em áudio com a minha voz!\n\n` +
            `▸ persona: *${personaAtiva.nome}*\n` +
            `▸ vou te chamar de: *${resultado.nome || "você"}*\n` +
            `▸ id de memória: \`${resultado.memoriaId}\`\n\n` +
            `pra desligar: ${prefix}modoai off`
        );

    } catch (err) {
        console.error(err);
        await reply("❌ deu erro pra ligar o modoai agora.");
    }
    break;
}

    case "polychat": {
      try {
        if (!q.trim()) { await reply(`me manda uma mensagem! Ex: ${prefix}polychat quem é você?`); break; }
        await reagir("🤖");
        const resp = await ZoneExtras.polyChat(q.trim());
        await reply(resp.ok ? resp.texto : "hmm, não consegui responder isso agora :(");
      } catch (err) {
        console.error(err);
        await reply("❌ deu erro nesse chat agora.");
      }
      break;
    }

    case "falar": {
      try {
        if (!q.trim()) { await reply(`me manda o texto que você quer ouvir! Ex: ${prefix}falar eu aplico o chá`); break; }
        await reagir("🔊");
        const resp = await ZoneExtras.player(q.trim());
        if (!resp.ok) { await reply("não consegui gerar esse áudio agora :("); break; }
        await enviar(conn, from, { audio: resp.buffer || { url: resp.url }, mimetype: "audio/mpeg", ptt: true }, { quoted: info });
      } catch (err) {
        console.error(err);
        await reply("❌ deu erro pra gerar esse áudio.");
      }
      break;
    }

    case "tiktoksearch": {
      try {
        if (!q.trim()) { await reply(`me diz o que buscar! Ex: ${prefix}tiktoksearch neymar edit`); break; }
        await reagir("🎵");
        const resp = await ZoneExtras.buscarTiktok(q.trim(), 10);
        if (!resp.ok) { await reply("não achei nada no tiktok com isso :("); break; }

        const texto = resp.lista.slice(0, 10).map((v, i) => `${i + 1}. ${v.titulo}${v.autor ? ` — @${v.autor}` : ""}\n${v.url}`).join("\n\n");
        await reply(`🎵 *resultados pra "${q.trim()}"*\n\n${texto}`);
      } catch (err) {
        console.error(err);
        await reply("❌ deu erro pra buscar no tiktok.");
      }
      break;
    }

    case "gimage": {
      try {
        if (!q.trim()) { await reply(`me diz o que buscar! Ex: ${prefix}gimage gatinho fofo`); break; }
        await reagir("🖼️");
        const resp = await ZoneExtras.buscarImagens(q.trim(), 10);
        if (!resp.ok) { await reply("não achei nenhuma imagem com isso :("); break; }

        for (const url of resp.lista.slice(0, 5)) {
          await enviar(conn, from, { image: { url }, caption: `🖼️ ${q.trim()}` }, { quoted: info }).catch(() => null);
        }
      } catch (err) {
        console.error(err);
        await reply("❌ deu erro pra buscar imagens.");
      }
      break;
    }

    case "appstore": {
      try {
        if (!q.trim()) { await reply(`me diz o nome do app! Ex: ${prefix}appstore Pou`); break; }
        await reagir("📱");
        const resp = await ZoneExtras.buscarAppStore(q.trim());
        if (!resp.ok) { await reply("não achei nenhum app com esse nome :("); break; }

        const texto = resp.lista.slice(0, 8).map((a, i) => `${i + 1}. *${a.nome}*${a.desenvolvedor ? ` — ${a.desenvolvedor}` : ""}${a.url ? `\n${a.url}` : ""}`).join("\n\n");
        await reply(`📱 *resultados pra "${q.trim()}"*\n\n${texto}`);
      } catch (err) {
        console.error(err);
        await reply("❌ deu erro pra buscar na app store.");
      }
      break;
    }

    case "soundcloud": {
      try {
        if (!q.trim()) { await reply(`me diz o que buscar! Ex: ${prefix}soundcloud mc menor rf`); break; }
        await reagir("🎧");
        const resp = await ZoneExtras.buscarSoundcloud(q.trim());
        if (!resp.ok) { await reply("não achei nada no soundcloud com isso :("); break; }

        const texto = resp.lista.slice(0, 8).map((m, i) => `${i + 1}. *${m.titulo}*${m.autor ? ` — ${m.autor}` : ""}${m.url ? `\n${m.url}` : ""}`).join("\n\n");
        await reply(`🎧 *resultados pra "${q.trim()}"*\n\n${texto}`);
      } catch (err) {
        console.error(err);
        await reply("❌ deu erro pra buscar no soundcloud.");
      }
      break;
    }

    case "wagroups": {
      try {
        if (!q.trim()) { await reply(`me diz o assunto do grupo que você quer achar! Ex: ${prefix}wagroups anime`); break; }
        await reagir("👥");
        const resp = await ZoneExtras.buscarGruposWa(q.trim());
        if (!resp.ok) { await reply("não achei nenhum grupo com esse tema :("); break; }

        const texto = resp.lista.slice(0, 8).map((g, i) => `${i + 1}. *${g.nome}*\n${g.link}`).join("\n\n");
        await reply(`👥 *grupos sobre "${q.trim()}"*\n\n${texto}`);
      } catch (err) {
        console.error(err);
        await reply("❌ deu erro pra buscar grupos.");
      }
      break;
    }

    case "apple": {
      try {
        if (!q.trim()) { await reply(`me diz o que buscar! Ex: ${prefix}apple never gonna give you up`); break; }
        await reagir("🍎");
        const resp = await ZoneExtras.buscarApple(q.trim());
        if (!resp.ok) { await reply("não achei nada com esse termo :("); break; }

        const texto = resp.lista.slice(0, 8).map((m, i) => `${i + 1}. *${m.titulo}*${m.artista ? ` — ${m.artista}` : ""}${m.url ? `\n${m.url}` : ""}`).join("\n\n");
        await reply(`🍎 *resultados pra "${q.trim()}"*\n\n${texto}`);
      } catch (err) {
        console.error(err);
        await reply("❌ deu erro pra buscar isso.");
      }
      break;
    }

    case "attp": {
      try {
        if (!q.trim()) { await reply(`me manda o texto! Ex: ${prefix}attp teste`); break; }
        await reagir("✨");
        const resp = await ZoneExtras.gerarAttp(q.trim());
        if (!resp.ok) { await reply("não consegui gerar esse gif agora :("); break; }
        await enviarCanvas(conn, from, info, resp);
      } catch (err) {
        console.error(err);
        await reply("❌ deu erro pra gerar o attp.");
      }
      break;
    }

    case "roleta": {
      try {
        if (!q.trim()) { await reply(`me manda o texto! Ex: ${prefix}roleta oi, oi, oi`); break; }
        await reagir("🎡");
        const resp = await ZoneExtras.gerarRoleta(q.trim());
        if (!resp.ok) { await reply("não consegui gerar essa roleta agora :("); break; }
        await enviarCanvas(conn, from, info, resp);
      } catch (err) {
        console.error(err);
        await reply("❌ deu erro pra gerar a roleta.");
      }
      break;
    }

    case "8ball":
    case "bola8": {
      try {
        if (!q.trim()) { await reply(`me faz uma pergunta de sim ou não!`); break; }
        await reagir("🎱");
        await reply(`🎱 ${Ia.bola8()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "conselho": {
      try {
        await reagir("💡");
        await reply(`💡 ${Ia.conselho()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "gerarsenha": {
      try {
        const tamanho = parseInt(args[0]) || 12;
        await reply(`🔐 sua senha: \`${Ia.gerarSenha(tamanho)}\`\n\n(gera uma nova sempre que quiser!)`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "casal": {
      try {
        if (args.length < 2) { await reply(`manda dois nomes! Ex: ${prefix}casal Ana João`); break; }
        const [nome1, nome2] = [args[0], args[1]];
        const porcentagem = Ia.calcularCasal(nome1, nome2);
        await reply(`💘 *${nome1} + ${nome2}*\n\ncompatibilidade: *${porcentagem}%* ${porcentagem > 70 ? "🔥" : porcentagem > 40 ? "💙" : "💔"}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "ppt": {
      try {
        const escolha = args[0]?.toLowerCase();
        if (!["pedra", "papel", "tesoura"].includes(escolha)) { await reply(`escolhe: ${prefix}ppt pedra | papel | tesoura`); break; }

        const { escolhaBot, resultado } = Ia.jogarPPT(escolha);
        const texto = resultado === "empate" ? "empatamos!!" : resultado === "jogador" ? "você ganhou! 😭" : "eu ganhei!! 🎉";
        await reply(`✊✋✌️ eu escolhi *${escolhaBot}*, você escolheu *${escolha}*\n\n${texto}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "gerarnick":
    case "nickaleatorio": {
      try {
        await reply(`✨ que tal: *${Ia.gerarNick(q.trim() || "Nejire")}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "piada": {
      try {
        await reagir("😂");
        await reply(`😂 ${Ia.piada()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "charada": {
      try {
        await reagir("🤔");
        const c = Ia.charada();
        await reply(`🤔 *charada:* ${c.pergunta}\n\n_a resposta chega em alguns segundos!_`);
        setTimeout(() => { reply(`💡 resposta: *${c.resposta}*`).catch(() => null); }, 8000);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "frase":
    case "motivacional": {
      try {
        await reagir(emojiAzul());
        await reply(`💙 ${Ia.fraseMotivacional()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "desafio": {
      try {
        await reagir(emojiPraia());
        await reply(`🏖️ *desafio do dia:*\n${Ia.desafio()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "escolher": {
      try {
        const opcoes = q.split("|").map(o => o.trim()).filter(Boolean);
        if (opcoes.length < 2) { await reply(`manda pelo menos 2 opções separadas por |. Ex: ${prefix}escolher pizza | hamburguer`); break; }

        const escolhida = opcoes[Math.floor(Math.random() * opcoes.length)];
        await reagir("🎯");
        await reply(`🎯 eu escolho: *${escolhida}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "moeda":
    case "cara-coroa": {
      try {
        const resultado = Math.random() < 0.5 ? "cara" : "coroa";
        await reagir("🪙");
        await reply(`🪙 deu *${resultado}*!`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "dado": {
      try {
        const lados = parseInt(args[0]) || 6;
        const resultado = Math.floor(Math.random() * Math.max(2, lados)) + 1;
        await reagir("🎲");
        await reply(`🎲 caiu no *${resultado}* (dado de ${Math.max(2, lados)} lados)`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "nota": {
      try {
        if (!q.trim()) { await reply(`manda o que você quer avaliar! Ex: ${prefix}nota seu dia`); break; }
        const nota = (Math.random() * 10).toFixed(1);
        await reply(`⭐ eu dou nota *${nota}/10* pra "${q.trim()}"`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "imc": {
      try {
        const [pesoStr, alturaStr] = args;
        const peso = parseFloat(pesoStr);
        const altura = parseFloat(alturaStr);
        if (!peso || !altura) { await reply(`usa: ${prefix}imc <peso em kg> <altura em m>\nEx: ${prefix}imc 70 1.75`); break; }

        const imc = peso / (altura * altura);
        let classificacao = "peso normal";
        if (imc < 18.5) classificacao = "abaixo do peso";
        else if (imc >= 25 && imc < 30) classificacao = "sobrepeso";
        else if (imc >= 30) classificacao = "obesidade";

        await reply(`📏 seu imc é *${imc.toFixed(1)}* (${classificacao})\n\n_isso é só uma conta, não substitui avaliação médica!_`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "idade": {
      try {
        if (!q.trim()) { await reply(`manda sua data de nascimento! Ex: ${prefix}idade 15/03/2000`); break; }

        const [dia, mes, ano] = q.trim().split(/[\/\-]/).map(Number);
        if (!dia || !mes || !ano) { await reply(`formato errado! usa: ${prefix}idade DD/MM/AAAA`); break; }

        const nascimento = new Date(ano, mes - 1, dia);
        const hoje = new Date();
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const aindaNaoFezAniversario = (hoje.getMonth() < nascimento.getMonth()) ||
          (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());
        if (aindaNaoFezAniversario) idade--;

        await reply(`🎂 você tem *${idade}* anos!`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "reverso":
    case "inverter": {
      try {
        if (!q.trim()) { await reply(`manda um texto pra eu inverter!`); break; }
        await reply(`🔄 ${q.trim().split("").reverse().join("")}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "tabuada": {
      try {
        const numero = parseInt(args[0]);
        if (!numero) { await reply(`manda um número! Ex: ${prefix}tabuada 7`); break; }

        const linhas = Array.from({ length: 10 }, (_, i) => `${numero} x ${i + 1} = ${numero * (i + 1)}`);
        await reply(`✖️ *tabuada do ${numero}:*\n\n${linhas.join("\n")}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "setprefixo": {
      try {
        if (!exigirDono()) break;
        if (!args[0]) { await reply(`manda o novo prefixo! Ex: ${prefix}setprefixo !`); break; }

        const novo = BotSistema.trocarPrefixo(args[0]);
        prefix = novo;
        await reply(`✅ prefixo trocado pra: *${novo}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "reiniciar": {
      try {
        if (!exigirDono()) break;
        await reply("🔄 reiniciando, já volto!");
        setTimeout(() => process.exit(0), 1200);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "botoff": {
      try {
        if (!exigirDono()) break;
        BotSistema.definirEstadoBot(false);
        await reply("💤 tá bom, tô desligando pros outros (você continua podendo me usar).");
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "boton": {
      try {
        if (!exigirDono()) break;
        BotSistema.definirEstadoBot(true);
        await reply("⚡ voltei! tô ligada de novo pra todo mundo.");
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "uptime": {
      try {
        await reply(`⏱️ tô ligada há: ${BotSistema.uptimeTexto()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "versao": {
      try {
        await reply(`🏝️ versão atual: v${config.versao}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "status": {
      try {
        await reply(`╭─❍ 𝒔𝒕𝒂𝒕𝒖𝒛 ❍─╮\n│ 🫐 versão: v${config.versao}\n│ ⏱️ uptime: ${BotSistema.uptimeTexto()}\n│ ⚙️ estado: ${BotSistema.botEstaAtivo() ? "ligada ✅" : "desligada 💤"}\n│ 🔤 prefixo: ${prefix}\n╰────────────╯`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "criador": {
      try {
        await reply(`🌀 fui programada pelo *${config.nomeDono || "meu criador"}*!`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "bug": {
      try {
        if (!q.trim()) { await reply(`descreve o bug! Ex: ${prefix}bug o comando play não funciona`); break; }
        if (config.numeroDono) {
          await enviar(conn, `${config.numeroDono.replace(/[^0-9]/g, "")}@s.whatsapp.net`, {
            text: `🐛 *bug reportado*\nde: @${sender.split("@")[0]}\n\n${q.trim()}`,
            mentions: [sender]
          }).catch(() => null);
        }
        await reply("✅ bug reportado pro meu criador, obrigada por ajudar!");
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "avaliar": {
      try {
        if (!q.trim()) { await reply(`me dá uma nota e uma opinião! Ex: ${prefix}avaliar 5 muito boa!`); break; }
        if (config.numeroDono) {
          await enviar(conn, `${config.numeroDono.replace(/[^0-9]/g, "")}@s.whatsapp.net`, {
            text: `⭐ *avaliação recebida*\nde: @${sender.split("@")[0]}\n\n${q.trim()}`,
            mentions: [sender]
          }).catch(() => null);
        }
        await reply("💙 obrigadaa pela avaliação!!");
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "doar": {
      try {
        await reply(`💙 se quiser ajudar a manter meus servidores no ar, fala com o *${config.nomeDono || "dono"}* pelo ${prefix}criador!`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "parceria": {
      try {
        if (!q.trim()) { await reply(`me conta a proposta de parceria! Ex: ${prefix}parceria quero divulgar meu grupo`); break; }
        if (config.numeroDono) {
          await enviar(conn, `${config.numeroDono.replace(/[^0-9]/g, "")}@s.whatsapp.net`, {
            text: `🤝 *proposta de parceria*\nde: @${sender.split("@")[0]}\n\n${q.trim()}`,
            mentions: [sender]
          }).catch(() => null);
        }
        await reply("✅ proposta enviada pro meu criador, obrigada!");
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "grupos": {
      try {
        if (!exigirDono()) break;
        const chats = await conn.groupFetchAllParticipating?.().catch(() => null);
        const total = chats ? Object.keys(chats).length : "desconhecido";
        await reply(`🌨️ tô presente em *${total}* grupo(s) no total`);
      } catch (err) {
        console.error(err);
        await reply("❌ não consegui contar os grupos agora.");
      }
      break;
    }

    case "comandostotal":
    case "totalcmd": {
      try {
        const total = todosComandos().length;
        await reply(`🌨️ eu tenho *${total}* comandos ativos agora! usa ${prefix}menu pra ver todos`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "creditos": {
      try {
        await reply(`💙 *${config.nome} v${config.versao}*\ncriada por *${config.nomeDono || "meu criador"}*\n\nobrigada por me usar! 🏖️`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "vip": {
      try {
        const vipStatus = VipSistema.status(sender);
        if (!vipStatus) { await reply(`você ainda não é VIP! usa ${prefix}planosvip pra ver como virar um 💎`); break; }

        const faltam = Math.ceil((vipStatus.expiraEm - Date.now()) / 86400000);
        await reply(`💎 você é VIP: *${vipStatus.plano}*\nfaltam *${faltam}* dia(s)`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "planosvip": {
      try {
        await reply(`╭─❍ 𝒑𝒍𝒂𝒏𝒐𝒔 𝒍𝒎𝒃 ❍─╮\n${VipSistema.planosTexto(prefix)}\n╰────────────╯`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "addvip": {
      try {
        if (!exigirDono()) break;
        const [numero, planoId] = args;
        if (!numero || !planoId) { await reply(`usa: ${prefix}addvip <numero> <id-do-plano>`); break; }

        const jidAlvo = `${numero.replace(/[^0-9]/g, "")}@s.whatsapp.net`;
        const registro = VipSistema.adicionar(jidAlvo, planoId);
        await reply(`✅ @${numero.replace(/[^0-9]/g, "")} agora é VIP (${registro.plano})!`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "delvip": {
      try {
        if (!exigirDono()) break;
        if (!args[0]) { await reply(`usa: ${prefix}delvip <numero>`); break; }

        const jidAlvo = `${args[0].replace(/[^0-9]/g, "")}@s.whatsapp.net`;
        const ok = VipSistema.remover(jidAlvo);
        await reply(ok ? "✅ VIP removido." : "❌ essa pessoa não é VIP.");
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "vips": {
      try {
        if (!exigirDono()) break;
        const todos = Object.entries(VipSistema.listar());
        if (!todos.length) { await reply("nenhum VIP ativo agora."); break; }

        const linhas = todos.map(([jid, v]) => `▸ ${jid.split("@")[0]} — ${v.plano}`).join("\n");
        await reply(`╭─❍ 𝒎𝒆𝒎𝒂 𝒗𝒊𝒑𝒛 ❍─╮\n${linhas}\n╰────────────╯`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "beneficiosvip": {
      try {
        await reply(`💎 *benefícios de ser VIP:*\n\n▸ prioridade nas filas de download\n▸ acesso a comandos exclusivos\n▸ selo especial no perfil\n▸ suporte mais rápido\n\nvê os planos com ${prefix}planosvip!`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "indicarvip": {
      try {
        await reply(`🐚 indique um(a) amigo(a) pra virar VIP também! quando ele(a) assinar, fala com o *${config.nomeDono || "dono"}* que vocês dois ganham um bônus especial 💎`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "vipsuporte": {
      try {
        if (!q.trim()) { await reply(`me conta seu problema! Ex: ${prefix}vipsuporte meu vip não tá ativando`); break; }
        if (config.numeroDono) {
          await enviar(conn, `${config.numeroDono.replace(/[^0-9]/g, "")}@s.whatsapp.net`, {
            text: `💎 *suporte vip*\nde: @${sender.split("@")[0]}\n\n${q.trim()}`,
            mentions: [sender]
          }).catch(() => null);
        }
        await reply("✅ mandei seu chamado pro suporte VIP, já te respondem!");
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "alugar": {
      try {
        await reply(`╭─❍ 𝒂𝒍𝒖𝒈𝒂𝒓 ❍─╮\n${AluguelSistema.planosTexto(prefix)}\n╰────────────╯`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "planosaluguel": {
      try {
        await reply(`╭─❍ 𝒑𝒍𝒂𝒏𝒐𝒔 ❍─╮\n${AluguelSistema.planosTexto(prefix)}\n╰────────────╯`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "statusaluguel": {
      try {
        const alvo = isGroup ? from : sender;
        const aluguelStatus = AluguelSistema.status(alvo);
        if (!aluguelStatus) { await reply(`nenhum aluguel ativo aqui. usa ${prefix}planosaluguel pra ver os planos!`); break; }

        const faltam = Math.ceil((aluguelStatus.expiraEm - Date.now()) / 86400000);
        await reply(`📆 aluguel ativo: *${aluguelStatus.plano}*\nfaltam *${faltam}* dia(s)`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "addaluguel": {
      try {
        if (!exigirDono()) break;
        const [alvoId, planoId] = args;
        if (!alvoId || !planoId) { await reply(`usa: ${prefix}addaluguel <numero-ou-id-do-grupo> <id-do-plano>`); break; }

        const alvoFinal = alvoId.includes("@") ? alvoId : `${alvoId.replace(/[^0-9]/g, "")}@s.whatsapp.net`;
        const registro = AluguelSistema.adicionar(alvoFinal, planoId);
        await reply(`✅ aluguel ativado (${registro.plano})!`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "delaluguel": {
      try {
        if (!exigirDono()) break;
        if (!args[0]) { await reply(`usa: ${prefix}delaluguel <numero-ou-id-do-grupo>`); break; }

        const alvoFinal = args[0].includes("@") ? args[0] : `${args[0].replace(/[^0-9]/g, "")}@s.whatsapp.net`;
        const ok = AluguelSistema.remover(alvoFinal);
        await reply(ok ? "✅ aluguel removido." : "❌ não achei esse aluguel.");
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "beneficiosaluguel": {
      try {
        await reply(`🌀 *o que vem no aluguel:*\n\n▸ bot funcionando 24h no seu grupo\n▸ todos os sistemas liberados (menos os do dono)\n▸ suporte durante o plano ativo\n\nvê os planos com ${prefix}planosaluguel!`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "suportealuguel": {
      try {
        if (!q.trim()) { await reply(`me conta o problema! Ex: ${prefix}suportealuguel meu bot caiu`); break; }
        if (config.numeroDono) {
          await enviar(conn, `${config.numeroDono.replace(/[^0-9]/g, "")}@s.whatsapp.net`, {
            text: `🌀 *suporte de aluguel*\nde: @${sender.split("@")[0]}\n\n${q.trim()}`,
            mentions: [sender]
          }).catch(() => null);
        }
        await reply("✅ chamado enviado pro suporte, já te respondem!");
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "renovaraluguel": {
      try {
        if (!exigirDono()) break;
        const [alvoId, planoId] = args;
        if (!alvoId || !planoId) { await reply(`usa: ${prefix}renovaraluguel <numero-ou-id-do-grupo> <id-do-plano>`); break; }

        const alvoFinal = alvoId.includes("@") ? alvoId : `${alvoId.replace(/[^0-9]/g, "")}@s.whatsapp.net`;
        const registro = AluguelSistema.adicionar(alvoFinal, planoId);
        await reply(`✅ aluguel renovado (${registro.plano})!`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "perfil":
    case "meuperfil": {
      try {
        await reagir(config.emojiPrincipal);
        const perfil = getPerfil(sender);
        await reply(cardPerfil(sender, perfil, prefix, Jid.nomeUsuario(info, sender)));
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "apelido":
    case "nickname": {
      try {
        if (!q.trim()) { await reply(`me diz um apelido! Ex: ${prefix}apelido Nejire-chan`); break; }
        const novoApelido = q.trim().slice(0, 30);
        salvarPerfil(sender, { apelido: novoApelido });
        await reagir("💙");
        await reply(`prontinho! agora eu te chamo de *${novoApelido}* ${config.emojiPrincipal}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "ranking":
    case "top": {
      try {
        await reagir("✨");
        const topLista = ranking(10);
        await reply(textoRanking(topLista, prefix));
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "daily": {
      try {
        const resultado = Economia.resgatarDaily(sender);
        if (!resultado.ok) { await reply(`já pegou hoje! volta em ${Economia.formatarTempo(resultado.faltam)} 💙`); break; }
        await reply(`🎁 você ganhou *${resultado.ganho} ${config.economia?.moeda || "moedas"}*!\nsaldo atual: ${resultado.perfil.saldo}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "saldo": {
      try {
        await reply(`💰 seu saldo: *${Economia.saldo(sender)} ${config.economia?.moeda || ""}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "xp": {
      try {
        const perfil = getPerfil(sender);
        await reply(`⭐ xp: *${perfil.xp || 0}*\n📈 nível: *${Economia.calcularNivel(perfil.xp || 0)}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "trabalhar": {
      try {
        const resultado = Economia.trabalhar(sender);
        if (!resultado.ok) { await reply(`você já trabalhou! volta em ${Economia.formatarTempo(resultado.faltam)} 💙`); break; }
        await reply(`💼 você ${resultado.tarefa} e ganhou *${resultado.ganho}* moedas!\nsaldo atual: ${resultado.perfil.saldo}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "roubar": {
      try {
        const alvos = await GrupoSistema.pegarAlvo(conn, from, info, args, q, sender);
        if (!alvos.length) { await reply(`marca, responde ou manda o número de quem você quer tentar roubar!`); break; }

        const resultado = Economia.roubar(sender, alvos[0]);
        if (!resultado.ok) {
          if (resultado.cooldown) { await reply(`calma, você já tentou roubar recentemente! espera ${Economia.formatarTempo(resultado.faltam)}`); break; }
          if (resultado.semGrana) { await reply("essa pessoa não tem moedas suficientes pra valer a pena roubar 😅"); break; }
        }

        if (resultado.roubou) {
          await reply(`🕵️ você roubou *${resultado.valor}* moedas de @${alvos[0].split("@")[0]}!`);
        } else {
          await reply(`🚨 você foi pego(a) tentando roubar e pagou *${resultado.multa}* moedas de multa!`);
        }
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "apostar": {
      try {
        const valor = parseInt(args[0]);
        if (!valor || valor <= 0) { await reply(`usa: ${prefix}apostar <quantidade>\nEx: ${prefix}apostar 100`); break; }

        const resultado = Economia.apostar(sender, valor);
        if (!resultado.ok) { await reply("você não tem moedas suficientes pra essa aposta!"); break; }

        await reply(resultado.ganhou
          ? `🎉 você apostou *${valor}* e ganhou o dobro! saldo atual: ${resultado.saldo}`
          : `😭 você apostou *${valor}* e perdeu tudo... saldo atual: ${resultado.saldo}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "transferir":
    case "pagar": {
      try {
        const alvos = await GrupoSistema.pegarAlvo(conn, from, info, args, q, sender);
        const valor = parseInt(args.find(a => /^\d+$/.test(a)) || 0);
        if (!alvos.length || !valor) { await reply(`usa: ${prefix}transferir <numero-ou-marca> <quantidade>`); break; }

        const resultado = Economia.transferir(sender, alvos[0], valor);
        if (!resultado.ok) { await reply("você não tem moedas suficientes pra essa transferência!"); break; }

        await reply(`💸 você transferiu *${valor}* moedas pra @${alvos[0].split("@")[0]}!`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "loja": {
      try {
        await reply(`🛍️ *loja da nejire:*\n\n${Economia.listarLoja()}\n\ncompra com ${prefix}comprar <id>`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "comprar": {
      try {
        if (!args[0]) { await reply(`manda o id do item! vê os ids com ${prefix}loja`); break; }

        const resultado = Economia.comprarItem(sender, args[0].toLowerCase());
        if (!resultado.ok) {
          await reply(resultado.motivo === "item" ? "não achei esse item na loja :(" : "você não tem moedas suficientes pra comprar isso!");
          break;
        }

        await reply(`✅ você comprou *${resultado.item.emoji} ${resultado.item.nome}*!`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "inventario": {
      try {
        const itens = Economia.listarInventario(sender);
        if (!itens) { await reply(`seu inventário tá vazio! compra algo com ${prefix}loja`); break; }
        await reply(`🎒 *seu inventário:*\n\n${itens}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "conquistas": {
      try {
        const lista = Economia.conquistas(sender);
        if (!lista.length) { await reply("você ainda não desbloqueou nenhuma conquista, continua usando a bot! 🌊"); break; }
        await reply(`🏆 *suas conquistas:*\n\n${lista.join("\n")}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    // ── RPG DE PESCA ──────────────────────────────────────
    case "pescar": {
      try {
        await reagir("🎣");
        const resultado = Pesca.pescar(sender);
        await reply(Pesca.textoCaptura(resultado));
        if (resultado.ok) Economia.ganharXp(sender, 1);
      } catch (err) {
        console.error(err);
        await reply("❌ deu erro na hora de pescar.");
      }
      break;
    }

    case "pesca": {
      try {
        await reagir("🎣");

        const secoes = [
          {
            titulo: "📍 locais",
            linhas: Pesca.locaisDisponiveis(sender).map(l => ({
              titulo: `${l.liberado ? "✅" : "🔒"} ${l.emoji} ${pequeno(l.nome)}`,
              descricao: l.liberado ? "toca pra ir pra cá" : `precisa nível ${l.nivelMin} · vara ${l.varaMinima}`,
              id: `${prefix}localpesca ${l.id}`
            }))
          },
          {
            titulo: "🏪 loja de pesca",
            linhas: [
              { titulo: "📜 ver loja completa", descricao: "preços de varas e iscas", id: `${prefix}lojapesca` },
              ...Pesca.VARAS.map(v => ({
                titulo: `${v.emoji} comprar ${v.nome}`,
                descricao: v.preco === 0 ? "grátis" : `${v.preco} moedas`,
                id: `${prefix}comprarvara ${v.id}`
              })),
              ...Pesca.ISCAS.map(i => ({
                titulo: `${i.emoji} comprar 5x ${i.nome}`,
                descricao: `${i.preco * 5} moedas`,
                id: `${prefix}comprarisca ${i.id} 5`
              }))
            ]
          },
          {
            titulo: "🎒 ações",
            linhas: [
              { titulo: "🎣 pescar agora", descricao: "lançar a isca no local atual", id: `${prefix}pescar` },
              { titulo: "🎒 ver minha bag", descricao: "peixes ainda não vendidos", id: `${prefix}bagpesca` },
              { titulo: "💰 vender tudo", descricao: "vender toda a bag de uma vez", id: `${prefix}venderpeixe tudo` },
              { titulo: "🔄 atualizar painel", descricao: "gerar esse painel de novo, na hora", id: `${prefix}pesca` },
              { titulo: "🏆 ranking de pesca", descricao: "quem tá no topo", id: `${prefix}rankingpesca` },
              ...(config.webapp?.urlPublica ? [{ titulo: "🌐 abrir no navegador", descricao: "versão completa em mini app", id: `${prefix}painelpesca` }] : [])
            ]
          }
        ];

        const imagemBuffer = await PescaImagem.gerarPainelPNG(sender);

        await enviarMenuHD(conn, from, info, {
          texto: Pesca.textoPainel(sender),
          footer: pequeno(`${config.nome} v${config.versao}`),
          imagemBuffer,
          secoes,
          tituloBotao: `🎣 ${pequeno("abrir menu de pesca")} 🩵`
        });
      } catch (err) {
        console.error(err);
        await reply("❌ deu erro pra abrir o painel de pesca.");
      }
      break;
    }

    case "lojapesca": {
      try {
        await reply(`🏪 *loja de pesca*\n\n${Pesca.textoLoja()}\n\ncompra com ${prefix}comprarvara <id> ou ${prefix}comprarisca <id> <qtd>`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "comprarvara": {
      try {
        if (!args[0]) { await reply(`manda o id da vara! vê os ids com ${prefix}lojapesca`); break; }

        const resultado = Pesca.comprarVara(sender, args[0].toLowerCase());
        if (!resultado.ok) {
          const msg = { vara_invalida: "não achei essa vara.", saldo: `você precisa de ${resultado.vara.preco} moedas pra essa vara!` };
          await reply(msg[resultado.motivo] || "❌ não deu pra comprar.");
          break;
        }

        await reply(resultado.jaTinha
          ? `${resultado.vara.emoji} você já equipou a *${resultado.vara.nome}*!`
          : `✅ comprou e equipou a *${resultado.vara.emoji} ${resultado.vara.nome}*!`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "comprarisca": {
      try {
        if (!args[0]) { await reply(`manda o id da isca! vê os ids com ${prefix}lojapesca`); break; }

        const resultado = Pesca.comprarIsca(sender, args[0].toLowerCase(), parseInt(args[1]) || 1);
        if (!resultado.ok) {
          const msg = { isca_invalida: "não achei essa isca.", saldo: `você precisa de ${resultado.custo} moedas pra isso!` };
          await reply(msg[resultado.motivo] || "❌ não deu pra comprar.");
          break;
        }

        await reply(`✅ comprou ${resultado.qtd}x *${resultado.isca.emoji} ${resultado.isca.nome}* por ${resultado.custo} moedas!`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "equiparvara": {
      try {
        if (!args[0]) { await reply(`manda o id da vara que você já tem! ex: ${prefix}equiparvara bambu`); break; }

        const resultado = Pesca.equiparVara(sender, args[0].toLowerCase());
        if (!resultado.ok) { await reply("você ainda não tem essa vara! compra ela primeiro."); break; }
        await reply(`✅ equipou a *${resultado.vara.emoji} ${resultado.vara.nome}*!`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "localpesca": {
      try {
        if (!args[0]) { await reply(`📍 *locais de pesca:*\n\n${Pesca.textoLocais(sender)}\n\nvai com ${prefix}localpesca <id>`); break; }

        const resultado = Pesca.definirLocal(sender, args[0].toLowerCase());
        if (!resultado.ok) {
          await reply(resultado.motivo === "local_invalido"
            ? "não achei esse local! vê os ids com " + prefix + "localpesca"
            : `🔒 você ainda não pode pescar em *${resultado.local.nome}* — precisa nível ${resultado.local.nivelMin} e vara ${resultado.local.varaMinima}`);
          break;
        }

        await reply(`${resultado.local.emoji} agora você tá pescando em *${resultado.local.nome}*!`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "bagpesca": {
      try {
        await reply(Pesca.textoBag(sender));
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "venderpeixe": {
      try {
        if (!args[0]) { await reply(`manda o número do peixe (vê com ${prefix}bagpesca) ou ${prefix}venderpeixe tudo`); break; }

        if (args[0].toLowerCase() === "tudo") {
          const resultado = Pesca.venderTudoPesca(sender);
          if (!resultado.ok) { await reply("sua bag já tá vazia!"); break; }
          await reply(`💰 vendeu ${resultado.quantidade} peixe(s) por ${resultado.total} moedas!`);
          break;
        }

        const indice = parseInt(args[0]) - 1;
        const resultado = Pesca.venderPeixe(sender, indice);
        if (!resultado.ok) { await reply(`não achei esse peixe na sua bag! vê os números com ${prefix}bagpesca`); break; }
        await reply(`💰 vendeu ${resultado.peixe.emoji} *${resultado.peixe.nome}* por ${resultado.peixe.valor} moedas!`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "rankingpesca": {
      try {
        const top = Pesca.rankingPesca(10);
        if (!top.length) { await reply("ninguém pescou nada ainda! seja o primeiro com " + prefix + "pescar"); break; }

        const medalhas = ["🥇", "🥈", "🥉"];
        const linhas = top.map((u, i) => {
          const numero = u.jid?.split("@")[0] || "???";
          return `${medalhas[i] || `${i + 1}.`} ${numero} — nível ${u.nivel} (${u.totalPescarias} pescarias)`;
        }).join("\n");

        await reply(`🏆 *ranking de pesca*\n\n${linhas}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "painelpesca": {
      try {
        if (!config.webapp?.urlPublica) { await reply("o mini app ainda não tá configurado — o dono precisa preencher webapp.urlPublica no config.json"); break; }

        const token = Pesca.gerarTokenPainel(sender);
        const url = `${config.webapp.urlPublica}/pesca.html?token=${token}`;

        if (Device.usarBotoes(sender, info)) {
          const { generateWAMessageFromContent, proto } = baileys;
          const conteudo = {
            viewOnceMessage: {
              message: {
                interactiveMessage: proto.Message.InteractiveMessage.create({
                  header: { title: pequeno("🎣 mini app de pesca"), hasMediaAttachment: false },
                  body: { text: pequeno("toca no botão pra abrir seu painel de pesca completo no navegador! o link expira em 20 minutos") },
                  footer: { text: pequeno(`${config.nome} v${config.versao}`) },
                  nativeFlowMessage: { buttons: [botaoUrl("🌐 abrir mini app", url)] }
                })
              }
            }
          };
          const msg = generateWAMessageFromContent(from, conteudo, { quoted: info, userJid: conn.user.id });
          await conn.relayMessage(from, msg.message, { messageId: msg.key.id });
        } else {
          await reply(`🌐 abre esse link pra ver seu painel de pesca:\n${url}\n\n(expira em 20 minutos)`);
        }
      } catch (err) {
        console.error(err);
        await reply("❌ deu erro pra gerar o link do painel.");
      }
      break;
    }

    case "pesca2": {
      try {
        if (!config.webapp?.urlPublica) { await reply("o mini app ainda não tá configurado — o dono precisa preencher webapp.urlPublica no config.json"); break; }

        const token = Pesca.gerarTokenPainel(sender);
        const url = `${config.webapp.urlPublica}/pesca2.html?token=${token}`;

        if (Device.usarBotoes(sender, info)) {
          const { generateWAMessageFromContent, proto } = baileys;
          const conteudo = {
            viewOnceMessage: {
              message: {
                interactiveMessage: proto.Message.InteractiveMessage.create({
                  header: { title: pequeno("🎣 pesca 2 — mundo 3D"), hasMediaAttachment: false },
                  body: { text: pequeno("toca no botão pra abrir a pesca 2 em 1ª pessoa no navegador! o link expira em 20 minutos") },
                  footer: { text: pequeno(`${config.nome} v${config.versao}`) },
                  nativeFlowMessage: { buttons: [botaoUrl("🌐 abrir pesca 2", url)] }
                })
              }
            }
          };
          const msg = generateWAMessageFromContent(from, conteudo, { quoted: info, userJid: conn.user.id });
          await conn.relayMessage(from, msg.message, { messageId: msg.key.id });
        } else {
          await reply(`🎣 abre esse link pra jogar a pesca 2 em 1ª pessoa:\n${url}\n\n(expira em 20 minutos)`);
        }
      } catch (err) {
        console.error(err);
        await reply("❌ deu erro pra gerar o link da pesca 2.");
      }
      break;
    }

    case "modo-ios": {
      try {
        Device.fixarPlataforma(sender, "iphone");
        await reply(avisoModoIOS(prefix));
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "modo-adr": {
      try {
        Device.fixarPlataforma(sender, "android");
        await reply(`🤖 modo ajustado! agora tudo vem com botão.`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "test67": {
      try {
        const { generateWAMessageFromContent, proto } = baileys;

        const botoes = [
          { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "✅ resposta rápida", id: `${prefix}oi` }) },
          botaoUrl("🔗 abrir link", config.canal?.url || "https://zone.api.br"),
          { name: "cta_copy", buttonParamsJson: JSON.stringify({ display_text: "📋 copiar código", copy_code: "NEJIRE67" }) },
          { name: "cta_call", buttonParamsJson: JSON.stringify({ display_text: "📞 ligar", phone_number: config.numeroDono }) },
          botaoLista("🐚 abrir opções", secoesPrincipalBotao(prefix))
        ];

        const canal = botaoCanal();
        if (canal) botoes.push(canal);

        const conteudo = {
          viewOnceMessage: {
            message: {
              interactiveMessage: proto.Message.InteractiveMessage.create({
                header: {
                  title: pequeno(`🐚 ${config.nome} — teste 67`),
                  hasMediaAttachment: false
                },
                body: { text: pequeno("👀 olha só todo tipo de botão suportado! e o botão de opções abre a lista de categorias — toca numa que abre a sublista dela") },
                footer: { text: pequeno(`${config.nome} v${config.versao}`) },
                ...contextInfoCanal(),
                nativeFlowMessage: { buttons: botoes }
              })
            }
          }
        };

        const msg = generateWAMessageFromContent(from, conteudo, { quoted: info, userJid: conn.user.id });
        await conn.relayMessage(from, msg.message, { messageId: msg.key.id });
      } catch (err) {
        console.error(err);
        await reply("❌ deu erro pro test67.");
      }
      break;
    }

    case "canal": {
      try {
        await enviarInteligente(conn, from, info, {
          texto: `${config.canal?.nome || "🫐 Canal Oficial"}\n\nvem seguir lá que eu posto tudo de novo por lá!`,
          comCanal: true,
          secoes: null
        });
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "subbot":
    case "criarsubbot": {
      try {
        const numero = args[0]?.replace(/[^0-9]/g, "");

        if (!numero || numero.length < 8) {
          await reply(`Digite o número com DDI e DDD, sem espaços.\n\n📌 Exemplo:\n${prefix + command} 5511999999999`);
          break;
        }

        await reagir(config.emojiPrincipal);
        await reply("_Gerando código de pareamento, aguarde alguns segundos..._");

        await NejireSubbot.startSubbot({
          ownerJid: sender,
          phoneNumber: numero,
          messageHandler: module.exports,
          onPairingCode: async (codigo, err) => {
            if (err || !codigo) {
              await reply("❌ Não consegui gerar o código de pareamento. Confira o número e tente de novo.");
              return;
            }
            await reply(`🔑 *Código:* ${codigo}\n\nAbra o WhatsApp do número ${numero} em:\n*Aparelhos conectados > Conectar um aparelho > Conectar com número de telefone*\ne digite o código em até 60 segundos.`);
          },
          onConnected: async () => {
            await reply("✅ Sua cópia da Nejire está conectada e já responde com os mesmos comandos!");
          },
          onDisconnected: async (motivo) => {
            if (motivo === "loggedOut") {
              try { await reply("⚠️ Esse subbot foi deslogado do WhatsApp e foi removido."); } catch {}
            }
          }
        });
      } catch (err) {
        console.error(err);
        await reply("❌ Erro ao criar o subbot. Tente novamente em instantes.");
      }
      break;
    }

    case "meussubbots":
    case "subbots": {
      try {
        await reagir(config.emojiPrincipal);
        const meus = NejireSubbot.listSubbotsByOwner(sender);
        await reply(menuNejireLista(prefix, meus));
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "delsubbot":
    case "removersubbot": {
      try {
        const id = args[0];
        if (!id) { await reply(`Digite o id do subbot.\n\nVeja os ids com ${prefix}meussubbots`); break; }

        const meus = NejireSubbot.listSubbotsByOwner(sender);
        const alvo = meus.find(s => s.id === id);

        if (!alvo && !isDono) { await reply("❌ Esse subbot não existe ou não é seu."); break; }

        const ok = NejireSubbot.stopSubbot(id);
        await reply(ok ? "✅ Subbot desconectado e removido." : "❌ Não encontrei esse subbot ativo.");
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "afk": {
      try {
        Afk.marcarAfk(sender, q.trim() || "sem motivo");
        await reagir(emojiPraia());
        await reply(`💤 blzz,, marquei você como afk${q.trim() ? `: _${q.trim()}_` : ""}. quando mandar mensagem de novo eu tiro automático!`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "desafk": {
      try {
        const registro = Afk.removerAfk(sender);
        if (!registro) { await reply("você nem tava afk!"); break; }
        await reagir(emojiAzul());
        await reply(`👋 bem-vindo(a) de volta! você ficou afk por ${Economia.formatarTempo(Date.now() - registro.desde)}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "hora": {
      try {
        const agora = new Date().toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo" });
        await reply(`⏰ agora são *${agora}* (horário de Brasília)`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "data": {
      try {
        const hoje = new Date().toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
        await reply(`📅 hoje é *${hoje}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "sortedodia": {
      try {
        const sortes = [
          "hoje é um bom dia pra tentar algo novo 🌊",
          "cuidado com decisões apressadas hoje, respira antes",
          "uma boa notícia pode chegar sem avisar 💙",
          "hoje o dia rende mais se você começar organizando as tarefas",
          "vai valer a pena conversar com alguém que você anda evitando"
        ];
        await reagir("🍀");
        await reply(`🍀 *sorte do dia:* ${sortes[Math.floor(Math.random() * sortes.length)]}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }


    // ══════════════════════════════════════════════════════
    // 🧩 UTILIDADES (texto, conversores & calculadora)
    // ══════════════════════════════════════════════════════
    case "maiuscula": {
      try {
        if (!q.trim()) { await reply(`manda um texto! Ex: ${prefix}maiuscula oi tudo bem`); break; }
        await reply(`🔠 ${Utilidades.maiusculo(q)}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "minuscula": {
      try {
        if (!q.trim()) { await reply(`manda um texto! Ex: ${prefix}minuscula OI TUDO BEM`); break; }
        await reply(`🔡 ${Utilidades.minusculo(q)}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "capitalizar": {
      try {
        if (!q.trim()) { await reply(`manda um texto! Ex: ${prefix}capitalizar bom dia pessoal`); break; }
        await reply(`🔤 ${Utilidades.capitalizar(q)}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "contarpalavras": {
      try {
        if (!q.trim()) { await reply(`manda um texto pra eu contar as palavras!`); break; }
        await reply(`📝 esse texto tem *${Utilidades.contarPalavras(q)}* palavras`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "contarcaracteres": {
      try {
        if (!q.trim()) { await reply(`manda um texto pra eu contar os caracteres!`); break; }
        const c = Utilidades.contarCaracteres(q);
        await reply(`🔢 com espaços: *${c.comEspacos}*\nsem espaços: *${c.semEspacos}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "contarvogais": {
      try {
        if (!q.trim()) { await reply(`manda um texto pra eu contar as vogais!`); break; }
        await reply(`🔤 esse texto tem *${Utilidades.contarVogais(q)}* vogais`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "contarconsoantes": {
      try {
        if (!q.trim()) { await reply(`manda um texto pra eu contar as consoantes!`); break; }
        await reply(`🔤 esse texto tem *${Utilidades.contarConsoantes(q)}* consoantes`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "removerespacos": {
      try {
        if (!q.trim()) { await reply(`manda um texto com espaços extras pra eu limpar!`); break; }
        await reply(`✨ ${Utilidades.removerEspacos(q)}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "embaralhar": {
      try {
        if (!q.trim()) { await reply(`manda um texto pra eu embaralhar as letras!`); break; }
        await reply(`🔀 ${Utilidades.embaralharTexto(q)}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "repetir": {
      try {
        const vezes = parseInt(args[0]);
        const texto = args.slice(1).join(" ");
        if (!vezes || !texto.trim()) { await reply(`usa: ${prefix}repetir <vezes> <texto>\nEx: ${prefix}repetir 3 oi`); break; }
        await reply(`🔁 ${Utilidades.repetirTexto(texto, vezes)}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "binario": {
      try {
        if (!q.trim()) { await reply(`manda um texto pra converter em binário!`); break; }
        await reply(`💾 ${Utilidades.paraBinario(q)}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "debinario": {
      try {
        if (!q.trim()) { await reply(`manda um código binário! Ex: ${prefix}debinario 01101111 01101001`); break; }
        const texto = Utilidades.deBinario(q);
        if (!texto) { await reply(`não consegui converter, confere o formato do binário!`); break; }
        await reply(`📝 ${texto}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "base64": {
      try {
        if (!q.trim()) { await reply(`manda um texto pra codificar em base64!`); break; }
        await reply(`🔐 ${Utilidades.paraBase64(q)}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "debase64": {
      try {
        if (!q.trim()) { await reply(`manda um código base64 pra decodificar!`); break; }
        const texto = Utilidades.deBase64(q);
        if (!texto) { await reply(`não consegui decodificar, confere o código!`); break; }
        await reply(`📝 ${texto}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "hash": {
      try {
        if (!q.trim()) { await reply(`manda um texto! Ex: ${prefix}hash minha senha`); break; }
        await reply(`🔒 sha256:\n\`${Utilidades.gerarHash(q, "sha256")}\`\n\n🔒 md5:\n\`${Utilidades.gerarHash(q, "md5")}\``);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "morse": {
      try {
        if (!q.trim()) { await reply(`manda um texto pra converter em código morse!`); break; }
        await reply(`📡 ${Utilidades.paraMorse(q)}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "demorse": {
      try {
        if (!q.trim()) { await reply(`manda um código morse! Ex: ${prefix}demorse ... --- ...`); break; }
        await reply(`📝 ${Utilidades.deMorse(q)}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "calcular": {
      try {
        if (!q.trim()) { await reply(`manda uma conta! Ex: ${prefix}calcular (5 + 3) * 2`); break; }
        const resultado = Utilidades.calcular(q);
        if (resultado === null) { await reply(`não consegui calcular isso, confere se só tem números e + - * / ( )`); break; }
        await reply(`🧮 resultado: *${resultado}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "porcentagem": {
      try {
        const [valorStr, percStr] = args;
        const valor = parseFloat(valorStr);
        const perc = parseFloat(percStr);
        if (Number.isNaN(valor) || Number.isNaN(perc)) { await reply(`usa: ${prefix}porcentagem <valor> <percentual>\nEx: ${prefix}porcentagem 200 15`); break; }
        await reply(`📊 ${perc}% de ${valor} é *${Utilidades.calcularPorcentagem(valor, perc).toFixed(2)}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "regra3": {
      try {
        const [a, b, c] = args.map(Number);
        if (!a || !b || !c) { await reply(`usa: ${prefix}regra3 <a> <b> <c>\nEx: ${prefix}regra3 2 10 5 (quanto é x em 2 está pra 10 assim como 5 está pra x)`); break; }
        const x = Utilidades.regraDeTres(a, b, c);
        await reply(`📐 x = *${x.toFixed(2)}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "celsiusfahrenheit": {
      try {
        const c = parseFloat(args[0]);
        if (Number.isNaN(c)) { await reply(`manda a temperatura em celsius! Ex: ${prefix}celsiusfahrenheit 30`); break; }
        await reply(`🌡️ ${c}°C = *${Utilidades.celsiusParaFahrenheit(c).toFixed(1)}°F*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "fahrenheitcelsius": {
      try {
        const f = parseFloat(args[0]);
        if (Number.isNaN(f)) { await reply(`manda a temperatura em fahrenheit! Ex: ${prefix}fahrenheitcelsius 86`); break; }
        await reply(`🌡️ ${f}°F = *${Utilidades.fahrenheitParaCelsius(f).toFixed(1)}°C*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "kmparamilha": {
      try {
        const km = parseFloat(args[0]);
        if (Number.isNaN(km)) { await reply(`manda a distância em km! Ex: ${prefix}kmparamilha 10`); break; }
        await reply(`🛣️ ${km} km = *${Utilidades.kmParaMilhas(km).toFixed(2)} milhas*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "kgparalibra": {
      try {
        const kg = parseFloat(args[0]);
        if (Number.isNaN(kg)) { await reply(`manda o peso em kg! Ex: ${prefix}kgparalibra 70`); break; }
        await reply(`⚖️ ${kg} kg = *${Utilidades.kgParaLibras(kg).toFixed(2)} lb*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "metrosparaft": {
      try {
        const m = parseFloat(args[0]);
        if (Number.isNaN(m)) { await reply(`manda a altura em metros! Ex: ${prefix}metrosparaft 1.75`); break; }
        await reply(`📏 ${m} m = *${Utilidades.metrosParaPes(m).toFixed(2)} pés*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    // ══════════════════════════════════════════════════════
    // 🎲 JOGOS & SORTE
    // ══════════════════════════════════════════════════════
    case "sorteio": {
      try {
        const opcoes = q.split("|").map(o => o.trim()).filter(Boolean);
        if (opcoes.length < 2) { await reply(`manda pelo menos 2 opções separadas por |. Ex: ${prefix}sorteio Ana | João | Marcos`); break; }
        await reagir("🎉");
        await reply(`🎉 e o sorteio deu... *${Jogos.sorteio(opcoes)}*!!`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "roleta": {
      try {
        await reagir("🎡");
        await reply(`🎡 a roleta girou e caiu em: *${Jogos.roleta()}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "loteria": {
      try {
        const numeros = Jogos.loteria();
        await reagir("🍀");
        await reply(`🍀 seus números da sorte: *${numeros.join(" - ")}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "anagrama": {
      try {
        const partes = q.split("|").map(p => p.trim()).filter(Boolean);
        if (partes.length !== 2) { await reply(`manda duas palavras separadas por |. Ex: ${prefix}anagrama roma | amor`); break; }
        const sao = Jogos.verificarAnagrama(partes[0], partes[1]);
        await reply(sao ? `✅ sim! "${partes[0]}" e "${partes[1]}" são anagramas` : `❌ não, essas palavras não são anagramas`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "palindromo": {
      try {
        if (!q.trim()) { await reply(`manda um texto! Ex: ${prefix}palindromo arara`); break; }
        const eh = Jogos.verificarPalindromo(q);
        await reply(eh ? `✅ sim, "${q.trim()}" é um palíndromo!` : `❌ não, "${q.trim()}" não é um palíndromo`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "quiz": {
      try {
        const p = Jogos.quiz();
        const opcoesTexto = p.opcoes.map((o, i) => `${i + 1}. ${o}`).join("\n");
        await reagir("❓");
        await reply(`❓ *quiz:* ${p.pergunta}\n\n${opcoesTexto}\n\n_a resposta chega em alguns segundos!_`);
        setTimeout(() => { reply(`✅ resposta certa: *${p.opcoes[p.correta]}*`).catch(() => null); }, 8000);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "sorteletra": {
      try {
        await reagir("🔤");
        await reply(`🔤 a letra sorteada é: *${Jogos.sortearLetra()}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "trocadilho": {
      try {
        await reagir("😆");
        await reply(`😆 ${Jogos.trocadilho()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "enigma": {
      try {
        const e = Jogos.enigma();
        await reagir("🧩");
        await reply(`🧩 *enigma:* ${e.pergunta}\n\n_a resposta chega em alguns segundos!_`);
        setTimeout(() => { reply(`💡 resposta: *${e.resposta}*`).catch(() => null); }, 8000);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "bingo": {
      try {
        await reagir("🎱");
        await reply(`🎱 número sorteado: *${Jogos.bingo()}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "dadoduplo": {
      try {
        const { d1, d2, soma } = Jogos.dadoDuplo();
        await reagir("🎲");
        await reply(`🎲🎲 caiu *${d1}* e *${d2}* (soma: ${soma})`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "rimar": {
      try {
        if (!q.trim()) { await reply(`manda uma palavra! Ex: ${prefix}rimar amor`); break; }
        const rimas = Jogos.rimar(q.trim());
        if (!rimas.length) { await reply(`não achei rimas pra "${q.trim()}" na minha listinha, tenta outra palavra!`); break; }
        await reply(`🎵 rimas com "${q.trim()}":\n${rimas.map(r => `▸ ${r}`).join("\n")}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "numerosorte": {
      try {
        await reagir("🍀");
        await reply(`🍀 seu número da sorte hoje é: *${Jogos.numeroSorte(sender)}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "horoscopo": {
      try {
        if (!q.trim()) { await reply(`manda seu signo! Ex: ${prefix}horoscopo leão\n\nsignos: ${Jogos.SIGNOS.join(", ")}`); break; }
        const h = Jogos.horoscopo(q.trim());
        if (!h) { await reply(`não reconheci esse signo! tenta: ${Jogos.SIGNOS.join(", ")}`); break; }
        await reagir("🔮");
        await reply(`🔮 *${h.signo}:* ${h.frase}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "compatibilidadesigno": {
      try {
        const partes = q.split("|").map(p => p.trim()).filter(Boolean);
        if (partes.length !== 2) { await reply(`manda dois signos separados por |. Ex: ${prefix}compatibilidadesigno leão | touro`); break; }
        const c = Jogos.compatibilidadeSignos(partes[0], partes[1]);
        if (!c) { await reply(`não reconheci algum desses signos! tenta: ${Jogos.SIGNOS.join(", ")}`); break; }
        await reply(`💫 *${c.signo1} + ${c.signo2}*\n\ncompatibilidade: *${c.porcentagem}%* ${c.porcentagem > 70 ? "🔥" : c.porcentagem > 40 ? "💙" : "💔"}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    // ══════════════════════════════════════════════════════
    // 🌊 MAIS IA & DIVERSÃO
    // ══════════════════════════════════════════════════════
    case "citacao": {
      try {
        await reagir(emojiAzul());
        await reply(`💭 ${Ia.citacao()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "definicao": {
      try {
        if (!q.trim()) { await reply(`manda uma palavra! Ex: ${prefix}definicao saudade`); break; }
        await reply(`📖 ${Ia.definicao(q.trim())}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "previsao": {
      try {
        await reagir("🔮");
        await reply(`🔮 ${Ia.previsao()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "elogio": {
      try {
        await reagir("💙");
        await reply(`💙 ${Ia.elogio()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "apelidoengracado": {
      try {
        await reply(`😄 ${Ia.apelidoEngracado(q.trim())}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "nomedeheroi": {
      try {
        await reply(`🦸 ${Ia.nomeDeHeroi()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "nomedevilao": {
      try {
        await reply(`🦹 ${Ia.nomeDeVilao()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "superpoder": {
      try {
        await reply(`⚡ seu superpoder é: *${Ia.superpoder()}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "statuscriativo": {
      try {
        await reply(`✨ ${Ia.statusCriativo()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "despedida": {
      try {
        await reply(`👋 ${Ia.despedida()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "dicadeouro": {
      try {
        await reagir("💡");
        await reply(`💡 ${Ia.dicaDeOuro()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "curiosidadeanimal": {
      try {
        await reagir("🐾");
        await reply(`🐾 ${Ia.curiosidadeAnimal()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "mitoourealidade": {
      try {
        const m = Ia.mitoOuRealidade();
        await reagir("🤔");
        await reply(`🤔 *mito ou realidade:* ${m.texto}\n\n_a resposta chega em alguns segundos!_`);
        setTimeout(() => { reply(`📌 ${m.resposta}`).catch(() => null); }, 8000);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "interpretarsonho": {
      try {
        if (!q.trim()) { await reply(`manda com o que você sonhou! Ex: ${prefix}interpretarsonho voar`); break; }
        await reply(`🌙 ${Ia.interpretarSonho(q.trim())}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "quefazer": {
      try {
        await reply(`🌊 ${Ia.queFazer()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "nivel": {
      try {
        const infoN = Economia.infoNivel(sender);
        await reply(`⭐ você tá no nível *${infoN.nivel}*\nxp atual: ${infoN.xp}\nfaltam *${infoN.faltam}* xp pro próximo nível`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "patente": {
      try {
        const p = Economia.patente(sender);
        await reply(`🎖️ sua patente: *${p.titulo}* (nível ${p.nivel})`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "bonussemanal": {
      try {
        const r = Economia.bonusSemanal(sender);
        if (!r.ok) { await reply(`você já pegou seu bônus semanal! volta em ${Economia.formatarTempo(r.faltam)}`); break; }
        await reagir("🎁");
        await reply(`🎁 você resgatou seu bônus semanal e ganhou *${r.ganho}* moedas!`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "caixamisteriosa": {
      try {
        const r = Economia.caixaMisteriosa(sender);
        if (!r.ok) { await reply(`sua caixa misteriosa ainda tá fechada! volta em ${Economia.formatarTempo(r.faltam)}`); break; }
        await reagir("🎁");
        if (r.tipo === "item") { await reply(`🎁 uauu, você achou um item raro: ${r.item.emoji} *${r.item.nome}*!`); break; }
        if (r.tipo === "moedas") { await reply(`🎁 você abriu a caixa e achou *${r.ganho}* moedas!`); break; }
        await reply(`🎁 abriu a caixa... e tava vazia dessa vez! tenta de novo amanhã`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "comparar": {
      try {
        const alvo = Jid.resolverAlvo({ info, args, q, sender });
        if (!alvo) { await reply(`marca ou responde a mensagem de quem você quer comparar!`); break; }

        const c = Economia.compararPerfis(sender, alvo);
        await enviar(conn, from, {
          text: pequeno(`📊 *comparação*\n\n💰 saldo: você ${c.saldo.p1} x ${c.saldo.p2} @${alvo.split("@")[0]}\n⭐ xp: você ${c.xp.p1} x ${c.xp.p2} @${alvo.split("@")[0]}\n🏅 nível: você ${c.nivel.p1} x ${c.nivel.p2} @${alvo.split("@")[0]}\n📝 comandos usados: você ${c.comandosUsados.p1} x ${c.comandosUsados.p2} @${alvo.split("@")[0]}`),
          mentions: [alvo]
        }, { quoted: info });
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "diadasemana": {
      try {
        await reply(`📅 hoje é *${Geral.diaDaSemana()}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "semanadoano": {
      try {
        await reply(`🗓️ estamos na semana *${Geral.semanaDoAno()}* do ano`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "gerarid": {
      try {
        const tamanho = parseInt(args[0]) || 8;
        await reply(`🆔 seu id: \`${Geral.gerarId(tamanho)}\``);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "estatisticasbot": {
      try {
        const stats = Geral.estatisticasBot();
        await reply(`📊 *estatísticas da bot*\n\n👥 usuários cadastrados: *${stats.totalUsuarios}*\n📝 comandos usados no total: *${stats.totalComandos}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "proximoferiado": {
      try {
        const f = Geral.proximoFeriado();
        await reply(`🎉 próximo feriado: *${f.nome}*\nfalta${f.diasFaltando === 1 ? "" : "m"} *${f.diasFaltando}* dia${f.diasFaltando === 1 ? "" : "s"}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "horamundo": {
      try {
        if (!args[0]) { await reply(`manda o fuso em horas! Ex: ${prefix}horamundo -3 (brasília) ou ${prefix}horamundo 9 (japão)`); break; }
        const hora = Geral.horaMundo(args[0]);
        if (!hora) { await reply(`fuso inválido! manda só um número, tipo -3 ou 9`); break; }
        await reply(`🌍 nesse fuso (UTC${Number(args[0]) >= 0 ? "+" : ""}${args[0]}) agora são *${hora}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "faltapara": {
      try {
        if (!q.trim()) { await reply(`manda uma data! Ex: ${prefix}faltapara 25/12/2026`); break; }
        const r = Geral.faltaPara(q.trim());
        if (!r) { await reply(`data inválida! usa o formato DD/MM/AAAA`); break; }
        await reply(r.passou ? `⏳ já passou faz *${r.dias}* dia(s)` : `⏳ faltam *${r.dias}* dia(s)`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "dataextenso": {
      try {
        const texto = Geral.dataPorExtenso(q.trim());
        if (!texto) { await reply(`data inválida! usa o formato DD/MM/AAAA ou manda sem nada pra hoje`); break; }
        await reply(`📆 ${texto}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "idadeanimal": {
      try {
        const idade = parseFloat(args[0]);
        const r = Geral.idadeAnimal(idade);
        if (!r) { await reply(`manda sua idade! Ex: ${prefix}idadeanimal 20`); break; }
        await reply(`🐶 em anos de cachorro: *${r.cachorro}*\n🐱 em anos de gato: *${r.gato}*\n🐢 em anos de tartaruga: *${r.tartaruga}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "tempoonline": {
      try {
        const t = Geral.tempoOnline(sender);
        await reply(`🌊 a gente se fala faz *${t.dias} dia(s) e ${t.horas} hora(s)*!`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "progresso": {
      try {
        const p = args[0];
        if (p === undefined || Number.isNaN(parseFloat(p))) { await reply(`manda um número de 0 a 100! Ex: ${prefix}progresso 70`); break; }
        await reply(`📊 ${Geral.progresso(p)}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "relogio": {
      try {
        await reply(`${Geral.relogioEmoji()} agora são *${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "nomerua": {
      try {
        await reply(`🏘️ que tal: *${Geral.nomeRua()}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "apelidopet": {
      try {
        await reply(`🐾 que tal: *${Geral.apelidoPet()}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "frasedodia": {
      try {
        await reagir(emojiAzul());
        await reply(`💙 *frase do dia:* ${Geral.fraseDoDia()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }


    // ══════════════════════════════════════════════════════
    // 👑 DONO
    // ══════════════════════════════════════════════════════
    case "sairgrupo": {
      try {
        if (!exigirDono()) break;
        if (!(await exigirGrupo())) break;
        await reply("👋 tá bom, já tô saindo desse grupo!");
        await conn.groupLeave(from);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "sairgrupoid": {
      try {
        if (!exigirDono()) break;
        const idGrupo = args[0];
        if (!idGrupo || !idGrupo.includes("@g.us")) { await reply(`manda o id do grupo! Ex: ${prefix}sairgrupoid 1203630xxxx@g.us`); break; }
        await conn.groupLeave(idGrupo);
        await reply(`👋 saí do grupo ${idGrupo}`);
      } catch (err) {
        console.error(err);
        await reply("❌ não consegui sair desse grupo, confere o id.");
      }
      break;
    }

    case "listargrupos": {
      try {
        if (!exigirDono()) break;
        const chats = await conn.groupFetchAllParticipating?.().catch(() => null);
        if (!chats) { await reply("❌ não consegui buscar os grupos agora."); break; }

        const lista = Object.values(chats)
          .slice(0, 40)
          .map((g, i) => `${i + 1}. ${g.subject || "(sem nome)"} — ${g.participants?.length || 0} membros`)
          .join("\n");

        await reply(`🌨️ grupos que eu tô (${Object.keys(chats).length} no total):\n\n${lista}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "definirnomebot": {
      try {
        if (!exigirDono()) break;
        if (!q.trim()) { await reply(`manda o novo nome! Ex: ${prefix}definirnomebot Nejire Bot`); break; }
        await conn.updateProfileName(q.trim());
        await reply(`✅ meu nome de perfil agora é *${q.trim()}*`);
      } catch (err) {
        console.error(err);
        await reply("❌ não consegui trocar o nome agora.");
      }
      break;
    }

    case "definirfotobot": {
      try {
        if (!exigirDono()) break;
        const quotedMsg = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const alvoImg = info.message?.imageMessage || quotedMsg?.imageMessage;
        if (!alvoImg) { await reply(`manda ou responde uma imagem com ${prefix}definirfotobot!`); break; }

        const buffer = await getMediaBuffer(alvoImg, "image");
        await conn.updateProfilePicture(conn.user.id, buffer);
        await reply("✅ foto de perfil trocada!");
      } catch (err) {
        console.error(err);
        await reply("❌ não consegui trocar a foto agora.");
      }
      break;
    }

    case "definirrecado": {
      try {
        if (!exigirDono()) break;
        if (!q.trim()) { await reply(`manda o novo recado! Ex: ${prefix}definirrecado disponível 24h`); break; }
        await conn.updateProfileStatus(q.trim());
        await reply(`✅ meu recado agora é: _${q.trim()}_`);
      } catch (err) {
        console.error(err);
        await reply("❌ não consegui trocar o recado agora.");
      }
      break;
    }

    case "broadcast": {
      try {
        if (!exigirDono()) break;
        if (!q.trim()) { await reply(`manda a mensagem! Ex: ${prefix}broadcast oii pessoal, aviso importante`); break; }

        const chats = await conn.groupFetchAllParticipating?.().catch(() => null);
        if (!chats) { await reply("❌ não consegui buscar os grupos agora."); break; }

        const ids = Object.keys(chats);
        let enviados = 0;
        for (const id of ids) {
          try {
            await enviar(conn, id, { text: pequeno(`📢 *aviso da bot:*\n\n${q.trim()}`) }, {});
            enviados++;
          } catch {}
        }
        await reply(`✅ mensagem enviada pra *${enviados}* de ${ids.length} grupo(s)`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "broadcastdm": {
      try {
        if (!exigirDono()) break;
        if (!q.trim()) { await reply(`manda a mensagem! Ex: ${prefix}broadcastdm oii, aviso importante pra você`); break; }

        const jids = Dono.listarTodosJids();
        let enviados = 0;
        for (const jid of jids) {
          try {
            await enviar(conn, jid, { text: pequeno(`📢 *aviso da bot:*\n\n${q.trim()}`) }, {});
            enviados++;
          } catch {}
        }
        await reply(`✅ mensagem enviada pra *${enviados}* de ${jids.length} usuário(s)`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "definirsaldo": {
      try {
        if (!exigirDono()) break;
        const alvo = Jid.resolverAlvo({ info, args, q, sender });
        const valor = parseInt(args[args.length - 1]);
        if (!alvo || Number.isNaN(valor)) { await reply(`marca a pessoa e manda o valor! Ex: ${prefix}definirsaldo @user 500`); break; }

        Dono.definirSaldo(alvo, valor);
        await reply(`✅ saldo de @${alvo.split("@")[0]} definido pra *${valor}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "definirxp": {
      try {
        if (!exigirDono()) break;
        const alvo = Jid.resolverAlvo({ info, args, q, sender });
        const valor = parseInt(args[args.length - 1]);
        if (!alvo || Number.isNaN(valor)) { await reply(`marca a pessoa e manda o valor! Ex: ${prefix}definirxp @user 1000`); break; }

        Dono.definirXp(alvo, valor);
        await reply(`✅ xp de @${alvo.split("@")[0]} definido pra *${valor}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "resetusuario": {
      try {
        if (!exigirDono()) break;
        const alvo = Jid.resolverAlvo({ info, args, q, sender });
        if (!alvo) { await reply(`marca, responde ou manda o número de quem você quer resetar!`); break; }

        Dono.resetarUsuario(alvo);
        await reply(`✅ perfil de @${alvo.split("@")[0]} foi resetado pro padrão`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "zerarranking": {
      try {
        if (!exigirDono()) break;
        const total = Dono.zerarRanking();
        await reply(`✅ ranking de curiosidade zerado pra *${total}* usuário(s)`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "listarusuarios": {
      try {
        if (!exigirDono()) break;
        const { total, recentes } = Dono.listarUsuarios(15);
        const linhas = recentes.map(([jid, p], i) => `${i + 1}. ${p.apelido || jid.split("@")[0]} — ${p.comandosUsados || 0} cmds`).join("\n");
        await reply(`👥 total de usuários: *${total}*\n\núltimos ativos:\n${linhas}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "listarbloqueados": {
      try {
        if (!exigirDono()) break;
        const lista = Moderacao.listarBloqueados();
        if (!lista.length) { await reply("🐚 ninguém tá bloqueado no momento!"); break; }
        await reply(`🚫 bloqueados (${lista.length}):\n${lista.map(j => `▸ @${j.split("@")[0]}`).join("\n")}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "desbloqueartodos": {
      try {
        if (!exigirDono()) break;
        const total = Moderacao.desbloquearTodos();
        await reply(`✅ *${total}* pessoa(s) desbloqueada(s)`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "statusprocesso": {
      try {
        if (!exigirDono()) break;
        const s = Dono.statusProcesso();
        await reply(`🖥️ *status do processo*\n\n🧠 memória usada: ${s.memoriaUsadaMb}mb\n💾 memória livre: ${s.memoriaLivreMb}mb / ${s.memoriaTotalMb}mb\n⚙️ node: ${s.nodeVersao}\n🖥️ plataforma: ${s.plataforma}\n⏱️ uptime do processo: ${s.uptimeProcessoSeg}s`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "limparflood": {
      try {
        if (!exigirDono()) break;
        Moderacao.limparFlood();
        await reply("✅ memória de antiflood zerada!");
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "testarenvio": {
      try {
        if (!exigirDono()) break;
        const numero = Jid.numero(args[0]);
        const mensagem = args.slice(1).join(" ");
        if (!numero || !mensagem.trim()) { await reply(`usa: ${prefix}testarenvio <numero> <mensagem>`); break; }

        await enviar(conn, `${numero}@s.whatsapp.net`, { text: pequeno(mensagem) }, {});
        await reply(`✅ mensagem de teste enviada pra ${numero}`);
      } catch (err) {
        console.error(err);
        await reply("❌ não consegui mandar, confere o número.");
      }
      break;
    }

    case "definirdailymin": {
      try {
        if (!exigirDono()) break;
        const valor = parseInt(args[0]);
        if (Number.isNaN(valor)) { await reply(`manda um número! Ex: ${prefix}definirdailymin 50`); break; }
        Dono.definirDailyMin(valor);
        await reply(`✅ valor mínimo do daily agora é *${valor}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "definirdailymax": {
      try {
        if (!exigirDono()) break;
        const valor = parseInt(args[0]);
        if (Number.isNaN(valor)) { await reply(`manda um número! Ex: ${prefix}definirdailymax 200`); break; }
        Dono.definirDailyMax(valor);
        await reply(`✅ valor máximo do daily agora é *${valor}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "definirmoedanome": {
      try {
        if (!exigirDono()) break;
        if (!q.trim()) { await reply(`manda o novo nome da moeda! Ex: ${prefix}definirmoedanome 🐚 Conchinhas`); break; }
        Dono.definirMoedaNome(q.trim());
        await reply(`✅ moeda renomeada pra: ${q.trim()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "definirnumerodono": {
      try {
        if (!exigirDono()) break;
        const numero = Jid.numero(args[0]);
        if (!numero || numero.length < 8) { await reply(`manda o número completo com DDI! Ex: ${prefix}definirnumerodono 5511999999999`); break; }
        Dono.definirNumeroDono(numero);
        await reply(`✅ número de dono atualizado pra ${numero}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "definircanal": {
      try {
        if (!exigirDono()) break;
        if (!q.trim()) { await reply(`manda o nome do canal! Ex: ${prefix}definircanal 📢 Canal Oficial`); break; }
        const canal = Dono.definirCanal(q.trim(), null);
        await reply(`✅ nome do canal atualizado pra: ${canal.nome}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "definirversao": {
      try {
        if (!exigirDono()) break;
        if (!q.trim()) { await reply(`manda a nova versão! Ex: ${prefix}definirversao 2.1.0`); break; }
        Dono.definirVersao(q.trim());
        await reply(`✅ versão atualizada pra *${q.trim()}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "exportarusuarios": {
      try {
        if (!exigirDono()) break;
        const r = Dono.exportarResumoUsuarios();
        const topSaldoTxt = r.topSaldo.map((u, i) => `${i + 1}. ${u.jid.split("@")[0]} — ${u.saldo || 0}`).join("\n");
        const topXpTxt = r.topXp.map((u, i) => `${i + 1}. ${u.jid.split("@")[0]} — ${u.xp || 0}`).join("\n");
        await reply(`📊 *resumo de usuários*\n\n👥 total: ${r.total}\n💰 saldo total em circulação: ${r.totalSaldo}\n⭐ xp total: ${r.totalXp}\n\n🏆 top saldo:\n${topSaldoTxt}\n\n🏆 top xp:\n${topXpTxt}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "contarlinhas": {
      try {
        if (!q.trim()) { await reply(`manda um texto com quebras de linha!`); break; }
        await reply(`📄 esse texto tem *${Utilidades.contarLinhas(q)}* linha(s)`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "extrairnumeros": {
      try {
        if (!q.trim()) { await reply(`manda um texto com números misturados!`); break; }
        const nums = Utilidades.extrairNumeros(q);
        await reply(nums ? `🔢 ${nums}` : "não achei nenhum número nesse texto!");
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "extrairletras": {
      try {
        if (!q.trim()) { await reply(`manda um texto com letras misturadas!`); break; }
        const letras = Utilidades.extrairLetras(q);
        await reply(letras ? `🔤 ${letras}` : "não achei nenhuma letra nesse texto!");
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "hexparatexto": {
      try {
        if (!q.trim()) { await reply(`manda um código hexadecimal! Ex: ${prefix}hexparatexto 6f69`); break; }
        const texto = Utilidades.deHex(q);
        if (!texto) { await reply(`não consegui converter, confere se é um hexadecimal válido!`); break; }
        await reply(`📝 ${texto}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "textoparahex": {
      try {
        if (!q.trim()) { await reply(`manda um texto pra converter em hexadecimal!`); break; }
        await reply(`🔢 ${Utilidades.paraHex(q)}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "gerarslug": {
      try {
        if (!q.trim()) { await reply(`manda um texto! Ex: ${prefix}gerarslug Meu Título Bacana`); break; }
        await reply(`🔗 ${Utilidades.gerarSlug(q)}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "mascararemail": {
      try {
        if (!q.trim()) { await reply(`manda um email! Ex: ${prefix}mascararemail exemplo@gmail.com`); break; }
        const mascarado = Utilidades.mascararEmail(q.trim());
        if (!mascarado) { await reply(`isso não parece um email válido!`); break; }
        await reply(`🔒 ${mascarado}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "milissegundosparadata": {
      try {
        if (!args[0]) { await reply(`manda um timestamp em milissegundos! Ex: ${prefix}milissegundosparadata 1735689600000`); break; }
        const data = Utilidades.msParaData(args[0]);
        if (!data) { await reply(`isso não parece um timestamp válido!`); break; }
        await reply(`📅 ${data}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "dataparamilissegundos": {
      try {
        if (!q.trim()) { await reply(`manda uma data! Ex: ${prefix}dataparamilissegundos 25/12/2026`); break; }
        const ms = Utilidades.dataParaMs(q.trim());
        if (ms === null) { await reply(`data inválida! usa o formato DD/MM/AAAA`); break; }
        await reply(`🔢 ${ms}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "arredondar": {
      try {
        const [valorStr, casasStr] = args;
        const valor = parseFloat(valorStr);
        if (Number.isNaN(valor)) { await reply(`usa: ${prefix}arredondar <numero> [casas decimais]\nEx: ${prefix}arredondar 3.14159 2`); break; }
        const casas = parseInt(casasStr) || 0;
        await reply(`🔢 ${Utilidades.arredondar(valor, casas)}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "mdc": {
      try {
        const [a, b] = args.map(Number);
        if (!a || !b) { await reply(`usa: ${prefix}mdc <a> <b>\nEx: ${prefix}mdc 12 18`); break; }
        await reply(`🔢 o mdc entre ${a} e ${b} é *${Utilidades.mdc(a, b)}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "mmc": {
      try {
        const [a, b] = args.map(Number);
        if (!a || !b) { await reply(`usa: ${prefix}mmc <a> <b>\nEx: ${prefix}mmc 12 18`); break; }
        await reply(`🔢 o mmc entre ${a} e ${b} é *${Utilidades.mmc(a, b)}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "eprimo": {
      try {
        const n = parseInt(args[0]);
        if (Number.isNaN(n)) { await reply(`manda um número! Ex: ${prefix}eprimo 17`); break; }
        await reply(Utilidades.ehPrimo(n) ? `✅ *${n}* é primo!` : `❌ *${n}* não é primo`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "fatorial": {
      try {
        const n = parseInt(args[0]);
        if (Number.isNaN(n)) { await reply(`manda um número! Ex: ${prefix}fatorial 5`); break; }
        const resultado = Utilidades.fatorial(n);
        if (resultado === null) { await reply(`manda um número entre 0 e 170!`); break; }
        await reply(`🔢 ${n}! = *${resultado}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "raizquadrada": {
      try {
        const n = parseFloat(args[0]);
        if (Number.isNaN(n)) { await reply(`manda um número! Ex: ${prefix}raizquadrada 81`); break; }
        const resultado = Utilidades.raizQuadrada(n);
        if (resultado === null) { await reply(`não dá pra tirar raiz de número negativo!`); break; }
        await reply(`🔢 √${n} = *${resultado.toFixed(4)}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "adedanha": {
      try {
        const a = Jogos.adedanha();
        await reagir("🔤");
        await reply(`🔤 *adedanha!* a letra é: *${a.letra}*\n\ncategorias: ${a.categorias.join(", ")}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "jogodavelha": {
      try {
        await reply(`⭕ tabuleiro do jogo da velha:\n\n${Jogos.jogoDaVelhaVazio()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "numeromagico": {
      try {
        const n = args[0];
        const fatos = Jogos.numeroMagico(n);
        if (!fatos) { await reply(`manda um número! Ex: ${prefix}numeromagico 16`); break; }
        await reply(`🔮 curiosidades sobre *${n}*:\n${fatos.map(f => `▸ ${f}`).join("\n")}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "sortearanimal": {
      try {
        await reply(`🐾 ${Jogos.sortearAnimal()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "sortearcor": {
      try {
        await reply(`🎨 ${Jogos.sortearCor()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "sortearpais": {
      try {
        await reply(`🌍 ${Jogos.sortearPais()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "sortearprofissao": {
      try {
        await reply(`💼 ${Jogos.sortearProfissao()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "desenharforca": {
      try {
        await reply(`🪢 ${Jogos.desenharForca()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "charadamatematica": {
      try {
        const c = Jogos.charadaMatematica();
        await reagir("🔢");
        await reply(`🔢 *charada:* ${c.pergunta}\n\n_a resposta chega em alguns segundos!_`);
        setTimeout(() => { reply(`✅ resposta: *${c.resposta}*`).catch(() => null); }, 8000);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "capitalsurpresa": {
      try {
        const c = Jogos.capitalSurpresa();
        await reply(`🌍 a capital de *${c.pais}* é *${c.capital}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "definirmeta": {
      try {
        const valor = parseInt(args[0]);
        if (Number.isNaN(valor) || valor <= 0) { await reply(`manda um valor! Ex: ${prefix}definirmeta 1000`); break; }
        Economia.definirMeta(sender, valor);
        await reply(`🎯 meta definida! você quer chegar em *${valor}* moedas`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "vermeta": {
      try {
        const m = Economia.verMeta(sender);
        if (!m) { await reply(`você ainda não definiu uma meta! usa ${prefix}definirmeta <valor>`); break; }
        await reply(`🎯 sua meta: ${m.atual} / ${m.meta} moedas (${m.porcentagem}%)`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "presentear": {
      try {
        const alvo = Jid.resolverAlvo({ info, args, q, sender });
        const itemId = args[args.length - 1];
        if (!alvo || !itemId) { await reply(`marca a pessoa e manda o id do item! Ex: ${prefix}presentear @user concha`); break; }

        const r = Economia.presentearItem(sender, alvo, itemId);
        if (!r.ok) { await reply(`você não tem esse item no seu inventário!`); break; }
        await reply(`🎁 você presenteou @${alvo.split("@")[0]} com um item!`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "estatisticaseconomia": {
      try {
        const e = Economia.estatisticasEconomia(sender);
        await reply(`📊 *sua economia*\n\n💰 saldo: ${e.saldo}\n⭐ xp: ${e.xp} (nível ${e.nivel})\n🎒 itens no inventário: ${e.itensNoInventario}\n💎 valor do inventário: ${e.valorInventario}\n🏦 patrimônio total: ${e.patrimonioTotal}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "rankingsaldo": {
      try {
        const db = require("./utils/db.js");
        const path = require("path");
        const todos = db.read(path.join(__dirname, "database", "usuarios.json"), {});
        const top = Economia.rankingPorSaldo(todos, 10);
        if (!top.length) { await reply("ninguém tem saldo ainda!"); break; }
        const linhas = top.map((u, i) => `${i + 1}. ${u.jid.split("@")[0]} — ${u.saldo || 0} moedas`).join("\n");
        await reply(`🏆 *ranking de saldo*\n\n${linhas}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "rankingxp": {
      try {
        const db = require("./utils/db.js");
        const path = require("path");
        const todos = db.read(path.join(__dirname, "database", "usuarios.json"), {});
        const top = Economia.rankingPorXp(todos, 10);
        if (!top.length) { await reply("ninguém tem xp ainda!"); break; }
        const linhas = top.map((u, i) => `${i + 1}. ${u.jid.split("@")[0]} — ${u.xp || 0} xp`).join("\n");
        await reply(`🏆 *ranking de xp*\n\n${linhas}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "resetarinventario": {
      try {
        Economia.resetarInventario(sender);
        await reply(`✅ seu inventário foi esvaziado!`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "venderitem": {
      try {
        const itemId = args[0];
        if (!itemId) { await reply(`manda o id do item! Ex: ${prefix}venderitem concha`); break; }
        const r = Economia.venderItem(sender, itemId);
        if (!r.ok) { await reply(r.motivo === "item" ? `esse item não existe!` : `você não tem esse item no inventário!`); break; }
        await reply(`💰 você vendeu ${r.item.emoji} *${r.item.nome}* e recebeu *${r.reembolso}* moedas de volta`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "biosugestao": {
      try {
        await reply(`📝 sugestão de bio: ${Ia.bioSugestao()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "legendafoto": {
      try {
        await reply(`📸 ${Ia.legendaFoto()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "nomedeband": {
      try {
        await reply(`🎸 ${Ia.nomeDeBanda()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "nomedejogo": {
      try {
        await reply(`🎮 ${Ia.nomeDeJogo()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "sloganengracado": {
      try {
        if (!q.trim()) { await reply(`manda um tema! Ex: ${prefix}sloganengracado pizza`); break; }
        await reply(`📣 ${Ia.sloganEngracado(q.trim())}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "horoscopochines": {
      try {
        const ano = args[0];
        const animal = Ia.horoscopoChines(ano);
        if (!animal) { await reply(`manda o ano de nascimento! Ex: ${prefix}horoscopochines 1998`); break; }
        await reply(`🐉 no horóscopo chinês, ${ano} é o ano do(a) *${animal}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "numerologianome": {
      try {
        if (!q.trim()) { await reply(`manda um nome! Ex: ${prefix}numerologianome Ana`); break; }
        const numero = Ia.numerologiaNome(q.trim());
        await reply(`🔮 o número da numerologia de "${q.trim()}" é *${numero}*\n\n_(brincadeira sem base científica!)_`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "testepersonalidade": {
      try {
        await reagir("🧠");
        await reply(`🧠 resultado do seu teste de personalidade:\n\n${Ia.testePersonalidade()}\n\n_(brincadeira, não é um teste real!)_`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "qualpersonagemsou": {
      try {
        await reply(`🎭 hoje você é: *${Ia.qualPersonagemSou()}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "gerartitulodemusica": {
      try {
        await reply(`🎵 ${Ia.gerarTituloDeMusica()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "gerarnomedeplaneta": {
      try {
        await reply(`🪐 ${Ia.gerarNomeDePlaneta()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "conselhorelacionamento": {
      try {
        await reagir("💙");
        await reply(`💙 ${Ia.conselhoRelacionamento()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "desejo": {
      try {
        await reply(`✨ ${Ia.desejo()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "curiosidadeespaco": {
      try {
        await reagir("🌌");
        await reply(`🌌 ${Ia.curiosidadeEspaco()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "curiosidadehistoria": {
      try {
        await reagir("📜");
        await reply(`📜 ${Ia.curiosidadeHistoria()}`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "semanasrestantesano": {
      try {
        await reply(`🗓️ faltam *${Geral.semanasRestantesAno()}* semanas pro fim do ano`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "diasrestantesano": {
      try {
        await reply(`🗓️ faltam *${Geral.diasRestantesAno()}* dias pro fim do ano`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "estacaodoano": {
      try {
        await reply(`🍃 estamos no(a) *${Geral.estacaoDoAno()}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "horabrasilia": {
      try {
        await reply(`🇧🇷 agora em brasília são *${Geral.horaBrasilia()}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "quantosdias": {
      try {
        const partes = q.split("|").map(p => p.trim()).filter(Boolean);
        if (partes.length !== 2) { await reply(`manda duas datas separadas por |. Ex: ${prefix}quantosdias 01/01/2026 | 25/12/2026`); break; }
        const dias = Geral.quantosDias(partes[0], partes[1]);
        if (dias === null) { await reply(`data inválida! usa o formato DD/MM/AAAA`); break; }
        await reply(`📅 são *${dias}* dias entre essas duas datas`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "mesatual": {
      try {
        await reply(`📅 estamos em *${Geral.mesAtual()}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "anobissexto": {
      try {
        const ano = args[0];
        const resultado = Geral.anoBissexto(ano);
        if (resultado === null) { await reply(`manda um ano! Ex: ${prefix}anobissexto 2028`); break; }
        await reply(resultado ? `✅ *${ano}* é bissexto!` : `❌ *${ano}* não é bissexto`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "horaformatada": {
      try {
        await reply(`🕐 agora são *${Geral.horaFormatada()}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "diadomes": {
      try {
        await reply(`📆 hoje é dia *${Geral.diaDoMes()}* do mês`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "trimestre": {
      try {
        await reply(`📊 estamos no *${Geral.trimestre()}º trimestre* do ano`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "semestre": {
      try {
        await reply(`📊 estamos no *${Geral.semestre()}º semestre* do ano`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "nomedomes": {
      try {
        const nome = Geral.nomeDoMes(args[0]);
        if (!nome) { await reply(`manda um número de 1 a 12! Ex: ${prefix}nomedomes 3`); break; }
        await reply(`📅 o mês *${args[0]}* é *${nome}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "diadasemanadedata": {
      try {
        if (!q.trim()) { await reply(`manda uma data! Ex: ${prefix}diadasemanadedata 25/12/2026`); break; }
        const dia = Geral.diaDaSemanaDeData(q.trim());
        if (!dia) { await reply(`data inválida! usa o formato DD/MM/AAAA`); break; }
        await reply(`📅 essa data cai numa *${dia}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "horasparaminutos": {
      try {
        const minutos = Geral.horasParaMinutos(args[0]);
        if (minutos === null) { await reply(`manda um número de horas! Ex: ${prefix}horasparaminutos 2.5`); break; }
        await reply(`⏱️ ${args[0]}h = *${minutos} minutos*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "minutosparahoras": {
      try {
        const r = Geral.minutosParaHoras(args[0]);
        if (!r) { await reply(`manda um número de minutos! Ex: ${prefix}minutosparahoras 150`); break; }
        await reply(`⏱️ ${args[0]} minutos = *${r.horas}h ${r.minutos}m*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "segundosparahms": {
      try {
        const hms = Geral.segundosParaHms(args[0]);
        if (!hms) { await reply(`manda um número de segundos! Ex: ${prefix}segundosparahms 5000`); break; }
        await reply(`⏱️ ${args[0]}s = *${hms}*`);
      } catch (err) {
        console.error(err);
      }
      break;
    }

    case "diasuteis": {
      try {
        const partes = q.split("|").map(p => p.trim()).filter(Boolean);
        if (partes.length !== 2) { await reply(`manda duas datas separadas por |. Ex: ${prefix}diasuteis 01/09/2026 | 18/09/2026`); break; }
        const dias = Geral.diasUteis(partes[0], partes[1]);
        if (dias === null) { await reply(`data inválida! usa o formato DD/MM/AAAA`); break; }
        await reply(`💼 são *${dias}* dias úteis entre essas duas datas`);
      } catch (err) {
        console.error(err);
      }
      break;
    }


    case "romano": {
      try {
        const n = parseInt(args[0]);
        if (!args[0] || Number.isNaN(n)) { await reply(`manda um número! Ex: ${prefix}romano 1994`); break; }
        const r = Romanos.paraRomano(n);
        if (!r) { await reply(`manda um número entre 1 e 3999!`); break; }
        await reply(`🏛️ ${n} em romano é *${r}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "deromano": {
      try {
        if (!q.trim()) { await reply(`manda um número romano! Ex: ${prefix}deromano MCMXCIV`); break; }
        const r = Romanos.deRomano(q);
        if (r === null) { await reply(`isso não parece um número romano válido 🤔`); break; }
        await reply(`🏛️ *${q.trim().toUpperCase()}* em número é *${r}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "titlecase": {
      try {
        if (!q.trim()) { await reply(`manda um texto! Ex: ${prefix}titlecase meu bot favorito`); break; }
        await reply(`🔠 ${TituloCaso.paraTituloCase(q)}`);
      } catch (err) { console.error(err); }
      break;
    }

    case "snakecase": {
      try {
        if (!q.trim()) { await reply(`manda um texto! Ex: ${prefix}snakecase meu bot favorito`); break; }
        await reply(`🐍 ${TituloCaso.paraSnakeCase(q)}`);
      } catch (err) { console.error(err); }
      break;
    }

    case "camelcase": {
      try {
        if (!q.trim()) { await reply(`manda um texto! Ex: ${prefix}camelcase meu bot favorito`); break; }
        await reply(`🐫 ${CamelCase.paraCamelCase(q)}`);
      } catch (err) { console.error(err); }
      break;
    }

    case "kebabcase": {
      try {
        if (!q.trim()) { await reply(`manda um texto! Ex: ${prefix}kebabcase meu bot favorito`); break; }
        await reply(`🍢 ${CamelCase.paraKebabCase(q)}`);
      } catch (err) { console.error(err); }
      break;
    }

    case "validarcpf": {
      try {
        if (!q.trim()) { await reply(`manda um cpf pra eu checar o formato! Ex: ${prefix}validarcpf 123.456.789-09`); break; }
        const valido = Validadores.validarCPFFormato(q);
        await reply(valido ? `✅ esse CPF tem um formato válido (só checagem matemática, não confirma existência real)` : `❌ esse CPF não é válido`);
      } catch (err) { console.error(err); }
      break;
    }

    case "validaremail": {
      try {
        if (!q.trim()) { await reply(`manda um e-mail pra eu checar! Ex: ${prefix}validaremail nome@exemplo.com`); break; }
        const valido = Validadores.validarEmailFormato(q);
        await reply(valido ? `✅ esse e-mail tem um formato válido` : `❌ esse e-mail não parece válido`);
      } catch (err) { console.error(err); }
      break;
    }

    case "grauparadian": {
      try {
        const r = GeoConversor.grausParaRadianos(args[0]);
        if (r === null) { await reply(`manda um valor em graus! Ex: ${prefix}grauparadian 180`); break; }
        await reply(`📐 ${args[0]}° = *${r.toFixed(4)} rad*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "radianparagrau": {
      try {
        const g = GeoConversor.radianosParaGraus(args[0]);
        if (g === null) { await reply(`manda um valor em radianos! Ex: ${prefix}radianparagrau 3.14`); break; }
        await reply(`📐 ${args[0]} rad = *${g.toFixed(2)}°*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "litroparagalao": {
      try {
        const r = UnidadesVolume.litrosParaGaloes(args[0]);
        if (r === null) { await reply(`manda um valor em litros! Ex: ${prefix}litroparagalao 10`); break; }
        await reply(`🧴 ${args[0]} L = *${r.toFixed(3)} galões*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "galaoparalitro": {
      try {
        const r = UnidadesVolume.galoesParaLitros(args[0]);
        if (r === null) { await reply(`manda um valor em galões! Ex: ${prefix}galaoparalitro 5`); break; }
        await reply(`🧴 ${args[0]} galões = *${r.toFixed(2)} L*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "oncaparagrama": {
      try {
        const r = UnidadesPeso.oncasParaGramas(args[0]);
        if (r === null) { await reply(`manda um valor em onças! Ex: ${prefix}oncaparagrama 5`); break; }
        await reply(`⚖️ ${args[0]} oz = *${r.toFixed(2)} g*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "gramaparaonca": {
      try {
        const r = UnidadesPeso.gramasParaOncas(args[0]);
        if (r === null) { await reply(`manda um valor em gramas! Ex: ${prefix}gramaparaonca 100`); break; }
        await reply(`⚖️ ${args[0]} g = *${r.toFixed(3)} oz*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "kmhparamph": {
      try {
        const r = Velocidade.kmhParaMph(args[0]);
        if (r === null) { await reply(`manda um valor em km/h! Ex: ${prefix}kmhparamph 100`); break; }
        await reply(`🚗 ${args[0]} km/h = *${r.toFixed(2)} mph*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "mphparakmh": {
      try {
        const r = Velocidade.mphParaKmh(args[0]);
        if (r === null) { await reply(`manda um valor em mph! Ex: ${prefix}mphparakmh 60`); break; }
        await reply(`🚗 ${args[0]} mph = *${r.toFixed(2)} km/h*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "m2paraft2": {
      try {
        const r = AreaConversor.m2ParaFt2(args[0]);
        if (r === null) { await reply(`manda um valor em m²! Ex: ${prefix}m2paraft2 50`); break; }
        await reply(`📐 ${args[0]} m² = *${r.toFixed(2)} ft²*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "ft2param2": {
      try {
        const r = AreaConversor.ft2ParaM2(args[0]);
        if (r === null) { await reply(`manda um valor em ft²! Ex: ${prefix}ft2param2 500`); break; }
        await reply(`📐 ${args[0]} ft² = *${r.toFixed(2)} m²*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "diasparasegundos": {
      try {
        const r = TempoConversor.diasParaSegundos(args[0]);
        if (r === null) { await reply(`manda um número de dias! Ex: ${prefix}diasparasegundos 2`); break; }
        await reply(`⏱️ ${args[0]} dias = *${r.toLocaleString("pt-BR")} segundos*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "segundosparadias": {
      try {
        const r = TempoConversor.segundosParaDias(args[0]);
        if (r === null) { await reply(`manda um número de segundos! Ex: ${prefix}segundosparadias 172800`); break; }
        await reply(`⏱️ ${args[0]} segundos = *${r.toFixed(3)} dias*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "extenso": {
      try {
        const r = NumeroExtenso.numeroParaExtenso(args[0]);
        if (r === null) { await reply(`manda um número entre 0 e 999999999! Ex: ${prefix}extenso 1994`); break; }
        await reply(`🔢 ${args[0]} por extenso: *${r}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "ordinal": {
      try {
        const r = NumeroExtenso.numeroParaOrdinal(args[0]);
        if (r === null) { await reply(`manda um número entre 1 e 20! Ex: ${prefix}ordinal 3`); break; }
        await reply(`🔢 ${args[0]}º = *${r}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "cesar": {
      try {
        const partes = q.split("|").map(p => p.trim());
        if (!partes[0]) { await reply(`manda o texto e (opcional) o deslocamento separados por |. Ex: ${prefix}cesar ola mundo | 3`); break; }
        const desl = partes[1] ? parseInt(partes[1]) : 3;
        await reply(`🔐 ${CifraCesar.cifraCesar(partes[0], desl)}`);
      } catch (err) { console.error(err); }
      break;
    }

    case "descesar": {
      try {
        const partes = q.split("|").map(p => p.trim());
        if (!partes[0]) { await reply(`manda o texto e (opcional) o deslocamento separados por |. Ex: ${prefix}descesar roh pxqgr | 3`); break; }
        const desl = partes[1] ? parseInt(partes[1]) : 3;
        await reply(`🔓 ${CifraCesar.decifraCesar(partes[0], desl)}`);
      } catch (err) { console.error(err); }
      break;
    }

    case "vigenere": {
      try {
        const partes = q.split("|").map(p => p.trim());
        if (!partes[0] || !partes[1]) { await reply(`manda o texto e a chave separados por |. Ex: ${prefix}vigenere ola mundo | chave`); break; }
        const r = Vigenere.cifraVigenere(partes[0], partes[1]);
        if (!r) { await reply(`a chave precisa ter pelo menos uma letra!`); break; }
        await reply(`🔐 ${r}`);
      } catch (err) { console.error(err); }
      break;
    }

    case "devigenere": {
      try {
        const partes = q.split("|").map(p => p.trim());
        if (!partes[0] || !partes[1]) { await reply(`manda o texto e a chave separados por |. Ex: ${prefix}devigenere texto cifrado | chave`); break; }
        const r = Vigenere.decifraVigenere(partes[0], partes[1]);
        if (!r) { await reply(`a chave precisa ter pelo menos uma letra!`); break; }
        await reply(`🔓 ${r}`);
      } catch (err) { console.error(err); }
      break;
    }

    case "palavrafrequente": {
      try {
        if (!q.trim()) { await reply(`manda um texto! Ex: ${prefix}palavrafrequente o bot é legal o bot ajuda`); break; }
        const r = Contadores2.palavraMaisFrequente(q);
        if (!r) { await reply(`não achei palavras nesse texto`); break; }
        await reply(`🔎 a palavra mais frequente é *"${r.palavra}"* (${r.vezes}x)`);
      } catch (err) { console.error(err); }
      break;
    }

    case "contarfrases": {
      try {
        if (!q.trim()) { await reply(`manda um texto! Ex: ${prefix}contarfrases Oi. Tudo bem? Sim!`); break; }
        await reply(`📝 esse texto tem *${Contadores2.contarFrases(q)}* frase(s)`);
      } catch (err) { console.error(err); }
      break;
    }

    case "senhamemoravel": {
      try {
        await reply(`🔑 sua senha memorável: *${GerarSenhas2.gerarSenhaMemoravel()}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "gerarpin": {
      try {
        const digitos = args[0] ? parseInt(args[0]) : 4;
        await reply(`🔢 seu pin: *${GerarSenhas2.gerarPin(digitos)}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "equadrado": {
      try {
        const r = Matematica2.ehQuadradoPerfeito(args[0]);
        if (r === null) { await reply(`manda um número positivo! Ex: ${prefix}equadrado 81`); break; }
        await reply(r ? `✅ *${args[0]}* é um quadrado perfeito!` : `❌ *${args[0]}* não é um quadrado perfeito`);
      } catch (err) { console.error(err); }
      break;
    }

    case "epalindromonum": {
      try {
        const r = Matematica2.ehPalindromoNumerico(args[0]);
        if (r === null) { await reply(`manda um número! Ex: ${prefix}epalindromonum 1221`); break; }
        await reply(r ? `✅ *${args[0]}* é um palíndromo numérico!` : `❌ *${args[0]}* não é um palíndromo`);
      } catch (err) { console.error(err); }
      break;
    }


    case "sortearnumero": {
      try {
        const [min, max] = args;
        const r = SorteioExtra.sortearNumeroEntre(min, max);
        if (r === null) { await reply(`manda o mínimo e o máximo! Ex: ${prefix}sortearnumero 1 100`); break; }
        await reagir("🎲");
        await reply(`🎯 número sorteado: *${r}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "sortearvarios": {
      try {
        const [qtd, min, max] = args;
        const r = SorteioExtra.sortearVariosNumeros(qtd, min, max);
        if (r === null) { await reply(`manda quantidade, mínimo e máximo! Ex: ${prefix}sortearvarios 5 1 60`); break; }
        await reagir("🎲");
        await reply(`🎯 números sorteados: *${r.join(", ")}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "classerpg": {
      try {
        await reply(`⚔️ sua classe de RPG é: *${Rpg.sortearClasseRPG()}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "armarpg": {
      try {
        await reply(`🗡️ sua arma lendária é: *${Rpg.sortearArmaRPG()}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "carta": {
      try {
        await reagir("🃏");
        await reply(`🃏 sua carta: *${Cartas.sortearCarta()}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "mao5cartas": {
      try {
        await reagir("🃏");
        await reply(`🃏 sua mão: ${Cartas.sortearMao(5).join(" ")}`);
      } catch (err) { console.error(err); }
      break;
    }

    case "rolardados": {
      try {
        const [qtd, lados] = args;
        const r = Dados2.rolarDados(qtd, lados);
        await reagir("🎲");
        await reply(`🎲 rolagens: ${r.rolagens.join(", ")}\n📊 total: *${r.total}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "d20": {
      try {
        const r = Dados2.rolarD20();
        await reagir("🎲");
        const msg = r === 20 ? " — CRÍTICO! 🌟" : r === 1 ? " — falha crítica 💀" : "";
        await reply(`🎲 d20: *${r}*${msg}`);
      } catch (err) { console.error(err); }
      break;
    }

    case "verdadeoudesafio": {
      try {
        const r = QuizTipos.sortearVerdadeOuDesafio();
        await reagir(r.tipo === "verdade" ? "🗣️" : "🔥");
        await reply(`${r.tipo === "verdade" ? "🗣️ *verdade*" : "🔥 *desafio*"}: ${r.texto}`);
      } catch (err) { console.error(err); }
      break;
    }

    case "voceprefere": {
      try {
        await reply(`🤔 você prefere ${QuizTipos.sortearVoceprefere()}`);
      } catch (err) { console.error(err); }
      break;
    }

    case "nomefantasia": {
      try {
        await reply(`🧝 seu nome de fantasia: *${NomeFiccao.sortearNomeFantasia()}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "nomereino": {
      try {
        await reply(`🏰 seu reino se chama: *${NomeFiccao.sortearNomeReino()}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "batalha": {
      try {
        const partes = q.split("|").map(p => p.trim()).filter(Boolean);
        const nome1 = partes[0] || "Jogador 1";
        const nome2 = partes[1] || "Jogador 2";
        const r = Combate.simularBatalha(nome1, nome2);
        await reagir("⚔️");
        await reply(`⚔️ *${nome1}* (${r.forca1}) vs *${nome2}* (${r.forca2})\n\n🏆 vencedor: *${r.vencedor}*!`);
      } catch (err) { console.error(err); }
      break;
    }

    case "dano": {
      try {
        const [ataque, defesa] = args;
        const r = Combate.calcularDano(ataque, defesa);
        if (r === null) { await reply(`manda ataque e defesa! Ex: ${prefix}dano 50 20`); break; }
        await reply(`💥 dano causado: *${r}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "megasena": {
      try {
        const nums = LoteriaExtra.gerarJogoMegaSena();
        await reagir("🍀");
        await reply(`🍀 seu jogo da mega-sena:\n*${nums.map(n => String(n).padStart(2, "0")).join(" - ")}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "lotofacil": {
      try {
        const nums = LoteriaExtra.gerarJogoLotofacil();
        await reagir("🍀");
        await reply(`🍀 seu jogo da lotofácil:\n*${nums.map(n => String(n).padStart(2, "0")).join(" - ")}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "roletacores": {
      try {
        await reagir("🎡");
        await reply(`🎡 a roleta parou em: *${Roleta2.girarRoletaCores()}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "roletanumeros": {
      try {
        const n = Roleta2.girarRoletaNumeros();
        await reagir("🎡");
        await reply(`🎡 a roleta parou no número: *${n}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "desafio24h": {
      try {
        await reply(`🔥 seu desafio de 24h: ${Desafios2.sortearDesafio24h()}`);
      } catch (err) { console.error(err); }
      break;
    }

    case "missaodiaria": {
      try {
        await reply(`📋 sua missão de hoje: ${Desafios2.sortearMissaoDiaria()}`);
      } catch (err) { console.error(err); }
      break;
    }


    case "piadacurta": {
      try {
        await reply(`😂 ${Piadas2.piadaCurta()}`);
      } catch (err) { console.error(err); }
      break;
    }

    case "trocadilhoruim": {
      try {
        await reply(`🤦 ${Piadas2.trocadilhoRuim()}`);
      } catch (err) { console.error(err); }
      break;
    }

    case "iniciofanfic": {
      try {
        await reply(`📖 ${Fanfic.gerarInicioFanfic()}...`);
      } catch (err) { console.error(err); }
      break;
    }

    case "nomeship": {
      try {
        const partes = q.split(/e|\+|,/i).map(p => p.trim()).filter(Boolean);
        if (partes.length < 2) { await reply(`manda dois nomes! Ex: ${prefix}nomeship Ana e João`); break; }
        const r = Fanfic.gerarNomeShip(partes[0], partes[1]);
        await reagir("💞");
        await reply(`💞 o nome do ship é: *${r}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "legendameme": {
      try {
        await reply(`🖼️ ${MemesGen.gerarLegendaMeme()}`);
      } catch (err) { console.error(err); }
      break;
    }

    case "hashtags": {
      try {
        if (!q.trim()) { await reply(`manda um tema! Ex: ${prefix}hashtags viagem praia`); break; }
        const r = MemesGen.gerarHashtags(q);
        await reply(`🏷️ ${r}`);
      } catch (err) { console.error(err); }
      break;
    }

    case "previsaoamor": {
      try {
        await reply(`💘 previsão amorosa: ${Signos2.previsaoAmorosa()}`);
      } catch (err) { console.error(err); }
      break;
    }

    case "cordasorte": {
      try {
        if (!q.trim()) { await reply(`manda seu signo! Ex: ${prefix}cordasorte leão`); break; }
        const r = Signos2.corDaSorteSigno(q);
        if (!r) { await reply(`não reconheci esse signo! usa um dos 12 signos do zodíaco`); break; }
        await reply(`🎨 a cor da sorte de *${q.trim()}* é: *${r}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "qualanimal": {
      try {
        await reagir("🐾");
        await reply(`🐾 hoje você é um(a): *${Personalidade2.qualAnimalVoceE()}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "qualelemento": {
      try {
        await reply(`🌪️ seu elemento é: *${Personalidade2.qualElementoVoceE()}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "citacaomotivacional": {
      try {
        await reply(`✨ "${Citacoes2.citacaoMotivacional()}"`);
      } catch (err) { console.error(err); }
      break;
    }

    case "citacaoengracada": {
      try {
        await reply(`😆 "${Citacoes2.citacaoEngracada()}"`);
      } catch (err) { console.error(err); }
      break;
    }

    case "nomeartistico": {
      try {
        await reply(`🎤 seu nome artístico: *${NomesGen2.gerarNomeArtistico()}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "nomegamer": {
      try {
        await reply(`🎮 seu nick gamer: *${NomesGen2.gerarNomeGamer()}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "curiosidadeciencia": {
      try {
        await reply(`🔬 ${Curiosidades3.curiosidadeCiencia()}`);
      } catch (err) { console.error(err); }
      break;
    }

    case "curiosidadetech": {
      try {
        await reply(`💻 ${Curiosidades3.curiosidadeTecnologia()}`);
      } catch (err) { console.error(err); }
      break;
    }

    case "receitarapida": {
      try {
        await reply(`🍳 que tal: ${Receitas.sugerirReceitaRapida()}?`);
      } catch (err) { console.error(err); }
      break;
    }

    case "sugestaolanche": {
      try {
        await reply(`🥪 que tal um lanche de: ${Receitas.sugerirLanche()}?`);
      } catch (err) { console.error(err); }
      break;
    }

    case "generofilme": {
      try {
        await reply(`🎬 hoje o gênero é: *${Filmes.sortearGeneroFilme()}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "filmeassistir": {
      try {
        await reply(`🍿 assista hoje: ${Filmes.sortearFilmeParaAssistir()}`);
      } catch (err) { console.error(err); }
      break;
    }

    case "generomusical": {
      try {
        await reply(`🎵 seu gênero musical de hoje: *${Musica2.sortearGeneroMusical()}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "instrumento": {
      try {
        await reply(`🎸 você deveria aprender: *${Musica2.sortearInstrumento()}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "destinoviagem": {
      try {
        await reply(`✈️ seu próximo destino: *${Viagem.sortearDestinoViagem()}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "continente": {
      try {
        await reply(`🌍 você devia conhecer: *${Viagem.sortearContinente()}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "sortearesporte": {
      try {
        await reply(`🏅 hoje o esporte é: *${Esportes.sortearEsporte()}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "timeficticio": {
      try {
        await reply(`🏆 seu time fictício: *${Esportes.sortearTimeFicticio()}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "superhabilidade": {
      try {
        await reply(`🦸 seu superpoder é: *${Profissoes2.sortearSuperHabilidade()}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "poderfraqueza": {
      try {
        const r = Profissoes2.sortearPoderFraqueza();
        await reply(`🦸 poder: *${r.poder}*\n💀 fraqueza: *${r.fraqueza}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "fraseparahoje": {
      try {
        await reply(`💙 ${Frases2.fraseParaHoje()}`);
      } catch (err) { console.error(err); }
      break;
    }

    case "fraseestudos": {
      try {
        await reply(`📚 ${Frases2.fraseParaEstudos()}`);
      } catch (err) { console.error(err); }
      break;
    }

    case "elogiocriativo": {
      try {
        await reply(`💐 ${Elogios2.elogioCriativo()}`);
      } catch (err) { console.error(err); }
      break;
    }

    case "elogioamigo": {
      try {
        await reply(`💙 ${Elogios2.elogioAmigo()}`);
      } catch (err) { console.error(err); }
      break;
    }


    case "diasatefimano": {
      try {
        await reply(`📅 faltam *${Calendario2.diasAteFimDoAno()}* dias pro fim do ano`);
      } catch (err) { console.error(err); }
      break;
    }

    case "diasdesdeinicioano": {
      try {
        await reply(`📅 já se passaram *${Calendario2.diasDesdeInicioAno()}* dias desde o início do ano`);
      } catch (err) { console.error(err); }
      break;
    }

    case "tempoatemeianoite": {
      try {
        const r = Tempo2.tempoAteMeiaNoite();
        await reply(`🌙 faltam *${r.horas}h ${r.minutos}m* pra meia-noite`);
      } catch (err) { console.error(err); }
      break;
    }

    case "tempodesdemeianoite": {
      try {
        const r = Tempo2.tempoDesdeMeiaNoite();
        await reply(`🌅 já se passaram *${r.horas}h ${r.minutos}m* desde a meia-noite`);
      } catch (err) { console.error(err); }
      break;
    }

    case "idadeemdias": {
      try {
        if (!q.trim()) { await reply(`manda sua data de nascimento! Ex: ${prefix}idadeemdias 15/03/2000`); break; }
        const r = IdadeExtra.calcularIdadeEmDias(q);
        if (r === null) { await reply(`data inválida! usa o formato DD/MM/AAAA`); break; }
        await reply(`🎂 você já viveu *${r.toLocaleString("pt-BR")}* dias`);
      } catch (err) { console.error(err); }
      break;
    }

    case "idadeemhoras": {
      try {
        if (!q.trim()) { await reply(`manda sua data de nascimento! Ex: ${prefix}idadeemhoras 15/03/2000`); break; }
        const r = IdadeExtra.calcularIdadeEmHoras(q);
        if (r === null) { await reply(`data inválida! usa o formato DD/MM/AAAA`); break; }
        await reply(`🎂 você já viveu aproximadamente *${r.toLocaleString("pt-BR")}* horas`);
      } catch (err) { console.error(err); }
      break;
    }

    case "converterfuso": {
      try {
        const [hora, origem, destino] = args;
        const r = FusoHorario.converterFusoHorario(hora, origem, destino);
        if (r === null) { await reply(`manda hora, fuso de origem e destino! Ex: ${prefix}converterfuso 15 -3 0`); break; }
        const horaInt = Math.floor(r);
        const minutos = Math.round((r - horaInt) * 60);
        await reply(`🌐 ${hora}h (UTC${origem >= 0 ? "+" : ""}${origem}) = *${horaInt}h${minutos ? minutos + "m" : ""}* (UTC${destino >= 0 ? "+" : ""}${destino})`);
      } catch (err) { console.error(err); }
      break;
    }

    case "horautc": {
      try {
        await reply(`🌐 hora UTC agora: *${FusoHorario.horaUTC()}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "diasaniversario": {
      try {
        if (!q.trim()) { await reply(`manda seu dia e mês de nascimento! Ex: ${prefix}diasaniversario 15/03`); break; }
        const r = Aniversario.diasParaAniversario(q);
        if (r === null) { await reply(`data inválida! usa o formato DD/MM`); break; }
        await reply(r === 0 ? `🎉 hoje é seu aniversário! parabéns!! 🎂` : `🎂 faltam *${r}* dias pro seu aniversário`);
      } catch (err) { console.error(err); }
      break;
    }

    case "aniversariodiasemana": {
      try {
        if (!q.trim()) { await reply(`manda seu dia e mês de nascimento! Ex: ${prefix}aniversariodiasemana 15/03`); break; }
        const r = Aniversario.aniversarioDiaSemana(q);
        if (!r) { await reply(`data inválida! usa o formato DD/MM`); break; }
        await reply(`🎂 seu próximo aniversário cai numa *${r}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "numerodestino": {
      try {
        if (!q.trim()) { await reply(`manda sua data de nascimento! Ex: ${prefix}numerodestino 15/03/2000`); break; }
        const r = Numerologia2.calcularNumeroDestino(q);
        if (r === null) { await reply(`manda uma data válida!`); break; }
        await reply(`🔮 seu número de destino é: *${r}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "numeroanjo": {
      try {
        const dig = Math.floor(Math.random() * 9) + 1;
        await reply(`👼 seu número anjo de hoje é: *${dig}${dig}${dig}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "diasproximaestacao": {
      try {
        const r = Estacoes2.diasParaProximaEstacao();
        await reply(`🍂 faltam *${r.dias}* dias pro início do(a) *${r.estacao}*`);
      } catch (err) { console.error(err); }
      break;
    }

    case "estacaopormes": {
      try {
        const r = Estacoes2.estacaoPorMes(args[0]);
        if (!r) { await reply(`manda um mês entre 1 e 12! Ex: ${prefix}estacaopormes 7`); break; }
        await reply(`🍂 o mês ${args[0]} é *${r}* (hemisfério sul)`);
      } catch (err) { console.error(err); }
      break;
    }

    case "eventohistorico": {
      try {
        await reply(`📜 ${CuriosidadesData.eventoHistoricoHoje()}`);
      } catch (err) { console.error(err); }
      break;
    }

    case "signodomes": {
      try {
        const r = CuriosidadesData.signoDoMes(args[0]);
        if (!r) { await reply(`manda um mês entre 1 e 12! Ex: ${prefix}signodomes 5`); break; }
        await reply(`♈ nesse mês transitam os signos: *${r}*`);
      } catch (err) { console.error(err); }
      break;
    }


    default: {
      try {
        const sugestoes = Sugestao.sugerir(command, todosComandos(), 3);
        if (sugestoes.length) {
          await reply(`não achei o comando *${prefix}${command}* 🤔\n\nvocê quis dizer:\n${sugestoes.map(s => `▸ ${prefix}${s}`).join("\n")}`);
        }
      } catch (err) {
        console.error(err);
      }
      break;
    }
    }

  } catch (err) {
    console.error("[NEJIRE INDEX] erro:", err);
  }
};
