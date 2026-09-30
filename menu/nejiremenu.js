const config = require("../config.json");
const { pequeno, miudo, titular, frase, LINHA, tituloCategoria, fecharCategoria } = require("../utils/texto.js");

// ── REGISTRO CENTRAL DE COMANDOS ─────────────────────────
const CATEGORIAS = [
    {
        emoji: "👑", nome: "dono", cor: "💙",
        comandos: [
            { cmd: "sairgrupo", desc: "" },
            { cmd: "sairgrupoid", desc: "" },
            { cmd: "listargrupos", desc: "" },
            { cmd: "definirnomebot", desc: "" },
            { cmd: "definirfotobot", desc: "" },
            { cmd: "definirrecado", desc: "" },
            { cmd: "broadcast", desc: "" },
            { cmd: "broadcastdm", desc: "" },
            { cmd: "definirsaldo", desc: "" },
            { cmd: "definirxp", desc: "" },
            { cmd: "resetusuario", desc: "" },
            { cmd: "zerarranking", desc: "" },
            { cmd: "listarusuarios", desc: "" },
            { cmd: "listarbloqueados", desc: "" },
            { cmd: "desbloqueartodos", desc: "" },
            { cmd: "statusprocesso", desc: "" },
            { cmd: "limparflood", desc: "" },
            { cmd: "testarenvio", desc: "" },
            { cmd: "definirdailymin", desc: "" },
            { cmd: "definirdailymax", desc: "" },
            { cmd: "definirmoedanome", desc: "" },
            { cmd: "definirnumerodono", desc: "" },
            { cmd: "definircanal", desc: "" },
            { cmd: "definirversao", desc: "" },
            { cmd: "exportarusuarios", desc: "" },
            { cmd: "backup", desc: "" },
            { cmd: "autobackup", desc: "" },
            { cmd: "donos", desc: "" },
            { cmd: "adddono", desc: "" },
            { cmd: "deldono", desc: "" },
            { cmd: "cmdoff", desc: "" },
            { cmd: "cmdon", desc: "" },
            { cmd: "cmdsoff", desc: "" },
            { cmd: "erros", desc: "" },
            { cmd: "limparerros", desc: "" },
            { cmd: "topcomandos", desc: "" },
            { cmd: "entrar", desc: "" },
            { cmd: "autoler", desc: "" },
            { cmd: "presenca", desc: "" },
            { cmd: "limparcache", desc: "" },
            { cmd: "antipv", desc: "" },
            { cmd: "anticall", desc: "" },
            { cmd: "definiraudiomenu", desc: "marca um áudio pra sair junto com o menu" },
            { cmd: "audiomenu", desc: "liga/desliga o áudio do menu" },
            { cmd: "testaraudiomenu", desc: "testa o áudio do menu" },
            { cmd: "removeraudiomenu", desc: "apaga o áudio do menu" }
        ]
    },
    {
        emoji: "🫐", nome: "admin", cor: "💙",
        comandos: [
            { cmd: "antis", desc: "" },
            { cmd: "antifig", desc: "" },
            { cmd: "antiimg", desc: "" },
            { cmd: "antivideo", desc: "" },
            { cmd: "antiaudio", desc: "" },
            { cmd: "antidoc", desc: "" },
            { cmd: "antictt", desc: "" },
            { cmd: "antiloc", desc: "" },
            { cmd: "antienquete", desc: "" },
            { cmd: "antivu", desc: "" },
            { cmd: "antitrava", desc: "" },
            { cmd: "antipalavra", desc: "" },
            { cmd: "antilinkgp", desc: "" },
            { cmd: "antifake", desc: "" },
            { cmd: "antiporn", desc: "" },
            { cmd: "antistatusgp", desc: "" },
            { cmd: "postarstatus", desc: "posta um status no grupo (texto, imagem, vídeo ou áudio)" },
            { cmd: "anticanal", desc: "" },
            { cmd: "antibot", desc: "" },
            { cmd: "antipayment", desc: "" },
            { cmd: "ban", desc: "" },
            { cmd: "promover", desc: "" },
            { cmd: "rebaixar", desc: "" },
            { cmd: "linkgp", desc: "" },
            { cmd: "antilink", desc: "" },
            { cmd: "abrirgrupo", desc: "" },
            { cmd: "fechargrupo", desc: "" },
            { cmd: "infogrupo", desc: "" },
            { cmd: "mutar", desc: "" },
            { cmd: "desmutar", desc: "" },
            { cmd: "aviso", desc: "" },
            { cmd: "avisos", desc: "" },
            { cmd: "resetavisos", desc: "" },
            { cmd: "apagar", desc: "" },
            { cmd: "antiflood", desc: "" },
            { cmd: "bloquear", desc: "" },
            { cmd: "desbloquear", desc: "" },
            { cmd: "marcartodos", desc: "" },
            { cmd: "hidetag", desc: "" },
            { cmd: "listaadms", desc: "" },
            { cmd: "nomegrupo", desc: "" },
            { cmd: "descgrupo", desc: "" },
            { cmd: "fotogrupo", desc: "" },
            { cmd: "revogarlink", desc: "" }
        ]
    },
    {
        emoji: "🐚", nome: "boas-vindas", cor: "💙",
        comandos: [
            { cmd: "bemvindo", desc: "" },
            { cmd: "legendabv", desc: "" },
            { cmd: "legendasaiu", desc: "" },
            { cmd: "regras", desc: "" },
            { cmd: "verregras", desc: "" },
            { cmd: "testarbv", desc: "" },
            { cmd: "autodelbv", desc: "" }
        ]
    },
    {
        emoji: "🗣️", nome: "figurinhas", cor: "💙",
        comandos: [
            { cmd: "sticker", desc: "" },
            { cmd: "toimg", desc: "" },
            { cmd: "figurinhas", desc: "" },
            { cmd: "figu_memes", desc: "" },
            { cmd: "setpack", desc: "" },
            { cmd: "setautor", desc: "" },
            { cmd: "resetfigurinha", desc: "" },
            { cmd: "scircle", desc: "" },
            { cmd: "scrop", desc: "" },
            { cmd: "sfull", desc: "" },
            { cmd: "sborda", desc: "" },
            { cmd: "sfx", desc: "" },
            { cmd: "sfxlista", desc: "" },
            { cmd: "take", desc: "" },
            { cmd: "sinfo", desc: "" },
            { cmd: "tovid", desc: "" },
            { cmd: "semoji", desc: "" }
        ]
    },
    {
        emoji: "🏊", nome: "download", cor: "💙",
        comandos: [
            { cmd: "play", desc: "" },
            { cmd: "playvid", desc: "" },
            { cmd: "tiktokdl", desc: "" },
            { cmd: "instadl", desc: "" },
            { cmd: "spotify", desc: "" },
            { cmd: "pinterest", desc: "" },
            { cmd: "letra", desc: "" },
            { cmd: "baixar", desc: "" },
            { cmd: "mp3", desc: "" },
            { cmd: "tomp3", desc: "" },
            { cmd: "toptt", desc: "" },
            { cmd: "linkinfo", desc: "" },
            { cmd: "midiasite", desc: "" },
            { cmd: "imgsite", desc: "" },
            { cmd: "scrapers", desc: "" }
        ]
    },
    {
        emoji: "🧊", nome: "cubo 3d", cor: "💙",
        comandos: [
            { cmd: "cubo3d", desc: "" },
            { cmd: "cubo3dgif", desc: "" },
            { cmd: "cubofoto", desc: "" },
            { cmd: "cubosticker", desc: "" },
            { cmd: "cuborubik", desc: "" },
            { cmd: "cubodado", desc: "" },
            { cmd: "cubo3dlista", desc: "" }
        ]
    },
    {
        emoji: "🌊", nome: "ia & diversão", cor: "💙",
        comandos: [
            { cmd: "gpt", desc: "" },
            { cmd: "ping", desc: "" },
            { cmd: "8ball", desc: "" },
            { cmd: "conselho", desc: "" },
            { cmd: "gerarsenha", desc: "" },
            { cmd: "casal", desc: "" },
            { cmd: "ppt", desc: "" },
            { cmd: "gerarnick", desc: "" },
            { cmd: "piada", desc: "" },
            { cmd: "charada", desc: "" },
            { cmd: "frase", desc: "" },
            { cmd: "desafio", desc: "" },
            { cmd: "escolher", desc: "" },
            { cmd: "moeda", desc: "" },
            { cmd: "dado", desc: "" },
            { cmd: "nota", desc: "" },
            { cmd: "imc", desc: "" },
            { cmd: "idade", desc: "" },
            { cmd: "reverso", desc: "" },
            { cmd: "tabuada", desc: "" },
            { cmd: "citacao", desc: "" },
            { cmd: "definicao", desc: "" },
            { cmd: "previsao", desc: "" },
            { cmd: "elogio", desc: "" },
            { cmd: "apelidoengracado", desc: "" },
            { cmd: "nomedeheroi", desc: "" },
            { cmd: "nomedevilao", desc: "" },
            { cmd: "superpoder", desc: "" },
            { cmd: "statuscriativo", desc: "" },
            { cmd: "despedida", desc: "" },
            { cmd: "dicadeouro", desc: "" },
            { cmd: "curiosidadeanimal", desc: "" },
            { cmd: "mitoourealidade", desc: "" },
            { cmd: "interpretarsonho", desc: "" },
            { cmd: "quefazer", desc: "" },
            { cmd: "biosugestao", desc: "" },
            { cmd: "legendafoto", desc: "" },
            { cmd: "nomedeband", desc: "" },
            { cmd: "nomedejogo", desc: "" },
            { cmd: "sloganengracado", desc: "" },
            { cmd: "horoscopochines", desc: "" },
            { cmd: "numerologianome", desc: "" },
            { cmd: "testepersonalidade", desc: "" },
            { cmd: "qualpersonagemsou", desc: "" },
            { cmd: "gerartitulodemusica", desc: "" },
            { cmd: "gerarnomedeplaneta", desc: "" },
            { cmd: "conselhorelacionamento", desc: "" },
            { cmd: "desejo", desc: "" },
            { cmd: "curiosidadeespaco", desc: "" },
            { cmd: "curiosidadehistoria", desc: "" },
            { cmd: "piadacurta", desc: "" },
            { cmd: "trocadilhoruim", desc: "" },
            { cmd: "iniciofanfic", desc: "" },
            { cmd: "nomeship", desc: "" },
            { cmd: "legendameme", desc: "" },
            { cmd: "hashtags", desc: "" },
            { cmd: "previsaoamor", desc: "" },
            { cmd: "cordasorte", desc: "" },
            { cmd: "qualanimal", desc: "" },
            { cmd: "qualelemento", desc: "" },
            { cmd: "citacaomotivacional", desc: "" },
            { cmd: "citacaoengracada", desc: "" },
            { cmd: "nomeartistico", desc: "" },
            { cmd: "nomegamer", desc: "" },
            { cmd: "curiosidadeciencia", desc: "" },
            { cmd: "curiosidadetech", desc: "" },
            { cmd: "receitarapida", desc: "" },
            { cmd: "sugestaolanche", desc: "" },
            { cmd: "generofilme", desc: "" },
            { cmd: "filmeassistir", desc: "" },
            { cmd: "generomusical", desc: "" },
            { cmd: "instrumento", desc: "" },
            { cmd: "destinoviagem", desc: "" },
            { cmd: "continente", desc: "" },
            { cmd: "sortearesporte", desc: "" },
            { cmd: "timeficticio", desc: "" },
            { cmd: "superhabilidade", desc: "" },
            { cmd: "poderfraqueza", desc: "" },
            { cmd: "fraseparahoje", desc: "" },
            { cmd: "fraseestudos", desc: "" },
            { cmd: "elogiocriativo", desc: "" },
            { cmd: "elogioamigo", desc: "" },
        ]
    },
    {
        emoji: "🧩", nome: "utilidades", cor: "💙",
        comandos: [
            { cmd: "maiuscula", desc: "" },
            { cmd: "minuscula", desc: "" },
            { cmd: "capitalizar", desc: "" },
            { cmd: "contarpalavras", desc: "" },
            { cmd: "contarcaracteres", desc: "" },
            { cmd: "contarvogais", desc: "" },
            { cmd: "contarconsoantes", desc: "" },
            { cmd: "removerespacos", desc: "" },
            { cmd: "embaralhar", desc: "" },
            { cmd: "repetir", desc: "" },
            { cmd: "binario", desc: "" },
            { cmd: "debinario", desc: "" },
            { cmd: "base64", desc: "" },
            { cmd: "debase64", desc: "" },
            { cmd: "hash", desc: "" },
            { cmd: "morse", desc: "" },
            { cmd: "demorse", desc: "" },
            { cmd: "calcular", desc: "" },
            { cmd: "porcentagem", desc: "" },
            { cmd: "regra3", desc: "" },
            { cmd: "celsiusfahrenheit", desc: "" },
            { cmd: "fahrenheitcelsius", desc: "" },
            { cmd: "kmparamilha", desc: "" },
            { cmd: "kgparalibra", desc: "" },
            { cmd: "metrosparaft", desc: "" },
            { cmd: "contarlinhas", desc: "" },
            { cmd: "extrairnumeros", desc: "" },
            { cmd: "extrairletras", desc: "" },
            { cmd: "hexparatexto", desc: "" },
            { cmd: "textoparahex", desc: "" },
            { cmd: "gerarslug", desc: "" },
            { cmd: "mascararemail", desc: "" },
            { cmd: "milissegundosparadata", desc: "" },
            { cmd: "dataparamilissegundos", desc: "" },
            { cmd: "arredondar", desc: "" },
            { cmd: "mdc", desc: "" },
            { cmd: "mmc", desc: "" },
            { cmd: "eprimo", desc: "" },
            { cmd: "fatorial", desc: "" },
            { cmd: "raizquadrada", desc: "" },
            { cmd: "romano", desc: "" },
            { cmd: "deromano", desc: "" },
            { cmd: "titlecase", desc: "" },
            { cmd: "snakecase", desc: "" },
            { cmd: "camelcase", desc: "" },
            { cmd: "kebabcase", desc: "" },
            { cmd: "validarcpf", desc: "" },
            { cmd: "validaremail", desc: "" },
            { cmd: "grauparadian", desc: "" },
            { cmd: "radianparagrau", desc: "" },
            { cmd: "litroparagalao", desc: "" },
            { cmd: "galaoparalitro", desc: "" },
            { cmd: "oncaparagrama", desc: "" },
            { cmd: "gramaparaonca", desc: "" },
            { cmd: "kmhparamph", desc: "" },
            { cmd: "mphparakmh", desc: "" },
            { cmd: "m2paraft2", desc: "" },
            { cmd: "ft2param2", desc: "" },
            { cmd: "diasparasegundos", desc: "" },
            { cmd: "segundosparadias", desc: "" },
            { cmd: "extenso", desc: "" },
            { cmd: "ordinal", desc: "" },
            { cmd: "cesar", desc: "" },
            { cmd: "descesar", desc: "" },
            { cmd: "vigenere", desc: "" },
            { cmd: "devigenere", desc: "" },
            { cmd: "palavrafrequente", desc: "" },
            { cmd: "contarfrases", desc: "" },
            { cmd: "senhamemoravel", desc: "" },
            { cmd: "gerarpin", desc: "" },
            { cmd: "equadrado", desc: "" },
            { cmd: "epalindromonum", desc: "" },
        ]
    },
    {
        emoji: "🕵️", nome: "detetive", cor: "💙",
        comandos: [
            { cmd: "casos", desc: "lista os casos disponíveis pra investigar" },
            { cmd: "caso", desc: "inicia um caso e manda o pacote de evidências" },
            { cmd: "suspeitos", desc: "lista os suspeitos do caso ativo" },
            { cmd: "interrogar", desc: "interroga um suspeito com uma pergunta" },
            { cmd: "evidencias", desc: "lista as evidências do caso ativo" },
            { cmd: "pista", desc: "pede uma pista extra do caso ativo" },
            { cmd: "dicasenha", desc: "dá dicas pra senha dos arquivos confidenciais" },
            { cmd: "acusar", desc: "faz a acusação final do caso" },
            { cmd: "statuscaso", desc: "mostra seu progresso no RPG de detetive" },
            { cmd: "abandonarcaso", desc: "abandona o caso ativo" },
            { cmd: "gerarcodigo", desc: "(dono) gera um ID + código de acesso pra liberar um caso" },
            { cmd: "codigosativos", desc: "(dono) lista os códigos de acesso ainda não usados" },
        ]
    },
    {
        emoji: "🎲", nome: "jogos & sorte", cor: "💙",
        comandos: [
            { cmd: "sorteio", desc: "" },
            { cmd: "roleta", desc: "" },
            { cmd: "loteria", desc: "" },
            { cmd: "anagrama", desc: "" },
            { cmd: "palindromo", desc: "" },
            { cmd: "quiz", desc: "" },
            { cmd: "sorteletra", desc: "" },
            { cmd: "trocadilho", desc: "" },
            { cmd: "enigma", desc: "" },
            { cmd: "bingo", desc: "" },
            { cmd: "dadoduplo", desc: "" },
            { cmd: "rimar", desc: "" },
            { cmd: "numerosorte", desc: "" },
            { cmd: "horoscopo", desc: "" },
            { cmd: "compatibilidadesigno", desc: "" },
            { cmd: "adedanha", desc: "" },
            { cmd: "jogodavelha", desc: "" },
            { cmd: "numeromagico", desc: "" },
            { cmd: "sortearanimal", desc: "" },
            { cmd: "sortearcor", desc: "" },
            { cmd: "sortearpais", desc: "" },
            { cmd: "sortearprofissao", desc: "" },
            { cmd: "desenharforca", desc: "" },
            { cmd: "charadamatematica", desc: "" },
            { cmd: "capitalsurpresa", desc: "" },
            { cmd: "sortearnumero", desc: "" },
            { cmd: "sortearvarios", desc: "" },
            { cmd: "classerpg", desc: "" },
            { cmd: "armarpg", desc: "" },
            { cmd: "carta", desc: "" },
            { cmd: "mao5cartas", desc: "" },
            { cmd: "rolardados", desc: "" },
            { cmd: "d20", desc: "" },
            { cmd: "verdadeoudesafio", desc: "" },
            { cmd: "voceprefere", desc: "" },
            { cmd: "nomefantasia", desc: "" },
            { cmd: "nomereino", desc: "" },
            { cmd: "batalha", desc: "" },
            { cmd: "dano", desc: "" },
            { cmd: "megasena", desc: "" },
            { cmd: "lotofacil", desc: "" },
            { cmd: "roletacores", desc: "" },
            { cmd: "roletanumeros", desc: "" },
            { cmd: "desafio24h", desc: "" },
            { cmd: "missaodiaria", desc: "" },
        ]
    },
    {
        emoji: "🌨️", nome: "bot", cor: "💙",
        comandos: [
            { cmd: "setprefixo", desc: "" },
            { cmd: "reiniciar", desc: "" },
            { cmd: "botoff", desc: "" },
            { cmd: "boton", desc: "" },
            { cmd: "uptime", desc: "" },
            { cmd: "versao", desc: "" },
            { cmd: "status", desc: "" },
            { cmd: "criador", desc: "" },
            { cmd: "bug", desc: "" },
            { cmd: "avaliar", desc: "" },
            { cmd: "subbot", desc: "" },
            { cmd: "meussubbots", desc: "" },
            { cmd: "delsubbot", desc: "" },
            { cmd: "doar", desc: "" },
            { cmd: "parceria", desc: "" },
            { cmd: "grupos", desc: "" },
            { cmd: "comandostotal", desc: "" },
            { cmd: "creditos", desc: "" }
        ]
    },
    {
        emoji: "💎", nome: "vip", cor: "💙",
        comandos: [
            { cmd: "vip", desc: "" },
            { cmd: "planosvip", desc: "" },
            { cmd: "addvip", desc: "" },
            { cmd: "delvip", desc: "" },
            { cmd: "vips", desc: "" },
            { cmd: "beneficiosvip", desc: "" },
            { cmd: "indicarvip", desc: "" },
            { cmd: "vipsuporte", desc: "" }
        ]
    },
    {
        emoji: "🌀", nome: "aluguel", cor: "💙",
        comandos: [
            { cmd: "alugar", desc: "" },
            { cmd: "planosaluguel", desc: "" },
            { cmd: "statusaluguel", desc: "" },
            { cmd: "addaluguel", desc: "" },
            { cmd: "delaluguel", desc: "" },
            { cmd: "beneficiosaluguel", desc: "" },
            { cmd: "suportealuguel", desc: "" },
            { cmd: "renovaraluguel", desc: "" }
        ]
    },
    {
        emoji: "🐾", nome: "sistemas (economia, xp & mais)", cor: "💙",
        comandos: [
            { cmd: "perfil", desc: "" },
            { cmd: "apelido", desc: "" },
            { cmd: "ranking", desc: "" },
            { cmd: "daily", desc: "" },
            { cmd: "saldo", desc: "" },
            { cmd: "xp", desc: "" },
            { cmd: "modo-ios", desc: "" },
            { cmd: "modo-adr", desc: "" },
            { cmd: "canal", desc: "" },
            { cmd: "trabalhar", desc: "" },
            { cmd: "roubar", desc: "" },
            { cmd: "apostar", desc: "" },
            { cmd: "transferir", desc: "" },
            { cmd: "loja", desc: "" },
            { cmd: "comprar", desc: "" },
            { cmd: "inventario", desc: "" },
            { cmd: "conquistas", desc: "" },
            { cmd: "nivel", desc: "" },
            { cmd: "patente", desc: "" },
            { cmd: "bonussemanal", desc: "" },
            { cmd: "caixamisteriosa", desc: "" },
            { cmd: "comparar", desc: "" },
            { cmd: "definirmeta", desc: "" },
            { cmd: "vermeta", desc: "" },
            { cmd: "presentear", desc: "" },
            { cmd: "estatisticaseconomia", desc: "" },
            { cmd: "rankingsaldo", desc: "" },
            { cmd: "rankingxp", desc: "" },
            { cmd: "resetarinventario", desc: "" },
            { cmd: "venderitem", desc: "" }
        ]
    },
    {
        emoji: "🎣", nome: "pesca", cor: "💙",
        comandos: [
            { cmd: "pescar", desc: "" },
            { cmd: "pesca", desc: "" },
            { cmd: "lojapesca", desc: "" },
            { cmd: "comprarvara", desc: "" },
            { cmd: "comprarisca", desc: "" },
            { cmd: "equiparvara", desc: "" },
            { cmd: "localpesca", desc: "" },
            { cmd: "bagpesca", desc: "" },
            { cmd: "venderpeixe", desc: "" },
            { cmd: "rankingpesca", desc: "" },
            { cmd: "painelpesca", desc: "" }
        ]
    },
    {
        emoji: "⚓", nome: "outros", cor: "💙",
        comandos: [
            { cmd: "menu", desc: "" },
            { cmd: "oi", desc: "" },
            { cmd: "sobre", desc: "" },
            { cmd: "curiosidade", desc: "" },
            { cmd: "prefixo", desc: "" },
            { cmd: "clima", desc: "" },
            { cmd: "suicidio", desc: "" },
            { cmd: "afk", desc: "" },
            { cmd: "desafk", desc: "" },
            { cmd: "hora", desc: "" },
            { cmd: "data", desc: "" },
            { cmd: "sortedodia", desc: "" },
            { cmd: "diadasemana", desc: "" },
            { cmd: "semanadoano", desc: "" },
            { cmd: "gerarid", desc: "" },
            { cmd: "estatisticasbot", desc: "" },
            { cmd: "proximoferiado", desc: "" },
            { cmd: "horamundo", desc: "" },
            { cmd: "faltapara", desc: "" },
            { cmd: "dataextenso", desc: "" },
            { cmd: "idadeanimal", desc: "" },
            { cmd: "tempoonline", desc: "" },
            { cmd: "progresso", desc: "" },
            { cmd: "relogio", desc: "" },
            { cmd: "nomerua", desc: "" },
            { cmd: "apelidopet", desc: "" },
            { cmd: "frasedodia", desc: "" },
            { cmd: "semanasrestantesano", desc: "" },
            { cmd: "diasrestantesano", desc: "" },
            { cmd: "estacaodoano", desc: "" },
            { cmd: "horabrasilia", desc: "" },
            { cmd: "quantosdias", desc: "" },
            { cmd: "mesatual", desc: "" },
            { cmd: "anobissexto", desc: "" },
            { cmd: "horaformatada", desc: "" },
            { cmd: "diadomes", desc: "" },
            { cmd: "trimestre", desc: "" },
            { cmd: "semestre", desc: "" },
            { cmd: "nomedomes", desc: "" },
            { cmd: "diadasemanadedata", desc: "" },
            { cmd: "horasparaminutos", desc: "" },
            { cmd: "minutosparahoras", desc: "" },
            { cmd: "segundosparahms", desc: "" },
            { cmd: "diasuteis", desc: "" },
            { cmd: "diasatefimano", desc: "" },
            { cmd: "diasdesdeinicioano", desc: "" },
            { cmd: "tempoatemeianoite", desc: "" },
            { cmd: "tempodesdemeianoite", desc: "" },
            { cmd: "idadeemdias", desc: "" },
            { cmd: "idadeemhoras", desc: "" },
            { cmd: "converterfuso", desc: "" },
            { cmd: "horautc", desc: "" },
            { cmd: "diasaniversario", desc: "" },
            { cmd: "aniversariodiasemana", desc: "" },
            { cmd: "numerodestino", desc: "" },
            { cmd: "numeroanjo", desc: "" },
            { cmd: "diasproximaestacao", desc: "" },
            { cmd: "estacaopormes", desc: "" },
            { cmd: "eventohistorico", desc: "" },
            { cmd: "signodomes", desc: "" },
        ]
    },
    {
        emoji: "📏", nome: "conversões extras", cor: "💙",
        comandos: [
            { cmd: "cmparapolegada", desc: "" },
            { cmd: "polegadaparacm", desc: "" },
            { cmd: "mmparacm", desc: "" },
            { cmd: "cmparamm", desc: "" },
            { cmd: "jardaparametro", desc: "" },
            { cmd: "metroparajarda", desc: "" },
            { cmd: "peparapolegada", desc: "" },
            { cmd: "polegadaparape", desc: "" },
            { cmd: "lbparaonca", desc: "" },
            { cmd: "oncaparalb", desc: "" },
            { cmd: "toneladaparakg", desc: "" },
            { cmd: "kgparatonelada", desc: "" },
            { cmd: "xicaraparaml", desc: "" },
            { cmd: "mlparaxicara", desc: "" },
            { cmd: "colherparaml", desc: "" },
            { cmd: "mlparacolher", desc: "" },
            { cmd: "colherchaparaml", desc: "" },
            { cmd: "mlparacolhercha", desc: "" },
            { cmd: "oncaflparalitro", desc: "" },
            { cmd: "litroparaoncafl", desc: "" },
            { cmd: "m2parahectare", desc: "" },
            { cmd: "hectareparam2", desc: "" },
            { cmd: "m2paraacre", desc: "" },
            { cmd: "acreparam2", desc: "" },
            { cmd: "km2parahectare", desc: "" },
            { cmd: "hectareparakm2", desc: "" },
            { cmd: "msparakmh", desc: "" },
            { cmd: "kmhparams", desc: "" },
            { cmd: "noparakmh", desc: "" },
            { cmd: "kmhparano", desc: "" },
            { cmd: "bitparabyte", desc: "" },
            { cmd: "byteparabit", desc: "" },
            { cmd: "byteparakb", desc: "" },
            { cmd: "kbparabyte", desc: "" },
            { cmd: "kbparamb", desc: "" },
            { cmd: "mbparakb", desc: "" },
            { cmd: "mbparagb", desc: "" },
            { cmd: "gbparamb", desc: "" },
            { cmd: "gbparatb", desc: "" },
            { cmd: "tbparagb", desc: "" },
            { cmd: "diaparahora", desc: "" },
            { cmd: "horaparadia", desc: "" },
            { cmd: "semanaparadia", desc: "" },
            { cmd: "diaparasemana", desc: "" },
            { cmd: "mesparadia", desc: "" },
            { cmd: "diaparames", desc: "" },
            { cmd: "anoparadia", desc: "" },
            { cmd: "diaparaano", desc: "" },
            { cmd: "anoparames", desc: "" },
            { cmd: "mesparaano", desc: "" },
            { cmd: "barparaatm", desc: "" },
            { cmd: "atmparabar", desc: "" },
            { cmd: "barparapsi", desc: "" },
            { cmd: "psiparabar", desc: "" },
            { cmd: "atmparapsi", desc: "" },
            { cmd: "psiparaatm", desc: "" },
            { cmd: "joulesparacalorias", desc: "" },
            { cmd: "caloriasparajoules", desc: "" },
            { cmd: "kwhparajoules", desc: "" },
            { cmd: "joulesparakwh", desc: "" },
            { cmd: "caloriasparakcal", desc: "" },
            { cmd: "kcalparacalorias", desc: "" },
            { cmd: "wattparacv", desc: "" },
            { cmd: "cvparawatt", desc: "" },
            { cmd: "wattparahp", desc: "" },
            { cmd: "hpparawatt", desc: "" },
            { cmd: "kwparahp", desc: "" },
            { cmd: "hpparakw", desc: "" },
            { cmd: "kmlparampg", desc: "" },
            { cmd: "mpgparakml", desc: "" },
            { cmd: "milhaparakm", desc: "" },
            { cmd: "celsiusparakelvin", desc: "" },
            { cmd: "kelvinparacelsius", desc: "" },
            { cmd: "fahrenheitparakelvin", desc: "" },
            { cmd: "kelvinparafahrenheit", desc: "" }
        ]
    },
    {
        emoji: "🔡", nome: "texto extra", cor: "💙",
        comandos: [
            { cmd: "textopequeno", desc: "" },
            { cmd: "textomiudo", desc: "" },
            { cmd: "textoinvertido", desc: "" },
            { cmd: "zalgo", desc: "" },
            { cmd: "vogais", desc: "" },
            { cmd: "semvogais", desc: "" },
            { cmd: "contarmaiusculas", desc: "" },
            { cmd: "contarminusculas", desc: "" },
            { cmd: "contardigitos", desc: "" },
            { cmd: "inverterpalavras", desc: "" },
            { cmd: "comecacom", desc: "" },
            { cmd: "terminacom", desc: "" }
        ]
    },
    {
        emoji: "🧮", nome: "calculadoras extras", cor: "💙",
        comandos: [
            { cmd: "areatriangulo", desc: "" },
            { cmd: "areacirculo", desc: "" },
            { cmd: "areaquadrado", desc: "" },
            { cmd: "arearetangulo", desc: "" },
            { cmd: "perimetroretangulo", desc: "" },
            { cmd: "volumecubo", desc: "" },
            { cmd: "volumeesfera", desc: "" },
            { cmd: "hipotenusa", desc: "" },
            { cmd: "jurossimples", desc: "" },
            { cmd: "juroscompostos", desc: "" },
            { cmd: "gorjeta", desc: "" },
            { cmd: "dividiraconta", desc: "" },
            { cmd: "desconto", desc: "" },
            { cmd: "aumentopercentual", desc: "" },
            { cmd: "media", desc: "" },
            { cmd: "mediana", desc: "" },
            { cmd: "moda", desc: "" },
            { cmd: "fibonacci", desc: "" },
            { cmd: "tempoviagem", desc: "" }
        ]
    },
    {
        emoji: "🗓️", nome: "data & hora extra", cor: "💙",
        comandos: [
            { cmd: "quantofaltanatal", desc: "" },
            { cmd: "quantofaltaanonovo", desc: "" },
            { cmd: "quantofaltapascoa", desc: "" },
            { cmd: "quantofaltacarnaval", desc: "" },
            { cmd: "diadoano", desc: "" },
            { cmd: "idadeemminutos", desc: "" },
            { cmd: "idadeemsemanas", desc: "" },
            { cmd: "idadeemsegundos", desc: "" }
        ]
    },
    {
        emoji: "🎰", nome: "sorte extra", cor: "💙",
        comandos: [
            { cmd: "sortearemoji", desc: "" },
            { cmd: "sortearsigno", desc: "" },
            { cmd: "numeroprimoaleatorio", desc: "" }
        ]
    },
    {
        emoji: "🔯", nome: "zodíaco extra", cor: "💙",
        comandos: [
            { cmd: "pedranascimento", desc: "" },
            { cmd: "cordosigno", desc: "" },
            { cmd: "planetaregente", desc: "" },
            { cmd: "flordosigno", desc: "" }
        ]
    },
    {
        emoji: "🆕", nome: "sistemas novos", cor: "💙",
        comandos: [
            { cmd: "addlembrete", desc: "" },
            { cmd: "meuslembretes", desc: "" },
            { cmd: "cancelarlembrete", desc: "" },
            { cmd: "addtarefa", desc: "" },
            { cmd: "minhastarefas", desc: "" },
            { cmd: "concluirtarefa", desc: "" },
            { cmd: "apagartarefa", desc: "" },
            { cmd: "limpartarefas", desc: "" },
            { cmd: "addiario", desc: "" },
            { cmd: "verdiario", desc: "" },
            { cmd: "apagardiario", desc: "" },
            { cmd: "criarguilda", desc: "" },
            { cmd: "guilda", desc: "" },
            { cmd: "entrarguilda", desc: "" },
            { cmd: "sairguilda", desc: "" },
            { cmd: "membrosguilda", desc: "" },
            { cmd: "topguildas", desc: "" },
            { cmd: "lojatitulos", desc: "" },
            { cmd: "comprartitulo", desc: "" },
            { cmd: "meustitulos", desc: "" },
            { cmd: "equipartitulo", desc: "" },
            { cmd: "addnota", desc: "" },
            { cmd: "notasgrupo", desc: "" },
            { cmd: "apagarnota", desc: "" }
        ]
    },
    {
        emoji: "🛠️", nome: "dev extra", cor: "💙",
        comandos: [
            { cmd: "jsonformatar", desc: "" },
            { cmd: "jsonvalidar", desc: "" },
            { cmd: "gerarlorem", desc: "" },
            { cmd: "ordenarlinhas", desc: "" },
            { cmd: "numerarlinhas", desc: "" },
            { cmd: "removerduplicadas", desc: "" }
        ]
    },
    {
        emoji: "ℹ️", nome: "grupo info extra", cor: "💙",
        comandos: [
            { cmd: "totalmembros", desc: "" },
            { cmd: "totaladmins", desc: "" },
            { cmd: "idgrupo", desc: "" },
            { cmd: "donogrupo", desc: "" },
            { cmd: "datacriacaogrupo", desc: "" }
        ]
    },
    {
        emoji: "🎨", nome: "geradores extra", cor: "💙",
        comandos: [
            { cmd: "fraseboanoite", desc: "" },
            { cmd: "fraseamizade", desc: "" },
            { cmd: "frasesuperacao", desc: "" },
            { cmd: "frasesarcastica", desc: "" },
            { cmd: "frasereflexiva", desc: "" },
            { cmd: "cantada", desc: "" },
            { cmd: "desculpa", desc: "" },
            { cmd: "nomedebebe", desc: "" },
            { cmd: "nomedegato", desc: "" },
            { cmd: "nomedecachorro", desc: "" },
            { cmd: "titulodefilme", desc: "" },
            { cmd: "piadaanimais", desc: "" },
            { cmd: "piadaprogramador", desc: "" },
            { cmd: "piadaescola", desc: "" },
            { cmd: "piadatrabalho", desc: "" },
            { cmd: "curiosidadeoceano", desc: "" },
            { cmd: "curiosidademusica", desc: "" },
            { cmd: "curiosidadeesporte", desc: "" },
            { cmd: "curiosidadealimentacao", desc: "" },
            { cmd: "receitadoce", desc: "" },
            { cmd: "receitavegana", desc: "" },
            { cmd: "receitainternacional", desc: "" },
            { cmd: "dicaprodutividade", desc: "" },
            { cmd: "dicaestudo", desc: "" },
            { cmd: "perguntapraconhecer", desc: "" },
            { cmd: "boavibe", desc: "" }
        ]
    },
];

