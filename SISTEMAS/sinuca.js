const baileys = require("@systemzero/baileys");
const { generateWAMessageFromContent } = baileys;

const POOL_HTML = `<div id="game-wrap" style="width:100%;height:520px;background:#000;position:relative;margin:0;padding:0;overflow:hidden;touch-action:none;user-select:none;-webkit-user-select:none;">
  <button id="rst" style="position:absolute;top:10px;right:10px;background:#ffffff44;color:#fff;border:none;padding:6px 12px;border-radius:4px;font-size:12px;font-weight:bold;z-index:99;cursor:pointer;">Reset</button>
  <canvas id="game" width="360" height="520" style="width:100%;height:100%;display:block;background:#0f380f;touch-action:none;"></canvas>
</div>
<script>
(function(){
  const c = document.getElementById('game');
  if(!c) return;
  const x = c.getContext('2d');
  const rstBtn = document.getElementById('rst');

  const W = 360, H = 520, M = 20, R = 10, PR = 18;
  const pockets = [
    {x:M, y:M}, {x:W-M, y:M},
    {x:M, y:H/2}, {x:W-M, y:H/2},
    {x:M, y:H-M}, {x:W-M, y:H-M}
  ];

  let balls = [];
  let isDrag = false;
  let dStart = {x:0, y:0}, dCurr = {x:0, y:0};

  const colors = ['#ffffff','#ffcc00','#0000ff','#ff0000','#800080','#ff6600','#008000','#800000','#000000','#ffd700','#1e90ff','#ff4500','#9400d3','#ff8c00','#2e8b57','#8b0000'];

  function init(){
    balls = [];
    // Bola branca
    balls.push({x:W/2, y:400, vx:0, vy:0, num:0, color:'#ffffff'});
    // Triângulo
    let sX = W/2, sY = 140, idx = 1;
    for(let r=0; r<5; r++){
      let offX = sX - (r * R);
      for(let col=0; col<=r; col++){
        balls.push({
          x: offX + (col * R * 2),
          y: sY - (r * R * 1.732),
          vx: 0, vy: 0,
          num: idx,
          color: colors[idx] || '#ffffff'
        });
        idx++;
      }
    }
  }

  function update(){
    balls.forEach(b => {
      b.x += b.vx; b.y += b.vy;
      b.vx *= 0.985; b.vy *= 0.985;
      if(Math.abs(b.vx) < 0.02) b.vx = 0;
      if(Math.abs(b.vy) < 0.02) b.vy = 0;

      if(b.x - R < M){ b.x = M + R; b.vx *= -0.8; }
      if(b.x + R > W - M){ b.x = W - M - R; b.vx *= -0.8; }
      if(b.y - R < M){ b.y = M + R; b.vy *= -0.8; }
      if(b.y + R > H - M){ b.y = H - M - R; b.vy *= -0.8; }

      pockets.forEach(p => {
        if(Math.hypot(b.x - p.x, b.y - p.y) < PR){
          if(b.num === 0){ b.x = W/2; b.y = 400; b.vx = 0; b.vy = 0; }
          else { b.x = -100; b.y = -100; b.vx = 0; b.vy = 0; }
        }
      });
    });

    for(let i=0; i<balls.length; i++){
      for(let j=i+1; j<balls.length; j++){
        let b1 = balls[i], b2 = balls[j];
        if(b1.x < 0 || b2.x < 0) continue;
        let dx = b2.x - b1.x, dy = b2.y - b1.y;
        let dist = Math.hypot(dx, dy);
        if(dist < R * 2){
          let overlap = (R * 2) - dist;
          let nx = dx / dist, ny = dy / dist;
          b1.x -= nx * overlap * 0.5; b1.y -= ny * overlap * 0.5;
          b2.x += nx * overlap * 0.5; b2.y += ny * overlap * 0.5;
          let kx = b1.vx - b2.vx, ky = b1.vy - b2.vy;
          let p = 2 * (nx * kx + ny * ky) / 2;
          b1.vx -= p * nx; b1.vy -= p * ny;
          b2.vx += p * nx; b2.vy += p * ny;
        }
      }
    }
  }

  function render(){
    x.clearRect(0,0,W,H);
    x.fillStyle = '#0f380f'; x.fillRect(0,0,W,H);
    x.fillStyle = '#2b1402';
    x.fillRect(0,0,W,M); x.fillRect(0,H-M,W,M);
    x.fillRect(0,0,M,H); x.fillRect(W-M,0,M,H);

    x.fillStyle = '#000000';
    pockets.forEach(p => { x.beginPath(); x.arc(p.x, p.y, PR, 0, Math.PI*2); x.fill(); });

    if(isDrag && balls[0].x > 0){
      let dx = dStart.x - dCurr.x, dy = dStart.y - dCurr.y;
      x.strokeStyle = '#ffffff'; x.lineWidth = 2; x.setLineDash([4,4]);
      x.beginPath(); x.moveTo(balls[0].x, balls[0].y);
      x.lineTo(balls[0].x + dx*2, balls[0].y + dy*2); x.stroke(); x.setLineDash([]);

      x.strokeStyle = '#d2b48c'; x.lineWidth = 5;
      x.beginPath(); x.moveTo(balls[0].x - dx*0.2, balls[0].y - dy*0.2);
      x.lineTo(balls[0].x - dx*1.5, balls[0].y - dy*1.5); x.stroke();
    }

    balls.forEach(b => {
      if(b.x < 0) return;
      x.fillStyle = b.color;
      x.beginPath(); x.arc(b.x, b.y, R, 0, Math.PI*2); x.fill();
      x.strokeStyle = '#00000033'; x.stroke();

      if(b.num > 0){
        x.fillStyle = '#ffffff'; x.beginPath(); x.arc(b.x, b.y, R*0.45, 0, Math.PI*2); x.fill();
        x.fillStyle = '#000000'; x.font = 'bold 7px Arial'; x.textAlign = 'center'; x.textBaseline = 'middle';
        x.fillText(b.num.toString(), b.x, b.y);
      }
    });
  }

  function loop(){ update(); render(); requestAnimationFrame(loop); }

  function getPos(e){
    let rect = c.getBoundingClientRect();
    let cx = e.touches ? e.touches[0].clientX : e.clientX;
    let cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (cx - rect.left) * (W / rect.width), y: (cy - rect.top) * (H / rect.height) };
  }

  function pDown(e){
    let p = getPos(e);
    if(Math.hypot(p.x - balls[0].x, p.y - balls[0].y) < 40){
      isDrag = true; dStart = p; dCurr = p;
    }
  }
  function pMove(e){ if(isDrag) dCurr = getPos(e); }
  function pUp(){
    if(isDrag){
      isDrag = false;
      let dx = dStart.x - dCurr.x, dy = dStart.y - dCurr.y;
      let power = Math.min(Math.hypot(dx, dy) * 0.15, 14);
      if(power > 0.4){
        let a = Math.atan2(dy, dx);
        balls[0].vx = Math.cos(a) * power;
        balls[0].vy = Math.sin(a) * power;
      }
    }
  }

  c.addEventListener('touchstart', e => { pDown(e); e.preventDefault(); }, {passive:false});
  c.addEventListener('touchmove', e => { pMove(e); e.preventDefault(); }, {passive:false});
  c.addEventListener('touchend', pUp);
  c.addEventListener('mousedown', pDown);
  c.addEventListener('mousemove', pMove);
  c.addEventListener('mouseup', pUp);
  if(rstBtn) rstBtn.addEventListener('click', init);

  init();
  requestAnimationFrame(loop);
})();
</script>`;

