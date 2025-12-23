// MeuMU Online - Instalador Web - JavaScript

// Estado global
let currentStep = 1;
let installData = {
    domain: '',
    installPath: '',
    dbMU: {},
    dbWEB: {},
    testResults: {
        mu: false,
        web: false
    }
};

// ════════════════════════════════════════════════════════════════
//  CONFIGURAÇÃO DA API
// ════════════════════════════════════════════════════════════════

// Detectar protocolo e hostname automaticamente
// Tentar HTTPS primeiro, depois HTTP
const API_BASE_URLS = [
    `${window.location.protocol}//${window.location.hostname}:3001`, // Mesmo protocolo
    `http://${window.location.hostname}:3001`, // HTTP forçado
    `https://${window.location.hostname}:3001` // HTTPS forçado
];

let API_BASE_URL = API_BASE_URLS[0]; // Começar com o primeiro

// Função helper para fazer fetch com fallback
async function apiFetch(endpoint, options = {}) {
    const errors = [];
    
    // Tentar cada URL até funcionar
    for (const baseUrl of API_BASE_URLS) {
        try {
            console.log(`🔄 Tentando: ${baseUrl}${endpoint}`);
            const response = await fetch(`${baseUrl}${endpoint}`, options);
            
            // Se chegou aqui, funcionou! Salvar essa URL
            API_BASE_URL = baseUrl;
            console.log(`✅ Sucesso com: ${baseUrl}`);
            
            return response;
        } catch (error) {
            console.warn(`❌ Falhou com ${baseUrl}: ${error.message}`);
            errors.push(`${baseUrl}: ${error.message}`);
            continue;
        }
    }
    
    // Se nenhuma funcionou, lançar erro
    throw new Error(`Não foi possível conectar à API. Tentativas:\n${errors.join('\n')}`);
}

// ════════════════════════════════════════════════════════════════
// INICIALIZAÇÃO
// ════════════════════════════════════════════════════════════════

window.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Instalador carregado');
    console.log('🌐 Current URL:', window.location.href);
    console.log('📍 API URLs (tentar em ordem):', API_BASE_URLS);
    checkRequirements();
});

// ════════════════════════════════════════════════════════════════
// NAVEGAÇÃO ENTRE PASSOS
// ════════════════════════════════════════════════════════════════

function goToStep(step) {
    // Esconder todos os passos
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`step${i}`).classList.add('hidden');
    }
    
    // Mostrar passo atual
    document.getElementById(`step${step}`).classList.remove('hidden');
    currentStep = step;
    
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ════════════════════════════════════════════════════════════════
// PASSO 1: VERIFICAÇÃO DE REQUISITOS
// ════════════════════════════════════════════════════════════════

async function checkRequirements() {
    const container = document.getElementById('checksContainer');
    container.innerHTML = '<div class="check-item checking"><div class="check-icon">⏳</div><div class="check-content"><div class="check-name">Verificando sistema...</div></div></div>';
    
    document.getElementById('btnNext1').disabled = true;
    
    try {
        const response = await apiFetch('/api/install/check-requirements', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Erro ao verificar requisitos');
        }
        
        // Renderizar checks
        container.innerHTML = '';
        
        for (const [key, check] of Object.entries(data.checks)) {
            const item = document.createElement('div');
            item.className = `check-item ${check.status}`;
            
            let icon = '⏳';
            if (check.status === 'success') icon = '✅';
            else if (check.status === 'warning') icon = '⚠️';
            else if (check.status === 'error') icon = '❌';
            
            item.innerHTML = `
                <div class="check-icon">${icon}</div>
                <div class="check-content">
                    <div class="check-name">${check.name}</div>
                    ${check.value ? `<div class="check-value">${check.value}</div>` : ''}
                    ${check.error ? `<div class="check-error">${check.error}</div>` : ''}
                </div>
            `;
            
            container.appendChild(item);
        }
        
        // Pode continuar?
        if (data.canContinue) {
            document.getElementById('btnNext1').disabled = false;
        } else {
            container.innerHTML += `
                <div class="alert alert-error" style="margin-top: 20px;">
                    <strong>❌ Não é possível continuar!</strong><br>
                    Corrija os erros acima antes de prosseguir.
                </div>
            `;
        }
        
    } catch (error) {
        console.error('Erro ao verificar requisitos:', error);
        container.innerHTML = `
            <div class="alert alert-error">
                <strong>❌ Erro ao verificar requisitos:</strong><br>
                ${error.message}
            </div>
        `;
    }
}