CATEGORIAS.push(...require("../SISTEMAS/lote3/index.js").CATEGORIAS_MENU);
CATEGORIAS.push(...require("../SISTEMAS/casesia.js").CATEGORIAS_MENU);
const CATEGORIAS_PRINCIPAIS = CATEGORIAS.filter(c => c.grupo !== "rpg");

const ALIASES_EXTRA = {
    postarstatus: ["poststatus", "statusgp", "pstatus"],
    menu: ["nejire", "help", "ajuda"],
    oi: ["ola", "olá"],
    sobre: ["quemsoueu"],
    curiosidade: ["fato", "curiosa"],
    perfil: ["meuperfil"],
    apelido: ["nickname"],
    ranking: ["top"],
    sticker: ["s", "figurinha"],
    subbot: ["criarsubbot"],
    meussubbots: ["subbots"],
    delsubbot: ["removersubbot"],
    ban: ["kick", "remover"],
    "8ball": ["bola8"],
    gerarnick: ["nickaleatorio"],
    mutar: ["mute"],
    desmutar: ["unmute"],
    aviso: ["avisar"],
    apagar: ["del"],
    marcartodos: ["all"],
    frase: ["motivacional"],
    moeda: ["cara-coroa"],
    reverso: ["inverter"],
    comandostotal: ["totalcomandos"],
    transferir: ["pagar"],
    baixar: ["dl", "download"],
    cubo3d: ["cubo"],
    cubo3dgif: ["cubogif"],
    cuborubik: ["cubomagico"],
    cubodado: ["dado3d"],
    take: ["rename", "renomear"],
    tovid: ["togif"],
    scircle: ["scirculo", "sredonda"],
    scrop: ["squadrada"],
    sfull: ["sesticar"],
    backup: ["backupbot"]
};

