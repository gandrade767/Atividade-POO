
using Microsoft.AspNetCore.Mvc;
using BibliotecaApi.Models;
using BibliotecaApi.Repositories;

namespace BibliotecaApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MateriaisController(IMaterialRepository repository) : ControllerBase
    {
        [HttpGet]
        public IActionResult ObterTodos()
        {
            var materiais = repository.ObterTodos();

            return Ok(materiais.Select(FormatarMaterial));
        }

        [HttpGet("{id}")]
        public IActionResult ObterPorId(int id)
        {
            var material = repository.ObterPorId(id);

            if (material == null)
                return NotFound("Material não encontrado.");

            return Ok(FormatarMaterial(material));
        }

        [HttpPost("livro")]
        public IActionResult CadastrarLivro([FromBody] Livro livro)
        {
            var erro = ValidarLivro(livro);

            if (erro != null)
                return BadRequest(erro);

            var material = repository.Adicionar(livro);

            return StatusCode(201, material);
        }

        [HttpPost("revista")]
        public IActionResult CadastrarRevista([FromBody] Revista revista)
        {
            var erro = ValidarRevista(revista);

            if (erro != null)
                return BadRequest(erro);

            var material = repository.Adicionar(revista);

            return StatusCode(201, material);
        }

        [HttpPut("livro/{id}")]
        public IActionResult AtualizarLivro(int id, [FromBody] Livro livro)
        {
            var materialExistente = repository.ObterPorId(id);

            if (materialExistente == null)
                return NotFound("Material não encontrado.");

            if (materialExistente is not Livro)
                return BadRequest("O material informado não é um livro.");

            var erro = ValidarLivro(livro);

            if (erro != null)
                return BadRequest(erro);

            repository.Atualizar(id, livro);

            return Ok(FormatarMaterial(livro));
        }

        [HttpPut("revista/{id}")]
        public IActionResult AtualizarRevista(int id, [FromBody] Revista revista)
        {
            var materialExistente = repository.ObterPorId(id);

            if (materialExistente == null)
                return NotFound("Material não encontrado.");

            if (materialExistente is not Revista)
                return BadRequest("O material informado não é uma revista.");

            var erro = ValidarRevista(revista);

            if (erro != null)
                return BadRequest(erro);

            repository.Atualizar(id, revista);

            return Ok(FormatarMaterial(revista));
        }

        [HttpDelete("{id}")]
        public IActionResult ExcluirMaterial(int id)
        {
            var removido = repository.Remover(id);

            if (!removido)
                return NotFound("Material não encontrado.");

            return NoContent();
        }

        [HttpGet("{id}/descricao")]
        public IActionResult ObterDescricao(int id)
        {
            var material = repository.ObterPorId(id);

            if (material == null)
                return NotFound("Material não encontrado.");

            return Ok(new
            {
                material.Id,
                Tipo = material.GetType().Name,
                Descricao = material.Descricao(),
                PrazoEmprestimo = material.CalcularPrazo()
            });
        }

        [HttpPost("{id}/emprestar")]
        public IActionResult EmprestarMaterial(int id)
        {
            var material = repository.ObterPorId(id);

            if (material == null)
                return NotFound("Material não encontrado.");

            if (material is not IEmprestimo emprestavel)
                return BadRequest("Este material não pode ser emprestado.");

            return Ok(emprestavel.Emprestar());
        }

        private string? ValidarMaterial(MaterialBiblioteca material)
        {
            if (string.IsNullOrWhiteSpace(material.Titulo))
                return "O título é obrigatório.";

            if (material.AnoPublicacao < 0)
                return "O ano de publicação não pode ser negativo.";

            return null;
        }

        private string? ValidarLivro(Livro livro)
        {
            var erro = ValidarMaterial(livro);

            if (erro != null)
                return erro;

            if (string.IsNullOrWhiteSpace(livro.Autor))
                return "O autor é obrigatório.";

            if (livro.Paginas <= 0)
                return "O número de páginas deve ser maior que zero.";

            return null;
        }

        private string? ValidarRevista(Revista revista)
        {
            var erro = ValidarMaterial(revista);

            if (erro != null)
                return erro;

            if (revista.Edicao <= 0)
                return "A edição deve ser maior que zero.";

            if (revista.MesPublicacao < 1 || revista.MesPublicacao > 12)
                return "O mês de publicação deve estar entre 1 e 12.";

            return null;
        }

        private object FormatarMaterial(MaterialBiblioteca material)
        {
            if (material is Livro livro)
            {
                return new
                {
                    livro.Id,
                    Tipo = "Livro",
                    livro.Titulo,
                    livro.AnoPublicacao,
                    livro.Autor,
                    livro.Resumo,
                    livro.Paginas
                };
            }

            if (material is Revista revista)
            {
                return new
                {
                    revista.Id,
                    Tipo = "Revista",
                    revista.Titulo,
                    revista.AnoPublicacao,
                    revista.Edicao,
                    revista.Resumo,
                    revista.MesPublicacao
                };
            }

            return new
            {
                material.Id,
                material.Titulo,
                material.AnoPublicacao
            };
        }
    }
}
