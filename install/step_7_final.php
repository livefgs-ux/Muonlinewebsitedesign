<?php
/**
 * MeuMU Online - Step 7: Conclusão Final
 * 
 * @version 3.0.0 - AUTOMÁTICO
 * @author MeuMU Team
 * @copyright (c) 2024-2025 MeuMU Online, All Rights Reserved
 */

if(!defined('access') or !access or access != 'install') die();

$siteUrl = $_SESSION['install_site_url'] ?? 'http://' . $_SERVER['HTTP_HOST'];
?>

<style>
.success-animation {
	text-align: center;
	padding: 48px 0;
}

.success-icon {
	font-size: 120px;
	animation: successPulse 2s infinite;
}

@keyframes successPulse {
	0%, 100% { transform: scale(1); opacity: 1; }
	50% { transform: scale(1.1); opacity: 0.8; }
}

.final-steps {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 24px;
	margin: 32px 0;
}

.final-step-card {
	background: linear-gradient(135deg, rgba(255,184,0,0.1), rgba(255,184,0,0.05));
	border: 2px solid #FFB800;
	border-radius: 12px;
	padding: 24px;
	transition: transform 0.3s ease;
}

.final-step-card:hover {
	transform: translateY(-4px);
	box-shadow: 0 8px 24px rgba(255,184,0,0.3);
}

.final-step-number {
	display: inline-block;
	width: 48px;
	height: 48px;
	background: #FFB800;
	color: #000;
	border-radius: 50%;
	font-size: 24px;
	font-weight: bold;
	line-height: 48px;
	text-align: center;
	margin-bottom: 16px;
}

.final-step-title {
	font-size: 20px;
	font-weight: bold;
	color: #FFB800;
	margin-bottom: 12px;
}

.final-step-content {
	color: rgba(255,255,255,0.9);
	line-height: 1.6;
}

.command-box {
	background: #0a0a0a;
	border: 1px solid rgba(255,184,0,0.3);
	border-radius: 6px;
	padding: 12px;
	font-family: 'Courier New', monospace;
	font-size: 14px;
	color: #28a745;
	margin: 8px 0;
	cursor: pointer;
	position: relative;
}

.command-box:hover {
	border-color: #FFB800;
	background: rgba(255,184,0,0.05);
}

.copy-button {
	position: absolute;
	right: 8px;
	top: 8px;
	background: rgba(255,184,0,0.2);
	border: 1px solid #FFB800;
	color: #FFB800;
	padding: 4px 12px;
	border-radius: 4px;
	font-size: 12px;
	cursor: pointer;
	transition: all 0.2s;
}

.copy-button:hover {
	background: #FFB800;
	color: #000;
}

.security-warning {
	background: linear-gradient(135deg, rgba(220,53,69,0.2), rgba(220,53,69,0.1));
	border: 2px solid #dc3545;
	border-radius: 12px;
	padding: 24px;
	margin: 32px 0;
}

.checklist {
	background: rgba(255,255,255,0.05);
	border-radius: 8px;
	padding: 24px;
	margin: 24px 0;
}

.checklist-item {
	display: flex;
	align-items: center;
	padding: 12px;
	margin: 8px 0;
	background: rgba(255,255,255,0.02);
	border-radius: 6px;
	cursor: pointer;
	transition: background 0.2s;
}

.checklist-item:hover {
	background: rgba(255,184,0,0.1);
}

.checklist-item input[type="checkbox"] {
	width: 24px;
	height: 24px;
	margin-right: 16px;
	cursor: pointer;
}

.checklist-item label {
	cursor: pointer;
	flex: 1;
	color: rgba(255,255,255,0.9);
}
</style>

<div class="success-animation">
	<div class="success-icon">🎉</div>
	<h1 style="color: #FFB800; font-size: 48px; margin: 16px 0;">Instalação Concluída!</h1>
	<p style="font-size: 20px; color: rgba(255,255,255,0.8);">MeuMU Online - Season 19-2-3 Épico está pronto!</p>
</div>

<div class="alert alert-success" style="text-align: center;">
	<span>✅</span>
	<div>
		<strong style="font-size: 18px;">O que foi feito automaticamente:</strong>
		<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 16px; text-align: left;">
			<div>✅ Arquivos de configuração criados</div>
			<div>✅ Dependências instaladas</div>
			<div>✅ React buildado para produção</div>
			<div>✅ .htaccess configurado</div>
			<div>✅ Estrutura verificada</div>
		</div>
	</div>
</div>

<br>

<h2 style="color: #FFB800; text-align: center; margin: 32px 0;">📋 Próximos Passos</h2>