function todosComandos() {
    const nomes = [];
    for (const cat of CATEGORIAS) {
        for (const c of cat.comandos) {
            nomes.push(c.cmd);
            if (ALIASES_EXTRA[c.cmd]) nomes.push(...ALIASES_EXTRA[c.cmd]);
        }
    }
    return [...new Set(nomes)];
}

function slugCategoria(nome) {
    return String(nome)
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "");
}

const SLUG_CURTO = {
    "dono": "dono",
    "admin": "admin",
    "boas-vindas": "boasvindas",
    "figurinhas": "figurinhas",
    "download": "download",
    "ia & diversão": "ia",
    "utilidades": "utilidades",
    "detetive": "detetive",
    "jogos & sorte": "jogos",
    "bot": "bot",
    "vip": "vip",
    "aluguel": "aluguel",
    "sistemas (economia, xp & mais)": "sistemas",
    "pesca": "pesca",
    "outros": "outros",
    "minecraft rpg": "minecraft",
    "simulador de vida": "vida",
    "miraculous rpg": "miraculous",
    "fantasia rpg": "fantasia"
};

const VISUAL_CATEGORIA = {
    "dono": { rotulo: "dono", desc: "controle total do bot" },
    "admin": { rotulo: "admin", desc: "gerencie o grupo" },
    "boas-vindas": { rotulo: "boas-vindas", desc: "entrada e saida de membros" },
    "figurinhas": { rotulo: "figurinhas", desc: "crie e converta figurinhas" },
    "download": { rotulo: "downloads", desc: "baixe conteudos" },
    "ia & diversão": { rotulo: "ia & diversão", desc: "brincadeiras e curiosidades" },
    "utilidades": { rotulo: "utilidades", desc: "ferramentas do dia a dia" },
    "detetive": { rotulo: "detetive", desc: "RPG de investigação com casos completos" },
    "jogos & sorte": { rotulo: "jogos & sorte", desc: "sorteios e desafios" },
    "bot": { rotulo: "bot", desc: "status e configuracoes" },
    "vip": { rotulo: "vip", desc: "planos e beneficios" },
    "aluguel": { rotulo: "aluguel", desc: "alugue o bot" },
    "sistemas (economia, xp & mais)": { rotulo: "economia & xp", desc: "perfil, saldo, loja e ranking" },
    "pesca": { rotulo: "pesca", desc: "pesque, venda e evolua" },
    "outros": { rotulo: "outros", desc: "hora, data e extras" },
    "minecraft rpg": { rotulo: "minecraft rpg", desc: "minere, lute e derrote o dragão do end" },
    "simulador de vida": { rotulo: "simulador de vida", desc: "trabalhe, estude, namore e evolua" },
    "miraculous rpg": { rotulo: "miraculous rpg", desc: "transforme-se e salve paris das akumas" },
    "fantasia rpg": { rotulo: "fantasia rpg", desc: "classes, magias, masmorras e dragões" },
    "cases ia": { rotulo: "cases ia", desc: "comandos criados pela ia" }
};

