<?php
/**
 * MeuMU Online - Step 7: Instalação Concluída
 * 
 * @version 2.0.0
 * @author MeuMU Team
 * @copyright (c) 2024-2025 MeuMU Online, All Rights Reserved
 */

if(!defined('access') or !access or access != 'install') die();

$siteUrl = $_SESSION['install_site_url'] ?? __BASE_URL__;
?>

<div style="text-align: center; padding: 40px 0;">
	<div style="font-size: 80px; margin-bottom: 20px;">🎉</div>
	<h2 style="font-size: 36px; margin-bottom: 16px;">Instalação Concluída!</h2>
	<p style="font-size: 18px; color: rgba(255,255,255,0.7);">
		Seu site MeuMU Online está pronto para ser usado!
	</p>
</div>

<hr>

<h3>✅ O que foi instalado:</h3>

<div class="list-group">
	<div class="list-group-item">
		<strong>Database MU</strong>
		<span class="label label-success pull-right">Conectado</span>
		<br>
		<small style="color: rgba(255,255,255,0.6);">
			<?php echo $_SESSION['install_db_mu']; ?> - Leitura de contas, personagens, guilds, etc.
		</small>
	</div>
	
	<div class="list-group-item">
		<strong>Database Web</strong>
		<span class="label label-success pull-right">Criado</span>
		<br>
		<small style="color: rgba(255,255,255,0.6);">
			<?php echo $_SESSION['install_db_web']; ?> - 18 tabelas WEBMU_* criadas
		</small>
	</div>
	
	<div class="list-group-item">
		<strong>Backend Node.js</strong>
		<span class="label label-success pull-right">Configurado</span>
		<br>
		<small style="color: rgba(255,255,255,0.6);">
			Arquivo .env criado com conexões duais
		</small>
	</div>
	
	<div class="list-group-item">
		<strong>Configuração PHP</strong>
		<span class="label label-success pull-right">Criado</span>
		<br>
		<small style="color: rgba(255,255,255,0.6);">
			config.php na raiz do projeto
		</small>
	</div>
	
	<?php if(isset($_SESSION['install_admin_account'])): ?>
	<div class="list-group-item">
		<strong>Admin Account</strong>
		<span class="label label-success pull-right">Configurado</span>
		<br>
		<small style="color: rgba(255,255,255,0.6);">
			Conta: <strong><?php echo htmlspecialchars($_SESSION['install_admin_account']); ?></strong>
		</small>
	</div>
	<?php endif; ?>
</div>

<hr>

<h3>🚀 Próximos Passos:</h3>

<div class="alert alert-warning">
	<span>⚠️</span>
	<div>
		<strong>IMPORTANTE - Segurança:</strong><br>
		Por segurança, você DEVE deletar ou renomear a pasta <code>/install</code> antes de usar o site em produção!
		<br><br>
		<strong>Linux/VPS:</strong><br>
		<code>rm -rf install/</code>
		<br><br>
		<strong>Windows:</strong><br>
		Delete a pasta manualmente ou renomeie para <code>install_backup</code>
	</div>
</div>

<div class="alert alert-info">
	<span>💡</span>
	<div>
		<strong>Verificar Backend:</strong>
		<br><br>
		<strong>Se usou PM2:</strong><br>
		<code>pm2 list</code> - Ver status<br>
		<code>pm2 logs meumu-backend</code> - Ver logs<br>
		<code>pm2 restart meumu-backend</code> - Reiniciar
		<br><br>
		<strong>Se usou Standalone:</strong><br>
		<code>cd backend-nodejs && npm start</code> - Iniciar manualmente<br>
		<code>curl http://localhost:3001/api/health</code> - Testar conexão
	</div>
</div>

<?php if(!isset($_SESSION['install_admin_account'])): ?>
<div class="alert alert-warning">
	<span>👑</span>
	<div>
		<strong>Admin não configurado:</strong><br>
		Você pulou a configuração do admin. Para definir um admin, execute no MySQL:
		<br><br>
		<code>UPDATE <?php echo $_SESSION['install_db_mu']; ?>.accounts SET web_admin = 1 WHERE account = 'nome_da_conta';</code>
	</div>
</div>
<?php endif; ?>

<hr>

<h3>📚 Recursos Disponíveis:</h3>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
	<div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
		<strong>🏠 Site Principal</strong>
		<p style="margin-top: 8px; color: rgba(255,255,255,0.7);">
			Notícias, rankings, downloads, sistema de votos
		</p>
	</div>
	
	<div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
		<strong>👤 Área do Jogador</strong>
		<p style="margin-top: 8px; color: rgba(255,255,255,0.7);">
			Gestão de personagens, distribuir pontos, reset
		</p>
	</div>
	
	<div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
		<strong>⚔️ Rankings</strong>
		<p style="margin-top: 8px; color: rgba(255,255,255,0.7);">
			Top níveis, resets, killers, guilds em tempo real
		</p>
	</div>
	
	<div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
		<strong>👑 AdminCP</strong>
		<p style="margin-top: 8px; color: rgba(255,255,255,0.7);">
			Gerenciar notícias, usuários, configurações
		</p>
	</div>
</div>

<hr>

<h3>🌐 Idiomas Suportados:</h3>
<p style="color: rgba(255,255,255,0.7);">
	🇧🇷 Português • 🇺🇸 English • 🇪🇸 Español • 🇩🇪 Deutsch • 🇫🇷 Français • 🇮🇹 Italiano • 🇷🇺 Русский • 🇨🇳 中文
</p>

<hr>

<div style="text-align: center; margin-top: 40px;">
	<a href="<?php echo $siteUrl; ?>" class="btn btn-primary btn-lg" style="font-size: 18px; padding: 20px 40px;">
		🎮 Acessar o Site Agora
	</a>
</div>

<br>

<div style="text-align: center; color: rgba(255,255,255,0.5); font-size: 14px;">
	<strong>MeuMU Online v<?php echo INSTALLER_VERSION; ?></strong><br>
	Season 19-2-3 Épico - Dark Medieval Fantasy<br>
	Desenvolvido com ⚔️ para a comunidade MU Online
</div>

<?php
// Limpar sessão (mas manter alguns dados para exibição)
$keepData = array(
	'install_db_mu',
	'install_db_web',
	'install_admin_account',
	'install_site_url'
);

foreach($_SESSION as $key => $value) {
	if(strpos($key, 'install_') === 0 && !in_array($key, $keepData)) {
		unset($_SESSION[$key]);
	}
}
?>