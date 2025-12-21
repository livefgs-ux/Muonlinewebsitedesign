# 💰 Sistema de Pacotes de WCoin Configuráveis

## 📋 Índice
- [Visão Geral](#visão-geral)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [AdminCP](#admincp)
- [Troubleshooting](#troubleshooting)

## 🎯 Visão Geral

Sistema completo e totalmente configurável para gerenciar pacotes de WCoin no MeuMU Online. Permite criar, editar, ativar/desativar pacotes via AdminCP, com carregamento dinâmico no frontend.

### Características
- ✅ Totalmente configurável via AdminCP
- ✅ CRUD completo de pacotes
- ✅ Ativação/desativação de pacotes
- ✅ Ordem personalizada de exibição
- ✅ Links de compra individuais por pacote
- ✅ Suporte a múltiplas moedas (BRL, USD, EUR, GBP)
- ✅ Sistema de bônus
- ✅ Carregamento dinâmico no frontend
- ✅ 100% real (sem dados mock)

## 🚀 Instalação

### 1. Criar a tabela no banco de dados

Execute o script SQL fornecido:

```bash
cd /backend-nodejs/database
mysql -u root -p MuOnline < 05_create_wcoin_packages.sql
```

Ou execute manualmente:

```sql
CREATE TABLE IF NOT EXISTS wcoin_packages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  wcoin_amount INT NOT NULL,
  bonus_amount INT DEFAULT 0,
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'BRL',
  purchase_link VARCHAR(500) DEFAULT '#',
  is_active TINYINT(1) DEFAULT 1,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_active (is_active),
  INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2. Inserir pacotes padrão (Opcional)

```sql
INSERT INTO wcoin_packages (name, wcoin_amount, bonus_amount, price, currency, purchase_link, display_order) VALUES
('Pacote Iniciante', 100, 0, 10.00, 'BRL', '#', 1),
('Pacote Bronze', 300, 20, 30.00, 'BRL', '#', 2),
('Pacote Prata', 600, 50, 60.00, 'BRL', '#', 3),
('Pacote Ouro', 1200, 150, 120.00, 'BRL', '#', 4),
('Pacote Platina', 3000, 500, 300.00, 'BRL', '#', 5),
('Pacote Diamante', 6000, 1200, 600.00, 'BRL', '#', 6);
```

### 3. Reiniciar o backend

```bash
cd /backend-nodejs
pm2 restart meumu-backend
```

## ⚙️ Configuração

### Backend
O backend já está configurado. As rotas foram adicionadas automaticamente em `/backend-nodejs/src/server.js`:

```javascript
app.use('/api/wcoin', wcoinRoutes);
```

### Frontend
O frontend já está configurado para carregar os pacotes automaticamente do banco de dados.

## 🎮 Uso

### Via AdminCP

1. Acesse o AdminCP
2. Navegue até "Pacotes WCoin" no menu lateral
3. Crie, edite ou remova pacotes conforme necessário

#### Criar Novo Pacote

1. Clique em "Novo Pacote"
2. Preencha os dados:
   - **Nome**: Nome do pacote (ex: "Pacote VIP")
   - **Quantidade WCoin**: Quantidade de WCoin (ex: 5000)
   - **Bônus WCoin**: Quantidade de bônus (ex: 1000)
   - **Preço**: Preço do pacote (ex: 250.00)
   - **Moeda**: Selecione a moeda (BRL, USD, EUR, GBP)
   - **Link de Compra**: URL do gateway de pagamento
   - **Ordem de Exibição**: Menor número aparece primeiro
   - **Pacote Ativo**: Marque para ativar

3. Clique em "Criar Pacote"

#### Editar Pacote

1. Clique no botão "Editar" (ícone azul)
2. Modifique os dados necessários
3. Clique em "Atualizar Pacote"

#### Ativar/Desativar Pacote

- Clique no badge de status ("Ativo" ou "Inativo") para alternar

#### Deletar Pacote

- **Desativar**: Clique no ícone amarelo (EyeOff)
- **Deletar Permanentemente**: Clique no ícone vermelho (Trash2)

### Via Frontend

Os pacotes configurados no AdminCP aparecerão automaticamente na loja de créditos do Player Dashboard.

## 📡 API Endpoints

### Públicos (Não requerem autenticação)

#### GET `/api/wcoin/packages`
Retorna todos os pacotes ativos.

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Pacote Iniciante",
      "wcoin_amount": 100,
      "bonus_amount": 0,
      "price": "10.00",
      "currency": "BRL",
      "purchase_link": "https://mercadopago.com/...",
      "is_active": 1,
      "display_order": 1,
      "created_at": "2024-12-21T00:00:00.000Z",
      "updated_at": "2024-12-21T00:00:00.000Z"
    }
  ]
}
```

#### GET `/api/wcoin/packages/:id`
Retorna um pacote específico.

**Parâmetros:**
- `id`: ID do pacote

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Pacote Iniciante",
    ...
  }
}
```

### Administrativos (Requerem token de admin)

#### GET `/api/wcoin/admin/packages`
Lista TODOS os pacotes (incluindo inativos).

**Headers:**
```
Authorization: Bearer {admin_token}
```

#### POST `/api/wcoin/admin/packages`
Cria um novo pacote.

**Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Pacote VIP",
  "wcoin_amount": 5000,
  "bonus_amount": 1000,
  "price": "250.00",
  "currency": "BRL",
  "purchase_link": "https://...",
  "is_active": 1,
  "display_order": 7
}
```