const RPGS_MENU = () => CATEGORIAS.filter(c => c.grupo === "rpg");

function slugCurto(nome) {
    return SLUG_CURTO[nome] || slugCategoria(nome);
}

function visualCategoria(cat) {
    return VISUAL_CATEGORIA[cat.nome] || {
        rotulo: cat.nome,
        desc: `${cat.comandos.length} comando${cat.comandos.length === 1 ? "" : "s"}`
    };
}

function categoriaPorSlug(slug) {
    const alvo = String(slug || "").toLowerCase();
    return CATEGORIAS.find(c => slugCategoria(c.nome) === alvo || slugCurto(c.nome) === alvo) || null;
}

const ORNAMENTO = "𓆩🩵𓆪";
const ONDA_AESTHETIC = "𓇼 𓂃𓈒𓏸 💙 𓏸𓈒𓂃 𓇼";

function secoesZeroCategorias(prefix) {
    return [{
        titulo: `‧₊˚ ${ORNAMENTO} ${titular("menus")} ${ORNAMENTO} ˚₊‧`,
        destaque: `˖ ࣪⊹ ${miudo("escolha um")} ⊹࣪ ˖`,
        linhas: CATEGORIAS_PRINCIPAIS.map(cat => {
            const v = visualCategoria(cat);
            return {
                cabecalho: `ᯓ★ ${titular(v.rotulo)}`,
                titulo: `‧₊˚ ${cat.emoji} ${titular(v.rotulo)} ₊˚⊹`,
                descricao: `${ORNAMENTO} ${frase(v.desc)} ${ORNAMENTO}`,
                id: `${prefix}menucat_${slugCurto(cat.nome)}`
            };
        })
    }];
}