<div class="final-steps">
	
	<!-- Step 1: Reiniciar Apache -->
	<div class="final-step-card">
		<div class="final-step-number">1</div>
		<div class="final-step-title">Reiniciar Servidor Web</div>
		<div class="final-step-content">
			<p>Reinicie o Apache/Nginx para aplicar as configurações:</p>
			
			<div class="command-box" onclick="copyCommand(this, 'sudo systemctl restart apache2')">
				sudo systemctl restart apache2
				<button class="copy-button">📋 Copiar</button>
			</div>
			
			<small style="color: rgba(255,255,255,0.6);">Ou no XAMPP: Painel de controle → Restart Apache</small>
		</div>
	</div>
	
	<!-- Step 2: Iniciar Backend -->
	<div class="final-step-card">
		<div class="final-step-number">2</div>
		<div class="final-step-title">Iniciar Backend Node.js</div>
		<div class="final-step-content">
			<p><strong>Opção A: PM2 (Recomendado)</strong></p>
			<div class="command-box" onclick="copyCommand(this, 'cd backend-nodejs && npm install && pm2 start src/server.js --name meumu-backend && pm2 save')">
				cd backend-nodejs<br>
				npm install<br>
				pm2 start src/server.js --name meumu-backend<br>
				pm2 save
				<button class="copy-button">📋 Copiar</button>
			</div>
			
			<p><strong>Opção B: Node Standalone</strong></p>
			<div class="command-box" onclick="copyCommand(this, 'cd backend-nodejs && npm install && npm start')">
				cd backend-nodejs<br>
				npm install<br>
				npm start
				<button class="copy-button">📋 Copiar</button>
			</div>
		</div>
	</div>
	
	<!-- Step 3: Testar -->
	<div class="final-step-card">
		<div class="final-step-number">3</div>
		<div class="final-step-title">Testar Instalação</div>
		<div class="final-step-content">
			<p><strong>Backend rodando:</strong></p>
			<div class="command-box" onclick="copyCommand(this, 'curl http://localhost:3001/api/health')">
				curl http://localhost:3001/api/health
				<button class="copy-button">📋 Copiar</button>
			</div>
			<small style="color: #28a745;">Deve retornar: {"status":"ok"}</small>
			
			<br><br>
			
			<p><strong>Frontend funcionando:</strong></p>
			<a href="<?php echo $siteUrl; ?>" target="_blank" class="btn btn-primary" style="display: inline-block; margin-top: 8px;">
				🌐 Abrir Site
			</a>
		</div>
	</div>
	
</div>

<!-- Checklist -->
<div class="checklist">
	<h3 style="color: #FFB800; margin-bottom: 16px;">✅ Checklist de Verificação</h3>
	
	<div class="checklist-item">
		<input type="checkbox" id="check1">
		<label for="check1">Servidor web reiniciado (Apache/Nginx)</label>
	</div>
	
	<div class="checklist-item">
		<input type="checkbox" id="check2">
		<label for="check2">Backend Node.js rodando na porta 3001</label>
	</div>
	
	<div class="checklist-item">
		<input type="checkbox" id="check3">
		<label for="check3">Teste de saúde do backend: <code>curl http://localhost:3001/api/health</code> retorna OK</label>
	</div>
	
	<div class="checklist-item">
		<input type="checkbox" id="check4">
		<label for="check4">Site abre sem erros no navegador</label>
	</div>
	
	<div class="checklist-item">
		<input type="checkbox" id="check5">
		<label for="check5">Console do navegador (F12) sem erros MIME type</label>
	</div>
	
	<div class="checklist-item">
		<input type="checkbox" id="check6">
		<label for="check6">Login/Cadastro funcionando (conectando ao MySQL)</label>
	</div>
	
	<div class="checklist-item">
		<input type="checkbox" id="check7">
		<label for="check7">Rankings mostrando dados reais do banco</label>
	</div>
	
</div>

<!-- Segurança -->
<div class="security-warning">
	<h3 style="color: #dc3545; margin-bottom: 16px;">🔒 SEGURANÇA CRÍTICA</h3>
	
	<div class="alert alert-danger">
		<span>⚠️</span>
		<div>
			<strong>DELETE A PASTA /install IMEDIATAMENTE!</strong>
			<br><br>
			<p>Deixar o instalador acessível é um risco de segurança GRAVE!</p>
			
			<div class="command-box" onclick="copyCommand(this, 'rm -rf install/')">
				rm -rf install/
				<button class="copy-button">📋 Copiar</button>
			</div>
			
			<br>
			
			<p>Ou pelo FTP/painel de controle, delete a pasta <code>/install</code> completamente.</p>
		</div>
	</div>
	
	<h4 style="color: #FFB800; margin-top: 24px;">Outras medidas de segurança:</h4>
	
	<div class="command-box" onclick="copyCommand(this, 'chmod 640 config.php backend-nodejs/.env')">
		# Proteger arquivos sensíveis<br>
		chmod 640 config.php<br>
		chmod 640 backend-nodejs/.env
		<button class="copy-button">📋 Copiar</button>
	</div>
	
	<div class="command-box" onclick="copyCommand(this, 'sudo certbot --apache -d meumu.com -d www.meumu.com')">
		# Instalar SSL (Let's Encrypt)<br>
		sudo certbot --apache -d meumu.com -d www.meumu.com
		<button class="copy-button">📋 Copiar</button>
	</div>
