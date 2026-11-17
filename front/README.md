# Front-end da Biblioteca

## O que foi desenvolvido

Fizemos uma página em HTML, CSS e JavaScript com Bootstrap que usa a nossa BibliotecaApi. Pela página dá pra:

- ver todos os materiais numa tabela (com a quantidade de livros e revistas em cima)
- cadastrar livro ou revista
- editar um material
- excluir (com uma janela pedindo confirmação antes)
- consultar um material pelo ID
- ver a descrição e o prazo de empréstimo
- tentar emprestar (só livro pode, revista dá erro)

## Como executar a API

Na pasta raiz do projeto (onde está o `BibliotecaApi.csproj`):

```
dotnet run
```

Ela sobe em `http://localhost:5236`. O Swagger fica em `http://localhost:5236/swagger`.

Os dados ficam só na memória, então quando a API é reiniciada volta a ter só o livro e a revista que já vêm cadastrados.

## Como abrir o front-end

Com a API rodando, abrir o `front/index.html` com o Live Server do VS Code (botão direito > Open with Live Server).

Também dá pra abrir o `index.html` direto no navegador, porque a API tem o CORS liberado.

## URL da API utilizada

```
http://localhost:5236/api/Materiais
```

Ela está numa constante `URL_API` na primeira linha do `script.js`.

## Endpoints consumidos

| Método | Endpoint | Onde usamos na página |
|---|---|---|
| GET | `/api/Materiais` | carregar a tabela e os contadores |
| GET | `/api/Materiais/{id}` | botão Consultar e busca por ID |
| GET | `/api/Materiais/{id}/descricao` | botão Descrição |
| POST | `/api/Materiais/livro` | cadastrar livro |
| POST | `/api/Materiais/revista` | cadastrar revista |
| PUT | `/api/Materiais/livro/{id}` | salvar edição de livro |
| PUT | `/api/Materiais/revista/{id}` | salvar edição de revista |
| DELETE | `/api/Materiais/{id}` | botão Excluir |
| POST | `/api/Materiais/{id}/emprestar` | botão Emprestar |

## Como o front-end foi organizado

São só três arquivos:

- `index.html`: a página. Tem os cards de resumo, o formulário de cadastro na esquerda, a tabela de materiais na direita e os dois modais (detalhes e excluir).
- `style.css`: as cores e os ajustes que fizemos por cima do Bootstrap.
- `script.js`: toda a parte de JavaScript.

No `script.js` primeiro pegamos os elementos com `querySelector` e guardamos em constantes. Depois cada ação tem a sua função (`carregarMateriais`, `cadastrarLivro`, `cadastrarRevista`, `editarMaterial`, `excluirMaterial`, `emprestarMaterial`...). As chamadas pra API são feitas com `fetch` e `.then()`, do mesmo jeito que vimos na aula.

O formulário serve tanto pra cadastrar quanto pra editar. Quando clica em Editar, guardamos o id na variável `idEmEdicao`, o formulário é preenchido e o botão muda pra "Salvar alterações". Se `idEmEdicao` tem valor ele faz PUT, se não faz POST.

Os campos de livro (autor e páginas) e de revista (edição e mês) ficam em divs separadas, e conforme o tipo escolhido no select uma aparece e a outra recebe `d-none`.

## Componentes do Bootstrap utilizados

- Grid (`container`, `row`, `col-sm-4`, `col-lg-4`, `col-lg-8`)
- Cards (resumo, formulário e lista)
- Formulários (`form-control`, `form-select`, `form-label`, `invalid-feedback`)
- Input group (campo de ID com os botões Buscar e Emprestar)
- Botões (`btn-primary`, `btn-danger`, `btn-success`, `btn-info`, `btn-outline-...`)
- Tabela (`table`, `table-hover`, `table-responsive`)
- Alert (`alert-success` e `alert-danger` pras mensagens)
- Modal (um pra mostrar detalhes/descrição e outro pra confirmar a exclusão)
- Classes utilitárias como `d-none`, `d-grid`, `d-flex`, `gap`, `mb-3`

## Validações implementadas

Antes de mandar pra API o formulário confere:

