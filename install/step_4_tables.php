<?php
/**
 * MeuMU Online - Step 4: Criar Tabelas
 * 
 * @version 2.0.0
 * @author MeuMU Team
 * @copyright (c) 2024-2025 MeuMU Online, All Rights Reserved
 */

if(!defined('access') or !access or access != 'install') die();

// Verificar se dados de conexão existem
if(!isset($_SESSION['install_db_host'])) {
	echo '<div class="alert alert-danger"><span>❌</span><div>Dados de conexão não encontrados. Por favor, volte ao Step 3.</div></div>';
	echo '<a href="index.php" class="btn btn-secondary">← Voltar</a>';
	exit;
}

// Processar criação de tabelas
if(isset($_POST['create_tables']) || isset($_GET['auto'])) {
	try {
		$host = $_SESSION['install_db_host'];
		$port = $_SESSION['install_db_port'];
		$user = $_SESSION['install_db_user'];
		$pass = $_SESSION['install_db_pass'];
		$dbWEB = $_SESSION['install_db_web'];
		
		// Conectar sem especificar database
		$dsn = "mysql:host={$host};port={$port};charset=utf8mb4";
		$pdo = new PDO($dsn, $user, $pass, [
			PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
		]);
		
		// Criar database se não existir
		$pdo->exec("CREATE DATABASE IF NOT EXISTS `{$dbWEB}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
		
		// Selecionar database
		$pdo->exec("USE `{$dbWEB}`");
		
		// Carregar e executar SQL
		$sqlFile = __INSTALL_ROOT__ . 'webmu_schema.sql';
		if(!file_exists($sqlFile)) {
			throw new Exception('Arquivo SQL não encontrado: webmu_schema.sql');
		}
		
		$sql = file_get_contents($sqlFile);
		
		// Executar SQL por statements
		$statements = array_filter(
			array_map('trim', explode(';', $sql)),
			function($stmt) {
				return !empty($stmt) && 
					   !preg_match('/^\s*--/', $stmt) && 
					   !preg_match('/^\s*\/\*/', $stmt) &&
					   !preg_match('/^\s*#/', $stmt);
			}
		);
		
		$_SESSION['tables_created'] = array();
		$_SESSION['tables_errors'] = array();
		
		foreach($statements as $statement) {
			if(empty($statement)) continue;
			
			// Extrair nome da tabela
			if(preg_match('/CREATE TABLE.*?`?(\w+)`?\s*\(/i', $statement, $matches)) {
				$tableName = $matches[1];
				
				try {
					$pdo->exec($statement);
					$_SESSION['tables_created'][] = $tableName;
				} catch (PDOException $e) {
					if(strpos($e->getMessage(), 'already exists') !== false) {
						$_SESSION['tables_created'][] = $tableName . ' (já existia)';
					} else {
						$_SESSION['tables_errors'][] = $tableName . ': ' . $e->getMessage();
					}
				}
			} else {
				// Executar outros statements (INSERT, etc)
				try {
					$pdo->exec($statement);
				} catch (PDOException $e) {
					// Ignorar erros de duplicação de dados iniciais
					if(strpos($e->getMessage(), 'Duplicate entry') === false) {
						$_SESSION['tables_errors'][] = 'SQL: ' . $e->getMessage();
					}
				}
			}
		}
		
		$_SESSION['tables_installation_complete'] = true;
		
	} catch (PDOException $e) {
		$_SESSION['tables_error'] = 'Erro SQL: ' . $e->getMessage();
	} catch (Exception $e) {
		$_SESSION['tables_error'] = $e->getMessage();
	}
}

// Deletar e recriar
if(isset($_GET['force'])) {
	try {
		$host = $_SESSION['install_db_host'];
		$port = $_SESSION['install_db_port'];
		$user = $_SESSION['install_db_user'];
		$pass = $_SESSION['install_db_pass'];
		$dbWEB = $_SESSION['install_db_web'];
		
		$dsn = "mysql:host={$host};port={$port};dbname={$dbWEB};charset=utf8mb4";
		$pdo = new PDO($dsn, $user, $pass, [
			PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
		]);
		
		// Deletar todas as tabelas WEBMU_*
		$tables = $pdo->query("SHOW TABLES LIKE 'WEBMU_%'")->fetchAll(PDO::FETCH_COLUMN);
		foreach($tables as $table) {
			$pdo->exec("DROP TABLE IF EXISTS `{$table}`");
		}
		
		$_SESSION['tables_deleted'] = true;
		header('Location: index.php?auto=1');
		exit;
		
	} catch (PDOException $e) {
		$_SESSION['tables_error'] = 'Erro ao deletar tabelas: ' . $e->getMessage();
	}
}

// Continuar
if(isset($_POST['continue'])) {
	$_SESSION['install_step']++;
	header('Location: index.php');
	exit;
}
?>

<h2>📊 Criar Tabelas do Database</h2>
<p>Criando as tabelas necessárias no database <strong><?php echo $_SESSION['install_db_web']; ?></strong>.</p>

<br>

<?php
// Mostrar erro
if(isset($_SESSION['tables_error'])) {
	echo '<div class="alert alert-danger">';
	echo '<span>❌</span>';
	echo '<div>' . $_SESSION['tables_error'] . '</div>';
	echo '</div>';
	unset($_SESSION['tables_error']);
}

// Mostrar sucesso
if(isset($_SESSION['tables_installation_complete'])) {
	echo '<div class="alert alert-success">';
	echo '<span>✅</span>';
	echo '<div>';
	echo '<strong>Instalação concluída com sucesso!</strong><br>';
	echo count($_SESSION['tables_created']) . ' tabelas criadas/verificadas';
	if(!empty($_SESSION['tables_errors'])) {
		echo '<br>' . count($_SESSION['tables_errors']) . ' erros encontrados (podem ser ignorados)';
	}
	echo '</div>';
	echo '</div>';
	
	// Mostrar tabelas criadas
	if(!empty($_SESSION['tables_created'])) {
		echo '<h4>✅ Tabelas Criadas:</h4>';
		echo '<div class="list-group">';
		foreach($_SESSION['tables_created'] as $table) {
			$isExisting = strpos($table, 'já existia') !== false;
			$label = $isExisting ? '<span class="label label-default">Já Existia</span>' : '<span class="label label-success">Criada</span>';
			echo '<div class="list-group-item">';
			echo str_replace(' (já existia)', '', $table);
			echo '<span class="pull-right">' . $label . '</span>';
			echo '</div>';
		}
		echo '</div><br>';
	}
	
	// Mostrar erros se houver
	if(!empty($_SESSION['tables_errors'])) {
		echo '<h4>⚠️ Avisos (podem ser ignorados):</h4>';
		echo '<div class="list-group">';
		foreach($_SESSION['tables_errors'] as $error) {
			echo '<div class="list-group-item">';
			echo '<small>' . htmlspecialchars($error) . '</small>';
			echo '</div>';
		}
		echo '</div><br>';
	}
	
	echo '<form method="post">';
	echo '<div class="btn-group">';
	echo '<a href="index.php" class="btn btn-secondary">🔄 Verificar Novamente</a>';
	echo '<button type="submit" name="continue" class="btn btn-success">Continuar →</button>';
	echo '</div>';
	echo '</form>';
	
	unset($_SESSION['tables_installation_complete']);
	
} else {
	// Primeira vez - mostrar botão para criar
	?>
	
	<div class="alert alert-info">
		<span>ℹ️</span>
		<div>
			<strong>O que será criado:</strong>
			<ul style="margin-left: 20px; margin-top: 8px;">
				<li>18 tabelas WEBMU_* (notícias, votos, downloads, etc.)</li>
				<li>Dados iniciais (notícia de boas-vindas, configurações, etc.)</li>
				<li>Estrutura completa para o site funcionar</li>
			</ul>
		</div>
	</div>
	
	<form method="post">
		<div class="btn-group">
			<button type="submit" name="create_tables" class="btn btn-primary btn-lg">
				🚀 Criar Tabelas Agora
			</button>
		</div>
	</form>
	
	<br><br>
	
	<div class="alert alert-warning">
		<span>⚠️</span>
		<div>
			<strong>Tabelas já existem?</strong><br>
			Se você já executou o instalador antes, pode deletar todas as tabelas WEBMU_* e recriá-las do zero.
			<br><br>
			<a href="?force=1" class="btn btn-danger btn-sm" onclick="return confirm('ATENÇÃO! Isso vai DELETAR todas as tabelas WEBMU_* e dados associados. Tem certeza?')">
				🗑️ Deletar Todas e Recriar
			</a>
		</div>
	</div>
	
	<?php
}
?>
