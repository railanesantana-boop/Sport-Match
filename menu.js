// menu.js
function atualizarMenuGlobal() {
    const authDiv = document.getElementById('authButtons');
    if (!authDiv) return;
    
    const sessao = getSessao();
    
    if (sessao.logado) {
        let perfilLink = sessao.tipo === 'atleta' ? '../html/perfil_atleta.html' : '../html/perfil_equipe.html';
        
        authDiv.innerHTML = `
            <div class="notification-wrapper">
                <button class="notification-badge" onclick="toggleNotificacoes()" data-count="">🔔</button>
                <div class="notification-dropdown" id="notificationDropdown"></div>
            </div>
            <button class="theme-toggle" onclick="toggleDarkMode()" title="Modo escuro/claro">🌙</button>
            <a href="${perfilLink}" class="btn-login">👤 Meu Perfil</a>
            <a href="#" class="btn-cadastrar" onclick="logout(); return false;">🚪 Sair</a>
        `;
    } else {
        authDiv.innerHTML = `
            <button class="theme-toggle" onclick="toggleDarkMode()" title="Modo escuro/claro">🌙</button>
            <a href="login.html" class="btn-login">Login</a>
            <a href="cadastro_atleta.html" class="btn-cadastrar">Cadastrar →</a>
        `;
    }
    
    atualizarBadgeNotificacoes();
}

document.addEventListener('DOMContentLoaded', function() {
    atualizarMenuGlobal();
});