// ════════════════════════════════════════════════════════════════
// PASSO 2: TESTAR DATABASE
// ════════════════════════════════════════════════════════════════

async function testDatabase(type) {
    const prefix = type === 'mu' ? 'MU' : 'WEB';
    const resultElement = document.getElementById(`test${prefix}Result`);
    
    // Coletar dados
    const dbData = {
        host: document.getElementById(`input${prefix}Host`).value,
        port: document.getElementById(`input${prefix}Port`).value,
        user: document.getElementById(`input${prefix}User`).value,
        password: document.getElementById(`input${prefix}Pass`).value,
        database: document.getElementById(`input${prefix}DB`).value,
        type: type
    };
    
    // Validar
    if (!dbData.password) {
        resultElement.innerHTML = '<span style="color: #f44336;">❌ Preencha a senha</span>';
        return;
    }
    
    // Mostrar loading
    resultElement.innerHTML = '<div class="spinner"></div> Testando...';
    
    try {
        const response = await apiFetch('/api/install/test-database', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dbData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            resultElement.innerHTML = `<span style="color: #4caf50;">✅ Conectado! (${data.tables} tabelas)</span>`;
            installData.testResults[type] = true;
            
            // Marcar input como sucesso
            document.getElementById(`input${prefix}Host`).classList.add('success');
            document.getElementById(`input${prefix}Pass`).classList.add('success');
            
            // Mostrar info de tabelas (se MU)
            if (type === 'mu' && data.importantTables) {
                const tables = data.importantTables;
                resultElement.innerHTML += `<br><span style="color: #a0a0a0; font-size: 0.9em;">
                    Accounts: ${tables.accounts ? '✅' : '❌'} | 
                    Characters: ${tables.characters ? '✅' : '❌'} | 
                    Guild: ${tables.guild ? '✅' : '❌'}
                </span>`;
            }
        } else {
            resultElement.innerHTML = `<span style="color: #f44336;">❌ ${data.error}</span>`;
            installData.testResults[type] = false;
            
            document.getElementById(`input${prefix}Pass`).classList.add('error');
        }
        
        // Habilitar próximo se ambos funcionarem
        checkCanProceed();
        
    } catch (error) {
        resultElement.innerHTML = `<span style="color: #f44336;">❌ Erro: ${error.message}</span>`;
        installData.testResults[type] = false;
    }
}

function checkCanProceed() {
    const canProceed = installData.testResults.mu && installData.testResults.web;
    document.getElementById('btnNext2').disabled = !canProceed;
}

// ════════════════════════════════════════════════════════════════
// PASSO 3: INSTALAÇÃO
// ════════════════════════════════════════════════════════════════

