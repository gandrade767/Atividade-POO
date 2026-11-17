const URL_API = "http://localhost:5236/api/Materiais";

const formularioMaterial = document.querySelector("#form-material");
const formularioConsultaId = document.querySelector("#form-consultar-id");
const campoConsultaId = document.querySelector("#id-consulta");
const botaoEmprestarPorId = document.querySelector("#btn-emprestar-por-id");
const campoTitulo = document.querySelector("#titulo");
const campoAno = document.querySelector("#ano");
const campoAutor = document.querySelector("#autor");
const campoPaginas = document.querySelector("#paginas");
const campoEdicao = document.querySelector("#edicao");
const campoMes = document.querySelector("#mes");
const campoTipo = document.querySelector("#tipo");
const camposLivro = document.querySelector("#campos-livro");
const camposRevista = document.querySelector("#campos-revista");
const tabelaMateriais = document.querySelector("#tabela-materiais");
const totalMateriais = document.querySelector("#total-materiais");
const totalLivros = document.querySelector("#total-livros");
const totalRevistas = document.querySelector("#total-revistas");
const mensagem = document.querySelector("#mensagem");
const modalDetalhes = new bootstrap.Modal("#modal-detalhes");
const tituloModalDetalhes = document.querySelector("#titulo-modal-detalhes");
const conteudoModalDetalhes = document.querySelector("#conteudo-modal-detalhes");
const modalExcluir = new bootstrap.Modal("#modal-excluir");
const textoModalExcluir = document.querySelector("#texto-modal-excluir");
const botaoConfirmarExclusao = document.querySelector("#btn-confirmar-exclusao");
const botaoSalvar = document.querySelector("#btn-salvar");
const botaoCancelarEdicao = document.querySelector("#btn-cancelar-edicao");
const tituloCadastro = document.querySelector("#titulo-cadastro");

let idParaExcluir = null;
let idEmEdicao = null;

function mostrarMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.classList.remove("d-none", "alert-success", "alert-danger");
    mensagem.classList.add(`alert-${tipo}`);
}

function lerResposta(resposta) {
    if (!resposta.ok) {
        return resposta.text().then(function (textoErro) {
            throw new Error(textoErro || "Não foi possível concluir a operação.");
        });
    }

    const tipoConteudo = resposta.headers.get("content-type") || "";
    return tipoConteudo.includes("json") ? resposta.json() : resposta.text();
}

function mostrarDetalhes(titulo, dados) {
    const nomesCampos = {
        id: "Id",
        tipo: "Tipo",
        titulo: "Título",
        anoPublicacao: "Ano de publicação",
        autor: "Autor",
        paginas: "Páginas",
        edicao: "Edição",
        mesPublicacao: "Mês de publicação",
        descricao: "Descrição",
        prazoEmprestimo: "Prazo de empréstimo"
    };

    tituloModalDetalhes.textContent = titulo;
    conteudoModalDetalhes.replaceChildren();

    Object.entries(dados).forEach(function ([campo, valor]) {
        const linha = document.createElement("p");
        linha.className = "mb-2";

        const nome = document.createElement("strong");
        nome.textContent = `${nomesCampos[campo] || campo}: `;
        const valorExibido = campo === "prazoEmprestimo" ? `${valor} dias` : String(valor);
        linha.append(nome, document.createTextNode(valorExibido));
        conteudoModalDetalhes.appendChild(linha);
    });

    modalDetalhes.show();
}

function tratarErroAcao(operacao, erro) {
    console.error(`Erro ao ${operacao}:`, erro.message);
    mostrarMensagem(`Erro ao ${operacao}: ${erro.message}`, "danger");
}

function consultarMaterial(id) {
    fetch(`${URL_API}/${id}`)
        .then(lerResposta)
        .then(function (material) {
            mostrarDetalhes("Dados do material", material);
        })
        .catch(function (erro) {
            tratarErroAcao("consultar material", erro);
        });
}

formularioConsultaId.addEventListener("submit", function (evento) {
    evento.preventDefault();
    consultarMaterial(Number(campoConsultaId.value));
});

botaoEmprestarPorId.addEventListener("click", function () {
    if (formularioConsultaId.reportValidity()) {
        emprestarMaterial(Number(campoConsultaId.value));
    }
});

function consultarDescricao(id) {
    fetch(`${URL_API}/${id}/descricao`)
        .then(lerResposta)
        .then(function (descricao) {
            mostrarDetalhes("Descrição do material", descricao);
        })
        .catch(function (erro) {
            tratarErroAcao("consultar descrição", erro);
        });
}

function emprestarMaterial(id) {
    fetch(`${URL_API}/${id}/emprestar`, { method: "POST" })
        .then(lerResposta)
        .then(function (resultado) {
            mostrarMensagem(resultado, "success");
        })
        .catch(function (erro) {
            tratarErroAcao("emprestar material", erro);
        });
}

