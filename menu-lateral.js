// menu-lateral.js

// ========== FUNÇÃO MODAL GENÉRICA ==========
function mostrarModal(titulo, mensagem, tipo) {
    const modalExistente = document.querySelector('.modal-overlay');
    if (modalExistente) modalExistente.remove();
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-container">
            <div class="modal-header modal-${tipo}">
                <h3>${titulo}</h3>
            </div>
            <div class="modal-body">
                <p>${mensagem}</p>
            </div>
            <div class="modal-buttons">
                <button class="modal-btn modal-btn-primary" onclick="this.closest('.modal-overlay').remove()">OK</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function mostrarModalSucesso(titulo, mensagem, callback) {
    const modalExistente = document.querySelector('.modal-overlay');
    if (modalExistente) modalExistente.remove();
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-container">
            <div class="modal-header modal-success">
                <h3>✨ ${titulo}</h3>
            </div>
            <div class="modal-body">
                <p>${mensagem}</p>
            </div>
            <div class="modal-buttons">
                <button class="modal-btn modal-btn-primary" onclick="this.closest('.modal-overlay').remove(); ${callback ? 'setTimeout(() => { ' + callback + ' }, 100);' : ''}">OK</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function mostrarModalConfirmacao(titulo, mensagem, onConfirm, onCancel) {
    const modalExistente = document.querySelector('.modal-overlay');
    if (modalExistente) modalExistente.remove();
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-container">
            <div class="modal-header modal-info">
                <h3>${titulo}</h3>
            </div>
            <div class="modal-body">
                <p>${mensagem}</p>
            </div>
            <div class="modal-buttons">
                <button class="modal-btn modal-btn-secondary" id="modalCancelBtn">Cancelar</button>
                <button class="modal-btn modal-btn-primary" id="modalConfirmBtn">Confirmar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('modalConfirmBtn').onclick = () => {
        modal.remove();
        if (onConfirm) onConfirm();
    };
    
    document.getElementById('modalCancelBtn').onclick = () => {
        modal.remove();
        if (onCancel) onCancel();
    };
}

function mostrarModalAviso(titulo, mensagem, onConfirm, onCancel) {
    const modalExistente = document.querySelector('.modal-overlay');
    if (modalExistente) modalExistente.remove();
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-container">
            <div class="modal-header modal-warning">
                <h3>⚠️ ${titulo}</h3>
            </div>
            <div class="modal-body">
                <p>${mensagem}</p>
            </div>
            <div class="modal-buttons">
                <button class="modal-btn modal-btn-secondary" id="modalCancelBtn">Cancelar</button>
                <button class="modal-btn modal-btn-danger" id="modalConfirmBtn">Continuar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('modalConfirmBtn').onclick = () => {
        modal.remove();
        if (onConfirm) onConfirm();
    };
    
    document.getElementById('modalCancelBtn').onclick = () => {
        modal.remove();
        if (onCancel) onCancel();
    };
}

// ========== FUNÇÕES PRINCIPAIS DA SIDEBAR ==========
function atualizarSidebar() {
    const sessao = getSessao();
    const avatarDiv = document.getElementById('sidebarAvatar');
    const nomeSpan = document.getElementById('sidebarNome');
    const emailSpan = document.getElementById('sidebarEmail');
    const perfilLink = document.getElementById('perfilLink');
    
    if (sessao.logado) {
        const nome = sessao.nome || 'Usuário';
        const email = sessao.email || '';
        const tipo = sessao.tipo;
        
        nomeSpan.textContent = nome;
        emailSpan.textContent = email;
        
        let fotoUrl = null;
        if (tipo === 'atleta') {
            const atletas = JSON.parse(localStorage.getItem('atletas') || '[]');
            const atleta = atletas.find(a => a.id === sessao.id);
            fotoUrl = atleta?.foto;
        } else if (tipo === 'equipe') {
            const equipes = JSON.parse(localStorage.getItem('equipes') || '[]');
            const equipe = equipes.find(e => e.id === sessao.id);
            fotoUrl = equipe?.foto;
        }
        
        if (fotoUrl && fotoUrl.trim() !== '') {
            avatarDiv.innerHTML = `<img src="${fotoUrl}" alt="Avatar" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
            avatarDiv.style.background = 'transparent';
        } else {
            avatarDiv.innerHTML = nome.charAt(0).toUpperCase();
            avatarDiv.style.background = '#3b82f6';
            avatarDiv.style.display = 'flex';
            avatarDiv.style.alignItems = 'center';
            avatarDiv.style.justifyContent = 'center';
            avatarDiv.style.fontSize = '1.5rem';
            avatarDiv.style.fontWeight = 'bold';
            avatarDiv.style.color = 'white';
        }
        
        if (perfilLink) {
            perfilLink.href = tipo === 'atleta' ? 'perfil_atleta.html' : 'perfil_equipe.html';
        }
        
        const logoutBtn = document.querySelector('.nav-item.logout');
        if (logoutBtn) logoutBtn.style.display = 'flex';
    } else {
        nomeSpan.textContent = 'Visitante';
        emailSpan.innerHTML = '<a href="../html/login.html" class="login-link" style="color: #e94560; text-decoration: none;">🔑 Faça login para acessar</a>';
        avatarDiv.innerHTML = '👤';
        avatarDiv.style.background = '#64748b';
        avatarDiv.style.display = 'flex';
        avatarDiv.style.alignItems = 'center';
        avatarDiv.style.justifyContent = 'center';
        avatarDiv.style.fontSize = '1.5rem';
        
        if (perfilLink) perfilLink.href = 'login.html';
        
        const logoutBtn = document.querySelector('.nav-item.logout');
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.toggle('open');
}

// Fechar sidebar ao clicar fora no mobile
document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    if (window.innerWidth <= 768 && sidebar && menuToggle) {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    }
});

// ========== FUNÇÕES DE NOTIFICAÇÃO ==========

function getNotificacoesUsuario() {
    const sessao = getSessao();
    if (!sessao.logado) return [];
    const todasNotificacoes = JSON.parse(localStorage.getItem('notificacoes') || '[]');
    return todasNotificacoes.filter(n => n.usuarioId === sessao.id && !n.lida);
}

function atualizarBadgeNotificacoes() {
    const notificacoes = getNotificacoesUsuario();
    const notifCount = document.getElementById('notifCount');
    if (notifCount) {
        const total = notificacoes.length;
        notifCount.textContent = total;
        notifCount.style.display = total === 0 ? 'none' : 'inline-block';
    }
}

function criarNotificacao(usuarioId, tipo, mensagem, acao, acaoId) {
    console.log(`📢 Criando notificação para usuário ${usuarioId}: ${mensagem}`);
    
    const notificacoes = JSON.parse(localStorage.getItem('notificacoes') || '[]');
    const novaNotificacao = {
        id: Date.now(),
        usuarioId: usuarioId,
        tipo: tipo,
        mensagem: mensagem,
        lida: false,
        data: new Date().toISOString(),
        acao: acao,
        acaoId: acaoId
    };
    notificacoes.push(novaNotificacao);
    localStorage.setItem('notificacoes', JSON.stringify(notificacoes));
    
    atualizarBadgeNotificacoes();
    
    const sessao = getSessao();
    if (sessao.id === usuarioId) {
        mostrarToast(mensagem);
    }
}

function mostrarToast(mensagem) {
    const toastExistente = document.querySelector('.toast-notification');
    if (toastExistente) toastExistente.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `<div class="toast-content"><span>🔔</span><span>${mensagem}</span></div>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

function toggleNotificacoes() {
    const sessao = getSessao();
    if (!sessao.logado) {
        window.location.href = '../html/login.html';
        return;
    }
    
    const todasNotificacoes = JSON.parse(localStorage.getItem('notificacoes') || '[]');
    const minhasNotificacoes = todasNotificacoes.filter(n => n.usuarioId === sessao.id);
    
    if (minhasNotificacoes.length === 0) {
        mostrarModal('Notificações', '📭 Você não tem notificações no momento.', 'info');
        return;
    }
    
    let msg = '📬 SUAS NOTIFICAÇÕES:\n\n';
    minhasNotificacoes.forEach((n, i) => {
        msg += `${i+1}. ${n.mensagem}\n`;
        msg += `   📅 ${new Date(n.data).toLocaleString()}\n`;
        msg += `   ${n.lida ? '✅ Lida' : '🔴 Não lida'}\n\n`;
    });
    
    mostrarModal('Notificações', msg, 'info');
}

function marcarTodasNotificacoesLidas() {
    const sessao = getSessao();
    if (!sessao.logado) return;
    
    let notificacoes = JSON.parse(localStorage.getItem('notificacoes') || '[]');
    notificacoes = notificacoes.map(n => {
        if (n.usuarioId === sessao.id) n.lida = true;
        return n;
    });
    localStorage.setItem('notificacoes', JSON.stringify(notificacoes));
    atualizarBadgeNotificacoes();
    mostrarModalSucesso('Notificações', '✅ Todas as notificações foram marcadas como lidas!');
}

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', function() {
    atualizarSidebar();
    atualizarBadgeNotificacoes();
});