async function startInstall() {
    const btnInstall = document.getElementById('btnInstall');
    const btnBack = document.getElementById('btnBack3');
    const logContainer = document.getElementById('logContainer');
    const alertContainer = document.getElementById('installAlert');
    const progressBar = document.getElementById('progressBar');
    
    // Desabilitar botões
    btnInstall.disabled = true;
    btnBack.disabled = true;
    
    // Limpar log
    logContainer.innerHTML = '';
    alertContainer.innerHTML = '';
    
    // Coletar dados
    installData.domain = document.getElementById('inputDomain').value;
    installData.installPath = document.getElementById('inputPath').value;
    
    installData.dbMU = {
        host: document.getElementById('inputMUHost').value,
        port: document.getElementById('inputMUPort').value,
        user: document.getElementById('inputMUUser').value,
        password: document.getElementById('inputMUPass').value,
        database: document.getElementById('inputMUDB').value
    };
    
    installData.dbWEB = {
        host: document.getElementById('inputWEBHost').value,
        port: document.getElementById('inputWEBPort').value,
        user: document.getElementById('inputWEBUser').value,
        password: document.getElementById('inputWEBPass').value,
        database: document.getElementById('inputWEBDB').value
    };
    
    // Adicionar log helper
    function addLog(message, type = 'info') {
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        
        let icon = 'ℹ️';
        let color = '#a0a0a0';
        
        if (type === 'success') {
            icon = '✅';
            color = '#4caf50';
        } else if (type === 'error') {
            icon = '❌';
            color = '#f44336';
        } else if (type === 'warning') {
            icon = '⚠️';
            color = '#ff9800';
        }
        
        logEntry.style.color = color;
        logEntry.innerHTML = `${icon} ${message}`;
        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }
    
    try {
        addLog('Iniciando instalação...', 'info');
        progressBar.style.width = '10%';
        progressBar.textContent = '10%';
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        addLog('Enviando dados para servidor...', 'info');
        progressBar.style.width = '30%';
        progressBar.textContent = '30%';
        
        const response = await apiFetch('/api/install/install', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(installData)
        });
        
        const data = await response.json();
        
        progressBar.style.width = '60%';
        progressBar.textContent = '60%';
        
        if (!data.success) {
            throw new Error(data.error || 'Erro desconhecido');
        }
        
        // Mostrar logs do servidor
        if (data.log && data.log.length > 0) {
            for (const log of data.log) {
                if (log.includes('✅')) addLog(log, 'success');
                else if (log.includes('❌')) addLog(log, 'error');
                else if (log.includes('⚠')) addLog(log, 'warning');
                else addLog(log, 'info');
                
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }
        
        progressBar.style.width = '80%';
        progressBar.textContent = '80%';
        
        // Testar proxy
        addLog('Testando proxy reverso...', 'info');
        
        try {
            const proxyResponse = await apiFetch('/api/install/test-proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ domain: installData.domain })
            });
            
            const proxyData = await proxyResponse.json();
            
            if (proxyData.proxy && proxyData.proxy.works) {
                addLog('Proxy configurado com sucesso!', 'success');
            } else {
                addLog('Proxy não está funcionando (site funcionará na porta 3001)', 'warning');
            }
        } catch (proxyError) {
            addLog('Não foi possível testar proxy', 'warning');
        }
        
        progressBar.style.width = '100%';
        progressBar.textContent = '100%';
        
        addLog('Instalação concluída com sucesso!', 'success');
        
        alertContainer.innerHTML = `
            <div class="alert alert-success">
                <strong>✅ Sucesso!</strong><br>
                MeuMU Online foi instalado com sucesso!<br>
                Acesse: <a href="http://${installData.domain}:3001" target="_blank" style="color: #4caf50; text-decoration: underline;">http://${installData.domain}:3001</a>
            </div>
        `;
        
        // Ir para próximo passo após 2 segundos
        setTimeout(() => {
            goToStep(4);
        }, 2000);
        
    } catch (error) {
        console.error('Erro na instalação:', error);
        
        addLog(`Erro: ${error.message}`, 'error');
        
        alertContainer.innerHTML = `
            <div class="alert alert-error">
                <strong>❌ Erro na instalação:</strong><br>
                ${error.message}<br><br>
                Verifique os logs acima para mais detalhes.
            </div>
        `;
        
        btnInstall.disabled = false;
        btnBack.disabled = false;
        
        progressBar.style.width = '0%';
        progressBar.textContent = '0%';
    }
}

// ════════════════════════════════════════════════════════════════
// PASSO 4: REMOVER INSTALADOR
// ════���═══════════════════════════════════════════════════════════

async function removeInstaller() {
    if (!confirm('Tem certeza que deseja remover a pasta /install?\n\nEsta ação não pode ser desfeita!')) {
        return;
    }
    
    try {
        const response = await apiFetch('/api/install/remove-installer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('✅ Instalador removido com sucesso!\n\nRedirecionando para o site...');
            window.location.href = '/';
        } else {
            alert('❌ Erro ao remover instalador:\n' + data.error);
        }
    } catch (error) {
        alert('❌ Erro: ' + error.message);
    }
}