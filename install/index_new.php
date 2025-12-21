<?php
/**
 * MeuMU Online
 * Season 19-2-3 Épico
 * 
 * @version 2.0.0
 * @author MeuMU Team
 * @copyright (c) 2024-2025 MeuMU Online, All Rights Reserved
 * 
 * Licensed under the MIT license
 * http://opensource.org/licenses/MIT
 */

define('access', 'install');
if(!@include_once('loader.php')) die('Não foi possível carregar o instalador.');
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title><?php echo INSTALLER_NAME; ?> - v<?php echo INSTALLER_VERSION; ?></title>
	
	<style>
		/* ═══════════════════════════════════════════════════════════════════
		   RESET & BASE
		   ═══════════════════════════════════════════════════════════════════ */
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}
		
		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
			background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
			color: #ffffff;
			min-height: 100vh;
			line-height: 1.6;
		}
		
		/* ═══════════════════════════════════════════════════════════════════
		   CONTAINER & LAYOUT
		   ═══════════════════════════════════════════════════════════════════ */
		.installer-container {
			max-width: 1200px;
			margin: 0 auto;
			padding: 40px 20px;
		}
		
		.header {
			text-align: center;
			margin-bottom: 40px;
			padding-bottom: 30px;
			border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		}
		
		.header-logo {
			font-size: 48px;
			margin-bottom: 10px;
		}
		
		.header h1 {
			font-size: 32px;
			font-weight: 700;
			background: linear-gradient(135deg, #FFB800 0%, #FFA000 100%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			background-clip: text;
			margin-bottom: 8px;
		}
		
		.header .version {
			color: rgba(255, 255, 255, 0.6);
			font-size: 14px;
		}
		
		/* ═══════════════════════════════════════════════════════════════════
		   MAIN CONTENT
		   ═══════════════════════════════════════════════════════════════════ */
		.content-wrapper {
			display: grid;
			grid-template-columns: 250px 1fr;
			gap: 30px;
			margin-bottom: 40px;
		}
		
		@media (max-width: 768px) {
			.content-wrapper {
				grid-template-columns: 1fr;
			}
		}
		
		/* ═══════════════════════════════════════════════════════════════════
		   SIDEBAR - STEPS
		   ═══════════════════════════════════════════════════════════════════ */
		.steps-sidebar {
			background: rgba(255, 255, 255, 0.03);
			border: 1px solid rgba(255, 255, 255, 0.1);
			border-radius: 12px;
			padding: 20px;
			backdrop-filter: blur(10px);
			height: fit-content;
		}
		
		.step-item {
			display: flex;
			align-items: center;
			gap: 12px;
			padding: 12px;
			margin-bottom: 8px;
			border-radius: 8px;
			transition: all 0.3s;
		}
		
		.step-item.active {
			background: rgba(255, 184, 0, 0.1);
			border: 1px solid rgba(255, 184, 0, 0.3);
		}
		
		.step-item.completed {
			opacity: 0.6;
		}
		
		.step-item.completed .step-number {
			background: linear-gradient(135deg, #10b981 0%, #059669 100%);
		}
		
		.step-number {
			width: 32px;
			height: 32px;
			border-radius: 50%;
			background: rgba(255, 255, 255, 0.1);
			display: flex;
			align-items: center;
			justify-content: center;
			font-weight: 600;
			font-size: 14px;
			flex-shrink: 0;
		}
		
		.step-item.active .step-number {
			background: linear-gradient(135deg, #FFB800 0%, #FFA000 100%);
			color: #0a0a0a;
		}
		
		.step-label {
			font-size: 14px;
			color: rgba(255, 255, 255, 0.9);
		}
		
		/* ═══════════════════════════════════════════════════════════════════
		   MAIN PANEL
		   ═══════════════════════════════════════════════════════════════════ */
		.main-panel {
			background: rgba(255, 255, 255, 0.03);
			border: 1px solid rgba(255, 255, 255, 0.1);
			border-radius: 12px;
			padding: 40px;
			backdrop-filter: blur(10px);
		}
		
		.main-panel h2, .main-panel h3, .main-panel h4 {
			color: #FFB800;
			margin-bottom: 20px;
		}
		
		.main-panel h2 {
			font-size: 28px;
			font-weight: 700;
		}
		
		.main-panel h3 {
			font-size: 24px;
			font-weight: 600;
		}
		
		.main-panel h4 {
			font-size: 20px;
			font-weight: 600;
		}
		
		.main-panel p {
			color: rgba(255, 255, 255, 0.8);
			margin-bottom: 16px;
			line-height: 1.8;
		}
		
		.main-panel hr {
			border: none;
			border-top: 1px solid rgba(255, 255, 255, 0.1);
			margin: 30px 0;
		}
		
		/* ═══════════════════════════════════════════════════════════════════
		   ALERTS
		   ═══════════════════════════════════════════════════════════════════ */
		.alert {
			padding: 16px 20px;
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
		
		.alert-warning {
			background: rgba(245, 158, 11, 0.1);
			border: 1px solid rgba(245, 158, 11, 0.3);
			color: #fbbf24;
		}
		
		.alert-danger, .alert-error {
			background: rgba(239, 68, 68, 0.1);
			border: 1px solid rgba(239, 68, 68, 0.3);
			color: #f87171;
		}
		
		/* ═══════════════════════════════════════════════════════════════════
		   FORMS
		   ═══════════════════════════════════════════════════════════════════ */
		.form-group {
			margin-bottom: 24px;
		}
		
		.form-label {
			display: block;
			margin-bottom: 8px;
			color: rgba(255, 255, 255, 0.9);
			font-weight: 500;
			font-size: 14px;
		}
		
		.form-control {
			width: 100%;
			padding: 12px 16px;
			background: rgba(255, 255, 255, 0.05);
			border: 1px solid rgba(255, 255, 255, 0.1);
			border-radius: 8px;
			color: #ffffff;
			font-size: 14px;
			transition: all 0.3s;
		}
		
		.form-control:focus {
			outline: none;
			border-color: #FFB800;
			background: rgba(255, 255, 255, 0.08);
		}
		
		.form-help {
			display: block;
			margin-top: 6px;
			font-size: 12px;
			color: rgba(255, 255, 255, 0.5);
		}
		
		.form-row {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 20px;
		}
		
		@media (max-width: 768px) {
			.form-row {
				grid-template-columns: 1fr;
			}
		}
		
		/* ═══════════════════════════════════════════════════════════════════
		   BUTTONS
		   ═══════════════════════════════════════════════════════════════════ */
		.btn {
			display: inline-block;
			padding: 12px 24px;
			border: none;
			border-radius: 8px;
			font-size: 14px;
			font-weight: 600;
			text-decoration: none;
			cursor: pointer;
			transition: all 0.3s;
			text-align: center;
		}
		
		.btn-primary {
			background: linear-gradient(135deg, #FFB800 0%, #FFA000 100%);
			color: #0a0a0a;
		}
		
		.btn-primary:hover {
			transform: translateY(-2px);
			box-shadow: 0 8px 16px rgba(255, 184, 0, 0.3);
		}
		
		.btn-success {
			background: linear-gradient(135deg, #10b981 0%, #059669 100%);
			color: #ffffff;
		}
		
		.btn-success:hover {
			transform: translateY(-2px);
			box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
		}
		
		.btn-danger {
			background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
			color: #ffffff;
		}
		
		.btn-danger:hover {
			transform: translateY(-2px);
			box-shadow: 0 8px 16px rgba(239, 68, 68, 0.3);
		}
		
		.btn-secondary, .btn-default {
			background: rgba(255, 255, 255, 0.1);
			color: rgba(255, 255, 255, 0.9);
			border: 1px solid rgba(255, 255, 255, 0.2);
		}
		
		.btn-secondary:hover, .btn-default:hover {
			background: rgba(255, 255, 255, 0.15);
		}
		
		.btn-lg {
			padding: 16px 32px;
			font-size: 16px;
		}
		
		.btn-sm {
			padding: 8px 16px;
			font-size: 12px;
		}
		
		.btn-group {
			display: flex;
			gap: 12px;
			margin-top: 30px;
		}
		
		/* ═══════════════════════════════════════════════════════════════════
		   LIST GROUP
		   ═══════════════════════════════════════════════════════════════════ */
		.list-group {
			border-radius: 8px;
			overflow: hidden;
		}
		
		.list-group-item {
			padding: 16px 20px;
			background: rgba(255, 255, 255, 0.03);
			border-bottom: 1px solid rgba(255, 255, 255, 0.1);
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		
		.list-group-item:last-child {
			border-bottom: none;
		}
		
		/* ═══════════════════════════════════════════════════════════════════
		   LABELS/BADGES
		   ═══════════════════════════════════════════════════════════════════ */
		.label {
			padding: 4px 12px;
			border-radius: 4px;
			font-size: 12px;
			font-weight: 600;
		}
		
		.label-success {
			background: rgba(16, 185, 129, 0.2);
			color: #34d399;
		}
		
		.label-danger {
			background: rgba(239, 68, 68, 0.2);
			color: #f87171;
		}
		
		.label-warning {
			background: rgba(245, 158, 11, 0.2);
			color: #fbbf24;
		}
		
		.label-default {
			background: rgba(255, 255, 255, 0.1);
			color: rgba(255, 255, 255, 0.7);
		}
		
		/* ═══════════════════════════════════════════════════════════════════
		   FOOTER
		   ═══════════════════════════════════════════════════════════════════ */
		.footer {
			text-align: center;
			padding: 20px;
			border-top: 1px solid rgba(255, 255, 255, 0.1);
			color: rgba(255, 255, 255, 0.5);
			font-size: 14px;
		}
		
		.footer a {
			color: #FFB800;
			text-decoration: none;
		}
		
		.footer a:hover {
			text-decoration: underline;
		}
		
		/* ═══════════════════════════════════════════════════════════════════
		   UTILITIES
		   ═══════════════════════════════════════════════════════════════════ */
		.pull-right {
			float: right;
		}
		
		code {
			background: rgba(255, 184, 0, 0.1);
			border: 1px solid rgba(255, 184, 0, 0.3);
			padding: 2px 6px;
			border-radius: 4px;
			color: #FFB800;
			font-family: 'Courier New', monospace;
			font-size: 13px;
		}
	</style>
</head>

<body>
	<div class="installer-container">
		
		<!-- Header -->
		<div class="header">
			<div class="header-logo">⚔️</div>
			<h1>MeuMU Online</h1>
			<div class="version">Instalador v<?php echo INSTALLER_VERSION; ?> - Season 19-2-3 Épico</div>
		</div>
		
		<!-- Main Content -->
		<div class="content-wrapper">
			
			<!-- Sidebar -->
			<aside>
				<?php stepListSidebar(); ?>
				
				<?php if($_SESSION['install_step'] > 0): ?>
					<br>
					<a href="?action=restart" class="btn btn-danger btn-sm" style="width: 100%;">
						🔄 Reiniciar
					</a>
				<?php endif; ?>
			</aside>
			
			<!-- Main Panel -->
			<main class="main-panel">
				<?php
				try {
					if(array_key_exists($_SESSION['install_step'], $install['step_list'])) {
						$fileName = $install['step_list'][$_SESSION['install_step']][0];
						if(file_exists(__INSTALL_ROOT__ . $fileName)) {
							if(!@include_once(__INSTALL_ROOT__ . $fileName)) {
								throw new Exception('Erro ao carregar step do instalador.');
							}
						} else {
							throw new Exception('Arquivo do step não encontrado: ' . $fileName);
						}
					}
				} catch (Exception $ex) {
					echo '<div class="alert alert-danger">';
					echo '<span>❌</span>';
					echo '<div>' . $ex->getMessage() . '</div>';
					echo '</div>';
				}
				?>
			</main>
			
		</div>
		
		<!-- Footer -->
		<footer class="footer">
			<strong>&copy; <?php echo date("Y"); ?> MeuMU Online</strong> - Season 19-2-3 Épico<br>
			Desenvolvido com ⚔️ para a comunidade MU Online
		</footer>
		
	</div>
</body>
</html>
