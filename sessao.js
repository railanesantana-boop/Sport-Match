// sessao.js
function getSessao() {
    const sessao = sessionStorage.getItem('sessao') || localStorage.getItem('sessao');
    if (sessao) {
        try {
            return JSON.parse(sessao);
        } catch (e) {
            return {};
        }
    }
    return {};
}

function isLogado() {
    const sessao = getSessao();
    return sessao.logado === true;
}

function getTipoUsuario() {
    const sessao = getSessao();
    return sessao.tipo || null;
}

function getNomeUsuario() {
    const sessao = getSessao();
    return sessao.nome || null;
}

function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('sessao');
        sessionStorage.removeItem('sessao');
        window.location.href = '../html/index.html';
    }
}

function redirecionarPerfil() {
    const sessao = getSessao();
    if (sessao.tipo === 'atleta') {
        window.location.href = '../html/perfil_atleta.html';
    } else if (sessao.tipo === 'equipe') {
        window.location.href = '../html/perfil_equipe.html';
    }
}

// ========== FUNÇÕES DE NOTIFICAÇÃO ==========
function addNotificacao(titulo, mensagem, tipo, link = null) {
    const notificacoes = JSON.parse(localStorage.getItem('notificacoes') || '[]');
    const novaNotif = {
        id: Date.now(),
        titulo: titulo,
        mensagem: mensagem,
        tipo: tipo,
        lida: false,
        link: link,
        data: new Date().toISOString()
    };
    notificacoes.unshift(novaNotif);
    // Manter apenas últimas 50 notificações
    if (notificacoes.length > 50) notificacoes.pop();
    localStorage.setItem('notificacoes', JSON.stringify(notificacoes));
    atualizarBadgeNotificacoes();
}

function getNotificacoes() {
    return JSON.parse(localStorage.getItem('notificacoes') || '[]');
}

function getNotificacoesNaoLidas() {
    const notificacoes = getNotificacoes();
    return notificacoes.filter(n => !n.lida);
}

function marcarNotificacaoLida(id) {
    let notificacoes = getNotificacoes();
    const index = notificacoes.findIndex(n => n.id === id);
    if (index !== -1) {
        notificacoes[index].lida = true;
        localStorage.setItem('notificacoes', JSON.stringify(notificacoes));
    }
    atualizarBadgeNotificacoes();
}

function marcarTodasNotificacoesLidas() {
    let notificacoes = getNotificacoes();
    notificacoes.forEach(n => n.lida = true);
    localStorage.setItem('notificacoes', JSON.stringify(notificacoes));
    atualizarBadgeNotificacoes();
}

function atualizarBadgeNotificacoes() {
    const naoLidas = getNotificacoesNaoLidas();
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        const count = naoLidas.length;
        badge.setAttribute('data-count', count > 0 ? count : '');
    }
}

function renderizarNotificacoes() {
    const dropdown = document.getElementById('notificationDropdown');
    if (!dropdown) return;
    
    const notificacoes = getNotificacoes();
    const naoLidas = getNotificacoesNaoLidas();
    
    if (notificacoes.length === 0) {
        dropdown.innerHTML = '<div class="notification-item">Nenhuma notificação</div>';
        return;
    }
    
    dropdown.innerHTML = `
        <div style="padding: 8px 12px; border-bottom: 1px solid #eef2ff; display: flex; justify-content: space-between;">
            <strong>Notificações</strong>
            ${naoLidas.length > 0 ? '<button onclick="marcarTodasNotificacoesLidas(); renderizarNotificacoes();" style="background:none; border:none; color:#3b82f6; cursor:pointer;">Marcar todas como lidas</button>' : ''}
        </div>
        ${notificacoes.map(notif => `
            <div class="notification-item ${!notif.lida ? 'unread' : ''}" onclick="marcarNotificacaoLida(${notif.id}); if('${notif.link}') window.location.href='${notif.link}';">
                <div class="notification-title">${notif.titulo}</div>
                <div class="notification-text">${notif.mensagem}</div>
                <div class="notification-time">${new Date(notif.data).toLocaleDateString()} ${new Date(notif.data).toLocaleTimeString()}</div>
            </div>
        `).join('')}
    `;
}

function toggleNotificacoes() {
    const dropdown = document.getElementById('notificationDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
        if (dropdown.classList.contains('show')) {
            renderizarNotificacoes();
        }
    }
}

// Fechar dropdown ao clicar fora
document.addEventListener('click', function(e) {
    const wrapper = document.querySelector('.notification-wrapper');
    const dropdown = document.getElementById('notificationDropdown');
    if (wrapper && dropdown && !wrapper.contains(e.target)) {
        dropdown.classList.remove('show');
    }
});

// ========== MODO ESCURO ==========
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function initDarkMode() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }
}

initDarkMode();