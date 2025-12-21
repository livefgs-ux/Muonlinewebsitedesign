<?php
/**
 * MeuMU Online - Step 7: Conclusão (v2)
 * 
 * @version 2.0.1
 * @author MeuMU Team
 * @copyright (c) 2024-2025 MeuMU Online, All Rights Reserved
 */

if(!defined('access') or !access or access != 'install') die();
?>

<div style="text-align: center; max-width: 900px; margin: 0 auto;">
	<h1 style="font-size: 48px; margin-bottom: 8px;">🎉</h1>
	<h2 style="color: #FFB800; margin-bottom: 8px;">Instalação Concluída!</h2>
	<p style="font-size: 18px; color: rgba(255,255,255,0.8);">Arquivos de configuração criados com sucesso!</p>
</div>

<br><br>

<!-- AVISO CRÍTICO -->
<div class="alert alert-danger" style="border: 3px solid #dc3545;">
	<span style="font-size: 32px;">⚠️</span>
	<div>
		<strong style="font-size: 22px;">O SITE AINDA NÃO ESTÁ FUNCIONANDO!</strong>
		<br><br>
		<span style="font-size: 18px;">
			Se você tentar acessar o site agora, vai dar erro:<br>
			<code>"Expected a JavaScript module script but got application/octet-stream"</code>
		</span>
		<br><br>
		<strong style="font-size: 18px;">Você PRECISA completar os 3 passos abaixo primeiro!</strong>
	</div>
</div>

<br>