function construirMensagemSinuca(conn) {
  const payloadData = Buffer.from(
    JSON.stringify({
      response_id: require("crypto").randomUUID(),
      sections: [
        {
          view_model: {
            primitive: {
              __typename: "GenAIaeacdsnwHtmlPrimitive",
              payload: POOL_HTML,
              trusted_sources: ["nixel.dev"],
            },
            __typename: "GenAISingleLayoutViewModel",
          },
        },
      ],
    }),
    "utf8"
  );

  const conteudo = {
    botForwardedMessage: {
      message: {
        richResponseMessage: {
          submessages: [
            {
              messageType: 2,
              messageText: "🎱 SINUCA 🎱",
            },
          ],
          messageType: 1,
          unifiedResponse: {
            data: payloadData,
          },
          contextInfo: {
            mentionedJid: [],
            groupMentions: [],
            statusAttributions: [],
            forwardingScore: 1,
            isForwarded: true,
            forwardedAiBotMessageInfo: {
              botJid: "867051314767696@bot",
            },
            forwardOrigin: 4,
          },
        },
      },
    },
  };

  return generateWAMessageFromContent(
    "",
    conteudo,
    { userJid: conn.user?.id || "" }
  );
}

module.exports = async function ({
  conn,
  info,
  from,
  command,
  reply,
  reagir
}) {
  const comandosPermitidos = ["sinuca", "pool", "bilhar"];

  if (!comandosPermitidos.includes(command)) return false;

  try {
    await reagir("🎱");
    const msgInteractive = construirMensagemSinuca(conn);
    await conn.relayMessage(from, msgInteractive.message, { messageId: msgInteractive.key.id });
  } catch (err) {
    console.error("[SINUCA] Erro ao enviar jogo:", err);
    await reply("❌ O WhatsApp do usuário não suporta mensagens HTML interativas.");
  }

  return true;
};