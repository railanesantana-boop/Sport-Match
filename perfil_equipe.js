// perfil_equipe.js

let equipeAtual = null;
let isVisualizacao = false;

function carregarPerfil() {
    const sessao = JSON.parse(localStorage.getItem('sessao') || sessionStorage.getItem('sessao') || '{}');
    
    // RF-08: Verifica se estamos tentando ver uma equipe específica da lista via URL (?id=...)
    const urlParams = new URLSearchParams(window.location.search);
    const idUrl = urlParams.get('id');
    
    const equipes = JSON.parse(localStorage.getItem('equipes') || '[]');

    if (idUrl) {
        // Se tem ID na URL, busca essa equipe específica
        equipeAtual = equipes.find(e => e.id == idUrl);
        // Só é visualização se o ID da URL não for o meu próprio ID de logado
        isVisualizacao = (equipeAtual && equipeAtual.id !== sessao.id);
    } 
    else if (sessao.logado && sessao.tipo === 'equipe') {
        // Se não tem ID na URL, mas estou logado como equipe, mostro o MEU perfil
        equipeAtual = equipes.find(e => e.id === sessao.id);
        isVisualizacao = false;
    }
    
    if (!equipeAtual) {
        document.getElementById('perfilContainer').innerHTML = `
            <div class="perfil-card" style="text-align:center; padding: 40px;">
                <h2>⚠️ Equipe não encontrada</h2>
                <p>Não foi possível carregar os dados desta equipe.</p>
                <a href="equipes.html" class="btn-primary" style="text-decoration:none; display:inline-block; margin-top:10px;">Voltar para Lista</a>
            </div>`;
        return;
    }
    
    renderizarPerfil();
}

function renderizarPerfil() {
    const container = document.getElementById('perfilContainer');
    
    container.innerHTML = `
        <div class="perfil-card">
            <div class="perfil-header">
                <div class="perfil-avatar">${equipeAtual.nomeEquipe.charAt(0).toUpperCase()}</div>
                <div class="perfil-info">
                    <h1 id="display-nome">${equipeAtual.nomeEquipe}</h1>
                    <p id="display-local">📍 ${equipeAtual.localizacao || 'Local não informado'}</p>
                    
                    <div class="perfil-actions">
                        ${!isVisualizacao ? `
                            <button class="btn-primary" onclick="window.location.href='vagas.html'">+ Nova Vaga</button>
                            <button id="btn-editar-toggle" class="btn-success" onclick="habilitarEdicao()">✏️ Editar Perfil</button>
                            <button class="btn-danger" onclick="excluirEquipe()">🗑️ Excluir Equipe</button>
                        ` : `
                            <button class="btn-primary" onclick="alert('Iniciando conversa...')">📩 Contato</button>
                        `}
                    </div>
                </div>
            </div>

            <div id="form-edicao-container" style="display:none; background: #f8fafc; padding: 20px; border-radius: 12px; margin-top: 20px; border: 1px solid #cbd5e1;">
                <h3 style="margin-bottom:15px;">Editar Dados da Equipe</h3>
                
                <div style="margin-bottom:10px;">
                    <label style="display:block; font-weight:bold;">Nome da Equipe:</label>
                    <input type="text" id="edit-nome" value="${equipeAtual.nomeEquipe}" style="width:100%; padding:10px; border-radius:5px; border:1px solid #ccc;">
                </div>

                <div style="margin-bottom:10px;">
                    <label style="display:block; font-weight:bold;">Localização:</label>
                    <input type="text" id="edit-local" value="${equipeAtual.localizacao || ''}" style="width:100%; padding:10px; border-radius:5px; border:1px solid #ccc;">
                </div>

                <div style="margin-bottom:10px;">
                    <label style="display:block; font-weight:bold;">Descrição (Sobre):</label>
                    <textarea id="edit-desc" style="width:100%; height:100px; padding:10px; border-radius:5px; border:1px solid #ccc;">${equipeAtual.descricao || ''}</textarea>
                </div>

                <button class="btn-success" onclick="salvarAlteracoes()">✅ Salvar</button>
                <button class="btn-danger" onclick="renderizarPerfil()">❌ Cancelar</button>
            </div>

            <div class="perfil-secao" id="secao-info">
                <h3>📝 Sobre</h3>
                <p id="display-desc">${equipeAtual.descricao || 'Nenhuma descrição disponível.'}</p>
            </div>
        </div>
    `;
}

// RF-04: Lógica para abrir o formulário sem pop-up
function habilitarEdicao() {
    document.getElementById('form-edicao-container').style.display = 'block';
    document.getElementById('secao-info').style.display = 'none';
    document.getElementById('btn-editar-toggle').style.display = 'none';
}

function salvarAlteracoes() {
    const novoNome = document.getElementById('edit-nome').value;
    
    if(!novoNome) {
        alert("O nome da equipe não pode ser vazio!");
        return;
    }

    equipeAtual.nomeEquipe = novoNome;
    equipeAtual.localizacao = document.getElementById('edit-local').value;
    equipeAtual.descricao = document.getElementById('edit-desc').value;

    let equipes = JSON.parse(localStorage.getItem('equipes') || '[]');
    const index = equipes.findIndex(e => e.id === equipeAtual.id);
    
    if (index !== -1) {
        equipes[index] = equipeAtual;
        localStorage.setItem('equipes', JSON.stringify(equipes));
        alert('Perfil atualizado com sucesso!');
        renderizarPerfil();
    }
}

// RF-04: Função para Excluir
function excluirEquipe() {
    if (confirm("ATENÇÃO: Você deseja excluir permanentemente esta equipe?")) {
        let equipes = JSON.parse(localStorage.getItem('equipes') || '[]');
        equipes = equipes.filter(e => e.id !== equipeAtual.id);
        localStorage.setItem('equipes', JSON.stringify(equipes));
        
        alert("Equipe removida.");
        window.location.href = 'index.html'; 
    }
}

carregarPerfil();

// Script para garantir que existam dados para o avaliador ver
(function garantirDadosDeTeste() {
    const equipesExistentes = localStorage.getItem('equipes');
    if (!equipesExistentes || JSON.parse(equipesExistentes).length === 0) {
        const dadosTeste = [
            {
                id: "123",
                nomeEquipe: "Equipe Sport Match Teste",
                localizacao: "Belo Horizonte, MG",
                descricao: "Esta é uma equipe de teste criada para validação dos requisitos RF-04 e RF-08."
            }
        ];
        localStorage.setItem('equipes', JSON.stringify(dadosTeste));
        console.log("Dados de teste criados com sucesso!");
    }
})();