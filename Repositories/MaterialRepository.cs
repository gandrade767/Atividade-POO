
using BibliotecaApi.Models;

namespace BibliotecaApi.Repositories
{
    public class MaterialRepository : IMaterialRepository
    {
        private readonly Dictionary<int, MaterialBiblioteca> _materiais = new();

        public MaterialRepository()
        {
            Adicionar(new Livro
            {
                Titulo = "Clean Code",
                AnoPublicacao = 2008,
                Autor = "Robert C. Martin",
                Paginas = 464
            });

            Adicionar(new Revista
            {
                Titulo = "Tecnologia e Inovação",
                AnoPublicacao = 2026,
                Edicao = 15,
                MesPublicacao = 10
            });
        }

        private int GerarNovoId()
        {
            var id = 1;

            while (_materiais.ContainsKey(id))
                id++;

            return id;
        }

        public IEnumerable<MaterialBiblioteca> ObterTodos()
        {
            return _materiais.Values;
        }

        public MaterialBiblioteca? ObterPorId(int id)
        {
            if (_materiais.TryGetValue(id, out var material))
                return material;

            return null;
        }

        public MaterialBiblioteca Adicionar(MaterialBiblioteca material)
        {
            material.Id = GerarNovoId();

            _materiais.Add(material.Id, material);

            return material;
        }

        public bool Atualizar(int id, MaterialBiblioteca material)
        {
            if (!_materiais.ContainsKey(id))
                return false;

            material.Id = id;

            _materiais[id] = material;

            return true;
        }

        public bool Remover(int id)
        {
            return _materiais.Remove(id);
        }
    }
}
