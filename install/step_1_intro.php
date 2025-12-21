<?php
/**
 * MeuMU Online - Step 1: Introdução
 * 
 * @version 2.0.0
 * @author MeuMU Team
 * @copyright (c) 2024-2025 MeuMU Online, All Rights Reserved
 */

if(!defined('access') or !access or access != 'install') die();

if(isset($_GET['action']) && $_GET['action'] == 'next') {
	$_SESSION['install_step']++;
	header('Location: index.php');
	exit;
}
?>

<h2>🎮 Bem-vindo ao MeuMU Online!</h2>

<p>Este instalador irá configurar automaticamente seu site completo para servidor MU Online Season 19-2-3 Épico com tema Dark Medieval Fantasy.</p>

<br>

<h4>📋 O que será instalado:</h4>
<div class="alert alert-info">
	<span>ℹ️</span>
	<div>
		<ul style="margin-left: 20px;">
			<li>✅ Sistema de login e cadastro seguro</li>
			<li>✅ Área do jogador com gestão de personagens</li>
			<li>✅ Sistema de distribuição de pontos via web</li>
			<li>✅ Sistema de reset automático</li>
			<li>✅ Rankings em tempo real</li>
			<li>✅ Sistema de notícias multilíngue (8 idiomas)</li>
			<li>✅ Sistema de votos e downloads</li>
			<li>✅ AdminCP completo para gestão</li>
			<li>✅ Backend Node.js + MariaDB</li>
		</ul>
	</div>
</div>

<hr>

<h4>⚙️ Requisitos Mínimos:</h4>
<div class="list-group">
	<div class="list-group-item">
		<strong>PHP 8.1+</strong>
		<span class="label label-default pull-right">Necessário</span>
	</div>
	<div class="list-group-item">
		<strong>Node.js 18+</strong>
		<span class="label label-default pull-right">Necessário</span>
	</div>
	<div class="list-group-item">
		<strong>MariaDB/MySQL 10.3+</strong>
		<span class="label label-default pull-right">Necessário</span>
	</div>
	<div class="list-group-item">
		<strong>Apache/Nginx/LiteSpeed</strong>
		<span class="label label-default pull-right">Necessário</span>
	</div>
</div>

<hr>

<h4>🗄️ Arquitetura de Dual Database:</h4>
<p>O sistema utiliza <strong>2 databases separadas</strong> para melhor segurança e performance:</p>

<div class="list-group">
	<div class="list-group-item">
		<div>
			<strong>muonline</strong> - Database do Servidor MU
			<br>
			<small style="color: rgba(255,255,255,0.6);">Contém: accounts, character_info, guild_list, etc. (Somente leitura)</small>
		</div>
		<span class="label label-warning pull-right">Read Only</span>
	</div>
	<div class="list-group-item">
		<div>
			<strong>webmu</strong> - Database do Site
			<br>
			<small style="color: rgba(255,255,255,0.6);">Contém: notícias, votos, downloads, etc. (Leitura + Escrita)</small>
		</div>
		<span class="label label-success pull-right">Read + Write</span>
	</div>
</div>

<hr>

<h4>📜 Licença MIT:</h4>
<div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); font-size: 12px; font-family: monospace; color: rgba(255,255,255,0.7); line-height: 1.8;">
The MIT License (MIT)<br><br>

Copyright (c) <?php echo date("Y"); ?> MeuMU Online<br><br>

Permission is hereby granted, free of charge, to any person obtaining a copy of<br>
this software and associated documentation files (the "Software"), to deal in<br>
the Software without restriction, including without limitation the rights to<br>
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of<br>
the Software, and to permit persons to whom the Software is furnished to do so,<br>
subject to the following conditions:<br><br>

The above copyright notice and this permission notice shall be included in all<br>
copies or substantial portions of the Software.<br><br>

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR<br>
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS<br>
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
</div>

<hr>

<h4>💝 Agradecimentos:</h4>
<p>Este projeto é open-source e desenvolvido com muito carinho para a comunidade MU Online brasileira. Se você gosta do nosso trabalho, considere apoiar o projeto compartilhando com outros administradores de servidores!</p>

<div class="btn-group">
	<a href="?action=next" class="btn btn-primary btn-lg">
		Iniciar Instalação →
	</a>
</div>
