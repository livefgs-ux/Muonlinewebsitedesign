<?php
/**
 * MeuMU Online - Step 5: Admin Account (OPCIONAL)
 * 
 * @version 2.0.0
 * @author MeuMU Team
 * @copyright (c) 2024-2025 MeuMU Online, All Rights Reserved
 */

if(!defined('access') or !access or access != 'install') die();

// Verificar dados de conexão
if(!isset($_SESSION['install_db_host'])) {
	echo '<div class="alert alert-danger"><span>❌</span><div>Dados de conexão não encontrados.</div></div>';
	exit;
}

// Pular este step
if(isset($_GET['skip'])) {
	$_SESSION['install_admin_skipped'] = true;
	$_SESSION['install_step']++;
	header('Location: index.php');
	exit;
}

// Definir admin
if(isset($_POST['set_admin'])) {
	try {
		$adminAccount = trim($_POST['admin_account'] ?? '');
		
		if(empty($adminAccount)) {
			throw new Exception('Digite o nome da conta admin.');
		}
		
		// Validar: apenas alfanumérico
		if(!preg_match('/^[a-zA-Z0-9]+$/', $adminAccount)) {
			throw new Exception('O nome da conta deve conter apenas letras e números.');
		}
		
		// Conectar ao database MU
		$host = $_SESSION['install_db_host'];
		$port = $_SESSION['install_db_port'];
		$user = $_SESSION['install_db_user'];
		$pass = $_SESSION['install_db_pass'];
		$dbMU = $_SESSION['install_db_mu'];
		
		$dsn = "mysql:host={$host};port={$port};dbname={$dbMU};charset=utf8mb4";
		$pdo = new PDO($dsn, $user, $pass, [
			PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
			PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
		]);
		
		// Verificar se conta existe
		$stmt = $pdo->prepare("SELECT guid, account FROM accounts WHERE account = ? LIMIT 1");
		$stmt->execute([$adminAccount]);
		$account = $stmt->fetch();
		
		if(!$account) {
			throw new Exception('Conta "' . $adminAccount . '" não encontrada no database MU. Verifique se o nome está correto.');
		}
		
		// Atualizar web_admin = 1
		$updateStmt = $pdo->prepare("UPDATE accounts SET web_admin = 1 WHERE account = ?");
		$updateStmt->execute([$adminAccount]);
		
		$_SESSION['install_admin_account'] = $adminAccount;
		$_SESSION['install_admin_success'] = true;
		
	} catch (PDOException $e) {
		$_SESSION['admin_error'] = 'Erro SQL: ' . $e->getMessage();
	} catch (Exception $e) {
		$_SESSION['admin_error'] = $e->getMessage();
	}
}

// Continuar
if(isset($_POST['continue'])) {
	$_SESSION['install_step']++;
	header('Location: index.php');
	exit;
}
?>

<h2>👑 Admin Account (Opcional)</h2>
<p>Defina qual conta do MU terá acesso ao AdminCP do site.</p>

<br>

<div class="alert alert-info">
	<span>ℹ️</span>
	<div>
		<strong>Como funciona:</strong>
		<ul style="margin-left: 20px; margin-top: 8px;">
			<li>Digite o nome de uma conta que <strong>já existe</strong> no servidor MU</li>
			<li>O sistema vai atualizar o campo <code>web_admin = 1</code> na tabela <code>accounts</code></li>
			<li>Essa conta terá acesso total ao AdminCP do site</li>
			<li><strong>Você pode pular este step</strong> e configurar depois via SQL</li>
		</ul>
	</div>
</div>

<?php
// Mostrar erro
if(isset($_SESSION['admin_error'])) {
	echo '<div class="alert alert-danger">';
	echo '<span>❌</span>';
	echo '<div>' . $_SESSION['admin_error'] . '</div>';
	echo '</div>';
	unset($_SESSION['admin_error']);
}

// Mostrar sucesso
if(isset($_SESSION['install_admin_success'])) {
	$adminAccount = $_SESSION['install_admin_account'];
	
	echo '<div class="alert alert-success">';
	echo '<span>✅</span>';
	echo '<div>';
	echo '<strong>Admin configurado com sucesso!</strong><br>';
	echo 'Conta <strong>' . htmlspecialchars($adminAccount) . '</strong> agora tem acesso ao AdminCP.';
	echo '</div>';
	echo '</div>';
	
	echo '<form method="post">';
	echo '<div class="btn-group">';
	echo '<button type="submit" name="continue" class="btn btn-success btn-lg">Continuar →</button>';
	echo '</div>';
	echo '</form>';
	
	unset($_SESSION['install_admin_success']);
	
} elseif(isset($_SESSION['install_admin_skipped'])) {
	
	echo '<div class="alert alert-warning">';
	echo '<span>⏭️</span>';
	echo '<div>';
	echo '<strong>Admin não configurado.</strong><br>';
	echo 'Você pode configurar manualmente depois executando:<br><br>';
	echo '<code>UPDATE accounts SET web_admin = 1 WHERE account = \'seu_admin\';</code>';
	echo '</div>';
	echo '</div>';
	
	echo '<form method="post">';
	echo '<div class="btn-group">';
	echo '<button type="submit" name="continue" class="btn btn-success btn-lg">Continuar →</button>';
	echo '</div>';
	echo '</form>';
	
	unset($_SESSION['install_admin_skipped']);
	
} else {
	// Formulário
	?>
	
	<form method="post">
		<div class="form-group">
			<label class="form-label">Nome da Conta Admin</label>
			<input type="text" name="admin_account" class="form-control" placeholder="admin" required autocomplete="off">
			<small class="form-help">Digite o nome de uma conta que JÁ EXISTE no servidor MU (case-sensitive)</small>
		</div>
		
		<div class="btn-group">
			<a href="?skip" class="btn btn-secondary">
				⏭️ Pular - Configurar Depois
			</a>
			<button type="submit" name="set_admin" class="btn btn-primary">
				👑 Definir como Admin
			</button>
		</div>
	</form>
	
	<br><br>
	
	<div class="alert alert-warning">
		<span>💡</span>
		<div>
			<strong>Dica:</strong> Se você pular este step, pode configurar o admin depois executando este comando SQL:
			<br><br>
			<code>UPDATE muonline.accounts SET web_admin = 1 WHERE account = 'nome_da_conta';</code>
		</div>
	</div>
	
	<?php
}
?>
