const readline = require("readline");

// =======================
// PERSONAGENS
// =======================

const players = [
    {
        NOME: "Mario",
        VELOCIDADE: 4,
        MANOBRABILIDADE: 3,
        PODER: 3,
        PONTOS: 0,
        TURBO: 0,
        IMUNE: false,
        BANANA: 0,
    },
    {
        NOME: "Luigi",
        VELOCIDADE: 3,
        MANOBRABILIDADE: 4,
        PODER: 4,
        PONTOS: 0,
        TURBO: 0,
        IMUNE: false,
        BANANA: 0,
    },
    {
        NOME: "Peach",
        VELOCIDADE: 3,
        MANOBRABILIDADE: 4,
        PODER: 2,
        PONTOS: 0,
        TURBO: 0,
        IMUNE: false,
        BANANA: 0,
    },
    {
        NOME: "Yoshi",
        VELOCIDADE: 2,
        MANOBRABILIDADE: 4,
        PODER: 3,
        PONTOS: 0,
        TURBO: 0,
        IMUNE: false,
        BANANA: 0,
    },
    {
        NOME: "Bowser",
        VELOCIDADE: 5,
        MANOBRABILIDADE: 2,
        PODER: 5,
        PONTOS: 0,
        TURBO: 0,
        IMUNE: false,
        BANANA: 0,
    },
    {
        NOME: "Donkey Kong",
        VELOCIDADE: 2,
        MANOBRABILIDADE: 2,
        PODER: 4,
        PONTOS: 0,
        TURBO: 0,
        IMUNE: false,
        BANANA: 0,
    },
];

// =======================
// INPUT TERMINAL
// =======================

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function ask(question) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}

// =======================
// FUNÇÕES
// =======================

async function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

async function getRandomBlock() {
    const random = Math.random();

    if (random < 0.33) return "RETA";
    if (random < 0.66) return "CURVA";

    return "CONFRONTO";
}

async function logRollResult(
    characterName,
    skill,
    diceResult,
    attribute
) {
    console.log(
        `${characterName} 🎲 (${skill}) ${diceResult} + ${attribute} = ${
            diceResult + attribute
        }`
    );
}

function showCharacters() {
    console.log("\n🎮 PERSONAGENS DISPONÍVEIS:\n");

    players.forEach((player, index) => {
        console.log(`
${index + 1}. ${player.NOME}
🚀 Velocidade: ${player.VELOCIDADE}
🎯 Manobrabilidade: ${player.MANOBRABILIDADE}
💥 Poder: ${player.PODER}
`);
    });
}

async function chooseCharacter(
    playerNumber,
    unavailableIndex = -1
) {
    while (true) {
        const choice = await ask(
            `Escolha o personagem do Jogador ${playerNumber}: `
        );

        const index = Number(choice) - 1;

        if (
            index >= 0 &&
            index < players.length &&
            index !== unavailableIndex
        ) {
            return {
                ...players[index],
                PONTOS: 0,
                TURBO: 0,
                IMUNE: false,
                BANANA: 0,
            };
        }

        console.log(
            "❌ Escolha inválida ou personagem já escolhido."
        );
    }
}

// =======================
// SISTEMA DE ITENS
// =======================

function getRandomItem() {
    const random = Math.random();

    if (random < 0.20) return "CASCO";
    if (random < 0.35) return "BOMBA";
    if (random < 0.50) return "COGUMELO";
    if (random < 0.65) return "ESTRELA";
    if (random < 0.80) return "BANANA";
    if (random < 0.95) return "FIRE_FLOWER";

    return "TROVAO";
}

