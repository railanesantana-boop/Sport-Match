let atletaAtual = null;
let isVisualizacao = false;

function carregarPerfil() {
    const sessaoSalva = localStorage.getItem('sessao') || sessionStorage.getItem('sessao');
    const sessao = sessaoSalva ? JSON.parse(sessaoSalva) : { logado: false };
    
    const urlParams = new URLSearchParams(window.location.search);
    const visualizarId = sessionStorage.getItem('perfilVisualizado');
    
    if (visualizarId || urlParams.get('view')) {
        const id = visualizarId || urlParams.get('id');
        const atletas = JSON.parse(localStorage.getItem('atletas') || '[]');
        atletaAtual = atletas.find(a => a.id == id);
        isVisualizacao = true;
        sessionStorage.removeItem('perfilVisualizado');
    } 
    else if (sessao.logado && sessao.tipo === 'atleta') {
        const atletas = JSON.parse(localStorage.getItem('atletas') || '[]');
        atletaAtual = atletas.find(a => a.id === sessao.id);
        isVisualizacao = false;
    }
    
    if (!atletaAtual) {
        const container = document.getElementById('perfilContainer');
        if(container) {
            container.innerHTML = `
                <div style="background: white; border-radius: 20px; padding: 40px; text-align: center;">
                    <h2>Perfil não encontrado</h2>
                    <p>Faça login para acessar seu perfil.</p>
                    <a href="login.html" class="btn-primary" style="display: inline-block; margin-top: 16px; text-decoration: none; background: #e94560; color: white; padding: 10px 20px; border-radius: 5px;">Ir para Login</a>
                </div>
            `;
        }
        return;
    }
    renderizarPerfil();
}

