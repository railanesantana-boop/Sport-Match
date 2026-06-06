// cadastro_equipe.js
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cadastroEquipeForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const equipe = {
            id: Date.now(),
            nomeEquipe: document.getElementById('nomeEquipe')?.value,
            email: document.getElementById('email')?.value,
            senha: document.getElementById('senha')?.value,
            tipoOrganizacao: document.getElementById('tipoOrganizacao')?.value,
            localizacao: document.getElementById('localizacao')?.value,
            descricao: document.getElementById('descricao')?.value || '',
            vagas: [],
            dataCadastro: new Date().toISOString()
        };
        
        if (!equipe.nomeEquipe || !equipe.email || !equipe.senha || !equipe.tipoOrganizacao || !equipe.localizacao) {
            alert('Preencha todos os campos obrigatórios!');
            return;
        }
        
        let atletas = JSON.parse(localStorage.getItem('atletas') || '[]');
        let equipes = JSON.parse(localStorage.getItem('equipes') || '[]');
        
        if (equipes.some(e => e.email === equipe.email) || atletas.some(a => a.email === equipe.email)) {
            alert('Email já cadastrado!');
            return;
        }
        
        equipes.push(equipe);
        localStorage.setItem('equipes', JSON.stringify(equipes));
        
        alert('Cadastro realizado com sucesso! Faça login.');
        window.location.href = '../html/login.html';
    });
});