// vagas.js
let vagas = [];
let filtroAtual = 'todos';
let ordenacaoAtual = 'recente';
let paginaAtual = 1;
let itensPorPagina = 6;

function carregarVagas() {
    const equipes = JSON.parse(localStorage.getItem('equipes') || '[]');
    const vagasIniciais = JSON.parse(localStorage.getItem('vagasIniciais') || '[]');
    
    vagas = [];
    
    equipes.forEach(equipe => {
        if (equipe.vagas && equipe.vagas.length) {
            equipe.vagas.forEach(vaga => {
                vagas.push({
                    ...vaga,
                    equipeId: equipe.id,
                    equipeNome: equipe.nomeEquipe,
                    fonte: 'equipe'
                });
            });
        }
    });
    
    vagasIniciais.forEach(vaga => {
        vagas.push({
            ...vaga,
            fonte: 'sistema'
        });
    });
    
    renderizarVagas();
}

function ordenarVagas(vagasArray) {
    const sorted = [...vagasArray];
    if (ordenacaoAtual === 'recente') {
        return sorted.sort((a, b) => (b.id || 0) - (a.id || 0));
    } else if (ordenacaoAtual === 'antigo') {
        return sorted.sort((a, b) => (a.id || 0) - (b.id || 0));
    } else if (ordenacaoAtual === 'az') {
        return sorted.sort((a, b) => (a.titulo || '').localeCompare(b.titulo || ''));
    }
    return sorted;
}

function renderizarVagas() {
    const container = document.getElementById('listaVagas');
    if (!container) return;
    
    let vagasFiltradas = filtroAtual === 'todos' ? vagas : vagas.filter(v => v.modalidade === filtroAtual);
    vagasFiltradas = ordenarVagas(vagasFiltradas);
    
    const totalPaginas = Math.ceil(vagasFiltradas.length / itensPorPagina);
    if (paginaAtual > totalPaginas) paginaAtual = 1;
    
    const start = (paginaAtual - 1) * itensPorPagina;
    const end = start + itensPorPagina;
    const vagasPaginadas = vagasFiltradas.slice(start, end);
    
    if (vagasFiltradas.length === 0) {
        container.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: #64748b;">Nenhuma vaga disponível no momento.</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="cards">
            ${vagasPaginadas.map(vaga => `
                <div class="card">
                    <h3>${vaga.titulo}</h3>
                    <div>
                        <span class="equipe">🏢 ${vaga.equipeNome}</span>
                        <span class="modalidade">⚽ ${vaga.modalidade}</span>
                        <span class="nivel">🏆 ${vaga.nivel || 'Não especificado'}</span>
                    </div>
                    <div class="descricao">${vaga.descricao || 'Nenhuma descrição fornecida.'}</div>
                    <div class="card-buttons">
                        <button class="btn-outline" onclick="verDetalhes(${vaga.id})">Ver detalhes</button>
                        <button class="btn-primary" onclick="candidatar(${vaga.id})">Candidatar-se</button>
                        <button class="btn-outline" onclick="compartilharVaga(${vaga.id})">🔗 Compartilhar</button>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="paginacao">
            <button onclick="mudarPagina(${paginaAtual - 1})" ${paginaAtual === 1 ? 'disabled' : ''}>◀ Anterior</button>
            <span>Página ${paginaAtual} de ${totalPaginas}</span>
            <button onclick="mudarPagina(${paginaAtual + 1})" ${paginaAtual === totalPaginas ? 'disabled' : ''}>Próxima ▶</button>
        </div>
    `;
}

function mudarPagina(novaPagina) {
    paginaAtual = novaPagina;
    renderizarVagas();
}

function verDetalhes(id) {
    const vaga = vagas.find(v => v.id === id);
    alert(`📋 ${vaga.titulo}\n\n🏢 ${vaga.equipeNome}\n⚽ ${vaga.modalidade}\n🏆 ${vaga.nivel}\n📝 ${vaga.descricao}`);
}

function candidatar(id) {
    const sessao = getSessao();
    if (!sessao.logado || sessao.tipo !== 'atleta') {
        mostrarModal('Acesso negado', 'Faça login como atleta para se candidatar!', 'warning');
        window.location.href = '../html/login.html';
        return;
    }
    
    const vaga = vagas.find(v => v.id === id);
    if (!vaga) return;
    
    let candidaturas = JSON.parse(localStorage.getItem('candidaturas') || '[]');
    const jaCandidatou = candidaturas.some(c => c.atletaId === sessao.id && c.vagaId === id);
    
    if (jaCandidatou) {
        mostrarModal('Atenção', 'Você já se candidatou para esta vaga!', 'warning');
        return;
    }
    
    const novaCandidatura = {
        id: Date.now(),
        atletaId: sessao.id,
        atletaNome: sessao.nome,
        vagaId: id,
        vagaTitulo: vaga.titulo,
        equipeId: vaga.equipeId,
        equipeNome: vaga.equipeNome,
        status: 'pendente',
        dataCandidatura: new Date().toISOString()
    };
    
    candidaturas.push(novaCandidatura);
    localStorage.setItem('candidaturas', JSON.stringify(candidaturas));
    
    // NOTIFICAÇÃO PARA A EQUIPE
    criarNotificacao(
        vaga.equipeId,
        'candidatura',
        `${sessao.nome} se candidatou para a vaga: ${vaga.titulo}`,
        'ver_candidatura',
        vaga.id
    );
    
    mostrarModalSucesso('Candidatura enviada! ✅', `Você se candidatou para ${vaga.titulo}. A equipe ${vaga.equipeNome} será notificada.`);
}

// Eventos
const filtroSelect = document.getElementById('filtroVagas');
if (filtroSelect) {
    filtroSelect.addEventListener('change', function(e) {
        filtroAtual = e.target.value;
        paginaAtual = 1;
        renderizarVagas();
    });
}

const ordenacaoSelect = document.getElementById('ordenacaoVagas');
if (ordenacaoSelect) {
    ordenacaoSelect.addEventListener('change', function(e) {
        ordenacaoAtual = e.target.value;
        paginaAtual = 1;
        renderizarVagas();
    });
}

carregarVagas();