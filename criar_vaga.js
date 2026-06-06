// criar_vaga.js
document.addEventListener('DOMContentLoaded', function() {
    const sessao = getSessao();
    
    if (!sessao.logado || sessao.tipo !== 'equipe') {
        alert('Apenas equipes podem criar vagas!');
        window.location.href = '../html/login.html';
        return;
    }
    
    const form = document.getElementById('criarVagaForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const novaVaga = {
            id: Date.now(),
            titulo: document.getElementById('titulo')?.value,
            modalidade: document.getElementById('modalidade')?.value,
            nivel: document.getElementById('nivel')?.value,
            descricao: document.getElementById('descricao')?.value || '',
            dataCriacao: new Date().toISOString()
        };
        
        if (!novaVaga.titulo || !novaVaga.modalidade || !novaVaga.nivel) {
            alert('Preencha todos os campos!');
            return;
        }
        
        let equipes = JSON.parse(localStorage.getItem('equipes') || '[]');
        const index = equipes.findIndex(e => e.id === sessao.id);
        
        if (index !== -1) {
            if (!equipes[index].vagas) equipes[index].vagas = [];
            equipes[index].vagas.push(novaVaga);
            localStorage.setItem('equipes', JSON.stringify(equipes));
            
            alert('Vaga publicada com sucesso!');
            window.location.href = '../html/perfil_equipe.html';
        } else {
            alert('Erro ao publicar vaga!');
        }
    });
});