<!-- PASSOS OBRIGATÓRIOS -->
<div style="background: linear-gradient(135deg, rgba(139,69,19,0.3), rgba(101,67,33,0.3)); border: 2px solid #FFB800; border-radius: 12px; padding: 32px; margin: 24px 0;">
	<h3 style="color: #FFB800; font-size: 24px; margin-bottom: 24px; text-align: center;">
		📋 PASSOS OBRIGATÓRIOS (Execute na Ordem)
	</h3>
	
	<!-- PASSO 1: BUILD -->
	<div style="background: rgba(0,0,0,0.4); border-left: 4px solid #FFB800; padding: 20px; margin-bottom: 20px; border-radius: 8px;">
		<div style="display: flex; align-items: center; margin-bottom: 12px;">
			<span style="background: #FFB800; color: #000; font-weight: bold; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 18px;">1</span>
			<strong style="font-size: 20px; color: #FFB800;">Buildar o Frontend React</strong>
		</div>
		<div style="margin-left: 44px;">
			<p style="color: rgba(255,255,255,0.9); margin-bottom: 12px;">
				O React precisa ser compilado para produção. Abra o terminal na <strong>raiz do projeto</strong> e execute:
			</p>
			<div style="background: #0a0a0a; padding: 16px; border-radius: 6px; font-family: 'Courier New', monospace; border: 1px solid rgba(255,184,0,0.3);">
				<div style="color: #6c757d; margin-bottom: 8px;"># Ir para a raiz do projeto</div>
				<div style="color: #28a745;">cd /caminho/para/meumu</div>
				<br>
				<div style="color: #6c757d; margin-bottom: 8px;"># Instalar dependências</div>
				<div style="color: #28a745;">npm install</div>
				<br>
				<div style="color: #6c757d; margin-bottom: 8px;"># Buildar para produção (cria pasta /dist)</div>
				<div style="color: #ffc107; font-weight: bold;">npm run build</div>
			</div>
			<p style="color: #28a745; margin-top: 12px; font-weight: bold;">
				✅ Isso vai criar a pasta <code>/dist</code> com os arquivos prontos para produção
			</p>
		</div>
	</div>
	
	<!-- PASSO 2: BACKEND -->
	<div style="background: rgba(0,0,0,0.4); border-left: 4px solid #0dcaf0; padding: 20px; margin-bottom: 20px; border-radius: 8px;">
		<div style="display: flex; align-items: center; margin-bottom: 12px;">
			<span style="background: #0dcaf0; color: #000; font-weight: bold; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 18px;">2</span>
			<strong style="font-size: 20px; color: #0dcaf0;">Iniciar o Backend Node.js</strong>
		</div>
		<div style="margin-left: 44px;">
			<p style="color: rgba(255,255,255,0.9); margin-bottom: 12px;">
				Escolha uma das opções abaixo:
			</p>
			
			<!-- OPÇÃO A: PM2 -->
			<div style="background: rgba(13,202,240,0.1); border: 1px solid rgba(13,202,240,0.3); padding: 16px; border-radius: 6px; margin-bottom: 12px;">
				<strong style="color: #0dcaf0;">⭐ OPÇÃO A: PM2 (RECOMENDADO)</strong>
				<p style="margin: 8px 0; color: rgba(255,255,255,0.8);">Gerenciador de processos. Reinicia automaticamente em caso de erro.</p>
				<div style="background: #0a0a0a; padding: 12px; border-radius: 4px; font-family: 'Courier New', monospace; margin-top: 8px;">
					<div style="color: #6c757d; margin-bottom: 4px;"># Instalar PM2 (apenas uma vez)</div>
					<div style="color: #28a745;">npm install -g pm2</div>
					<br>
					<div style="color: #6c757d; margin-bottom: 4px;"># Ir para o backend</div>
					<div style="color: #28a745;">cd backend-nodejs</div>
					<br>
					<div style="color: #6c757d; margin-bottom: 4px;"># Instalar dependências</div>
					<div style="color: #28a745;">npm install</div>
					<br>
					<div style="color: #6c757d; margin-bottom: 4px;"># Iniciar com PM2</div>
					<div style="color: #ffc107; font-weight: bold;">pm2 start src/server.js --name meumu-backend</div>
					<br>
					<div style="color: #6c757d; margin-bottom: 4px;"># Salvar configuração (auto-start)</div>
					<div style="color: #0dcaf0;">pm2 save</div>
					<div style="color: #0dcaf0;">pm2 startup</div>
				</div>
			</div>
			
			<!-- OPÇÃO B: NODE -->
			<div style="background: rgba(108,117,125,0.1); border: 1px solid rgba(108,117,125,0.3); padding: 16px; border-radius: 6px;">
				<strong style="color: #6c757d;">OPÇÃO B: Node Standalone</strong>
				<p style="margin: 8px 0; color: rgba(255,255,255,0.7);">Simples, mas precisa ficar rodando no terminal.</p>
				<div style="background: #0a0a0a; padding: 12px; border-radius: 4px; font-family: 'Courier New', monospace; margin-top: 8px;">
					<div style="color: #6c757d; margin-bottom: 4px;"># Ir para o backend</div>
					<div style="color: #28a745;">cd backend-nodejs</div>
					<br>
					<div style="color: #6c757d; margin-bottom: 4px;"># Instalar dependências</div>
					<div style="color: #28a745;">npm install</div>
					<br>
					<div style="color: #6c757d; margin-bottom: 4px;"># Iniciar</div>
					<div style="color: #ffc107; font-weight: bold;">npm start</div>
				</div>
				<p style="color: #dc3545; margin-top: 8px; font-size: 14px;">
					⚠️ O terminal precisa ficar aberto! Se fechar, o backend para!
				</p>
			</div>
			
			<p style="color: #28a745; margin-top: 12px; font-weight: bold;">
				✅ O backend vai rodar na porta 3001
			</p>
		</div>
	</div>
	
	<!-- PASSO 3: SERVIDOR WEB -->
	<div style="background: rgba(0,0,0,0.4); border-left: 4px solid #198754; padding: 20px; border-radius: 8px;">
		<div style="display: flex; align-items: center; margin-bottom: 12px;">
			<span style="background: #198754; color: #fff; font-weight: bold; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 18px;">3</span>
			<strong style="font-size: 20px; color: #198754;">Configurar Servidor Web</strong>
		</div>
		<div style="margin-left: 44px;">
			<p style="color: rgba(255,255,255,0.9); margin-bottom: 12px;">
				<strong>IMPORTANTE:</strong> O servidor web precisa apontar para a pasta <code>/dist</code> criada no Passo 1!
			</p>
			
			<!-- APACHE -->
			<div style="margin-bottom: 16px;">
				<strong style="color: #198754;">🔹 Apache (XAMPP, etc.)</strong>
				<div style="background: #0a0a0a; padding: 12px; border-radius: 4px; font-family: 'Courier New', monospace; margin-top: 8px;">
					<div style="color: #6c757d; margin-bottom: 4px;"># Editar httpd.conf ou .htaccess:</div>
					<div style="color: #ffc107;">DocumentRoot "/caminho/para/meumu/dist"</div>
					<br>
					<div style="color: #28a745;">&lt;Directory "/caminho/para/meumu/dist"&gt;</div>
					<div style="color: #28a745;">    Options -Indexes +FollowSymLinks</div>
					<div style="color: #28a745;">    AllowOverride All</div>
					<div style="color: #28a745;">    Require all granted</div>
					<div style="color: #28a745;">&lt;/Directory&gt;</div>
					<br>
					<div style="color: #6c757d; margin-bottom: 4px;"># Reiniciar Apache</div>
					<div style="color: #0dcaf0;">sudo systemctl restart apache2</div>
				</div>
			</div>
			
			<!-- NGINX -->
			<div>
				<strong style="color: #198754;">🔹 Nginx</strong>
				<div style="background: #0a0a0a; padding: 12px; border-radius: 4px; font-family: 'Courier New', monospace; margin-top: 8px;">
					<div style="color: #6c757d; margin-bottom: 4px;"># Editar /etc/nginx/sites-available/meumu.com:</div>
					<div style="color: #28a745;">server {</div>
					<div style="color: #28a745;">    root /caminho/para/meumu/dist;</div>
					<div style="color: #28a745;">    index index.html;</div>
					<div style="color: #28a745;">    </div>
					<div style="color: #28a745;">    location / {</div>
					<div style="color: #28a745;">        try_files $uri $uri/ /index.html;</div>
					<div style="color: #28a745;">    }</div>
					<div style="color: #28a745;">}</div>
					<br>
					<div style="color: #6c757d; margin-bottom: 4px;"># Reiniciar Nginx</div>
					<div style="color: #0dcaf0;">sudo systemctl reload nginx</div>
				</div>
			</div>
			
			<p style="color: #28a745; margin-top: 12px; font-weight: bold;">
				✅ Após configurar, reinicie o servidor web
			</p>
		</div>
	</div>
