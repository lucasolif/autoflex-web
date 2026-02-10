# 🚀 AutoFlex Web (Angular)

Interface web do sistema desenvolvida em **Angular**, para consumo da API **Java/Spring Boot**.  
O sistema possui layout corporativo responsivo com sidebar lateral, CRUD completo de matérias-primas e produtos, além da funcionalidade de sugestão de produção baseada no estoque disponível.

---

## 📌 Funcionalidades

### ✔ Matéria-prima
- Cadastro
- Edição
- Exclusão
- Listagem
- Busca por ID

### ✔ Produtos
- Cadastro
- Edição
- Exclusão
- Listagem
- Busca por ID
- Associação de matérias-primas ao produto (Lista de Materiais / BOM)

### ✔ Sugestão de Produção
- Consulta automática na API
- Exibição em tabela
- Cálculo de valor total sugerido

---

## 🧱 Tecnologias Utilizadas

- Angular (Standalone Components)
- Angular Router
- Angular Reactive Forms
- Angular Material
- TypeScript
- HTML + SCSS
- Proxy Angular (evitar CORS no desenvolvimento)

---

## 📌 Pré-requisitos

- Node.js LTS
- Angular CLI:

`npm install -g @angular/cli`

## 🌐 Endpoints Consumidos

### 🧪 Matéria-prima

| Método | Endpoint | Descrição |
|--------|----------|----------|
| GET | `/api/raw-material` | Listar matérias-primas |
| GET | `/api/raw-material/{id}` | Buscar matéria-prima por ID |
| POST | `/api/raw-material` | Cadastrar matéria-prima |
| PUT | `/api/raw-material/{id}` | Atualizar matéria-prima |
| DELETE | `/api/raw-material/{id}` | Excluir matéria-prima |

---

### 📦 Produtos

| Método | Endpoint | Descrição |
|--------|----------|----------|
| GET | `/api/product` | Listar produtos |
| GET | `/api/product/{id}` | Buscar produto por ID |
| POST | `/api/product` | Cadastrar produto |
| PUT | `/api/product/{id}` | Atualizar produto |
| DELETE | `/api/product/{id}` | Excluir produto |

---

### 💡 Sugestão de Produção

| Método | Endpoint | Descrição |
|--------|----------|----------|
| GET | `/api/production/suggestions` | Obter sugestão de produção baseada no estoque |
