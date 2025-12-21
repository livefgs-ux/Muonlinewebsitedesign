/**
 * MeuMU Online - Instalador
 * JavaScript para gerenciar o fluxo de instalação
 */

let currentStep = 1;
const totalSteps = 5;

// Dados do formulário
let installData = {
    database: {},
    backend: {},
    admin: {}
};

// Navegar entre steps
function nextStep() {
    if (currentStep < totalSteps) {
        document.getElementById(`step-${currentStep}`).classList.add('hidden');
        document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
        document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('completed');
        
        currentStep++;
        
        document.getElementById(`step-${currentStep}`).classList.remove('hidden');
        document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
    }
}

function prevStep() {
    if (currentStep > 1) {
        document.getElementById(`step-${currentStep}`).classList.add('hidden');
        document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
        
        currentStep--;
        
        document.getElementById(`step-${currentStep}`).classList.remove('hidden');
        document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('completed');
        document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
    }
}

// Testar conexão do database
async function testDatabase() {
    const form = document.getElementById('db-form');
    const formData = new FormData(form);
    
    const loading = document.getElementById('test-loading');
    const errorDiv = document.getElementById('db-error');
    const successDiv = document.getElementById('db-success');
    
    loading.classList.remove('hidden');
    errorDiv.classList.add('hidden');
    successDiv.classList.add('hidden');
    
    try {
        const response = await fetch('installer.php', {
            method: 'POST',
            body: JSON.stringify({
                action: 'test_database',
                data: Object.fromEntries(formData)
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const result = await response.json();
        
        loading.classList.add('hidden');
        
        if (result.success) {
            successDiv.innerHTML = `<span>✅</span><div><strong>Conexão bem-sucedida!</strong><br>${result.message}</div>`;
            successDiv.classList.remove('hidden');
        } else {
            errorDiv.innerHTML = `<span>❌</span><div><strong>Erro de conexão:</strong><br>${result.message}</div>`;
            errorDiv.classList.add('hidden');
        }
    } catch (error) {
        loading.classList.add('hidden');
        errorDiv.innerHTML = `<span>❌</span><div><strong>Erro:</strong><br>${error.message}</div>`;
        errorDiv.classList.remove('hidden');
    }
}

// Salvar dados do database
function saveDatabase() {
    const form = document.getElementById('db-form');
    const formData = new FormData(form);
    
    installData.database = Object.fromEntries(formData);
    nextStep();
}

// Instalar
async function install() {
    const form = document.getElementById('admin-form');
    const formData = new FormData(form);
    
    // Validar senhas
    const password = formData.get('admin_password');
    const confirm = formData.get('admin_password_confirm');
    
    if (password !== confirm) {
        alert('As senhas não coincidem!');
        return;
    }
    
    // Coletar dados
    installData.admin = Object.fromEntries(formData);
    installData.backend = {
        mode: document.querySelector('input[name="backend_mode"]:checked').value,
        site_url: document.getElementById('site_url').value
    };
    
    const loading = document.getElementById('install-loading');
    loading.classList.remove('hidden');
    
    try {
        const response = await fetch('installer.php', {
            method: 'POST',
            body: JSON.stringify({
                action: 'install',
                data: installData
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const result = await response.json();
        
        loading.classList.add('hidden');
        
        if (result.success) {
            nextStep();
        } else {
            alert('Erro na instalação: ' + result.message);
        }
    } catch (error) {
        loading.classList.add('hidden');
        alert('Erro: ' + error.message);
    }
}

// Event listeners para radio buttons
document.addEventListener('DOMContentLoaded', function() {
    const radioOptions = document.querySelectorAll('.radio-option');
    
    radioOptions.forEach(option => {
        option.addEventListener('click', function() {
            radioOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            this.querySelector('input[type="radio"]').checked = true;
        });
    });
});
