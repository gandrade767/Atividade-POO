# BibliotecaApi — Sistema de Gerenciamento de Biblioteca Universitária

Web API para cadastrar, consultar, atualizar e excluir os materiais do acervo de uma biblioteca universitária (livros e revistas), desenvolvida na disciplina de **Programação Orientada a Objetos**.

> Este README documenta o backend (Web API) e registra a validação responsiva da interface web em `front/`.

## Integrantes

1. Marcos Portales Cruz RGM: 114.017
2. Gabriel Andrade RGM: 114.073
3. Guilherme Graces RGM: 114.072
4. Enzo Musskopf Lupinetti RGM: 114.019
5. Kaemy dos Reis Moreira RGM: 114.032

## Repositório no GitHub

**Repositório público:** [github.com/gandrade767/Atividade-POO](https://github.com/gandrade767/Atividade-POO).

## Descrição do sistema

A biblioteca possui dois tipos de material:

| Tipo | Dados próprios | Prazo de empréstimo | Pode ser emprestado? |
|---|---|---|---|
| **Livro** | Autor, Páginas | 14 dias | Sim (implementa `IEmprestimo`) |
| **Revista** | Edição, Mês de publicação | 7 dias | Não |

Conceitos de Orientação a Objetos aplicados:

- **Classe abstrata:** `MaterialBiblioteca` reúne o que é comum (`Id`, `Titulo`, `AnoPublicacao`) e não pode ser criada com `new`.
- **Herança:** `Livro` e `Revista` herdam de `MaterialBiblioteca`.
- **`abstract`, `virtual` e `override`:** `CalcularPrazo()` é abstrato e `Descricao()` é virtual. As duas classes filhas sobrescrevem os dois métodos.
- **Polimorfismo:** a Controller chama `material.CalcularPrazo()` e `material.Descricao()` sem saber se o objeto é Livro ou Revista. Cada classe responde do seu jeito.
- **Interface:** `IEmprestimo` representa a capacidade de ser emprestado. Só o `Livro` a implementa, e a Controller verifica isso com `is not IEmprestimo`.
- **Repository Pattern:** `IMaterialRepository` / `MaterialRepository` separam o acesso aos dados da Controller.
- **Dictionary:** os materiais ficam em memória num `Dictionary<int, MaterialBiblioteca>` privado do Repository.
- **Injeção de dependência e Singleton:** a Controller recebe `IMaterialRepository` pelo construtor, e o Repository é registrado com `AddSingleton`.
- **CORS:** política `PermitirFrontend` configurada para que a API possa ser consumida por uma página web.

Os dados ficam **apenas em memória**. Ao reiniciar a aplicação, voltam a existir só os materiais iniciais (1 livro e 1 revista).

## Tecnologias utilizadas

- C#
- ASP.NET Core Web API (.NET 10)
- Swagger (Swashbuckle.AspNetCore)

## Interface web e responsividade

A interface está na pasta `front/`. A responsividade foi verificada visualmente no Microsoft Edge (Chromium), com a API em execução, nestas larguras de viewport:

| Tamanho | Viewport | Resultado |
|---|---:|---|
| Pequeno | 390 × 2400 | Formulário e lista empilhados; tabela rola horizontalmente dentro do próprio contêiner. |
| Médio | 768 × 1600 | Formulário e lista empilhados para evitar colunas apertadas; tabela mantém rolagem horizontal contida. |
| Grande | 1440 × 1000 | Formulário e lista lado a lado; colunas e ações da tabela visíveis. |

### Como executar o frontend

1. Inicie a API na raiz do projeto:

   ```bash
   dotnet run
   ```

2. Em outro terminal, sirva os arquivos estáticos do frontend:

   ```bash
   python -m http.server 5500 --directory front
   ```

   Também é possível abrir `front/index.html` com a extensão Live Server do VS Code.

3. Acesse `http://localhost:5500`.

O frontend usa Bootstrap **5.3.3** pelo CDN e o tema próprio de `front/styles.css`; por isso, é necessária conexão à internet para carregar o Bootstrap. A API fica configurada em `http://localhost:5236/api/Materiais`, e o endpoint da documentação é `http://localhost:5236/swagger`.

### Validação e testes do frontend

O formulário impede o envio quando o título está vazio, o ano é negativo, páginas ou edição não são maiores que zero, ou o mês está fora do intervalo de 1 a 12. Os campos inválidos recebem `is-invalid` e uma mensagem. A API também valida os dados no servidor.

Roteiro para conferir as operações pela interface:

| Ação | Resultado esperado |
|---|---|
| Enviar livro sem título ou sem páginas válidas | O envio é bloqueado e o campo inválido é destacado. |
| Cadastrar livro ou revista válidos | A mensagem de sucesso aparece e a tabela e os contadores são atualizados. |
| Buscar um ID existente/inexistente | Os dados abrem no modal / a mensagem de erro da API aparece. |
| Editar e cancelar | Salvar envia `PUT`; cancelar limpa o estado de edição. |
| Emprestar livro/revista/ID inexistente | Sucesso para livro; mensagens de erro da API para revista ou ID inexistente. |

As verificações visuais responsivas estão registradas na tabela acima; `node --check front/script.js` também foi executado sem erros.

### Dificuldades e aprendizados

Na integração entre a página e a API, foi necessário tratar respostas JSON e respostas de texto, além de manter mensagens de erro visíveis sem perder o detalhe no console. A validação no navegador foi alinhada às regras do servidor, e a tabela usa criação de elementos e `textContent` para exibir valores recebidos da API. Os testes em diferentes larguras ajudaram a ajustar os pontos de quebra e a rolagem horizontal da tabela.

O projeto reúne prática de herança, classes abstratas, polimorfismo e interfaces no backend, além de consumo de API REST, manipulação do DOM, validação de formulário e layout responsivo no frontend.

## Estrutura do backend

```text
├── Controllers/
│   └── MateriaisController.cs
├── models/
│   ├── MaterialBiblioteca.cs
│   ├── Livro.cs
│   ├── Revista.cs
│   └── IEmprestimo.cs
├── Repositories/
│   ├── IMaterialRepositories.cs
│   └── MaterialRepository.cs
├── prints/              ← evidências dos testes no Swagger
└── Program.cs
```

## Como executar

Pré-requisito: **SDK do .NET 10** instalado.

1. Clone o repositório e entre na pasta do projeto:

   ```bash
   git clone https://github.com/gandrade767/Atividade-POO.git
   cd Atividade-POO
   ```

2. Execute a API:

   ```bash
   dotnet run
   ```

3. Abra o Swagger no navegador:

   ```text
   http://localhost:5236/swagger
   ```

## Principais endpoints

| Método | URL | Função | Respostas |
|---|---|---|---|
| GET | `/api/Materiais` | Lista todos os materiais | `200 OK` |
| GET | `/api/Materiais/{id}` | Busca um material pelo ID | `200 OK` ou `404` |
| POST | `/api/Materiais/livro` | Cadastra um livro | `201 Created` ou `400` |
| POST | `/api/Materiais/revista` | Cadastra uma revista | `201 Created` ou `400` |
| PUT | `/api/Materiais/livro/{id}` | Atualiza um livro | `200 OK`, `400` ou `404` |
| PUT | `/api/Materiais/revista/{id}` | Atualiza uma revista | `200 OK`, `400` ou `404` |
| DELETE | `/api/Materiais/{id}` | Exclui um material | `204 No Content` ou `404` |
| GET | `/api/Materiais/{id}/descricao` | Mostra tipo, descrição e prazo | `200 OK` ou `404` |
| POST | `/api/Materiais/{id}/emprestar` | Tenta realizar o empréstimo | `200 OK`, `400` ou `404` |

O `id` **não** deve ser enviado no cadastro, porque é gerado pelo sistema. Na atualização, vale o `id` da URL.

### Validações (retornam `400 Bad Request`)

- Título obrigatório (não pode ser vazio nem só espaços).
- Ano de publicação não pode ser menor que 0.
- Livro: autor obrigatório e páginas maior que 0.
- Revista: edição maior que 0 e mês de publicação entre 1 e 12.

## Exemplos de testes

**Cadastrar livro**: `POST /api/Materiais/livro`

```json
{
  "titulo": "O Programador Pragmático",
  "anoPublicacao": 1999,
  "autor": "Andrew Hunt",
  "paginas": 352
}
```

Resposta `201 Created`, com o `id` gerado pela API.

**Cadastrar revista**: `POST /api/Materiais/revista`

```json
{
  "titulo": "Revista de Tecnologia",
  "anoPublicacao": 2026,
  "edicao": 20,
  "mesPublicacao": 11
}
```

**Descrição (polimorfismo)**: `GET /api/Materiais/1/descricao`

```json
{
  "id": 1,
  "tipo": "Livro",
  "descricao": "Livro: Clean Code - Autor: Robert C. Martin",
  "prazoEmprestimo": 14
}
```

`GET /api/Materiais/2/descricao` devolve `"tipo": "Revista"` e `"prazoEmprestimo": 7`.

**Empréstimo (interface)**

- `POST /api/Materiais/1/emprestar` (livro) → `200 OK`: "O livro 'Clean Code' pode ser emprestado por 14 dias."
- `POST /api/Materiais/2/emprestar` (revista) → `400 Bad Request`: "Este material não pode ser emprestado."

## Evidências dos testes

> **A pasta [`prints/`](prints/) contém as evidências dos testes realizados no Swagger.**

Cada imagem mostra o endpoint testado, os dados enviados, o código HTTP retornado e o corpo da resposta. O nome de cada arquivo começa com o número do teste e termina com o código esperado (exemplo: `07-post-livro-paginas-0-400.png`).

Testes realizados:

| Nº | Teste | Resultado esperado |
|---|---|---|
| 1 | `GET /api/Materiais` | Lista os materiais |
| 2 | `GET /api/Materiais/1` | Retorna o material 1 |
| 3 | `GET /api/Materiais/999` | `404 Not Found` |
| 4 | POST livro válido | `201 Created` |
| 5 | POST revista válida | `201 Created` |
| 6 | POST livro sem título | `400 Bad Request` |
| 7 | POST livro com páginas 0 | `400 Bad Request` |
| 8 | POST revista com edição 0 | `400 Bad Request` |
| 9 | POST revista com mês 13 | `400 Bad Request` |
| 10 | PUT livro existente | `200 OK` |
| 11 | PUT revista existente | `200 OK` |
| 12 | PUT material inexistente | `404 Not Found` |
| 13 | DELETE material existente | `204 No Content` |
| 14 | DELETE material inexistente | `404 Not Found` |
| 15 | GET descrição de livro | Descrição e 14 dias |
| 16 | GET descrição de revista | Descrição e 7 dias |
| 17 | POST empréstimo de livro | `200 OK` |
| 18 | POST empréstimo de revista | `400 Bad Request` |
| 19 | Cadastrar vários materiais | IDs diferentes |
| 20 | Excluir e cadastrar outro material | O menor ID disponível é reutilizado |
