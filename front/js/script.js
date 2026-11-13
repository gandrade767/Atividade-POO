const URL_API = "http://localhost:5236/api/Materiais";

const formularioMaterial = document.querySelector("#form-material");
const campoTitulo = document.querySelector("#titulo");
const campoDescricao = document.querySelector("#descricao");
const campoAno = document.querySelector("#ano");
const campoAutor = document.querySelector("#autor");
const campoPaginas = document.querySelector("#paginas");
const campoEdicao = document.querySelector("#edicao");
const campoMes = document.querySelector("#mes");
const campoTipo = document.querySelector("#tipo");
const camposLivro = document.querySelector("#campos-livro");
const camposRevista = document.querySelector("#campos-revista");
const tabelaMateriais = document.querySelector("#tabela-materiais");
const mensagem = document.querySelector("#mensagem");
const modalExcluir = new bootstrap.Modal("#modal-excluir");
const textoModalExcluir = document.querySelector("#texto-modal-excluir");
const botaoConfirmarExclusao = document.querySelector("#btn-confirmar-exclusao");
const botaoSalvar = document.querySelector("#btn-salvar")
const tituloCadastro = document.querySelector("#titulo-cadastro")

let idParaExcluir = null;
let idEmEdicao = null





function mostrarMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.classList.remove("d-none", "alert-success", "alert-danger")
    mensagem.classList.add(`alert-${tipo}`)
}

function carregarMateriais() {
    fetch(URL_API)
        .then(function (resposta) {
            if (!resposta.ok) {
                throw new Error("Não foi possível consultar a API");

            }
            return resposta.json();
        })

        .then(function (materiais) {
            tabelaMateriais.innerHTML = "";

            materiais.forEach(function (material) {
                const linha = document.createElement("tr");

                linha.innerHTML = `
            <td>${material.id}</td>
            <td>${material.tipo}</td>
            <td>${material.titulo}</td>
            <td class="text-end">
            <button class="btn btn-danger btn-sm btn-excluir">Excluir</button>
            <button class="btn btn-primary btn-sm btn-editar">Editar</button>
            </td>
            `;
                linha.querySelector(".btn-excluir").addEventListener("click", function () {
                    abrirModalExcluir(material);
                })
                linha.querySelector(".btn-editar").addEventListener("click", function () {
                    preencherFormulario(material);
                    botaoSalvar.textContent = "Salvar alterações";
                    tituloCadastro.textContent= "Edição de Material"
                })
                tabelaMateriais.appendChild(linha);
            })
        })

        .catch(function (erro) {
            tabelaMateriais.innerHTML = `<tr><td colspan="4">Não foi possível carregar.</td></tr>`;
            console.error("Erro ao buscar materiais:", erro.message);
            mostrarMensagem("Erro ao buscar materiais: " + erro.message, "danger");
        })
}

carregarMateriais();


function atualizarCampos() {
    if (campoTipo.value === "livro") {
        camposLivro.classList.remove("d-none");
        camposRevista.classList.add("d-none");
    } else {
        camposLivro.classList.add("d-none");
        camposRevista.classList.remove("d-none");
    }
}


campoTipo.addEventListener("change", atualizarCampos)

function preencherFormulario(material) {
    idEmEdicao = material.id;

    campoTipo.value = material.tipo.toLowerCase();
    atualizarCampos()

    campoTitulo.value = material.titulo;
    campoAno.value = material.anoPublicacao;
    campoDescricao.value = material.resumo;

    if (campoTipo.value === "livro") {
        campoAutor.value = material.autor;
        campoPaginas.value = material.paginas;
    } else {
        campoEdicao.value = material.edicao;
        campoMes.value = material.mesPublicacao
    }
}

function abrirModalExcluir(material) {
    idParaExcluir = material.id;
    textoModalExcluir.textContent = `Tem certeza que deseja excluir "${material.titulo}"?`
    modalExcluir.show();
}

botaoConfirmarExclusao.addEventListener("click", function () {
    excluirMaterial(idParaExcluir)
})


function excluirMaterial(id) {
    fetch(`${URL_API}/${id}`, { method: "DELETE" })
        .then(function (resposta) {
            if (!resposta.ok) {
                return resposta.text().then(function (textoErro) {
                    throw new Error(textoErro);
                });
            }
            return resposta.text();
        })
        .then(function (texto) {
            mostrarMensagem("Material excluído com sucesso.", "success");
            carregarMateriais();
            modalExcluir.hide();
        })
        .catch(function (erro) {
            console.error("Erro ao excluir:", erro.message);
            mostrarMensagem("Erro ao excluir: " + erro.message, "danger");
            modalExcluir.hide();
        })
}



formularioMaterial.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const tipo = campoTipo.value;
    const titulo = campoTitulo.value.trim();

    let novoMaterial;


    if (tipo === "livro") {
        novoMaterial = {
            titulo: titulo,
            anoPublicacao: Number(campoAno.value),
            autor: campoAutor.value.trim(),
            paginas: Number(campoPaginas.value),
            resumo: campoDescricao.value.trim(),

        };
    } else {
        novoMaterial = {
            titulo: titulo,
            anoPublicacao: Number(campoAno.value),
            edicao: Number(campoEdicao.value),
            mesPublicacao: Number(campoMes.value),
            resumo: campoDescricao.value.trim(),
        };
    }

    let metodo = "POST";
    let endereco = `${URL_API}/${tipo}`;

    if (idEmEdicao !== null) {
        metodo = "PUT";
        endereco = `${URL_API}/${tipo}/${idEmEdicao}`;
    }

    fetch(endereco, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoMaterial)
    })
        .then(function (resposta) {
            if (!resposta.ok) {
                return resposta.text().then(function (textoErro) {
                    throw new Error(textoErro);
                });
            }
            return resposta.json();
        })
        .then(function (criado) {
            if (idEmEdicao !== null) {
                mostrarMensagem(`"${criado.titulo}" atualizado com sucesso.`, "success");
            } else {
                mostrarMensagem(`"${criado.titulo}" cadastrado com o id ${criado.id}.`, "success");
            }

            formularioMaterial.reset();
            idEmEdicao = null;
            botaoSalvar.textContent = "Cadastrar";
            carregarMateriais();
            atualizarCampos();
        })
        .catch(function (erro) {
            console.error("Erro ao cadastrar:", erro.message);
            mostrarMensagem("Erro ao cadastrar: " + erro.message, "danger");
        })
})