function renderizarPerfil(editando = false) {
    const container = document.getElementById('perfilContainer');
    if (!container) return;
    
    let candidaturas = [];
    try {
        candidaturas = JSON.parse(localStorage.getItem('candidaturas') || '[]');
        candidaturas = candidaturas.filter(c => c.atletaId === atletaAtual.id);
    } catch(e) {}
    
    container.innerHTML = `
        <div style="background: white; border-radius: 20px; padding: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="display: flex; gap: 24px; flex-wrap: wrap; align-items: center; padding-bottom: 24px; border-bottom: 1px solid #e2e8f0;">
                <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #e94560, #c72e4a); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: bold; color: white;">
                    ${!atletaAtual.foto ? atletaAtual.nome.charAt(0).toUpperCase() : ''}
                </div>
                <div style="flex: 1;">
                    ${editando ? 
                        `<label style="font-size:0.8rem; color:#64748b;">Nome Completo:</label>
                         <input type="text" id="edit-nome" value="${atletaAtual.nome}" style="display:block; width:100%; padding:10px; margin-bottom:12px; border:1px solid #e2e8f0; border-radius:8px;">` : 
                        `<h1 style="margin: 0 0 8px 0; color: #1e293b;">${atletaAtual.nome}</h1>`
                    }
                    
                    <p style="margin: 4px 0; color: #64748b;">📍 ${atletaAtual.localizacao || 'Local não informado'} • ${atletaAtual.idade} anos</p>
                    <p style="margin: 4px 0; color: #64748b;">⚽ ${atletaAtual.modalidade} • ${atletaAtual.posicao || 'Posição não informada'}</p>
                    
                    ${!isVisualizacao ? `
                        <div style="display: flex; gap: 12px; margin-top: 16px;">
                            ${editando ? 
                                `<button class="btn-primary" style="background:#22c55e; border:none; color:white; padding:10px 20px; border-radius:8px; cursor:pointer;" onclick="salvarEdicao()">💾 Salvar Dados</button>
                                 <button class="btn-outline" style="padding:10px 20px; border-radius:8px; cursor:pointer;" onclick="renderizarPerfil(false)">Cancelar</button>` : 
                                `<button class="btn-primary" style="background:#e94560; border:none; color:white; padding:10px 20px; border-radius:8px; cursor:pointer;" onclick="renderizarPerfil(true)">✏️ Editar Perfil</button>
                                 <button class="btn-outline" style="padding:10px 20px; border-radius:8px; cursor:pointer;" onclick="logout()">🚪 Sair</button>`
                            }
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <div style="margin-top: 24px;">
                <h3 style="color: #e94560; margin-bottom: 16px;">📊 Informações Físicas</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                    <div style="background: #f8fafc; padding: 16px; border-radius: 12px;">
                        <span style="font-size: 0.8rem; color: #64748b;">Peso (kg)</span>
                        ${editando ? 
                            `<input type="text" id="edit-peso" value="${atletaAtual.peso || ''}" style="display:block; width:100%; padding:8px; border-radius:8px; border:1px solid #e2e8f0; margin-top:5px;">` : 
                            `<span style="font-size: 1.2rem; font-weight: bold; color: #1e293b; display: block;">${atletaAtual.peso || 'Não informado'}</span>`
                        }
                    </div>
                    <div style="background: #f8fafc; padding: 16px; border-radius: 12px;">
                        <span style="font-size: 0.8rem; color: #64748b;">Altura (cm)</span>
                        ${editando ? 
                            `<input type="text" id="edit-altura" value="${atletaAtual.altura || ''}" style="display:block; width:100%; padding:8px; border-radius:8px; border:1px solid #e2e8f0; margin-top:5px;">` : 
                            `<span style="font-size: 1.2rem; font-weight: bold; color: #1e293b; display: block;">${atletaAtual.altura || 'Não informado'}</span>`
                        }
                    </div>
                </div>
            </div>

            <div style="margin-top: 24px;">
                <h3 style="color: #e94560; margin-bottom: 16px;">📜 Histórico</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${atletaAtual.historico && atletaAtual.historico.length ? 
                        atletaAtual.historico.map(h => `<span style="background: #f1f5f9; padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; color: #334155;">${h}</span>`).join('') : 
                        '<p style="color: #64748b;">Nenhum histórico cadastrado.</p>'}
                </div>
            </div>

            <div style="margin-top: 24px;">
                <h3 style="color: #e94560; margin-bottom: 16px;">🕒 Atividades Recentes</h3>
                <div id="logAtividades" style="max-height: 150px; overflow-y: auto; background: #f8fafc; padding: 12px; border-radius: 12px;">
                    ${atletaAtual.atividades && atletaAtual.atividades.length ? 
                        atletaAtual.atividades.map(at => `<p style="font-size: 0.85rem; margin: 4px 0; color: #475569;">• ${at.data}: ${at.acao}</p>`).reverse().join('') : 
                        '<p style="color: #64748b; font-size: 0.85rem;">Nenhuma atividade registrada.</p>'}
                </div>
            </div>
            
            ${renderizarConvites()}
        </div>
    `;
}

function salvarEdicao() {
    const novoNome = document.getElementById('edit-nome').value;
    const novoPeso = document.getElementById('edit-peso').value;
    const novaAltura = document.getElementById('edit-altura').value;

    if (!novoNome.trim()) {
        document.getElementById('edit-nome').style.border = "2px solid red";
        return;
    }

    atletaAtual.nome = novoNome.trim();
    atletaAtual.peso = novoPeso;
    atletaAtual.altura = novaAltura;

    // ADICIONADO PARA REQUISITO 4: REGISTRA A ATIVIDADE AO SALVAR
    registrarAtividade("Atualizou as informações do perfil.");

    atualizarLocalStorage();
    renderizarPerfil(false);

    if (typeof mostrarModalSucesso === 'function') {
        mostrarModalSucesso('Sucesso!', 'Seu perfil foi atualizado.');
    }
}

// ADICIONADO PARA REQUISITO 4: FUNÇÃO DE LOG
function registrarAtividade(acao) {
    if (!atletaAtual.atividades) atletaAtual.atividades = [];
    const agora = new Date();
    const dataFormatada = agora.toLocaleDateString() + " " + agora.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    atletaAtual.atividades.push({ data: dataFormatada, acao: acao });
}

// ADICIONADO PARA REQUISITO 8: FUNÇÃO DE PESQUISA/FILTRO (EXEMPLO PARA BUSCAR NO LOCALSTORAGE)
function pesquisarNoSistema(termo) {
    const atletas = JSON.parse(localStorage.getItem('atletas') || '[]');
    return atletas.filter(atleta => 
        atleta.nome.toLowerCase().includes(termo.toLowerCase()) || 
        atleta.modalidade.toLowerCase().includes(termo.toLowerCase())
    );
}

function atualizarLocalStorage() {
    const atletas = JSON.parse(localStorage.getItem('atletas') || '[]');
    const index = atletas.findIndex(a => a.id === atletaAtual.id);
    if (index !== -1) {
        atletas[index] = atletaAtual;
        localStorage.setItem('atletas', JSON.stringify(atletas));
    }
}

function logout() {
    localStorage.removeItem('sessao');
    sessionStorage.removeItem('sessao');
    window.location.href = '../html/index.html';
}

function renderizarConvites() {
    const convites = JSON.parse(localStorage.getItem('convites') || '[]');
    const meusConvites = convites.filter(c => c.atletaId === atletaAtual.id && c.status === 'pendente');
    if (meusConvites.length === 0) return '';
    return `<div style="margin-top:20px;"><h3>Convites Pendentes</h3></div>`;
}

carregarPerfil();