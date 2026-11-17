# Frontend — Minha Biblioteca

Interface web para consultar, cadastrar, editar, excluir e emprestar materiais da BibliotecaApi.

## Executar localmente

1. Na raiz do projeto, inicie a API:

   ```bash
   dotnet run
   ```

   A API deve estar disponível em `http://localhost:5236`. Confira o Swagger em `http://localhost:5236/swagger`.

2. Em outro terminal, na raiz do projeto, sirva esta pasta:

   ```bash
   python -m http.server 5500 --directory front
   ```

   Alternativamente, abra `index.html` com a extensão Live Server do VS Code.

3. Acesse `http://localhost:5500`.

O endereço da API está definido no início de `script.js` como `http://localhost:5236/api/Materiais`. A API permite chamadas do frontend pela política CORS `PermitirFrontend`.

## Interface

- `index.html`: estrutura dos formulários, painel, tabela e modais.
- `script.js`: validação, renderização segura do DOM e chamadas `fetch`.
- `styles.css`: tema da página e ajustes responsivos.
- Bootstrap 5.3.3 é carregado pelo CDN; é necessária conexão à internet para os estilos e componentes do Bootstrap.

O formulário valida título obrigatório, ano não negativo, páginas e edição maiores que zero e mês entre 1 e 12. Os erros recebem a classe `is-invalid`; a API repete as validações no servidor.

## Verificação responsiva

A página foi conferida visualmente no Microsoft Edge (Chromium) nos viewports 390 × 2400, 768 × 1600 e 1440 × 1000. Em telas pequenas e médias, o formulário e a lista ficam empilhados; a tabela mantém a rolagem horizontal dentro do próprio contêiner. Em telas grandes, o formulário e a lista ficam lado a lado.