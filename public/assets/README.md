# Assets do MeuMU Online

## 📁 Estrutura de Arquivos

```
/public/assets/
├── backgrounds/
│   └── hero-background.png          (Background principal - Elf Warrior)
├── images/
│   └── character-example.png        (Exemplo de personagem)
└── README.md
```

## 🎨 Imagens Necessárias

### Background Principal (hero-background.png)
- **Origem:** figma:asset/7c77bece727042bfc957b9adbcf34e1fa973fbec.png
- **Descrição:** Imagem de Elf Warrior - Background dark medieval fantasy
- **Tamanho recomendado:** 1920x1080px ou maior
- **Formato:** PNG com transparência ou JPG
- **Usado em:** Todas as páginas (Home, Rankings, Events, Downloads, News)

### Character Example (character-example.png)
- **Origem:** figma:asset/0481c7d9f941d688b911f1c81a92c821fe1a50e8.png
- **Descrição:** Exemplo de personagem para Dashboard
- **Tamanho recomendado:** 400x600px
- **Formato:** PNG com transparência
- **Usado em:** Dashboard de usuário

## ⚙️ Como Adicionar as Imagens

### Opção 1: Exportar do Figma (Recomendado)
1. Abra o projeto no Figma
2. Selecione a camada da imagem
3. Clique em "Export" no painel direito
4. Escolha formato PNG e resolução @2x
5. Salve na pasta correspondente

### Opção 2: Usar Imagens Próprias
1. Prepare imagens que correspondam ao tema dark medieval fantasy
2. Renomeie para os nomes especificados acima
3. Coloque nas pastas correspondentes

### Opção 3: Usar Placeholders
O projeto já inclui placeholders que mostram onde as imagens devem aparecer.
Substitua por imagens reais quando disponível.

## 🚀 Após Adicionar as Imagens

Execute o comando:
```bash
npm run build
```

Isso irá:
- Otimizar as imagens
- Gerar versões responsivas
- Criar cache para melhor performance
