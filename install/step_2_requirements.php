<?php
/**
 * MeuMU Online - Step 2: Requisitos do Servidor
 * 
 * @version 2.0.0
 * @author MeuMU Team
 * @copyright (c) 2024-2025 MeuMU Online, All Rights Reserved
 */

if(!defined('access') or !access or access != 'install') die();

if(isset($_POST['continue'])) {
	$_SESSION['install_step']++;
	header('Location: index.php');
	exit;
}
?>

<h2>⚙️ Requisitos do Servidor</h2>
<p>Verificando se seu servidor atende os requisitos mínimos para executar o MeuMU Online.</p>

<br>

<h4>🔍 Versões e Extensões PHP:</h4>

<div class="list-group">
	<?php
	// PHP Version
	$phpOK = version_compare(PHP_VERSION, '8.1.0', '>=');
	?>
	<div class="list-group-item">
		<strong>PHP 8.1 ou superior</strong>
		<span class="pull-right">
			<small style="margin-right: 10px; color: rgba(255,255,255,0.6);">(Versão: <?php echo PHP_VERSION; ?>)</small>
			<?php echo $phpOK ? '<span class="label label-success">✓ OK</span>' : '<span class="label label-danger">✗ Erro</span>'; ?>
		</span>
	</div>
	
	<?php
	// Extensions
	$extensions = array(
		'PDO' => 'pdo',
		'PDO MySQL' => 'pdo_mysql',
		'OpenSSL' => 'openssl',
		'cURL' => 'curl',
		'GD' => 'gd',
		'XML' => 'xml',
		'JSON' => 'json',
		'MBString' => 'mbstring',
	);
	
	foreach($extensions as $name => $ext) {
		$loaded = extension_loaded($ext);
		?>
		<div class="list-group-item">
			<strong><?php echo $name; ?></strong>
			<span class="pull-right">
				<?php echo $loaded ? '<span class="label label-success">✓ OK</span>' : '<span class="label label-danger">✗ Não instalado</span>'; ?>
			</span>
		</div>
		<?php
	}
	?>
</div>

<br>

<h4>📁 Permissões de Escrita:</h4>

<div class="list-group">
	<?php
	$writablePaths = array(
		'backend-nodejs/',
		'',  // root
	);
	
	foreach($writablePaths as $path) {
		$fullPath = __ROOT_DIR__ . $path;
		$displayPath = empty($path) ? '/ (raiz)' : $path;
		$writable = is_writable($fullPath);
		?>
		<div class="list-group-item">
			<strong><?php echo $displayPath; ?></strong>
			<span class="pull-right">
				<?php echo $writable ? '<span class="label label-success">✓ Escrita OK</span>' : '<span class="label label-warning">✗ Sem permissão</span>'; ?>
			</span>
		</div>
		<?php
	}
	?>
</div>

<br>

<?php
// Check for errors
$errors = checkRequirements();
if(!empty($errors)) {
	echo '<div class="alert alert-warning">';
	echo '<span>⚠️</span>';
	echo '<div>';
	echo '<strong>Atenção! Alguns requisitos não foram atendidos:</strong><br><br>';
	foreach($errors as $error) {
		echo '• ' . $error . '<br>';
	}
	echo '<br><strong>Recomendamos fortemente que você corrija esses problemas antes de continuar.</strong>';
	echo '</div>';
	echo '</div>';
	
	echo '<div class="alert alert-info">';
	echo '<span>💡</span>';
	echo '<div>';
	echo '<strong>Como corrigir permissões:</strong><br><br>';
	echo '<strong>Linux/VPS:</strong><br>';
	echo '<code>chmod +x scripts/fix-permissions.sh && ./scripts/fix-permissions.sh</code><br><br>';
	echo '<strong>Windows:</strong><br>';
	echo '<code>Set-ExecutionPolicy Bypass -Scope Process && .\\scripts\\fix-permissions.ps1</code>';
	echo '</div>';
	echo '</div>';
}
?>

<form method="post">
	<div class="btn-group">
		<a href="index.php" class="btn btn-secondary">
			🔄 Verificar Novamente
		</a>
		<button type="submit" name="continue" class="btn btn-success">
			Continuar Mesmo Assim →
		</button>
	</div>
</form>
