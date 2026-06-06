// atletas.js
let atletas = [];
let filtroAtual = 'todos';

function carregarAtletas() {
    atletas = JSON.parse(localStorage.getItem('atletas') || '[]');
    renderizarAtletas();
}

function renderizarAtletas() {
    const container = document.getElementById('listaAtletas');
    if (!container) return;
    
    let atletasFiltrados = filtroAtual === 'todos' ? atletas : atletas.filter(a => a.modalidade === filtroAtual);
    
    if (atletasFiltrados.length === 0) {
        container.innerHTML = '<p style="text-align: center;">Nenhum atleta cadastrado.</p>';
        return;
    }
    
    container.innerHTML = atletasFiltrados.map(atleta => `
        <div class="card">
            <h3>${atleta.nome}</h3>
            <div>
                <span class="modalidade">⚽ ${atleta.modalidade}</span>
                <span class="nivel">🏆 ${atleta.nivel}</span>
            </div>
            <div class="descricao">📍 ${atleta.localizacao || 'Local não informado'} • ${atleta.posicao || 'Posição não informada'}</div>
            <div class="card-buttons">
                <button class="btn-outline" onclick="verPerfil(${atleta.id})">Ver Perfil</button>
                <button class="btn-primary" onclick="convidarAtleta(${atleta.id})">Convidar</button>
            </div>
        </div>
    `).join('');
}

function verPerfil(id) {
    sessionStorage.setItem('perfilVisualizado', id);
    window.location.href = '../html/perfil_atleta.html?view=true';
}

function getEquipeLogada() {
    const sessao = getSessao();
    if (!sessao.logado || sessao.tipo !== 'equipe') return null;
    const equipes = JSON.parse(localStorage.getItem('equipes') || '[]');
    return equipes.find(e => e.id === sessao.id);
}

function enviarConvite(atletaId, atletaNome) {
    const equipe = getEquipeLogada();
    
    if (!equipe) {
        mostrarModalAviso('Acesso negado', 'Você precisa estar logado como equipe para convidar atletas.', null, null);
        return;
    }
    
    let convites = JSON.parse(localStorage.getItem('convites') || '[]');
    const jaExiste = convites.some(c => c.atletaId === atletaId && c.equipeId === equipe.id && c.status === 'pendente');
    
    if (jaExiste) {
        mostrarModal('Atenção', `Você já enviou um convite para ${atletaNome} que ainda está pendente.`, 'warning');
        return;
    }
    
    const novoConvite = {
        id: Date.now(),
        atletaId: atletaId,
        atletaNome: atletaNome,
        equipeId: equipe.id,
        equipeNome: equipe.nomeEquipe,
        status: 'pendente',
        dataConvite: new Date().toISOString()
    };
    
    convites.push(novoConvite);
    localStorage.setItem('convites', JSON.stringify(convites));
    
    // Notificação para o atleta
    criarNotificacao(
        atletaId,
        'convite',
        `${equipe.nomeEquipe} te convidou para fazer parte da equipe!`,
        'ver_convite',
        novoConvite.id
    );
    
    mostrarModalSucesso('Convite enviado! ✨', `Convite enviado para ${atletaNome}. Aguarde a resposta.`);
}

function convidarAtleta(atletaId) {
    const atletasLista = JSON.parse(localStorage.getItem('atletas') || '[]');
    const atleta = atletasLista.find(a => a.id === atletaId);
    if (!atleta) {
        mostrarModal('Erro', 'Atleta não encontrado!', 'warning');
        return;
    }
    
    mostrarModalConfirmacao(
        'Confirmar convite',
        `Você está convidando ${atleta.nome} para fazer parte da sua equipe. Deseja continuar?`,
        () => enviarConvite(atleta.id, atleta.nome)
    );
}

// Filtro
const filtroSelect = document.getElementById('filtroEsporte');
if (filtroSelect) {
    filtroSelect.addEventListener('change', function(e) {
        filtroAtual = e.target.value;
        renderizarAtletas();
    });
}

// Inicializar
carregarAtletas();