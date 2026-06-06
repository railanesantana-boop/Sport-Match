// dados.js - Vagas iniciais pré-existentes
const vagasIniciais = [
    {
        id: 1001,
        titulo: "Time de Futebol procura atacante",
        modalidade: "Futebol",
        nivel: "Profissional",
        descricao: "Buscamos atleta experiente para time da série B.",
        equipeId: 0,
        equipeNome: "Esporte Clube Virtual"
    },
    {
        id: 1002,
        titulo: "Clube de Basquete busca armador",
        modalidade: "Basquete",
        nivel: "Semi-profissional",
        descricao: "Procuramos jogador com experiência em campeonatos estaduais.",
        equipeId: 0,
        equipeNome: "Basquete Elite"
    },
    {
        id: 1003,
        titulo: "Escola de Vôlei procura jovens talentos",
        modalidade: "Vôlei",
        nivel: "Amador",
        descricao: "Vagas para categoria de base. Treinos gratuitos.",
        equipeId: 0,
        equipeNome: "Vôlei Futuro"
    },
    {
        id: 1004,
        titulo: "Time de Natação busca nadadores",
        modalidade: "Natação",
        nivel: "Profissional",
        descricao: "Busca atletas para competições nacionais.",
        equipeId: 0,
        equipeNome: "Natação Brasil"
    }
];

function inicializarVagas() {
    const vagasExistentes = localStorage.getItem('vagasIniciais');
    if (!vagasExistentes) {
        localStorage.setItem('vagasIniciais', JSON.stringify(vagasIniciais));
        console.log('Vagas iniciais carregadas!');
    }
}

inicializarVagas();