function secoesZeroMiniGames(prefix) {
    const secoes = [{
        titulo: `‧₊˚ 🎮 ${titular("rpgs")} 🎮 ˚₊‧`,
        destaque: `˖ ࣪⊹ ${miudo("escolha um")} ⊹࣪ ˖`,
        linhas: [
            {
                cabecalho: `𓎩 ${titular("pesca")} 𓐐`,
                titulo: `‧₊˚ 🎣 ${titular("rpg de pesca")} ₊˚⊹`,
                descricao: `${ORNAMENTO} ${frase("pesque e divirta-se")} ${ORNAMENTO}`,
                id: `${prefix}pesca`
            },
            ...RPGS_MENU().map(cat => {
                const v = visualCategoria(cat);
                return {
                    cabecalho: `𓎩 ${titular("rpg")} 𓐐`,
                    titulo: `‧₊˚ ${cat.emoji} ${titular(v.rotulo)} ₊˚⊹`,
                    descricao: `${ORNAMENTO} ${frase(v.desc)} ${ORNAMENTO}`,
                    id: `${prefix}menucat_${slugCurto(cat.nome)}`
                };
            })
        ]
    }];

    const jogos = categoriaPorSlug("jogos");
    if (jogos) {
        secoes.push({
            titulo: `‧₊˚ 🎲 ${titular("jogos & sorte")} 🎲 ˚₊‧`,
            linhas: jogos.comandos.map(c => ({
                cabecalho: `🎲 ${titular("jogos & sorte")}`,
                titulo: `${prefix}${c.cmd}`,
                descricao: c.desc,
                id: `${prefix}${c.cmd}`
            }))
        });
    }

    return secoes;
}

