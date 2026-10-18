<div align="center">

# 🩵 System Nejire 4.0

**Bot de WhatsApp em Node.js, feito em cima do Baileys, com identidade azul aesthetic.**

![Node.js](https://img.shields.io/badge/Node.js-18%2B-38C6DC?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Baileys](https://img.shields.io/badge/Baileys-WhatsApp-3276E8?style=for-the-badge&logo=whatsapp&logoColor=white)
![Versão](https://img.shields.io/badge/vers%C3%A3o-4.0-DDF8FF?style=for-the-badge&labelColor=38C6DC&color=DDF8FF&logoColor=black)
![Ofuscado](https://img.shields.io/badge/vers%C3%A3o-ofuscada-3276E8?style=for-the-badge)

[📢 Canal oficial](https://whatsapp.com/channel/0029Vb8rVXsDOQIWsbKuAd34) · [💬 Suporte](https://wa.me/SEUNUMERO)

</div>

> [!CAUTION]
> ### 🔒 Esta é a versão **OFUSCADA** (gratuita)
> O código desta versão está **ofuscado**: dá para rodar, mas **não dá para ler, editar ou aprender com ele** de forma direta.
> A **versão DESOFUSCADA** (código limpo, legível e editável) é **paga**, com o criador. Para comprar ou tirar dúvidas sobre a versão desofuscada, chame o suporte.
>
> 🚫 **É proibido vender, revender ou cobrar** por esta versão. Se você pagou por ela, foi enganado(a).

---

## 📚 Índice

1. [O que é](#-o-que-é)
2. [Novidades da 4.0](#-novidades-da-40)
3. [O que o bot faz](#-o-que-o-bot-faz)
4. [Menus e modos](#-menus-e-modos)
5. [Play com card](#-play-com-card)
6. [Copiar mensagens](#-copiar-mensagens)
7. [Atualizar pelo GitHub](#-atualizar-pelo-github)
8. [Requisitos](#-requisitos)
9. [Instalação](#-instalação)
10. [Primeiro login (pairing code)](#-primeiro-login-pairing-code)
11. [Configuração (`config.json`)](#-configuração-configjson)
12. [Comandos principais](#-comandos-principais)
13. [Áudio do menu](#-áudio-do-menu)
14. [Menu auto](#-menu-auto)
15. [Estrutura do projeto](#-estrutura-do-projeto)
16. [Segurança](#-segurança)
17. [Problemas comuns](#-problemas-comuns)
18. [Versão desofuscada (paga)](#-versão-desofuscada-paga)
19. [Suporte e créditos](#-suporte-e-créditos)

---

## 💙 O que é

O **System Nejire** é um bot de WhatsApp em **Node.js**, feito com a biblioteca **Baileys** (`@systemzero/baileys`), inspirado na Nejire Hado. Todas as respostas seguem a decoração azul aesthetic: fontes miúdas, emojis azuis e molduras.

O login é por **código de pareamento** (sem QR code), então dá para rodar até no Termux.

| 🩵 | 🎮 | 🧠 | 🎬 | 📦 |
|:-:|:-:|:-:|:-:|:-:|
| **1.200+**<br/>comandos | **4**<br/>RPGs completos | **IA**<br/>cria comandos | **Card**<br/>do play | **Update**<br/>pelo GitHub |

---

## 🆕 Novidades da 4.0

| | Novidade | Como usar |
|:-:|---|---|
| 🔀 | **Escolha de modo** na primeira vez que a pessoa usa um comando: modo adr, modo ios ou modo ios2, cada um com a explicação | aparece sozinho (uma vez por pessoa) |
| 📱 | **Modo iOS com paginação**: menu de localização com ◀ voltar, 📂 abrir e avançar ▶ | `×modo-ios` |
| ✨ | **Modo iOS 2**: foto no topo com botões de resposta rápida e a lista "Selecionar" | `×modo-ios2` |
| 🤖 | **Modo adr** (Android): menus com botões e listas | `×modo-adr` |
| 🎬 | **Card do play**: capa, disco de vinil, nome da música, linha do tempo e foto de quem pediu, com revezamento entre o estilo **vinil** e o **clássico** | `×play nome da música` |
| 🎧 | **Play no iOS** com dois botões: 🎵 áudio e 🎬 vídeo | `×play` no iPhone |
| 📋 | **Copiar no privado**: em grupo, a cópia vai para o seu PV, com uma prévia antes do arquivo | responda uma mensagem com `×copiar` |
| 🎨 | **Cada categoria com moldura própria** (o menu principal continua igual) | `×menu` → abra uma categoria |
| ⏳ | **Botões expiram em 10 minutos** depois do menu ser enviado | automático |
| 🔗 | **Opções no menu de comandos**: canal oficial, mini games, alugar bot, site oficial, abrir painel, copiar prefixo e avaliar o menu | dentro de "Menus de Comandos" |
| 📡 | **Canal encaminhado**: o menu sai com o selo de mensagem encaminhada do canal | automático |
| 📇 | **vCard do bot** enviado junto do menu de play | automático |
| ♻️ | **`×update`**: atualiza o bot direto pelo GitHub, com backup antes | `×update` e `×update start` (dono) |

> [!NOTE]
> Os comandos continuam os mesmos das versões anteriores: RPGs, pesca, economia, downloads, figurinhas, cubo 3D, IA, detetive, sub-bots e mais.

---

## ✨ O que o bot faz

| | Área | O que tem |
|:-:|---|---|
| 👑 | **Dono** | broadcast, backup, ligar/desligar comandos, donos, trocar nome/foto/recado, `pcase`, `update` |
| 🫐 | **Admin** | antis (link, figurinha, imagem, vídeo, áudio, documento, trava, fake, canal, bot…), ban, promover, rebaixar, advertências, `postarstatus` |
| 🐚 | **Boas-vindas** | mensagem de entrada e saída de grupo, configurável |
| 🗣️ | **Figurinhas** | criar, converter, cortar, bordas, efeitos, trocar pack e autor |
| 🏊 | **Download** | play (áudio e vídeo), TikTok, Instagram, Spotify, Pinterest, letra, `gitclone` e `npm` em zip |
| 🧊 | **Cubo 3D** | renderizador 3D próprio, gera imagem, vídeo e figurinha |
| 🌊 | **IA e diversão** | IA de conversa, modo AI com memória, memes, frases, curiosidades, geradores |
| 🧩 | **Utilidades** | calculadoras, conversores, texto, data e hora, validadores |
| 🛠️ | **Ferramentas npm** | cards, QR e pix, OCR, PDF, agenda, xadrez, formatadores |
| 🕵️ | **Detetive** | jogo de investigação com casos completos |
| 🎲 | **Jogos e sorte** | quiz, roleta, dados, loteria, cartas, sinuca, forca, jogo da velha |
| 💞 | **Sociais** | namoro e casamento, tinder, zoeira |
| 💎 | **VIP e aluguel** | planos VIP e aluguel do bot para grupos |
| 🐾 | **Sistemas** | economia, XP, ranking, perfil, daily, trabalho, guildas, lembretes, tarefas, diário |
| 🎣 | **Pesca** | jogo de pesca com **mini app web** |
| 🎮 | **RPGs** | **Minecraft RPG**, **Simulador de Vida**, **Miraculous RPG** e **Fantasia RPG** |

<details>
<summary><b>➕ Outros recursos</b></summary>

<br/>

- 🤖 **Sub-bots**: qualquer pessoa pode virar um sub-bot (`×subbot 5511999999999`).
- 🧠 **Modo AI**, **antipv**, **anticall**, **autoler**, **presença** e **autobackup**.
- 🚫 **`×bangp`**: neste grupo o bot só responde o dono.
- 🧪 **`×testarzone`**: testa todos os endpoints da API de uma vez.
- 📦 **Auto-instalação**: o `autoinstall.js` instala sozinho o que estiver faltando ao iniciar.

</details>

---

## 📱 Menus e modos

O bot tem **três modos de menu**. Na primeira vez que alguém usa um comando, o bot mostra os três com a explicação de cada um, e a pessoa escolhe com um botão ou digitando o comando.

| Modo | Comando | Como aparece |
|---|---|---|
| 🤖 **Adr** | `×modo-adr` | menus com botões e listas (Android) |
| 🍎 **iOS** | `×modo-ios` | menu de localização com páginas: ◀ voltar, 📂 abrir e avançar ▶ |
| ✨ **iOS 2** | `×modo-ios2` | foto no topo com botões de resposta rápida e a lista "Selecionar" |

- O **menu principal** tem visual próprio e não muda entre categorias.
- Cada **categoria** (download, figurinhas, pesca, menuadmin…) tem uma **moldura diferente**.
- Os botões de menu **expiram depois de 10 minutos**. Depois disso, o bot avisa para pedir o menu de novo.
- Quem prefere texto puro pode usar o menu em texto no iPhone.

> [!TIP]
> Para ver tudo, mande `×menu`. Para saber o que um comando faz, mande `×info nome-do-comando`.

---

## 🎬 Play com card

O `×play` mostra um **card** da música antes do menu de opções. O card é a **imagem do próprio menu**, então não sai como mensagem separada.

**O que o card tem:**
- 💿 **Estilo vinil**: a capa vira um disco com sulcos, anel de progresso e rótulo "PLAY • tempo".
- 🎞️ **Estilo clássico**: capa de fundo, moldura de play e linha do tempo.
- 🔁 **Revezamento**: um play sai no vinil, o próximo no clássico, e assim por diante.
- 🏷️ **Nome limpo**: títulos como "(Official Video)" ou "[HD]" são tirados automaticamente.
- 👤 **Quem pediu**: foto de perfil e o texto "pedido por <nome>" no canto.
- ✍️ **Marca d'água**: "by Lopes" no canto.

**Opções do play:**
- Em **Android**: menu com botões e lista (áudio, vídeo, letra e mais).
- No **iPhone**: card com dois botões, 🎵 **áudio** e 🎬 **vídeo**.

> [!NOTE]
> Não tem card em `×playvid`, na lista de resultados do `×play2` nem no `×playmenu`. Esses comandos seguem como antes.

---

## 📋 Copiar mensagens

O `×copiar` copia uma mensagem respondida.

- **Em grupo**: a cópia vai para o **seu PV**, primeiro com uma **prévia** (tipo da mensagem e de qual grupo veio), depois o arquivo. No grupo, o bot só reage com 📩.
- **No PV**: a cópia sai no próprio chat.
- **Para outro chat**: só o dono pode informar um destino (`×copiar` com o número ou o link do canal).

---

## ♻️ Atualizar pelo GitHub

O dono pode atualizar o bot sem mexer em arquivo nenhum:

| Comando | O que faz |
|---|---|
| `×update` | compara a versão instalada com a do GitHub e diz se tem atualização |
| `×update start` | faz a atualização em etapas e reinicia o bot |

Na atualização, o bot:
1. Faz um **backup** da versão atual na pasta `backup/`.
2. Baixa o zip da branch no GitHub.
3. Copia os arquivos novos, **sem mexer** em `config.json`, `database/`, `data/`, `auth/`, `session/`, `node_modules/` e `.env`.
4. Atualiza as dependências, se o `package.json` mudou.
5. Reinicia.

> [!IMPORTANT]
> Para o `×update` funcionar, preencha o repositório no `config.json`:
> ```json
> "atualizacao": { "repo": "seuusuario/seurepo", "branch": "main" }
> ```
> O repositório precisa ser **público**, com o projeto na raiz (com `package.json` e `index.js` no topo). Rode o bot com um gerenciador de processos (PM2) para ele voltar sozinho depois do reinício.

---

## 🧾 Requisitos

- ![Node](https://img.shields.io/badge/-Node.js%2018%2B-38C6DC?logo=nodedotjs&logoColor=white) e **npm** (recomendado Node 20+)
- ![ffmpeg](https://img.shields.io/badge/-ffmpeg-3276E8?logo=ffmpeg&logoColor=white) instalado (figurinhas animadas, áudio e vídeo)
- 📱 Um **número de WhatsApp só para o bot** (não use o seu principal)
- 🌐 Internet estável

---

## 🛠️ Instalação

<details open>
<summary><b>🐧 Linux / VPS (Ubuntu, Debian)</b></summary>

```bash
sudo apt update && sudo apt install -y git ffmpeg nodejs npm
git clone https://github.com/seuusuario/System-Nejire.git
cd System-Nejire
npm install
```

</details>

<details>
<summary><b>📱 Termux (Android)</b></summary>

```bash
pkg update && pkg upgrade -y
pkg install -y git nodejs ffmpeg
git clone https://github.com/seuusuario/System-Nejire.git
cd System-Nejire
npm install
```

</details>

<details>
<summary><b>🪟 Windows</b></summary>

1. Instale o [Node.js LTS](https://nodejs.org) e o [Git](https://git-scm.com).
2. Instale o [ffmpeg](https://ffmpeg.org/download.html) e coloque no `PATH`.
3. No terminal:

```bash
git clone https://github.com/seuusuario/System-Nejire.git
cd System-Nejire
npm install
```

</details>

> [!NOTE]
> O `autoinstall.js` roda ao iniciar o bot e instala sozinho o que estiver faltando.

---

## 🔑 Primeiro login (pairing code)

1. Configure o `config.json`, principalmente o **`numeroDono`**.
2. Inicie o bot:

   ```bash
   npm start
   ```

3. O terminal pede o número do bot, com DDI e DDD, só números. Exemplo: `5511999999999`.
4. Aparece um **código de 8 caracteres**.
5. No WhatsApp do bot: **Aparelhos conectados → Conectar um aparelho → Conectar com número de telefone** e digite o código **em até 60 segundos**.
6. Quando aparecer `✅ System Nejire conectada!`, está pronto.

A sessão fica em `sessions/main`. Nas próximas vezes, o bot conecta sozinho.

> [!WARNING]
> Se a sessão quebrar, apague `sessions/main` e faça o pareamento de novo. **Nunca suba `sessions/` para o GitHub**, é o login do bot.

---

## ⚙️ Configuração (`config.json`)

| Campo | Para que serve |
|---|---|
| `nome` | Nome do bot, usado nos menus e rodapés |
| `versao` | Versão exibida (`4.0`) |
| `prefixo` | Prefixo dos comandos (`×`) |
| `numeroDono` | **Seu número**, com DDI e DDD, só números. Libera os comandos de dono |
| `nomeDono` | Seu nome |
| `canal` | `id`, `nome` e `url` do canal do WhatsApp (aparece no menu e no selo de encaminhada) |
| `siteOficial` | Link do site (aparece no menu de opções) |
| `plataforma.padrao` | `android`, `iphone` ou `auto`. Define o menu padrão de quem não escolheu modo |
| `webapp` | `habilitado`, `porta` e `urlPublica` do mini app de pesca. Troque `localhost` pelo seu domínio ou IP |
| `zoneApi` | URL, **sua apikey** e endpoints de IA, TTS e buscas |
| `lopesApi` | URL e **seu token** da API usada pelos downloaders |
| `atualizacao` | `repo` e `branch` usados pelo `×update` |
| `boasVindas` | Textos de entrada e saída (`@user`, `@group` e `@membros` são trocados automaticamente) |
| `vip` e `aluguel` | Planos, dias e preços |
| `decoracao` | Liga e desliga a decoração azul |

> [!IMPORTANT]
> Coloque **a sua apikey** em `zoneApi.apikey` e **o seu token** em `lopesApi.token`. Sem eles, IA, TTS, buscas e downloads não funcionam. Depois, teste com `×testarzone`.

---

## 🚀 Comandos principais

| Comando | O que faz |
|---|---|
| `×menu` | Abre o menu principal (e a escolha de modo, na primeira vez) |
| `×modo-adr` / `×modo-ios` / `×modo-ios2` | Escolhe o modo de menu |
| `×info <comando>` | Mostra a descrição de um comando |
| `×ping` | Testa se o bot está vivo |
| `×figurinha` | Cria figurinha de uma imagem ou vídeo (envie ou responda) |
| `×play <música>` | Card do play e menu de opções (áudio, vídeo e mais) |
| `×copiar` | Copia a mensagem respondida (no seu PV, em grupo) |
| `×pesca` | Abre o painel de pesca |
| `×rpgs` | Lista os 4 RPGs |
| `×alugar` | Mostra os planos de aluguel |
| `×subbot <número>` | Cria um sub-bot |
| `×update` | Verifica atualização no GitHub (dono) |
| `×addcase <pedido>` | A IA cria um comando novo (dono) |
| `×pcase <comando>` | Manda a case de um comando em zip (dono) |

---

## 🎧 Áudio do menu

O dono marca um áudio e o bot passa a mandá-lo **logo depois do menu**, toda vez que alguém pedir.

1. Envie o áudio no chat com o bot.
2. **Responda esse áudio** com `×definiraudiomenu`.
3. Teste com `×testaraudiomenu`.

| Comando (dono) | O que faz |
|---|---|
| `×definiraudiomenu` | Salva o áudio marcado como áudio do menu |
| `×audiomenu` | Mostra o status |
| `×audiomenu on` / `off` | Liga ou desliga sem apagar o áudio |
| `×testaraudiomenu` | Manda o áudio salvo só para você |
| `×removeraudiomenu` | Apaga o áudio salvo |

> [!NOTE]
> Limite de **16 MB**. Se o envio do áudio falhar, o menu continua saindo normalmente.

---

## 🤖 Menu auto

Comandos que ficam **ligados** e agem sozinhos em toda mensagem que não é comando. Exemplo: com `×autofigu` ligado, toda imagem, vídeo ou GIF vira figurinha na hora.

| Comando | O que faz |
|---|---|
| `×autofigu` | imagem, vídeo e GIF viram figurinha |
| `×autoemoji` | mensagem só com um emoji vira figurinha do emoji |
| `×autotoimg` | figurinha vira imagem |
| `×autodl` | link de TikTok, Instagram e YouTube Shorts baixa o vídeo |
| `×autoreact` | o bot reage nas mensagens com um emoji |
| `×menuauto` | abre o menu dos automáticos |

Cada pessoa tem o **próprio pack e autor** das figurinhas automáticas, com `×autopack` e `×autoautor`. As escolhas ficam em `database/auto.json`, que não sobe para o GitHub.

---

## 🗂️ Estrutura do projeto

```
System-Nejire/
├── connect.js          # ponto de entrada (npm start)
├── index.js            # handler central dos comandos
├── config.json         # configuração do bot
├── SISTEMAS/           # a lógica dos comandos, um arquivo por sistema
│   ├── play2/          # play, card e menu de opções
│   ├── infocmd/        # descrições dos comandos (×info)
│   ├── auto/           # menu auto
│   ├── lote3/          # os 4 RPGs
│   └── ...
├── menu/               # menus, botões, fotos e áudio do menu
├── utils/              # card do play, menus de localização, device, atualizador...
├── webapp/             # mini app web da pesca
├── assets/             # fontes e arquivos de apoio
├── data/               # dados fixos do jogo (ex.: casos do detetive)
├── database/           # dados dos usuários (criados automaticamente)
└── sessions/           # sessão do WhatsApp (não sobe para o GitHub)
```

---

## 🔐 Segurança

- 🚫 **Nunca suba** `sessions/`, `database/` nem o `config.json` com chaves reais para um repositório público.
- 🔑 Guarde sua apikey e seu token só no seu servidor.
- 👑 Só coloque como dono quem você confia: o dono usa `×pcase`, `×addcase`, `×update`, `×backup` e `×broadcast`.
- 🧠 Leia com `×vercase` o código criado pela IA antes de liberar para outras pessoas.
- 📵 Use um número só para o bot.

---

## 🩹 Problemas comuns

| Problema | Solução |
|---|---|
| O código de pareamento não conecta | Digite em até 60 s, com DDI e DDD. Se falhar, apague `sessions/main` e tente de novo |
| `Sessão deslogada` / `403` | Apague `sessions/main` e faça o pareamento de novo |
| `Conflito: outra sessão ativa` | O mesmo número está conectado em outro lugar. Feche a outra instância |
| Figurinha, áudio ou vídeo não funciona | Instale o **ffmpeg** |
| O menu não tem botões | Escolha o modo com `×modo-adr` |
| O card do play não aparece | Confira se as pastas `utils/` estão completas e se o bot foi reiniciado |
| `×update` diz que não tem repositório | Preencha `atualizacao.repo` no `config.json` |
| IA, TTS ou busca não respondem | Confira a apikey em `zoneApi` e rode `×testarzone` |
| Download não funciona | Confira o token em `lopesApi` |
| Erro de módulo não encontrado | Rode `npm install` |

---

## 🔓 Versão desofuscada (paga)

Esta versão é **gratuita e ofuscada**. A versão **desofuscada** tem o código limpo, legível e editável, com:

- 📖 código aberto para estudo e personalização;
- 🛠️ suporte direto com o criador;
- 🔄 acesso às atualizações.

Para comprar ou tirar dúvidas, chame o suporte: [wa.me/SEUNUMERO](https://wa.me/SEUNUMERO).

---

## 💬 Suporte e créditos

| | |
|---|---|
| 💬 **Suporte** | [wa.me/SEUNUMERO](https://wa.me/SEUNUMERO) |
| 📢 **Canal (atualizações)** | [Seguir o canal](https://whatsapp.com/channel/0029Vb8rVXsDOQIWsbKuAd34) |
| 👤 **Criador** | **Lopes** (by Lopes) |
| 📚 **Base** | [Baileys](https://github.com/WhiskeySockets/Baileys) (`@systemzero/baileys`) |

> [!CAUTION]
> ✖ **Proibido vender, revender ou cobrar** por esta versão, total ou parcialmente.
> ✖ **Proibido remover os créditos** do criador.
> ✔ Pode usar para uso próprio, mantendo os créditos.

<div align="center">

**⋆｡° 𓆩🩵𓆪 System Nejire 4.0 𓆩🩵𓆪 °｡⋆**

🩵 Feito com muito azul, by **Lopes** 🩵

</div>
