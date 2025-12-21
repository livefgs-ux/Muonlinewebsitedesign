<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎮 MeuMU Online - Instalador</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%);
            color: #fff;
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            padding: 40px 0;
        }
        
        .logo {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #FFB800, #FFA000);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 40px;
            box-shadow: 0 10px 30px rgba(255, 184, 0, 0.3);
        }
        
        .header h1 {
            font-size: 32px;
            margin-bottom: 10px;
        }
        
        .header .subtitle {
            color: #FFB800;
            font-size: 18px;
        }
        
        .card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 40px;
            margin-bottom: 20px;
        }
        
        .steps {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
            position: relative;
        }
        
        .steps::before {
            content: '';
            position: absolute;
            top: 20px;
            left: 40px;
            right: 40px;
            height: 2px;
            background: rgba(255, 184, 0, 0.2);
            z-index: 0;
        }
        
        .step {
            flex: 1;
            text-align: center;
            position: relative;
            z-index: 1;
        }
        
        .step-number {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 10px;
            font-weight: bold;
        }
        
        .step.active .step-number {
            background: #FFB800;
            border-color: #FFB800;
            color: #000;
            box-shadow: 0 0 20px rgba(255, 184, 0, 0.5);
        }
        
        .step.completed .step-number {
            background: #10b981;
            border-color: #10b981;
        }
        
        .step-label {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
        }
        
        .step.active .step-label {
            color: #FFB800;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.9);
        }
        
        .form-group input,
        .form-group select {
            width: 100%;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: #fff;
            font-size: 14px;
            transition: all 0.3s;
        }
        
        .form-group input:focus,
        .form-group select:focus {
            outline: none;
            border-color: #FFB800;
            box-shadow: 0 0 0 3px rgba(255, 184, 0, 0.1);
        }
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        
        .btn {
            padding: 14px 32px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #FFB800, #FFA000);
            color: #000;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(255, 184, 0, 0.4);
        }
        
        .btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
        }
        
        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.15);
        }
        
        .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .btn-group {
            display: flex;
            gap: 12px;
            margin-top: 30px;
        }
        
        .alert {
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: flex;
            align-items: flex-start;
            gap: 12px;
        }
        
        .alert-info {
            background: rgba(59, 130, 246, 0.1);
            border: 1px solid rgba(59, 130, 246, 0.3);
            color: #60a5fa;
        }
        
        .alert-success {
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.3);
            color: #34d399;
        }
        
        .alert-error {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #f87171;
        }
        
        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 184, 0, 0.2);
            border-top-color: #FFB800;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .hidden {
            display: none;
        }
        
        .radio-group {
            display: flex;
            gap: 16px;
            margin-top: 8px;
        }
        
        .radio-option {
            flex: 1;
            padding: 16px;
            background: rgba(255, 255, 255, 0.05);
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .radio-option:hover {
            border-color: rgba(255, 184, 0, 0.5);
        }
        
        .radio-option input[type="radio"] {
            margin-right: 8px;
        }
        
        .radio-option input[type="radio"]:checked ~ label {
            color: #FFB800;
        }
        
        .radio-option.selected {
            border-color: #FFB800;
            background: rgba(255, 184, 0, 0.1);
        }
        
        @media (max-width: 768px) {
            .form-row {
                grid-template-columns: 1fr;
            }
            
            .steps {
                flex-wrap: wrap;
            }
            
            .step {
                flex-basis: 50%;
                margin-bottom: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">⚔️</div>
            <h1>MeuMU Online</h1>
            <p class="subtitle">Instalador Automático - Season 19-2-3 Épico</p>
        </div>
        
        <div class="card">
            <div class="steps">
                <div class="step active" data-step="1">
                    <div class="step-number">1</div>
                    <div class="step-label">Bem-vindo</div>
                </div>
                <div class="step" data-step="2">
                    <div class="step-number">2</div>
                    <div class="step-label">Database</div>
                </div>
                <div class="step" data-step="3">
                    <div class="step-number">3</div>
                    <div class="step-label">Backend</div>
                </div>
                <div class="step" data-step="4">
                    <div class="step-number">4</div>
                    <div class="step-label">Concluído</div>
                </div>
            </div>
            
            <!-- Step 1: Bem-vindo -->
            <div id="step-1" class="step-content">
                <h2>🎮 Bem-vindo ao MeuMU Online!</h2>
                <p style="margin: 20px 0; line-height: 1.6; color: rgba(255,255,255,0.8);">
                    Este instalador vai configurar automaticamente seu site completo para servidor MU Online.
                </p>
                
                <div class="alert alert-info">
                    <span>ℹ️</span>
                    <div>
                        <strong>Requisitos:</strong>
                        <ul style="margin-top: 8px; padding-left: 20px;">
                            <li>PHP 7.4+</li>
                            <li>Node.js 18+</li>
                            <li>MariaDB/MySQL 10.3+</li>
                            <li>Apache/LiteSpeed/Nginx</li>
                        </ul>
                    </div>
                </div>
                
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="nextStep()">
                        Começar Instalação →
                    </button>
                </div>
            </div>
            
            <!-- Step 2: Database -->
            <div id="step-2" class="step-content hidden">
                <h2>🗄️ Configuração do Database</h2>
                <p style="margin: 20px 0; color: rgba(255,255,255,0.8);">
                    Configure a conexão com os 2 bancos de dados: <strong>muonline</strong> (servidor MU) e <strong>webmu</strong> (site).
                </p>
                
                <div class="alert alert-info" style="margin-bottom: 20px;">
                    <span>ℹ️</span>
                    <div>
                        <strong>2 Databases necessárias:</strong>
                        <ul style="margin-top: 8px; padding-left: 20px;">
                            <li><strong>muonline</strong>: Database do servidor MU (somente leitura)</li>
                            <li><strong>webmu</strong>: Database do site (será criada automaticamente se não existir)</li>
                        </ul>
                    </div>
                </div>
                
                <div id="db-error" class="alert alert-error hidden"></div>
                <div id="db-success" class="alert alert-success hidden"></div>
                
                <form id="db-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Host</label>
                            <input type="text" name="db_host" value="localhost" required>
                        </div>
                        <div class="form-group">
                            <label>Porta</label>
                            <input type="text" name="db_port" value="3306" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Database do MU (muonline)</label>
                            <input type="text" name="db_mu" value="muonline" required>
                            <small style="color: rgba(255,255,255,0.5); display: block; margin-top: 4px;">
                                Database com accounts, character_info, etc.
                            </small>
                        </div>
                        <div class="form-group">
                            <label>Database do Site (webmu)</label>
                            <input type="text" name="db_web" value="webmu" required>
                            <small style="color: rgba(255,255,255,0.5); display: block; margin-top: 4px;">
                                Database para notícias, votos, etc. (criada automaticamente)
                            </small>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Usuário</label>
                        <input type="text" name="db_user" value="root" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Senha</label>
                        <input type="password" name="db_password">
                    </div>
                    
                    <div class="btn-group">
                        <button type="button" class="btn btn-secondary" onclick="prevStep()">
                            ← Voltar
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="testDatabase()">
                            <span class="loading hidden" id="test-loading"></span>
                            Testar Conexão
                        </button>
                        <button type="button" class="btn btn-primary" onclick="saveDatabase()">
                            Próximo →
                        </button>
                    </div>
                </form>
            </div>
            
            <!-- Step 3: Backend -->
            <div id="step-3" class="step-content hidden">
                <h2>🚀 Configuração Final</h2>
                <p style="margin: 20px 0; color: rgba(255,255,255,0.8);">
                    Escolha como o backend Node.js será executado e finalize a instalação.
                </p>
                
                <div class="alert alert-info" style="margin-bottom: 20px;">
                    <span>ℹ️</span>
                    <div>
                        <strong>Admin do site:</strong> Use uma conta do MU com <code>web_admin = 1</code> na tabela <code>accounts</code>. Não é necessário criar admin separado!
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Modo de Execução:</label>
                    <div class="radio-group">
                        <label class="radio-option selected">
                            <input type="radio" name="backend_mode" value="pm2" checked>
                            <div>
                                <strong>PM2</strong>
                                <p style="font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 4px;">
                                    Recomendado para produção. Reinicia automaticamente.
                                </p>
                            </div>
                        </label>
                        <label class="radio-option">
                            <input type="radio" name="backend_mode" value="standalone">
                            <div>
                                <strong>Node Standalone</strong>
                                <p style="font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 4px;">
                                    Simples, para testes locais.
                                </p>
                            </div>
                        </label>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>URL do Site</label>
                    <input type="text" id="site_url" value="http://localhost" placeholder="http://seudominio.com">
                    <small style="color: rgba(255,255,255,0.6); font-size: 12px;">
                        Use http://localhost para testes locais
                    </small>
                </div>
                
                <div class="btn-group">
                    <button class="btn btn-secondary" onclick="prevStep()">
                        ← Voltar
                    </button>
                    <button class="btn btn-primary" onclick="install()">
                        <span class="loading hidden" id="install-loading"></span>
                        🚀 Instalar Agora
                    </button>
                </div>
            </div>
            
            <!-- Step 4: Concluído -->
            <div id="step-4" class="step-content hidden">
                <div style="text-align: center;">
                    <div style="font-size: 80px; margin-bottom: 20px;">✅</div>
                    <h2>Instalação Concluída!</h2>
                    <p style="margin: 20px 0; color: rgba(255,255,255,0.8);">
                        Seu site MeuMU Online está pronto para uso!
                    </p>
                    
                    <div class="alert alert-success" style="text-align: left; margin: 30px 0;">
                        <span>✅</span>
                        <div>
                            <strong>Próximos passos:</strong>
                            <ol style="margin-top: 8px; padding-left: 20px;">
                                <li>Acesse seu site</li>
                                <li>Faça login com a conta admin criada</li>
                                <li>Configure eventos e notícias no AdminCP</li>
                                <li>Personalize o site conforme necessário</li>
                            </ol>
                        </div>
                    </div>
                    
                    <div class="btn-group" style="justify-content: center;">
                        <a href="/" class="btn btn-primary">
                            🎮 Acessar o Site
                        </a>
                    </div>
                </div>
            </div>
        </div>
        
        <div style="text-align: center; color: rgba(255,255,255,0.4); font-size: 14px; margin-top: 20px;">
            MeuMU Online - Season 19-2-3 Épico
        </div>
    </div>
    
    <script src="script.js"></script>
</body>
</html>