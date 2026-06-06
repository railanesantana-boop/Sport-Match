// cadastro_atleta.js
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cadastroAtletaForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const atleta = {
            id: Date.now(),
            nome: document.getElementById('nome')?.value,
            idade: document.getElementById('idade')?.value,
            email: document.getElementById('email')?.value,
            senha: document.getElementById('senha')?.value,
            foto: document.getElementById('foto')?.value,
            peso: document.getElementById('peso')?.value || '',
            altura: document.getElementById('altura')?.value || '',
            modalidade: document.getElementById('modalidade')?.value,
            posicao: document.getElementById('posicao')?.value || '',
            nivel: document.getElementById('nivel')?.value || 'Amador',
            localizacao: document.getElementById('localizacao')?.value || '',
            historico: [],
            estatisticas: { gols: 0, assistencias: 0, titulos: 0 },
            dataCadastro: new Date().toISOString()
        };
        
        if (!atleta.nome || !atleta.idade || !atleta.email || !atleta.senha || !atleta.modalidade) {
            alert('Preencha todos os campos obrigatórios!');
            return;
        }
        
        let atletas = JSON.parse(localStorage.getItem('atletas') || '[]');
        let equipes = JSON.parse(localStorage.getItem('equipes') || '[]');
        
        if (atletas.some(a => a.email === atleta.email) || equipes.some(e => e.email === atleta.email)) {
            alert('Email já cadastrado!');
            return;
        }
        
        atletas.push(atleta);
        localStorage.setItem('atletas', JSON.stringify(atletas));
        
        alert('Cadastro realizado com sucesso! Faça login.');
        window.location.href = '../html/login.html';
    });
});