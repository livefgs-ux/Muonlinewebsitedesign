# 🔒 Configuração HSTS (HTTP Strict Transport Security)

**Arquivo**: CONFIGURACAO-HSTS-SERVIDOR.md  
**Versão**: V612  
**Data**: 31 de Dezembro de 2025, 14:30 CET  
**Propósito**: Resolver Issue 205 (No HSTS support)

---

## 📋 O que é HSTS?

**HTTP Strict Transport Security (HSTS)** é um mecanismo de segurança que força o navegador a:
- ✅ Sempre usar HTTPS (nunca HTTP)
- ✅ Prevenir ataques man-in-the-middle
- ✅ Prevenir downgrade attacks
- ✅ Prevenir cookie hijacking

---

## 🎯 Como Configurar HSTS

### 1. **Apache (CyberPanel)**

Edite o arquivo de configuração do virtual host:

```bash
# Localização (CyberPanel):
nano /usr/local/lsws/conf/vhosts/meumu.online/vhost.conf
```

Adicione dentro do bloco `<VirtualHost *:443>`:

```apache
<IfModule mod_headers.c>
    # HSTS (HTTP Strict Transport Security)
    Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    
    # Outras security headers
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
    
    # CSP (Content Security Policy)
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://www.meumu.online"
</IfModule>
```

Reinicie o Apache:

```bash
systemctl restart httpd
# OU no CyberPanel:
systemctl restart lsws
```

---

### 2. **Nginx**

Edite o arquivo de configuração do site:

```bash
nano /etc/nginx/sites-available/meumu.online.conf
```

Adicione dentro do bloco `server`:

```nginx
server {
    listen 443 ssl http2;
    server_name meumu.online www.meumu.online;
    
    # SSL Configuration
    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;
    
    # HSTS Header
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    
    # Security Headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
    
    # CSP
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://www.meumu.online" always;
    
    # Resto da configuração...
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name meumu.online www.meumu.online;
    return 301 https://$host$request_uri;
}
```

Teste e reinicie:

```bash
nginx -t
systemctl reload nginx
```

---

### 3. **Node.js Backend (Express)**

Adicione ao arquivo `backend-nodejs/src/server.js`:

```javascript
const helmet = require('helmet');

// Security middleware
app.use(helmet({
  hsts: {
    maxAge: 63072000,
    includeSubDomains: true,
    preload: true
  },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "data:"],
      connectSrc: ["'self'", "https://www.meumu.online"]
    }
  },
  frameguard: {
    action: 'sameorigin'
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  }
}));
```

Instale o helmet:

```bash
cd backend-nodejs
npm install helmet
```

---

## 🧪 Como Testar HSTS

### 1. **Teste Online**

Visite: https://securityheaders.com/

Digite: `https://www.meumu.online`

Você deve ver:
```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Grade: A+
```

---

### 2. **Teste via cURL**

```bash
curl -I https://www.meumu.online

# Resultado esperado:
HTTP/2 200
strict-transport-security: max-age=63072000; includeSubDomains; preload
x-content-type-options: nosniff
x-frame-options: SAMEORIGIN
x-xss-protection: 1; mode=block
```

---

### 3. **Teste no Navegador**

1. Abra DevTools (F12)
2. Vá para Network tab
3. Acesse https://www.meumu.online
4. Clique no primeiro request
5. Veja Response Headers
6. Confirme que `strict-transport-security` está presente

---

## 🚀 HSTS Preload (Opcional, mas Recomendado)

Para adicionar seu domínio à lista global de HSTS dos navegadores:

### Pré-requisitos:
1. ✅ HTTPS funcionando em TODO o site
2. ✅ Header HSTS com `max-age` >= 31536000 (1 ano)
3. ✅ `includeSubDomains` presente
4. ✅ `preload` presente
5. ✅ Redirect HTTP → HTTPS funcionando

### Submeter ao HSTS Preload:

1. Visite: https://hstspreload.org/
2. Digite: `meumu.online`
3. Clique em "Check HSTS preload status and eligibility"
4. Se tudo estiver OK, clique em "Submit"

**⚠️ ATENÇÃO**: HSTS Preload é **IRREVERSÍVEL** por meses! Só faça se tiver 100% de certeza que sempre usará HTTPS.

---

## 📊 Parâmetros Explicados

### `max-age=63072000`
- Duração em segundos (2 anos)
- Navegador lembrará de usar HTTPS por 2 anos
- Mínimo recomendado: 31536000 (1 ano)
- HSTS Preload exige: >= 31536000

### `includeSubDomains`
- Aplica HSTS a TODOS os subdomínios
- Exemplo: `api.meumu.online`, `cdn.meumu.online`, etc.
- **⚠️ CUIDADO**: Se algum subdomínio não tiver HTTPS, ficará inacessível!

### `preload`
- Permite submissão ao HSTS Preload
- Navegadores terão o domínio hardcoded
- **Permanente** (remoção leva meses)

---

## 🔍 Troubleshooting

### Problema: "HSTS header not found"

**Solução**:
```bash
# Verificar se módulo headers está ativo (Apache)
a2enmod headers
systemctl restart apache2

# Verificar sintaxe (Nginx)
nginx -t
```

---

### Problema: "Mixed Content" após ativar HSTS

**Causa**: Algum recurso (imagem, CSS, JS) está sendo carregado via HTTP.

**Solução**:
```bash
# Encontrar recursos HTTP:
grep -r "http://" src/

# Substituir por HTTPS ou protocolo relativo:
http://example.com/image.png  →  https://example.com/image.png
# OU
http://example.com/image.png  →  //example.com/image.png
```

---

### Problema: Subdomínio sem HTTPS quebrou

**Causa**: `includeSubDomains` aplicado mas subdomínio não tem SSL.

**Soluções**:
1. **Opção A**: Remover `includeSubDomains`
   ```apache
   Header always set Strict-Transport-Security "max-age=63072000"
   ```

2. **Opção B**: Adicionar SSL ao subdomínio
   ```bash
   certbot --nginx -d api.meumu.online
   ```

---

## 📚 Referências

- [MDN - HSTS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security)
- [OWASP - HSTS Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html)
- [HSTS Preload](https://hstspreload.org/)
- [Security Headers](https://securityheaders.com/)

---

## ✅ Checklist Final

Antes de marcar Issue 205 como resolvida:

- [ ] Header HSTS presente em HTTPS
- [ ] `max-age` >= 31536000
- [ ] `includeSubDomains` presente (se aplicável)
- [ ] Redirect HTTP → HTTPS funcionando
- [ ] Testado em https://securityheaders.com/
- [ ] Testado via cURL
- [ ] Testado no navegador (DevTools)
- [ ] Nenhum mixed content error
- [ ] Todos os subdomínios têm HTTPS (se `includeSubDomains`)
- [ ] (Opcional) Submetido ao HSTS Preload

---

**Status**: ⚠️ **REQUER CONFIGURAÇÃO NO SERVIDOR VPS**  
**Responsável**: Administrador do servidor  
**Prioridade**: ALTA (segurança)  
**Impacto**: Melhora SEO e segurança

---

**Desenvolvido por**: AI Assistant  
**Projeto**: MeuMU Online  
**Versão**: V612  
**Data**: 31/12/2025 14:30 CET