function textoMenuZero(prefix, extra = {}) {
    const { status = "free user", uptime = "" } = extra;
    const emojiStatus = { "dono": " 👑", "vip": " 💎" }[status] || "";

    const linha = (rotulo, valor) =>
        `${ORNAMENTO} ${titular(rotulo)}${" ".repeat(Math.max(1, 8 - rotulo.length))}» ${valor}`;

    return [
        `𓆩🩵𓆪 ‧₊˚ ✦ ${titular("system nejire")} ✦ ˚₊‧ 𓆩🩵𓆪`,
        ``,
        linha("criador", config.nomeDono),
        linha("bot", config.nome),
        linha("versao", config.versao),
        linha("status", `${titular(status)}${emojiStatus}`),
        ...(uptime ? [linha("uptime", uptime)] : []),
        linha("prefixo", `[ ${prefix} ]`),
        ``,
        `˖ ࣪⊹ 🫐 ${miudo("use o prefixo")} 🫐 ⊹࣪ ˖`,
        ONDA_AESTHETIC,
        ``
    ].join("\n");
}

function menuNejireIOS(prefix, sender, extra = {}) {
    const { status = "free user", uptime = "" } = extra;
    const totalCmds = todosComandos().length;
    const jogos = categoriaPorSlug("jogos");

    const linhas = [
        `⊹˚₊‧ ${ORNAMENTO} ‧₊˚⊹`,
        `╭──── ⋆⋆ ⟡ ⋆⋆ ────╮`,
        `   𝑺𝒀𝑺𝑻𝑬𝑴  𝑵𝑬𝑱𝑰𝑹𝑬`,
        `╰──── ⋆⋆ ⟡ ⋆⋆ ────╯`,
        ``,
        `🍎 ${pequeno("modo ios")} › ${pequeno("menu em texto")}`,
        `🩵 ${totalCmds} comandos em ${CATEGORIAS.length} categorias`,
        ``,
        `┄┄┄ ✦ ${pequeno("informações")} ✦ ┄┄┄`,
        `💎 ${pequeno("criador")} › ${config.nomeDono}`,
        `🔵 ${pequeno("bot")} › ${config.nome}`,
        `🫐 ${pequeno("versão")} › ${config.versao}`,
        `💠 ${pequeno("status")} › ${titular(status)}`,
        ...(uptime ? [`🌊 ${pequeno("uptime")} › ${uptime}`] : []),
        `📋 ${pequeno("prefixo")} › [ ${prefix} ]`,
        `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄`,
        ``,
        tituloCategoria("🌊", "menus cat")
    ];

    for (const cat of CATEGORIAS_PRINCIPAIS) {
        const v = visualCategoria(cat);
        const n = cat.comandos.length;
        linhas.push(`│ ✧ ${prefix}menucat_${slugCurto(cat.nome)}`);
        linhas.push(`│   ${cat.emoji} ${titular(v.rotulo)} • ${n} cmd${n === 1 ? "" : "s"}`);
    }
    linhas.push(fecharCategoria(), ``);

    linhas.push(tituloCategoria("🎲", "mini games"));
    linhas.push(`│ ✧ ${prefix}pesca`);
    linhas.push(`│   🎣 ${titular("rpg de pesca")}`);
    for (const cat of RPGS_MENU()) {
        linhas.push(`│ ✧ ${prefix}menucat_${slugCurto(cat.nome)}`);
        linhas.push(`│   ${cat.emoji} ${titular(visualCategoria(cat).rotulo)} • ${cat.total ?? cat.comandos.length} cmds`);
    }
    if (jogos) {
        linhas.push(`│ ✧ ${prefix}menucat_${slugCurto(jogos.nome)}`);
        linhas.push(`│   🎲 ${titular("jogos & sorte")} • ${jogos.comandos.length} cmds`);
    }
    linhas.push(fecharCategoria(), ``);

    linhas.push(tituloCategoria("🩵", "atalhos"));
    linhas.push(`│ ✧ ${prefix}alugar`, `│   🌀 ${titular("alugar o bot")}`);
    linhas.push(`│ ✧ ${prefix}planosvip`, `│   💎 ${titular("planos vip")}`);
    linhas.push(`│ ✧ ${prefix}perfil`, `│   🌊 ${titular("meu perfil")}`);
    linhas.push(`│ ✧ ${prefix}prefixo`, `│   📋 ${titular("meu prefixo")}`);
    linhas.push(`│ ✧ ${prefix}sobre`, `│   🐚 ${titular("sobre a nejire")}`);
    linhas.push(fecharCategoria(), ``);

    linhas.push(
        `˚₊‧꒰ঌ ${pequeno("como usar")} ໒꒱‧₊˚`,
        `manda o comando da categoria, tipo`,
        `*${prefix}menucat_download*, que eu`,
        `mostro todos os comandos dela! 💙`,
        ``,
        `🤖 quer botões de volta? *${prefix}modo-adr*`,
        ``,
        `${LINHA}`,
        `𝘷${config.versao}`
    );

    return linhas.join("\n");
}

