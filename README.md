# Sistema de Inspeção de Vasos de Pressão

Um aplicativo web desenvolvido em React para gerenciar inspeções de vasos de pressão, permitindo o registro, armazenamento e geração de relatórios em PDF.

## 🌐 Demo Online

Acesse a aplicação em produção: [https://formulario-inspecao.vercel.app/](https://formulario-inspecao.vercel.app/)

## 🚀 Funcionalidades

- ✅ Registro de inspeções com dados do equipamento
- 📅 Controle de datas de inspeção e vencimento
- 📸 Upload e visualização de fotos
- 📄 Geração automática de relatórios em PDF
- 💾 Armazenamento local dos dados usando IndexedDB
- 📊 Geração de relatórios em lote
- 🔍 Validação de datas de inspeção

## 🛠️ Tecnologias Utilizadas

- React 19.1.0
- Bootstrap 5.3.7
- ReactStrap 9.2.3
- PDF-Lib 1.17.1
- IndexedDB (via IDB 8.0.3)
- Date-fns 4.1.0
- React Icons 5.5.0
- Vite 7.0.0

## 📋 Pré-requisitos

- Node.js (versão LTS recomendada)
- NPM ou Yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
```

## 📦 Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Gera a versão de produção
- `npm run preview`: Visualiza a versão de produção localmente
- `npm run lint`: Executa a verificação de código com ESLint

## 🗄️ Estrutura do Projeto

```
src/
├── assets/         # Arquivos estáticos (imagens, etc)
├── components/     # Componentes React
├── data/          # Configuração do banco de dados
├── utils/         # Utilitários e funções auxiliares
└── ...
```

## 💾 Armazenamento de Dados

O aplicativo utiliza IndexedDB para armazenamento local dos dados das inspeções, permitindo:
- Armazenamento offline
- Persistência dos dados
- Acesso rápido às informações

## 📄 Geração de PDF

Os relatórios em PDF incluem:
- Dados do equipamento
- Datas de inspeção
- Tipo de dano
- Observações
- Fotos anexadas
- Marca d'água corporativa

## 🤝 Contribuindo

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença [inserir tipo de licença]. Veja o arquivo `LICENSE` para mais detalhes.

## 🚀 Deploy

O projeto está hospedado na Vercel e pode ser acessado através do link: [https://formulario-inspecao.vercel.app/](https://formulario-inspecao.vercel.app/)