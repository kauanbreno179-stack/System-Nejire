const { pick } = require("./_ajuda.js");

const LISTAS = {
    fraseboanoite: ["durma bem e sonhe com coisas boas 🌙", "descansa, amanhã é um novo dia ✨", "que seu sono seja tranquilo 😴", "boa noite, recarrega as energias 🌌", "amanhã tudo começa de novo, agora é hora de descansar 🌙"],
    fraseamizade: ["amigo de verdade é aquele que fica mesmo quando é mais fácil ir 🤝", "amizade boa não precisa de motivo, só precisa de tempo 💛", "quem tem amigo tem tudo 🐚", "amizade é a família que a gente escolhe 🌟", "bons amigos são raros, cuide dos seus 💫"],
    frasesuperacao: ["cada dia é uma nova chance de recomeçar 🌅", "você já superou coisas difíceis antes, vai superar essa também 💪", "o difícil não é cair, é continuar tentando levantar 🌱", "toda tempestade passa, confia no processo 🌦️", "um passo de cada vez já é progresso 👣"],
    frasesarcastica: ["ah sim, porque isso vai dar super certo 🙄", "que dia produtivo... pra procrastinar 😌", "com certeza é exatamente isso que eu queria fazer hoje 😏", "não, eu não tô de mau humor, eu sou assim mesmo 😌", "claro, vou fazer isso amanhã (nunca) 😴"],
    frasereflexiva: ["nem tudo que brilha é ouro, mas quase tudo que é bom exige esforço 🌟", "o tempo não volta, então usa ele com o que importa ⏳", "a gente é feito das escolhas que faz todo dia 🌱", "silêncio também é resposta 🤫", "às vezes o caminho mais lento é o mais seguro 🐢"],
    cantada: ["você é tipo wi-fi grátis: eu sinto uma conexão forte 📶", "seu sorriso deveria ser considerado crime, porque desarma qualquer um 😳", "você tem 206 ossos no corpo, quer mais um? 😏", "se beleza fosse crime, você já tava presa(o) há tempos 👀", "você é a exceção de todas as minhas regras 💫"],
    desculpa: ["desculpa, meu wi-fi caiu e levou minha responsabilidade junto 😅", "foi mal, eu simplesmente esqueci que hoje era hoje 🙈", "desculpa a demora, tava resolvendo uma crise existencial 😌", "peço desculpas, minha bateria social tava em 1% 🔋", "foi mal, eu juro que ia fazer, só que não 😬"],

    nomedebebe: ["Alice", "Théo", "Helena", "Miguel", "Laura", "Davi", "Valentina", "Gael", "Sophia", "Noah", "Isabela", "Heitor"],
    nomedegato: ["Mimi", "Frajola", "Salém", "Nala", "Tobias", "Luna", "Simba", "Amora", "Whiskers", "Zorro"],
    nomedecachorro: ["Rex", "Bidu", "Thor", "Bela", "Max", "Amora", "Fred", "Nina", "Bob", "Lola"],
    titulodefilme: ["O Último Suspiro da Cidade", "Entre Sombras e Estrelas", "O Segredo do Lago Azul", "Depois da Meia-Noite", "A Última Carta", "Reflexos do Passado"],

    piadaanimais: ["por que o peixe não joga tênis? porque ele tem medo da rede! 🐟", "o que a abelha disse pra outra abelha? zum bem, amiga! 🐝", "por que o passarinho caiu do ninho? porque ele dormiu voando! 🐦"],
    piadaprogramador: ["por que o programador foi ao médico? porque ele tinha um bug! 🐛", "quantos programadores são precisos pra trocar uma lâmpada? nenhum, isso é hardware! 💡", "por que os devs preferem o escuro? porque light atrai bugs! 😎"],
    piadaescola: ["por que o livro de matemática ficou triste? porque tinha muitos problemas! 📚", "o que o professor de geografia falou na praia? nada, ele só ficou de boa! 🏖️", "por que o caderno foi ao médico? porque estava com as folhas soltas! 📓"],
    piadatrabalho: ["por que o chefe foi ao psicólogo? pra aprender a delegar melhor! 💼", "meu trabalho é tipo o wi-fi de casa: nunca falha bem na hora que eu preciso 📶", "segunda-feira é aquele amigo que ninguém convidou mas sempre aparece! ☕"],

    curiosidadeoceano: ["a maior parte do oceano ainda é inexplorada pela humanidade 🌊", "o polvo tem três corações e sangue azul 🐙", "existem montanhas e vulcões debaixo do mar maiores que os da superfície 🌋"],
    curiosidademusica: ["ouvir música libera dopamina no cérebro, o mesmo neurotransmissor do prazer 🎶", "o batimento cardíaco pode se sincronizar com o ritmo da música que você escuta 🎵", "o vaporwave é um gênero musical inteiro que nasceu já dentro da internet 🎧"],
    curiosidadeesporte: ["o primeiro cartão vermelho da história do futebol só surgiu em 1970 🟥", "o tênis de mesa profissional já teve rebatidas mais rápidas que a bolinha de badminton 🏓", "a maratona tem 42,195km por causa de um ajuste feito nos jogos de Londres em 1908 🏃"],
    curiosidadealimentacao: ["o mel bem guardado praticamente não estraga, já acharam potes comestíveis de milhares de anos 🍯", "a pipoca é um dos alimentos mais antigos da humanidade, quase sem mudar em 5 mil anos 🍿", "o chocolate já foi usado como moeda de troca por civilizações antigas 🍫"],

    receitadoce: ["brigadeiro gourmet: leite condensado, chocolate 70%, manteiga e granulado belga 🍫", "mousse de maracujá: suco concentrado, leite condensado e creme de leite batidos juntos 🍈", "bolo de caneca: farinha, cacau, leite e um fio de óleo, 2 minutos no microondas ☕"],
    receitavegana: ["strogonoff de cogumelos com creme de castanha 🍄", "hambúrguer de grão-de-bico e temperos assado no forno 🌱", "curry de legumes com leite de coco e arroz integral 🍛"],
    receitainternacional: ["shakshuka: ovos cozidos em molho de tomate especiado, clássico do oriente médio 🍳", "okonomiyaki: panqueca salgada japonesa de repolho e frutos do mar ou carne 🇯🇵", "ratatouille: legumes fatiados finos e assados em camadas, clássico francês 🇫🇷"],

    dicaprodutividade: ["separe as 3 tarefas mais importantes do dia antes de olhar o resto 📝", "desligue notificações por 25 minutos e foque em uma coisa só 🎯", "deixe o ambiente de trabalho organizado antes de começar, isso já ajuda a focar 🧹"],
    dicaestudo: ["revisar o conteúdo em intervalos espaçados funciona melhor que revisar tudo de uma vez 📚", "explicar o assunto em voz alta pra alguém (ou pra si mesmo) ajuda a fixar melhor 🗣️", "estudar em blocos curtos com pausas rende mais do que horas seguidas sem parar ⏱️"],

    perguntapraconhecer: ["qual foi a última coisa que te fez rir de verdade?", "se você pudesse aprender uma habilidade nova instantaneamente, qual seria?", "qual lugar você mais quer visitar um dia?", "qual foi a melhor viagem que você já fez?", "o que você faria num dia totalmente livre, sem compromissos?"],
    boavibe: ["hoje é um bom dia pra tentar de novo 🌞", "você tá indo melhor do que imagina 🌱", "respira, uma coisa de cada vez 🍃", "seu esforço tá valendo, mesmo que não pareça agora ✨", "dá um tempo pra você hoje, você merece 🌸"]
};

const TABELA = {};
for (const [nome, lista] of Object.entries(LISTAS)) {
    TABELA[nome] = (async (ctx) => { await ctx.reply(pick(lista)); });
}

module.exports = { TABELA };