function avisoModoIOS(prefix) {
    const exemplos = ["download", "figurinhas", "pesca"]
        .map(slug => categoriaPorSlug(slug))
        .filter(Boolean)
        .map(cat => `│ ✧ ${prefix}menucat_${slugCurto(cat.nome)}\n│   ${cat.emoji} ${titular(visualCategoria(cat).rotulo)}`);

    return [
        `╭─❍ 🍎 ${pequeno("modo ios ativado")} ❍─╮`,
        `│ ✅ pronto! agora tudo vem em`,
        `│    texto, sem botão nenhum`,
        `╰──────────────────╯`,
        ``,
        `⚠️ ${pequeno("aviso")}`,
        `os botões e listas não abrem direito`,
        `no iphone, então aqui o menu vira uma`,
        `lista de comandos. cada categoria tem o`,
        `seu próprio *menucat*, que mostra tudo`,
        `que tem dentro dela!`,
        ``,
        tituloCategoria("🌊", "como navegar"),
        `│ ✧ ${prefix}menu`,
        `│   🐚 menu principal, já com o`,
        `│   comando de cada categoria`,
        ...exemplos,
        fecharCategoria(),
        ``,
        `💡 no lugar de "download" vale o nome`,
        `   que aparecer no ${prefix}menu`,
        `🤖 ${prefix}modo-adr → volta pros botões`
    ].join("\n");
}

function secoesPrincipalBotao(prefix) {
    return [{
        titulo: `🌊 ${pequeno("categorias")}`,
        linhas: CATEGORIAS_PRINCIPAIS.map(cat => ({
            titulo: `${cat.emoji} ${pequeno(cat.nome)}`,
            descricao: `${cat.comandos.length} comando${cat.comandos.length === 1 ? "" : "s"}`,
            id: `${prefix}menucat_${slugCategoria(cat.nome)}`
        }))
    }];
}

function secoesMenuCompleto(prefix) {
    const secoes = [...secoesPrincipalBotao(prefix)];

    secoes.push({
        titulo: `🎮 ${pequeno("rpgs")}`,
        linhas: [
            { titulo: "🎣 rpg de pesca", descricao: "pesque, venda e evolua", id: `${prefix}pesca` },
            ...RPGS_MENU().map(cat => ({
                titulo: `${cat.emoji} ${pequeno(cat.nome)}`,
                descricao: `${cat.total ?? cat.comandos.length} comandos`,
                id: `${prefix}menucat_${slugCurto(cat.nome)}`
            }))
        ]
    });

    const catJogos = categoriaPorSlug(slugCategoria("jogos & sorte"));
    if (catJogos) {
        secoes.push({
            titulo: `🎲 ${pequeno("mini games")}`,
            linhas: catJogos.comandos.map(c => ({
                titulo: `${prefix}${c.cmd}`,
                descricao: c.desc,
                id: `${prefix}${c.cmd}`
            }))
        });
    }

    secoes.push({
        titulo: `🩵 ${pequeno("atalhos rápidos")}`,
        linhas: [
            { titulo: "🌀 alugar o bot", descricao: "conhecer os planos de aluguel", id: `${prefix}alugar` },
            { titulo: "💎 ver planos vip", descricao: "benefícios de quem é vip", id: `${prefix}planosvip` },
            { titulo: "📋 meu prefixo", descricao: "ver e copiar o prefixo atual", id: `${prefix}prefixo` },
            { titulo: "🐚 sobre a nejire", descricao: "quem eu sou e o que eu faço", id: `${prefix}sobre` },
            { titulo: "🌊 meu perfil", descricao: "pontos, saldo e xp", id: `${prefix}perfil` }
        ]
    });

    return secoes;
}

function menuNejireCurto(prefix, sender) {
    const numero = sender?.split("@")[0] || "";
    const totalCmds = todosComandos().length;

    return [
        `╭─❍ ⋆⋆ *𝑺𝒀𝑺𝑻𝑬𝑴 𝑵𝑬𝑱𝑰𝑹𝑬* ⋆⋆ ❍─╮`,
        `│ 💠 oiii, @${numero}!!`,
        `│ 💠 escolhe uma categoria`,
        `│    aqui embaixo que eu te`,
        `│    mostro os comandos dela!`,
        `╰────────────────────╯`,
        ``,
        `✨ ${totalCmds} comandos, ${CATEGORIAS.length} categorias — tudo organizadinho 🐚`,
        `${LINHA}`,
        `𝘷${config.versao}`
    ].join("\n");
}

function menuNejireCard(prefix, sender, extra = {}) {
    const { status = "ativa ✅", uptime = "" } = extra;
    const numero = sender?.split("@")[0] || "";
    const totalCmds = todosComandos().length;

    const linhas = [
        `⊹˚₊‧ 𓆩🐚𓆪 ‧₊˚⊹`,
        `╭──── ⋆⋆ ⟡ ⋆⋆ ────╮`,
        `   ${pequeno("𝑺𝒀𝑺𝑻𝑬𝑴")}  𝑵𝑬𝑱𝑰𝑹𝑬`,
        `╰──── ⋆⋆ ⟡ ⋆⋆ ────╯`,
        ``,
        `🔵 oiii, @${numero}!!`,
        `🩵 ${totalCmds} comandos te esperando`,
        `   aqui embaixo, tudo azulzinho`,
        `   e organizadinho pra você 💙`,
        ``,
        `┄┄┄ ✦ ${pequeno("informações")} ✦ ┄┄┄`,
        `💎 ${pequeno("criador")} › ${config.nomeDono}`,
        `🔵 ${pequeno("bot")} › ${config.nome}`,
        `🫐 ${pequeno("versão")} › ${config.versao}`,
        `💠 ${pequeno("status")} › ${status}`
    ];

    if (uptime) linhas.push(`🌊 ${pequeno("uptime")} › ${uptime}`);

    linhas.push(
        `📋 ${pequeno("prefixo")} › [ ${prefix} ]`,
        `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄`,
        ``,
        `˚₊‧꒰ঌ ${pequeno("toca no botão aqui embaixo pra abrir o menu completo")} ໒꒱‧₊˚`,
        `⊹˚₊‧ 𓆩💙𓆪 ‧₊˚⊹`
    );

    return linhas.join("\n");
}

function menuCategoriaTexto(prefix, cat) {
    let corpo = `${tituloCategoria(cat.emoji, cat.nome)}\n`;
    if (cat.secoes) {
        for (const sec of cat.secoes) {
            corpo += `│\n│ ${sec.titulo}\n`;
            for (const c of sec.comandos) {
                corpo += `│ ✧ ${prefix}${c.cmd}\n`;
                if (c.desc) corpo += `│   ${c.desc}\n`;
            }
        }
        corpo += `${fecharCategoria()}\n\n`;
        corpo += `𓆩💙𓆪 ${miudo("manda")} ${prefix}menu ${miudo("pra voltar")}\n   ${miudo("pra tela principal")}!\n${ONDA_AESTHETIC}`;
        return corpo;
    }
    for (const c of cat.comandos) {
        corpo += `│ ✧ ${prefix}${c.cmd}\n`;
        if (c.desc) corpo += `│   ${c.desc}\n`;
    }
    corpo += `${fecharCategoria()}\n\n`;
    corpo += `𓆩💙𓆪 ${miudo("manda")} ${prefix}menu ${miudo("pra voltar")}\n   ${miudo("pra tela principal")}!\n${ONDA_AESTHETIC}`;
    return corpo;
}