#### PUT `/api/wcoin/admin/packages/:id`
Atualiza um pacote existente.

**Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Pacote VIP Premium",
  "wcoin_amount": 10000,
  "price": "500.00"
}
```

#### DELETE `/api/wcoin/admin/packages/:id`
Desativa um pacote (soft delete).

**Headers:**
```
Authorization: Bearer {admin_token}
```

#### DELETE `/api/wcoin/admin/packages/:id/permanent`
Remove um pacote permanentemente.

**Headers:**
```
Authorization: Bearer {admin_token}
```

## 🎨 AdminCP

### Tela Principal

![AdminCP WCoin Packages](./screenshots/wcoin-packages-admincp.png)

### Funcionalidades

1. **Info Box**: Instruções de uso
2. **Formulário**: Criar/editar pacotes
3. **Tabela**: Lista todos os pacotes com ações
4. **Estatísticas**: Cards com totais de pacotes

### Permissões

Apenas administradores com a permissão `viewAccounts` podem acessar.

## 🔧 Troubleshooting

### Pacotes não aparecem no frontend

1. Verifique se o backend está rodando:
```bash
pm2 status
```

2. Verifique se a tabela foi criada:
```sql
SHOW TABLES LIKE 'wcoin_packages';
```

3. Verifique se existem pacotes ativos:
```sql
SELECT * FROM wcoin_packages WHERE is_active = 1;
```

4. Verifique o console do navegador por erros

### Erro 500 ao criar pacote

1. Verifique os logs do backend:
```bash
pm2 logs meumu-backend
```

2. Verifique se todos os campos obrigatórios foram preenchidos
3. Verifique se os tipos de dados estão corretos

### Pacote não aparece após criar

1. Verifique se o pacote está ativo (`is_active = 1`)
2. Verifique a ordem de exibição (`display_order`)
3. Limpe o cache do navegador

## 📝 Notas Importantes

- **Moeda**: A conversão de moeda não é automática. Configure o preço correto para cada moeda.
- **Links de Compra**: Configure links válidos de gateways de pagamento (MercadoPago, PayPal, PagSeguro, etc)
- **Ordem**: Pacotes com `display_order` menor aparecem primeiro
- **Segurança**: Nunca exponha o token de admin no frontend

## 🎯 Próximos Passos

1. Configurar gateway de pagamento
2. Adicionar webhooks para processar pagamentos
3. Criar histórico de compras
4. Adicionar notificações de compra
5. Implementar sistema de cupons/descontos

## 📞 Suporte

Para dúvidas ou problemas, contate o desenvolvedor ou abra uma issue no repositório.

---

**MeuMU Online** - Sistema de Gerenciamento de Pacotes WCoin  
Desenvolvido com ❤️ para a comunidade Mu Online