function criarCelula(valor, classe) {
    const celula = document.createElement("td");
    if (classe) {
        celula.className = classe;
    }
    celula.textContent = valor == null ? "" : String(valor);
    return celula;
}

function criarBotaoAcao(texto, classe, acao) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = `btn btn-sm ${classe}`;
    botao.textContent = texto;
    botao.addEventListener("click", acao);
    return botao;
}

function mostrarEstadoTabela(texto) {
    tabelaMateriais.replaceChildren();
    const linha = document.createElement("tr");
    const celula = criarCelula(texto, "empty-state");
    celula.colSpan = 6;
    linha.appendChild(celula);
    tabelaMateriais.appendChild(linha);
}

function iniciarEdicao(material) {
    preencherFormulario(material);
    botaoSalvar.textContent = "Salvar alterações";
    botaoCancelarEdicao.classList.remove("d-none");
    tituloCadastro.textContent = "Edição de Material";
}

function renderizarMaterial(material) {
    const linha = document.createElement("tr");
    const ehLivro = material.tipo.toLowerCase() === "livro";
    const detalhes = ehLivro
        ? `Autor: ${material.autor} | Páginas: ${material.paginas}`
        : `Edição: ${material.edicao} | Mês: ${material.mesPublicacao}`;
    const acoes = document.createElement("td");
    const grupoAcoes = document.createElement("div");
    grupoAcoes.className = "d-flex justify-content-end gap-1 flex-wrap action-buttons";

    linha.append(
        criarCelula(material.id),
        criarCelula(material.tipo),
        criarCelula(material.titulo),
        criarCelula(material.anoPublicacao),
        criarCelula(detalhes),
        acoes
    );

    grupoAcoes.append(
        criarBotaoAcao("Consultar", "btn-info", function () {
            consultarMaterial(material.id);
        }),
        criarBotaoAcao("Descrição", "btn-secondary", function () {
            consultarDescricao(material.id);
        }),
        criarBotaoAcao("Emprestar", "btn-success", function () {
            emprestarMaterial(material.id);
        }),
        criarBotaoAcao("Excluir", "btn-danger", function () {
            abrirModalExcluir(material);
        }),
        criarBotaoAcao("Editar", "btn-primary", function () {
            iniciarEdicao(material);
        })
    );

    acoes.appendChild(grupoAcoes);
    tabelaMateriais.appendChild(linha);
}

function renderizarMateriais(materiais) {
    tabelaMateriais.replaceChildren();
    totalMateriais.textContent = materiais.length;
    totalLivros.textContent = materiais.filter(function (material) {
        return material.tipo.toLowerCase() === "livro";
    }).length;
    totalRevistas.textContent = materiais.filter(function (material) {
        return material.tipo.toLowerCase() === "revista";
    }).length;

    if (materiais.length === 0) {
        mostrarEstadoTabela("Nenhum material cadastrado. Use o formulário para adicionar o primeiro.");
        return;
    }

    materiais.forEach(renderizarMaterial);
}

function carregarMateriais() {
    fetch(URL_API)
        .then(function (resposta) {
            if (!resposta.ok) {
                throw new Error("Não foi possível consultar a API");
            }
            return resposta.json();
        })
        .then(renderizarMateriais)
        .catch(function (erro) {
            mostrarEstadoTabela("Não foi possível carregar.");
            console.error("Erro ao buscar materiais:", erro.message);
            mostrarMensagem("Erro ao buscar materiais: " + erro.message, "danger");
        });
}

carregarMateriais();


function atualizarCampos() {
    if (campoTipo.value === "livro") {
        camposLivro.classList.remove("d-none");
        camposRevista.classList.add("d-none");
        limparErro(campoEdicao);
        limparErro(campoMes);
    } else {
        camposLivro.classList.add("d-none");
        camposRevista.classList.remove("d-none");
        limparErro(campoAutor);
        limparErro(campoPaginas);
    }
}

function definirErro(campo, texto) {
    const feedback = campo.parentElement.querySelector(".invalid-feedback");
    campo.classList.toggle("is-invalid", texto !== "");
    feedback.textContent = texto;
    return texto === "";
}

function limparErro(campo) {
    definirErro(campo, "");
}

function limparValidacao() {
    formularioMaterial.querySelectorAll(".is-invalid").forEach(function (campo) {
        campo.classList.remove("is-invalid");
        const feedback = campo.parentElement.querySelector(".invalid-feedback");
        if (feedback) {
            feedback.textContent = "";
        }
    });
}

