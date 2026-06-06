// equipes.js
let equipes = [];
let filtroAtual = 'todos';

function carregarEquipes() {
    equipes = JSON.parse(localStorage.getItem('equipes') || '[]');
    renderizarEquipes();
}

function renderizarEquipes() {
    const container = document.getElementById('listaEquipes');
    if (!container) return;
    
    let equipesFiltradas = filtroAtual === 'todos' ? equipes : equipes.filter(e => e.tipoOrganizacao === filtroAtual);
    
    if (equipesFiltradas.length === 0) {
        container.innerHTML = '<p style="text-align: center;">Nenhuma equipe cadastrada.</p>';
        return;
    }
    
    container.innerHTML = equipesFiltradas.map(equipe => `
        <div class="card">
            <h3>${equipe.nomeEquipe}</h3>
            <div>
                <span class="modalidade">🏢 ${equipe.tipoOrganizacao}</span>
            </div>
            <div class="descricao">📍 ${equipe.localizacao}</div>
            <div class="card-buttons">
                <button class="btn-outline" onclick="verEquipe(${equipe.id})">Ver Perfil</button>
                <button class="btn-primary" onclick="entrarContato(${equipe.id})">Contato</button>
            </div>
        </div>
    `).join('');
}

function verEquipe(id) {
    sessionStorage.setItem('equipeVisualizada', id);
    window.location.href = '../html/perfil_equipe.html?view=true';
}

function entrarContato(id) {
    const sessao = getSessao();
    if (!sessao.logado) {
        alert('Faça login para entrar em contato com a equipe!');
        window.location.href = '../html/login.html';
        return;
    }
    
    const equipe = equipes.find(e => e.id === id);
    if (equipe) {
        alert(`📧 Contato solicitado para ${equipe.nomeEquipe}!\n\nE-mail: ${equipe.email}\nEles responderão em breve.`);
    }
}

document.getElementById('filtroEquipe')?.addEventListener('change', function(e) {
    filtroAtual = e.target.value;
    renderizarEquipes();
});

carregarEquipes();