- título não pode ficar vazio (usamos `.trim()`, então só espaço também não passa)
- ano de publicação não pode ser negativo
- livro: autor obrigatório e páginas maior que zero
- revista: edição maior que zero e mês entre 1 e 12

Se algum campo estiver errado ele fica vermelho com `is-invalid` e aparece a mensagem embaixo. Quando a pessoa começa a digitar de novo o erro some.

Na busca por ID o campo é obrigatório e tem que ser no mínimo 1.

Se mesmo assim a API recusar alguma coisa, a mensagem de erro que ela devolve aparece num alert vermelho e também no console.

## Dificuldades encontradas

1. Na aula a gente só tinha usado o JSONPlaceholder e nunca tinha dado erro de CORS. Quando ligamos o front na nossa API, nada carregava e o console mostrava erro de CORS.
2. O projeto estava em .NET 10 e em alguns computadores do grupo só tinha o SDK 9, aí dava erro ao rodar a API.
3. O cadastro de revista salvava o mês como 0. O front mandava `mes`, mas na classe `Revista` a propriedade se chama `MesPublicacao`.
4. Quando a API dava erro (400 ou 404), a página mostrava uma mensagem fixa e não a frase que a API mandava. O professor abriu o DevTools e não tinha nada no console. E no DELETE aparecia a caixa verde vazia, porque ele devolve 204 sem nada no corpo.
5. A descrição do material não vinha no GET, porque na API `Descricao()` é um método e não uma propriedade.

## Como as dificuldades foram resolvidas

1. Configuramos o CORS no `Program.cs` com `AddCors` e a política `PermitirFrontend`, e chamamos `app.UseCors("PermitirFrontend")`.
2. Quem não tinha o SDK 10 instalou ele.
3. Trocamos no `script.js` pra mandar `mesPublicacao`, igual ao nome da propriedade.
4. Fizemos a função `lerResposta`: se a resposta não for ok, lê com `resposta.text()` e joga o erro com a frase da API, que aparece no alert vermelho. Também colocamos `console.error` nos `.catch()`, então agora o erro aparece no DevTools. No DELETE a gente mesmo escreve "Material excluído com sucesso." em vez de mostrar o corpo da resposta.
5. Usamos o endpoint `/api/Materiais/{id}/descricao` no botão Descrição.

## O que cada integrante aprendeu

- **Guilherme:** entendi melhor como manipular o JS e a utilizar de forma mais rápida o Bootstrap.
- **Enzo:** entendi melhor como a estrutura do backend funciona.
- **Marcos:** consegui aprender a mexer no backend de forma mais clara.
- **Gabriel:** aprendi a mexer com o backend em C# de forma mais eficiente.
- **Kaemy:** aprendi a mexer melhor no HTML e no Bootstrap.

## Entrega

### Integrantes

1. Guilherme Graces
2. Enzo Musskopf
3. Marcos Portales
4. Gabriel Andrade
5. Kaemy Reis

### Testes realizados

Testamos com a API rodando e a página aberta no navegador:

| Teste | O que aconteceu |
|---|---|
| Abrir a página | a tabela carregou o livro e a revista iniciais e os contadores mostraram 2, 1 e 1 |
| Cadastrar livro sem título | não enviou, o campo título ficou vermelho com a mensagem |
| Cadastrar revista com mês 13 | não enviou, apareceu "O mês deve estar entre 1 e 12." |
| Cadastrar um livro certo | apareceu o alert verde com o id gerado e ele entrou na tabela |
| Cadastrar uma revista certa | mesma coisa, e o mês ficou salvo certo |
| Editar uma revista | o formulário foi preenchido, salvamos e a tabela mudou |
| Cancelar edição | o formulário limpou e o botão voltou pra "Cadastrar" |
| Excluir | abriu o modal de confirmação e depois o material sumiu da tabela |
| Consultar ID 999 | apareceu "Material não encontrado." em vermelho |
| Descrição de uma revista | o modal mostrou a descrição e prazo de 7 dias |
| Emprestar o livro 1 | "O livro 'Clean Code' pode ser emprestado por 14 dias." |
| Emprestar a revista 2 | "Este material não pode ser emprestado." em vermelho |