function applyItem(winner, loser) {
    const item = getRandomItem();

    console.log(
        `🎁 ${winner.NOME} pegou: ${item}`
    );

    switch (item) {
        case "CASCO":
            if (!loser.IMUNE) {
                loser.PONTOS = Math.max(
                    loser.PONTOS - 1,
                    0
                );

                console.log(
                    `🐢 Casco lançado! ${loser.NOME} perdeu 1 ponto.`
                );
            } else {
                console.log(
                    `⭐ ${loser.NOME} bloqueou o casco com imunidade!`
                );
            }
            break;

        case "BOMBA":
            winner.PONTOS = Math.max(
                winner.PONTOS - 1,
                0
            );

            console.log(
                `💣 BOOM! ${winner.NOME} perdeu 1 ponto.`
            );
            break;

        case "COGUMELO":
            winner.TURBO = 2;

            console.log(
                `🍄 Cogumelo! ${winner.NOME} ganhará +2 velocidade na próxima reta.`
            );
            break;

        case "ESTRELA":
            winner.IMUNE = true;

            console.log(
                `⭐ ${winner.NOME} ficou imune por 1 rodada!`
            );
            break;

        case "BANANA":
            loser.BANANA = 2;

            console.log(
                `🍌 Banana lançada! ${loser.NOME} perderá 2 de manobrabilidade na próxima curva.`
            );
            break;

        case "FIRE_FLOWER":
            if (
                loser.PONTOS > 0 &&
                Math.random() > 0.5
            ) {
                loser.PONTOS--;
                winner.PONTOS++;

                console.log(
                    `🔥 Fire Flower roubou 1 ponto de ${loser.NOME}!`
                );
            } else {
                console.log(
                    `🔥 Fire Flower falhou!`
                );
            }
            break;

        case "TROVAO":
            loser.TURBO = -1;

            console.log(
                `⚡ Trovão! ${loser.NOME} terá -1 velocidade na próxima reta.`
            );
            break;
    }
}

// =======================
// CORRIDA
// =======================