function validarFormularioMaterial() {
    let valido = true;

    valido = definirErro(
        campoTitulo,
        campoTitulo.value.trim() ? "" : "O título é obrigatório."
    ) && valido;

    valido = definirErro(
        campoAno,
        campoAno.value !== "" && Number(campoAno.value) < 0
            ? "O ano de publicação não pode ser negativo."
            : ""
    ) && valido;

    if (campoTipo.value === "livro") {
        valido = definirErro(
            campoAutor,
            campoAutor.value.trim() ? "" : "O autor é obrigatório."
        ) && valido;

        const paginas = Number(campoPaginas.value);
        valido = definirErro(
            campoPaginas,
            Number.isFinite(paginas) && paginas > 0
                ? ""
                : "O número de páginas deve ser maior que zero."
        ) && valido;
    } else {
        const edicao = Number(campoEdicao.value);
        const mes = Number(campoMes.value);

        valido = definirErro(
            campoEdicao,
            Number.isFinite(edicao) && edicao > 0
                ? ""
                : "A edição deve ser maior que zero."
        ) && valido;
        valido = definirErro(
            campoMes,
            Number.isFinite(mes) && mes >= 1 && mes <= 12
                ? ""
                : "O mês deve estar entre 1 e 12."
        ) && valido;
    }

    return valido;
}

[campoTitulo, campoAno, campoAutor, campoPaginas, campoEdicao, campoMes].forEach(function (campo) {
    campo.addEventListener("input", function () {
        limparErro(campo);
    });
});


campoTipo.addEventListener("change", atualizarCampos);

function preencherFormulario(material) {
    idEmEdicao = material.id;

    campoTipo.value = material.tipo.toLowerCase();
    atualizarCampos();

    campoTitulo.value = material.titulo;
    campoAno.value = material.anoPublicacao;

    if (campoTipo.value === "livro") {
        campoAutor.value = material.autor;
        campoPaginas.value = material.paginas;
    } else {
        campoEdicao.value = material.edicao;
        campoMes.value = material.mesPublicacao;
    }
}

function sairDoModoEdicao() {
    formularioMaterial.reset();
    limparValidacao();
    idEmEdicao = null;
    botaoSalvar.textContent = "Cadastrar";
    botaoCancelarEdicao.classList.add("d-none");
    tituloCadastro.textContent = "Cadastrar material";
    atualizarCampos();
}

botaoCancelarEdicao.addEventListener("click", sairDoModoEdicao);

function abrirModalExcluir(material) {
    idParaExcluir = material.id;
    textoModalExcluir.textContent = `Tem certeza que deseja excluir "${material.titulo}"?`;
    modalExcluir.show();
}

botaoConfirmarExclusao.addEventListener("click", function () {
    excluirMaterial(idParaExcluir);
});

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
        .then(function () {
            mostrarMensagem("Material excluído com sucesso.", "success");
            carregarMateriais();
            modalExcluir.hide();
        })
        .catch(function (erro) {
            console.error("Erro ao excluir:", erro.message);
            mostrarMensagem("Erro ao excluir: " + erro.message, "danger");
        });
}

function concluirSalvamento(mensagemSucesso) {
    mostrarMensagem(mensagemSucesso, "success");
    sairDoModoEdicao();
    carregarMateriais();
}

function enviarMaterial(endereco, metodo, material, aoSalvar, operacao) {
    fetch(endereco, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(material)
    })
        .then(lerResposta)
        .then(aoSalvar)
        .catch(function (erro) {
            console.error(`Erro ao ${operacao} material:`, erro.message);
            mostrarMensagem(`Erro ao ${operacao} material: ${erro.message}`, "danger");
        });
}

function cadastrarLivro(livro) {
    enviarMaterial(`${URL_API}/livro`, "POST", livro, function (criado) {
        concluirSalvamento(`"${criado.titulo}" cadastrado com o id ${criado.id}.`);
    }, "cadastrar");
}

function cadastrarRevista(revista) {
    enviarMaterial(`${URL_API}/revista`, "POST", revista, function (criada) {
        concluirSalvamento(`"${criada.titulo}" cadastrada com o id ${criada.id}.`);
    }, "cadastrar");
}

function editarMaterial(tipo, material) {
    const id = idEmEdicao;
    enviarMaterial(`${URL_API}/${tipo}/${id}`, "PUT", material, function (atualizado) {
        concluirSalvamento(`"${atualizado.titulo}" atualizado com sucesso.`);
    }, "salvar");
}

formularioMaterial.addEventListener("submit", function (evento) {
    evento.preventDefault();

    if (!validarFormularioMaterial()) {
        formularioMaterial.querySelector(".is-invalid").focus();
        return;
    }

    const tipo = campoTipo.value;
    const material = {
        titulo: campoTitulo.value.trim(),
        anoPublicacao: Number(campoAno.value)
    };

    if (tipo === "livro") {
        material.autor = campoAutor.value.trim();
        material.paginas = Number(campoPaginas.value);
    } else {
        material.edicao = Number(campoEdicao.value);
        material.mesPublicacao = Number(campoMes.value);
    }

    if (idEmEdicao !== null) {
        editarMaterial(tipo, material);
    } else if (tipo === "livro") {
        cadastrarLivro(material);
    } else {
        cadastrarRevista(material);
    }
});