</div>

<br>

<!-- CHECKLIST -->
<div style="background: rgba(25,135,84,0.2); border: 2px solid #198754; border-radius: 8px; padding: 24px;">
	<h3 style="color: #198754; margin-bottom: 16px;">✅ Checklist de Verificação</h3>
	<div style="color: rgba(255,255,255,0.9);">
		<label style="display: block; margin-bottom: 8px; cursor: pointer;">
			<input type="checkbox"> Pasta <code>/dist</code> foi criada com sucesso
		</label>
		<label style="display: block; margin-bottom: 8px; cursor: pointer;">
			<input type="checkbox"> Backend rodando na porta 3001
		</label>
		<label style="display: block; margin-bottom: 8px; cursor: pointer;">
			<input type="checkbox"> Testar backend: <code>curl http://localhost:3001/api/health</code> retorna <code>{"status":"ok"}</code>
		</label>
		<label style="display: block; margin-bottom: 8px; cursor: pointer;">
			<input type="checkbox"> DocumentRoot/root do servidor web aponta para <code>/dist</code>
		</label>
		<label style="display: block; margin-bottom: 8px; cursor: pointer;">
			<input type="checkbox"> Servidor web reiniciado
		</label>
		<label style="display: block; cursor: pointer;">
			<input type="checkbox"> Pasta <code>/install</code> foi deletada (segurança)
		</label>
	</div>
