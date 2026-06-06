// modal.js

function mostrarModal(titulo, mensagem, tipo, onConfirm = null, onCancel = null) {
    // Remover modal existente se houver
    const modalExistente = document.querySelector('.modal-overlay');
    if (modalExistente) modalExistente.remove();
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    
    let headerClass = '';
    let botoesHtml = '';
    
    if (tipo === 'success') {
        headerClass = 'modal-success';
        botoesHtml = `<button class="modal-btn modal-btn-primary" id="modalConfirm">OK</button>`;
    } else if (tipo === 'confirm') {
        headerClass = 'modal-info';
        botoesHtml = `
            <button class="modal-btn modal-btn-secondary" id="modalCancel">Cancelar</button>
            <button class="modal-btn modal-btn-primary" id="modalConfirm">Confirmar</button>
        `;
    } else if (tipo === 'danger') {
        headerClass = 'modal-warning';
        botoesHtml = `
            <button class="modal-btn modal-btn-secondary" id="modalCancel">Não</button>
            <button class="modal-btn modal-btn-danger" id="modalConfirm">Sim, confirmar</button>
        `;
    } else {
        headerClass = 'modal-info';
        botoesHtml = `<button class="modal-btn modal-btn-primary" id="modalConfirm">OK</button>`;
    }
    
    modal.innerHTML = `
        <div class="modal-container">
            <div class="modal-header ${headerClass}">
                <h3>${titulo}</h3>
            </div>
            <div class="modal-body">
                <p>${mensagem}</p>
            </div>
            <div class="modal-buttons">
                ${botoesHtml}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const confirmBtn = document.getElementById('modalConfirm');
    const cancelBtn = document.getElementById('modalCancel');
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            modal.remove();
            if (onConfirm) onConfirm();
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            modal.remove();
            if (onCancel) onCancel();
        });
    }
}

function mostrarModalSucesso(titulo, mensagem, callback) {
    mostrarModal(titulo, mensagem, 'success', callback);
}

function mostrarModalConfirmacao(titulo, mensagem, onConfirm, onCancel) {
    mostrarModal(titulo, mensagem, 'confirm', onConfirm, onCancel);
}

function mostrarModalAviso(titulo, mensagem, onConfirm, onCancel) {
    mostrarModal(titulo, mensagem, 'danger', onConfirm, onCancel);
}