async function playRaceEngine(
    character1,
    character2
) {
    for (let round = 1; round <= 5; round++) {
        console.log(
            `\n🏁 ===== RODADA ${round} =====`
        );

        const block =
            await getRandomBlock();

        console.log(
            `🛣️ Bloco sorteado: ${block}`
        );

        const diceResult1 =
            await rollDice();

        const diceResult2 =
            await rollDice();

        let totalTestSkill1 = 0;
        let totalTestSkill2 = 0;

        // =======================
        // RETA
        // =======================

        if (block === "RETA") {
            const turbo1 =
                character1.TURBO || 0;

            const turbo2 =
                character2.TURBO || 0;

            const velocidade1 = Math.max(
                character1.VELOCIDADE +
                    turbo1,
                1
            );

            const velocidade2 = Math.max(
                character2.VELOCIDADE +
                    turbo2,
                1
            );

            totalTestSkill1 =
                diceResult1 + velocidade1;

            totalTestSkill2 =
                diceResult2 + velocidade2;

            await logRollResult(
                character1.NOME,
                "Velocidade",
                diceResult1,
                velocidade1
            );

            await logRollResult(
                character2.NOME,
                "Velocidade",
                diceResult2,
                velocidade2
            );

            character1.TURBO = 0;
            character2.TURBO = 0;
        }

        // =======================
        // CURVA
        // =======================

        if (block === "CURVA") {
            const banana1 =
                character1.BANANA || 0;

            const banana2 =
                character2.BANANA || 0;

            const manobra1 = Math.max(
                character1.MANOBRABILIDADE -
                    banana1,
                1
            );

            const manobra2 = Math.max(
                character2.MANOBRABILIDADE -
                    banana2,
                1
            );

            totalTestSkill1 =
                diceResult1 + manobra1;

            totalTestSkill2 =
                diceResult2 + manobra2;

            await logRollResult(
                character1.NOME,
                "Manobrabilidade",
                diceResult1,
                manobra1
            );

            await logRollResult(
                character2.NOME,
                "Manobrabilidade",
                diceResult2,
                manobra2
            );

            character1.BANANA = 0;
            character2.BANANA = 0;
        }

        // =======================
        // CONFRONTO
        // =======================

        if (block === "CONFRONTO") {
            totalTestSkill1 =
                diceResult1 +
                character1.PODER;

            totalTestSkill2 =
                diceResult2 +
                character2.PODER;

            console.log(
                `🥊 ${character1.NOME} enfrentou ${character2.NOME}!`
            );

            await logRollResult(
                character1.NOME,
                "Poder",
                diceResult1,
                character1.PODER
            );

            await logRollResult(
                character2.NOME,
                "Poder",
                diceResult2,
                character2.PODER
            );

            if (
                totalTestSkill1 >
                totalTestSkill2
            ) {
                console.log(
                    `💥 ${character1.NOME} venceu o confronto!`
                );

                // Turbo do vencedor
                character1.PONTOS++;

                console.log(
                    `⚡ Turbo! ${character1.NOME} ganhou +1 ponto`
                );

                applyItem(
                    character1,
                    character2
                );
            } else if (
                totalTestSkill2 >
                totalTestSkill1
            ) {
                console.log(
                    `💥 ${character2.NOME} venceu o confronto!`
                );

                character2.PONTOS++;

                console.log(
                    `⚡ Turbo! ${character2.NOME} ganhou +1 ponto`
                );

                applyItem(
                    character2,
                    character1
                );
            } else {
                console.log(
                    "🤝 Confronto empatado!"
                );
            }
        }

        // =======================
        // VENCEDOR RODADA
        // =======================

        if (
            totalTestSkill1 >
            totalTestSkill2
        ) {
            console.log(
                `🏆 ${character1.NOME} venceu a rodada!`
            );

            character1.PONTOS++;
        } else if (
            totalTestSkill2 >
            totalTestSkill1
        ) {
            console.log(
                `🏆 ${character2.NOME} venceu a rodada!`
            );

            character2.PONTOS++;
        } else {
            console.log(
                "🤝 Rodada empatada!"
            );
        }

        // estrela dura 1 rodada
        if (character1.IMUNE) {
            console.log(
                `⭐ Imunidade de ${character1.NOME} acabou`
            );

            character1.IMUNE = false;
        }

        if (character2.IMUNE) {
            console.log(
                `⭐ Imunidade de ${character2.NOME} acabou`
            );

            character2.IMUNE = false;
        }

        // placar
        console.log(`
📊 PLACAR:

${character1.NOME}: ${character1.PONTOS}
${character2.NOME}: ${character2.PONTOS}
`);
    }

    // =======================
    // RESULTADO FINAL
    // =======================

    console.log(
        "\n🏁 ===== RESULTADO FINAL ====="
    );

    console.log(
        `${character1.NOME}: ${character1.PONTOS} ponto(s)`
    );

    console.log(
        `${character2.NOME}: ${character2.PONTOS} ponto(s)`
    );

    if (
        character1.PONTOS >
        character2.PONTOS
    ) {
        console.log(
            `👑 ${character1.NOME} venceu a corrida!`
        );
    } else if (
        character2.PONTOS >
        character1.PONTOS
    ) {
        console.log(
            `👑 ${character2.NOME} venceu a corrida!`
        );
    } else {
        console.log(
            "🤝 A corrida terminou empatada!"
        );
    }
}

// =======================
// MAIN
// =======================

(async function main() {
    console.log(
        "🏁 BEM-VINDO AO MARIO KART 🏁"
    );

    showCharacters();

    const player1 =
        await chooseCharacter(1);

    const indexPlayer1 =
        players.findIndex(
            (p) =>
                p.NOME === player1.NOME
        );

    const player2 =
        await chooseCharacter(
            2,
            indexPlayer1
        );

    console.log(`
🚥 Corrida iniciando!

${player1.NOME} 🆚 ${player2.NOME}
`);

    await playRaceEngine(
        player1,
        player2
    );

    rl.close();
})();