</div>

<!-- Informações Finais -->
<div style="background: linear-gradient(135deg, rgba(255,184,0,0.2), rgba(255,184,0,0.05)); border: 2px solid #FFB800; border-radius: 12px; padding: 32px; margin: 32px 0; text-align: center;">
	<h2 style="color: #FFB800; margin-bottom: 16px;">🎮 Seu Servidor MU Está Pronto! 🎮</h2>
	
	<p style="font-size: 18px; color: rgba(255,255,255,0.9); margin: 16px 0;">
		<strong>MeuMU Online - Season 19-2-3 Épico</strong>
	</p>
	
	<div style="display: flex; gap: 16px; justify-content: center; margin-top: 24px; flex-wrap: wrap;">
		<a href="<?php echo $siteUrl; ?>" target="_blank" class="btn btn-success btn-lg">
			🌐 Acessar Site
		</a>
		
		<a href="<?php echo $siteUrl; ?>/admin" target="_blank" class="btn btn-primary btn-lg">
			⚙️ Painel Admin
		</a>
	</div>
	
	<p style="margin-top: 32px; color: rgba(255,255,255,0.7);">
		Documentação completa em:
		<code>/LEIA-ME-PRIMEIRO.md</code>
		<code>/SITE_FUNCIONANDO.md</code>
	</p>
</div>

<!-- Comandos Úteis -->
<div style="margin: 32px 0;">
	<h3 style="color: #FFB800; margin-bottom: 16px;">📝 Comandos Úteis</h3>
	
	<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
		
		<div>
			<strong style="color: #FFB800;">Ver logs do backend (PM2):</strong>
			<div class="command-box" onclick="copyCommand(this, 'pm2 logs meumu-backend')">
				pm2 logs meumu-backend
				<button class="copy-button">📋</button>
			</div>
		</div>
		
		<div>
			<strong style="color: #FFB800;">Reiniciar backend (PM2):</strong>
			<div class="command-box" onclick="copyCommand(this, 'pm2 restart meumu-backend')">
				pm2 restart meumu-backend
				<button class="copy-button">📋</button>
			</div>
		</div>
		
		<div>
			<strong style="color: #FFB800;">Ver status (PM2):</strong>
			<div class="command-box" onclick="copyCommand(this, 'pm2 status')">
				pm2 status
				<button class="copy-button">📋</button>
			</div>
		</div>
		
		<div>
			<strong style="color: #FFB800;">Logs do Apache:</strong>
			<div class="command-box" onclick="copyCommand(this, 'tail -f /var/log/apache2/error.log')">
				tail -f /var/log/apache2/error.log
				<button class="copy-button">📋</button>
			</div>
		</div>
		
		<div>
			<strong style="color: #FFB800;">Testar MySQL:</strong>
			<div class="command-box" onclick="copyCommand(this, 'mysql -u root -p muonline')">
				mysql -u root -p muonline
				<button class="copy-button">📋</button>
			</div>
		</div>
		
		<div>
			<strong style="color: #FFB800;">Rebuildar frontend:</strong>
			<div class="command-box" onclick="copyCommand(this, 'npm run build')">
				npm run build
				<button class="copy-button">📋</button>
			</div>
		</div>
		
	</div>
</div>

<div style="text-align: center; padding: 32px; color: rgba(255,255,255,0.6);">
	<p>MeuMU Online v3.0.0 - Instalador Automático</p>
	<p>© 2024-2025 MeuMU Team • All Rights Reserved</p>
	<br>
	<p style="font-size: 24px;">🎮 Bom jogo! 🎮</p>
</div>

<script>
function copyCommand(element, command) {
	// Remover quebras de linha HTML
	const cleanCommand = command || element.textContent.replace(/\s+/g, ' ').trim();
	
	navigator.clipboard.writeText(cleanCommand).then(() => {
		const button = element.querySelector('.copy-button');
		const originalText = button.textContent;
		button.textContent = '✅ Copiado!';
		button.style.background = '#28a745';
		button.style.color = '#fff';
		
		setTimeout(() => {
			button.textContent = originalText;
			button.style.background = '';
			button.style.color = '';
		}, 2000);
	});
}
</script>