</div>

<br>

<!-- TESTES -->
<div class="alert alert-info">
	<span>🧪</span>
	<div>
		<strong>Como testar se está funcionando:</strong>
		<br><br>
		<strong>1. Backend:</strong><br>
		<code style="display:block;background:rgba(0,0,0,0.3);padding:8px;border-radius:4px;margin:8px 0;">
			curl http://localhost:3001/api/health<br>
			# Deve retornar: {"status":"ok"}
		</code>
		
		<strong>2. Frontend:</strong><br>
		Abra <code>http://meumu.com</code> no navegador
		<ul style="margin-left: 20px; margin-top: 8px;">
			<li>✅ Se carregar sem erros: <strong>FUNCIONOU!</strong></li>
			<li>❌ Se der erro MIME type: Você NÃO buildou o React (volte ao Passo 1)</li>
			<li>❌ Se der erro 404: DocumentRoot não aponta para /dist (volte ao Passo 3)</li>
		</ul>
	</div>
</div>

<br>

<!-- SEGURANÇA -->
<div class="alert alert-warning">
	<span>🔒</span>
	<div>
		<strong>SEGURANÇA: Deletar pasta /install</strong>
		<br><br>
		Após tudo funcionando, delete a pasta de instalação:
		<code style="display:block;background:rgba(0,0,0,0.3);padding:8px;border-radius:4px;margin:8px 0;">
			rm -rf install/
		</code>
		Isso previne que alguém reinstale o site e sobrescreva suas configurações.
	</div>
</div>

<br>

<!-- SCRIPTS AUTOMÁTICOS -->
<div class="alert alert-success">
	<span>🚀</span>
	<div>
		<strong>Atalho Rápido: Use os scripts automáticos!</strong>
		<br><br>
		
		<strong>Linux/Mac:</strong><br>
		<code style="display:block;background:rgba(0,0,0,0.3);padding:8px;border-radius:4px;margin:8px 0;">
			chmod +x deploy.sh<br>
			./deploy.sh<br>
			# Escolha opção 3 (Produção VPS/Cloud)
		</code>
		
		<strong>Windows:</strong><br>
		<code style="display:block;background:rgba(0,0,0,0.3);padding:8px;border-radius:4px;margin:8px 0;">
			deploy.bat<br>
			REM Escolha opção 2 (Produção Local)
		</code>
	</div>
</div>

<br><br>

<!-- DOCUMENTAÇÃO -->
<div style="text-align: center; padding: 24px; background: rgba(255,184,0,0.1); border-radius: 8px;">
	<h3 style="color: #FFB800; margin-bottom: 16px;">📚 Documentação Completa</h3>
	<p style="color: rgba(255,255,255,0.8); margin-bottom: 16px;">
		Para mais detalhes, consulte os guias na raiz do projeto:
	</p>
	<div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
		<code style="background: rgba(0,0,0,0.3); padding: 8px 16px; border-radius: 4px;">/install/DEPLOY_PRODUCAO.md</code>
		<code style="background: rgba(0,0,0,0.3); padding: 8px 16px; border-radius: 4px;">/install/SOLUCAO_MIME_TYPE.md</code>
		<code style="background: rgba(0,0,0,0.3); padding: 8px 16px; border-radius: 4px;">/install/ERROS_COMUNS.md</code>
	</div>
</div>

<br><br>

<div style="text-align: center; padding: 32px;">
	<h2 style="color: #FFB800; font-size: 32px; margin-bottom: 16px;">
		🎮 MeuMU Online v2.0.0 🎮
	</h2>
	<p style="font-size: 18px; color: rgba(255,255,255,0.8);">
		Season 19-2-3 Épico
	</p>
	<p style="color: rgba(255,255,255,0.6); margin-top: 16px;">
		© 2024-2025 MeuMU Team • All Rights Reserved
	</p>
</div>
