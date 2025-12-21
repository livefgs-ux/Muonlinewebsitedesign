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

if(!defined('access') or !access or access != 'install') die();

session_name('MeuMUInstaller200'); 
session_start();
ob_start();

@ini_set('default_charset', 'utf-8');

// Definir constantes de path
define('HTTP_HOST', $_SERVER['HTTP_HOST']);
define('SERVER_PROTOCOL', (!empty($_SERVER['HTTPS']) && strtolower($_SERVER['HTTPS']) == 'on') ? 'https://' : 'http://');
define('__ROOT_DIR__', str_replace('\\', '/', dirname(dirname(__FILE__))) . '/');
define('__RELATIVE_ROOT__', str_ireplace(rtrim(str_replace('\\', '/', realpath(str_replace($_SERVER['SCRIPT_NAME'], '', $_SERVER['SCRIPT_FILENAME']))), '/'), '', __ROOT_DIR__));
define('__BASE_URL__', SERVER_PROTOCOL . HTTP_HOST . __RELATIVE_ROOT__);
define('__INSTALL_ROOT__', __ROOT_DIR__ . 'install/');
define('__INSTALL_URL__', __BASE_URL__ . 'install/');

try {
	
	// Carregar configurações do instalador
	if(!@include_once(__INSTALL_ROOT__ . 'config.php')) {
		throw new Exception('Não foi possível carregar as configurações do instalador.');
	}
	
	// Verificar se já foi instalado
	if(file_exists(__ROOT_DIR__ . 'backend-nodejs/.env')) {
		$envContent = file_get_contents(__ROOT_DIR__ . 'backend-nodejs/.env');
		if($envContent && strpos($envContent, 'DB_MU_NAME') !== false) {
			if(!isset($_GET['force'])) {
				throw new Exception('
					<h3>⚠️ Instalação já concluída!</h3>
					<p>O sistema já foi instalado anteriormente.</p>
					<p><strong>Por segurança, renomeie ou delete a pasta <code>/install</code> antes de usar o site.</strong></p>
					<br>
					<a href="' . __BASE_URL__ . '" class="btn-success">Ir para o Site</a>
					<a href="?force=1" class="btn-danger">Reinstalar (CUIDADO!)</a>
				');
			}
		}
	}
	
	// Inicializar step atual
	if(!isset($_SESSION['install_step'])) {
		$_SESSION['install_step'] = 0;
	}
	
	// Funções auxiliares
	function stepListSidebar() {
		global $install;
		if(is_array($install['step_list'])) {
			echo '<div class="steps-sidebar">';
			foreach($install['step_list'] as $key => $row) {
				$stepClass = '';
				if($key < $_SESSION['install_step']) {
					$stepClass = 'completed';
				} elseif($key == $_SESSION['install_step']) {
					$stepClass = 'active';
				}
				
				echo '<div class="step-item ' . $stepClass . '">';
				echo '<div class="step-number">' . ($key + 1) . '</div>';
				echo '<div class="step-label">' . $row[1] . '</div>';
				echo '</div>';
			}
			echo '</div>';
		}
	}
	
	function checkRequirements() {
		global $install;
		$errors = array();
		
		// PHP Version
		if(version_compare(PHP_VERSION, $install['requirements']['php_version'], '<')) {
			$errors[] = 'PHP ' . $install['requirements']['php_version'] . '+ é necessário. Versão atual: ' . PHP_VERSION;
		}
		
		// Extensions
		foreach($install['requirements']['extensions'] as $ext) {
			if(!extension_loaded($ext)) {
				$errors[] = 'Extensão PHP necessária: ' . $ext;
			}
		}
		
		// Writable directories
		$writablePaths = array(
			'backend-nodejs/',
			'backend-nodejs/.env',
			'config.php',
		);
		
		foreach($writablePaths as $path) {
			$fullPath = __ROOT_DIR__ . $path;
			$dir = dirname($fullPath);
			if(!is_writable($dir)) {
				$errors[] = 'Pasta sem permissão de escrita: ' . $path;
			}
		}
		
		return $errors;
	}
	
	function restartInstaller() {
		$_SESSION = array();
		session_destroy();
		header('Location: index.php');
		exit;
	}
	
	// Ações globais
	if(isset($_GET['action'])) {
		switch($_GET['action']) {
			case 'restart':
				restartInstaller();
				break;
		}
	}
	
} catch (Exception $ex) {
	?>
	<!DOCTYPE html>
	<html lang="pt-BR">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Erro - <?php echo INSTALLER_NAME; ?></title>
		<style>
			* { margin: 0; padding: 0; box-sizing: border-box; }
			body {
				font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
				background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
				color: #fff;
				min-height: 100vh;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 20px;
			}
			.error-container {
				background: rgba(255, 255, 255, 0.05);
				border: 1px solid rgba(255, 255, 255, 0.1);
				border-radius: 12px;
				padding: 40px;
				max-width: 600px;
				text-align: center;
				backdrop-filter: blur(10px);
			}
			.error-container h3 {
				color: #f87171;
				margin-bottom: 20px;
				font-size: 24px;
			}
			.error-container p {
				color: rgba(255, 255, 255, 0.8);
				line-height: 1.6;
				margin-bottom: 10px;
			}
			.error-container code {
				background: rgba(255, 184, 0, 0.1);
				border: 1px solid rgba(255, 184, 0, 0.3);
				padding: 2px 8px;
				border-radius: 4px;
				color: #FFB800;
				font-family: 'Courier New', monospace;
			}
			.btn-success, .btn-danger {
				display: inline-block;
				padding: 12px 24px;
				margin: 10px 5px;
				border-radius: 8px;
				text-decoration: none;
				font-weight: 600;
				transition: all 0.3s;
			}
			.btn-success {
				background: linear-gradient(135deg, #10b981 0%, #059669 100%);
				color: #fff;
			}
			.btn-success:hover {
				transform: translateY(-2px);
				box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
			}
			.btn-danger {
				background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
				color: #fff;
			}
			.btn-danger:hover {
				transform: translateY(-2px);
				box-shadow: 0 8px 16px rgba(239, 68, 68, 0.3);
			}
		</style>
	</head>
	<body>
		<div class="error-container">
			<?php echo $ex->getMessage(); ?>
		</div>
	</body>
	</html>
	<?php
	exit;
}