function secoesBotao(prefix) {
    return CATEGORIAS.map(cat => ({
        titulo: `${cat.emoji} ${pequeno(cat.nome)}`,
        linhas: cat.comandos.map(c => ({
            titulo: `${prefix}${c.cmd}`,
            descricao: c.desc,
            id: `${prefix}${c.cmd}`
        }))
    }));
}

function menuNejireEntrada(prefix, sender) {
    const numero = sender?.split("@")[0] || "";
    const totalCmds = todosComandos().length;

    let corpo = `╭─❍ ⋆⋆ *𝑺𝒀𝑺𝑻𝑬𝑴 𝑵𝑬𝑱𝑰𝑹𝑬* ⋆⋆ ❍─╮\n`;
    corpo += `│ 💠 oiii, @${numero}!!\n`;
    corpo += `│ 💠 sou a Nejire, deixa eu te\n`;
    corpo += `│    mostrar o que eu sei fazer\n`;
    corpo += `╰────────────────────╯\n\n`;

    corpo += `✨ ${totalCmds} comandos, ${CATEGORIAS.length} categorias — tudo organizadinho 🐚\n\n`;
    corpo += `escolhe uma categoria pra ver os comandos dela:\n\n`;

    for (const cat of CATEGORIAS_PRINCIPAIS) {
        corpo += `${cat.emoji} ${pequeno(cat.nome)} — manda ${prefix}menucat_${slugCategoria(cat.nome)}\n`;
    }

    corpo += `\n${LINHA}\n╰─❍ toda energia, pouca calma ❍─╯\n𝘷${config.versao}`;

    return corpo;
}

function menuNejire(prefix, sender) {
    const numero = sender?.split("@")[0] || "";

    let corpo = `╭─❍ ⋆⋆ *𝑺𝒀𝑺𝑻𝑬𝑴 𝑵𝑬𝑱𝑰𝑹𝑬* ⋆⋆ ❍─╮\n`;
    corpo += `│ 💠 oiii, @${numero}!!\n`;
    corpo += `│ 💠 sou a Nejire, deixa eu te\n`;
    corpo += `│    mostrar o que eu sei fazer\n`;
    corpo += `╰────────────────────╯\n${LINHA}\n\n`;

    for (const cat of CATEGORIAS) {
        corpo += `${tituloCategoria(cat.emoji, cat.nome)}\n`;
        for (const c of cat.comandos) {
            corpo += `│ ✧ ${prefix}${c.cmd}\n`;
            if (c.desc) corpo += `│   ${c.desc}\n`;
        }
        corpo += `${fecharCategoria()}\n\n`;
    }

    corpo += `✨ ei, sabia que cada subbot\n   meu guarda a própria sessão\n   e o próprio banco de dados?\n   curioso, né?? né??\n\n`;
    corpo += `${LINHA}\n╰─❍ toda energia, pouca calma ❍─╯\n𝘷${config.versao}`;

    return corpo;
}

const menuNejireLista = (prefix, subbots) => {
    if (!subbots.length) {
        return `╭─❍ 𝒎𝒆𝒖𝒔 𝒔𝒖𝒃𝒃𝒐𝒕𝒔 ❍─╮
│ ainda não tem nenhum criado!
│ bora fazer o primeiro?
│ usa ${prefix}subbot <numero>
╰──────────────────╯`;
    }

    const linhas = subbots
        .map((s, i) => {
            const numero = s.botNumber
                ? s.botNumber.split("@")[0]
                : (s.phoneNumber || "desconhecido");

            return `│ 💠 ${i + 1}. id: ${s.id}
│    número: ${numero}
│    desde: ${new Date(s.connectedAt || Date.now()).toLocaleString("pt-BR")}`;
        })
        .join("\n│\n");

    return `╭─❍ 𝒎𝒆𝒖𝒔 𝒔𝒖𝒃𝒃𝒐𝒕𝒔 ❍─╮
${linhas}
╰──────────────────╯
usa ${prefix}delsubbot <id> pra
apagar algum deles!`;
};

const respostaNejire = () => {
    return `╭─❍ 𝒒𝒖𝒆𝒎 𝒔𝒐𝒖 𝒆𝒖 ❍─╮
│ 💠 sou a Nejire! inspirada
│    na Nejire Hado, aquela
│    heroína cheia de energia
│    e curiosidade lá de BNHA
│
│ 💙 gosto de perguntar "por
│    quê" umas cinco vezes
│    seguidas e de aprender
│    curiosidade nova
│
│ ✨ aqui dentro eu cuido de
│    admin, figurinha, download,
│    IA, VIP, aluguel, economia
│    e dos meus subbots — tudo
│    separado e organizadinho!
╰────────────────────╯
𝘷${config.versao}`;
};

const cardPerfil = (jid, perfil, prefix = "#", nomePush = null) => {
    const numero = jid?.split("@")[0] || "???";
    const nome = perfil.apelido || nomePush || numero;
    const criadoEm = new Date(perfil.primeiraVez).toLocaleDateString("pt-BR");

    return `╭─❍ 𝒑𝒆𝒓𝒇𝒊𝒍 ❍─╮
│ 💠 ${nome}
│
│ ✨ pontos de curiosidade:
│    ${perfil.pontosCuriosidade || 0}
│
│ 💙 comandos usados:
│    ${perfil.comandosUsados || 0}
│
│ 💰 saldo: ${perfil.saldo || 0} ${config.economia?.moeda || ""}
│ ⭐ xp: ${perfil.xp || 0}
│
│ 🌊 falando comigo desde:
│    ${criadoEm}
╰────────────╯
manda ${config.emojiPrincipal} ${prefix}apelido <nome>
pra trocar como eu te chamo!`;
};

const textoRanking = (top, prefix = "#") => {
    if (!top.length) {
        return `╭─❍ 𝒓𝒂𝒌𝒌𝒊𝒏𝒈 ❍─╮
│ ninguém tem ponto ainda!
│ manda ${prefix}curiosidade e
│ seja a primeira pessoa 💠
╰────────────────╯`;
    }

    const medalhas = ["🥇", "🥈", "🥉"];

    const linhas = top
        .map((u, i) => {
            const numero = u.jid?.split("@")[0] || "???";
            const nome = u.apelido || numero;
            const medalha = medalhas[i] || `${i + 1}.`;
            return `│ ${medalha} ${nome} — ${u.pontosCuriosidade || 0} pts`;
        })
        .join("\n");

    return `╭─❍ 𝒓𝒂𝒏𝒌𝒊𝒏𝒈 𝒅𝒆 𝒄𝒖𝒓𝒊𝒐𝒔𝒊𝒅𝒂𝒅𝒆 ❍─╮
${linhas}
╰──────────────────╯`;
};

const CURIOSIDADES = [
    "os polvos têm três corações e sangue azul! por quê será que ninguém fala mais disso??",
    "o mel nunca estraga — acharam potes de mel com MILHARES de anos ainda bons de comer",
    "um dia em Vênus dura mais que um ano em Vênus! isso não é bagunçado??",
    "borboletas sentem gosto com os pés, olha que curioso",
    "o coração de um camarão fica na cabeça! e o meu tá disparado só de pensar nisso",
    "bananas são levemente radioativas... calma, é bem pouquinho, pode comer sossegado",
    "tem mais estrelas no universo do que grãos de areia em toda a Terra, imagina isso!"
];

module.exports = {
    CATEGORIAS,
    ALIASES_EXTRA,
    todosComandos,
    secoesBotao,
    menuNejire,
    menuNejireEntrada,
    menuNejireLista,
    respostaNejire,
    cardPerfil,
    textoRanking,
    CURIOSIDADES,
    slugCategoria,
    categoriaPorSlug,
    secoesPrincipalBotao,
    secoesMenuCompleto,
    menuNejireCurto,
    menuNejireCard,
    menuCategoriaTexto,
    slugCurto,
    visualCategoria,
    secoesZeroCategorias,
    secoesZeroMiniGames,
    textoMenuZero,
    menuNejireIOS,
    avisoModoIOS
};
