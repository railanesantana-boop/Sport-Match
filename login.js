// login.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('Login.js carregado');
    
    const sessaoExistente = getSessao();
    if (sessaoExistente.logado) {
        console.log('Sessão já existe. Redirecionando...');
        if (sessaoExistente.tipo === 'atleta') {
            window.location.href = '../html/perfil_atleta.html';
        } else if (sessaoExistente.tipo === 'equipe') {
            window.location.href = '../html/perfil_equipe.html';
        }
        return;
    }
    
    const form = document.getElementById('loginForm');
    if (!form) {
        console.error('Formulário de login não encontrado!');
        return;
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email')?.value;
        const senha = document.getElementById('senha')?.value;
        const lembrar = document.getElementById('lembrar')?.checked || false;
        
        if (!email || !senha) {
            alert('Preencha email e senha!');
            return;
        }
        
        let atletas = [];
        let equipes = [];
        
        try {
            atletas = JSON.parse(localStorage.getItem('atletas') || '[]');
            equipes = JSON.parse(localStorage.getItem('equipes') || '[]');
        } catch (error) {
            alert('Erro ao acessar dados. Tente novamente.');
            return;
        }
        
        let usuario = atletas.find(a => a.email === email && a.senha === senha);
        let tipo = 'atleta';
        
        if (!usuario) {
            usuario = equipes.find(e => e.email === email && e.senha === senha);
            tipo = 'equipe';
        }
        
        if (usuario) {
            localStorage.removeItem('sessao');
            sessionStorage.removeItem('sessao');
            
            const sessao = {
                id: usuario.id,
                nome: usuario.nome || usuario.nomeEquipe,
                email: usuario.email,
                tipo: tipo,
                logado: true,
                timestamp: Date.now()
            };
            
            if (lembrar) {
                localStorage.setItem('sessao', JSON.stringify(sessao));
            } else {
                sessionStorage.setItem('sessao', JSON.stringify(sessao));
            }
            
            if (tipo === 'atleta') {
                window.location.href = '../html/perfil_atleta.html';
            } else {
                window.location.href = '../html/perfil_equipe.html';
            }
        } else {
            alert('Email ou senha incorretos!');
        }
    });
});

// Função para recuperar senha
function recuperarSenha() {
    const email = prompt('Digite seu email cadastrado para recuperar a senha:');
    if (!email) return;
    
    const atletas = JSON.parse(localStorage.getItem('atletas') || '[]');
    const equipes = JSON.parse(localStorage.getItem('equipes') || '[]');
    
    const usuario = [...atletas, ...equipes].find(u => u.email === email);
    
    if (usuario) {
        alert(`Sua senha é: ${usuario.senha}\n\nRecomendamos alterar após o login.`);
    } else {
        alert('Email não encontrado!');
    }
}