<?php
/**
 * MeuMU Online - Step 3: Conexão Database
 * 
 * @version 2.0.0
 * @author MeuMU Team
 * @copyright (c) 2024-2025 MeuMU Online, All Rights Reserved
 */

if(!defined('access') or !access or access != 'install') die();

// Processar formulário
if(isset($_POST['test_connection'])) {
	try {
		$host = $_POST['db_host'] ?? '';
		$port = $_POST['db_port'] ?? '3306';
		$user = $_POST['db_user'] ?? '';
		$pass = $_POST['db_pass'] ?? '';
		$dbMU = $_POST['db_mu'] ?? '';
		$dbWEB = $_POST['db_web'] ?? '';
		
		if(empty($host) || empty($user) || empty($dbMU) || empty($dbWEB)) {
			throw new Exception('Preencha todos os campos obrigatórios.');
		}
		
		// Testar conexão MU
		$dsnMU = "mysql:host={$host};port={$port};dbname={$dbMU};charset=utf8mb4";
		$pdoMU = new PDO($dsnMU, $user, $pass, [
			PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
			PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
		]);
		
		// Verificar tabela accounts
		$checkAccounts = $pdoMU->query("SHOW TABLES LIKE 'accounts'")->rowCount();
		if($checkAccounts === 0) {
			throw new Exception('Tabela "accounts" não encontrada no database MU. Verifique se você selecionou o database correto do servidor MU.');
		}
		
		// Testar conexão Web (pode não existir ainda)
		try {
			$dsnWEB = "mysql:host={$host};port={$port};dbname={$dbWEB};charset=utf8mb4";
			$pdoWEB = new PDO($dsnWEB, $user, $pass, [
				PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
			]);
			$webExists = true;
		} catch (PDOException $e) {
			$webExists = false;
		}
		
		$_SESSION['db_connection_success'] = true;
		$_SESSION['db_web_exists'] = $webExists;
		
	} catch (PDOException $e) {
		$_SESSION['db_connection_error'] = 'Erro de conexão: ' . $e->getMessage();
	} catch (Exception $e) {
		$_SESSION['db_connection_error'] = $e->getMessage();
	}
}

// Salvar e continuar
if(isset($_POST['save_continue'])) {
	$_SESSION['install_db_host'] = $_POST['db_host'];
	$_SESSION['install_db_port'] = $_POST['db_port'];
	$_SESSION['install_db_user'] = $_POST['db_user'];
	$_SESSION['install_db_pass'] = $_POST['db_pass'];
	$_SESSION['install_db_mu'] = $_POST['db_mu'];
	$_SESSION['install_db_web'] = $_POST['db_web'];
	
	$_SESSION['install_step']++;
	header('Location: index.php');
	exit;
}

// Valores padrão
$dbHost = $_SESSION['install_db_host'] ?? 'localhost';
$dbPort = $_SESSION['install_db_port'] ?? '3306';
$dbUser = $_SESSION['install_db_user'] ?? 'root';
$dbPass = $_SESSION['install_db_pass'] ?? '';
$dbMU = $_SESSION['install_db_mu'] ?? 'muonline';
$dbWEB = $_SESSION['install_db_web'] ?? 'webmu';
?>

<h2>🗄️ Conexão com Database</h2>
<p>Configure a conexão com os 2 bancos de dados: <strong>muonline</strong> (servidor MU) e <strong>webmu</strong> (site).</p>

<br>

<div class="alert alert-info">
	<span>ℹ️</span>
	<div>
		<strong>Importante:</strong>
		<ul style="margin-left: 20px; margin-top: 8px;">
			<li><strong>muonline</strong>: Database do seu servidor MU (deve existir com tabela "accounts")</li>
			<li><strong>webmu</strong>: Database do site (será criada automaticamente se não existir)</li>
		</ul>
	</div>
</div>

<?php
// Mostrar erro se houver
if(isset($_SESSION['db_connection_error'])) {
	echo '<div class="alert alert-danger">';
	echo '<span>❌</span>';
	echo '<div>' . $_SESSION['db_connection_error'] . '</div>';
	echo '</div>';
	unset($_SESSION['db_connection_error']);
}

// Mostrar sucesso se houver
if(isset($_SESSION['db_connection_success'])) {
	$webStatus = $_SESSION['db_web_exists'] ? 'já existe' : 'será criado automaticamente';
	echo '<div class="alert alert-success">';
	echo '<span>✅</span>';
	echo '<div>';
	echo '<strong>Conexão bem-sucedida!</strong><br>';
	echo '• Database MU conectado e tabela "accounts" verificada<br>';
	echo '• Database Web ' . $webStatus;
	echo '</div>';
	echo '</div>';
	unset($_SESSION['db_connection_success']);
	unset($_SESSION['db_web_exists']);
}
?>

<form method="post">
	<div class="form-row">
		<div class="form-group">
			<label class="form-label">Host</label>
			<input type="text" name="db_host" class="form-control" value="<?php echo htmlspecialchars($dbHost); ?>" required>
			<small class="form-help">Endereço IP do servidor MySQL (geralmente localhost ou 127.0.0.1)</small>
		</div>
		
		<div class="form-group">
			<label class="form-label">Porta</label>
			<input type="text" name="db_port" class="form-control" value="<?php echo htmlspecialchars($dbPort); ?>" required>
			<small class="form-help">Porta padrão: 3306</small>
		</div>
	</div>
	
	<div class="form-row">
		<div class="form-group">
			<label class="form-label">Database MU (muonline)</label>
			<input type="text" name="db_mu" class="form-control" value="<?php echo htmlspecialchars($dbMU); ?>" required>
			<small class="form-help">Database do servidor MU com accounts, character_info, etc.</small>
		</div>
		
		<div class="form-group">
			<label class="form-label">Database Web (webmu)</label>
			<input type="text" name="db_web" class="form-control" value="<?php echo htmlspecialchars($dbWEB); ?>" required>
			<small class="form-help">Database do site (será criado automaticamente se não existir)</small>
		</div>
	</div>
	
	<div class="form-group">
		<label class="form-label">Usuário MySQL</label>
		<input type="text" name="db_user" class="form-control" value="<?php echo htmlspecialchars($dbUser); ?>" required>
		<small class="form-help">Usuário com permissões de CREATE DATABASE e CREATE TABLE</small>
	</div>
	
	<div class="form-group">
		<label class="form-label">Senha MySQL</label>
		<input type="password" name="db_pass" class="form-control" value="<?php echo htmlspecialchars($dbPass); ?>">
		<small class="form-help">Deixe vazio se não houver senha (não recomendado)</small>
	</div>
	
	<div class="btn-group">
		<button type="submit" name="test_connection" class="btn btn-secondary">
			🔍 Testar Conexão
		</button>
		<button type="submit" name="save_continue" class="btn btn-success">
			Salvar e Continuar →
		</button>
	</div>
</form>
