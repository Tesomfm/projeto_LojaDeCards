const API_CARTAS = "http://localhost:8000/cartas";

const API_CATEGORIAS = "http://localhost:8000/categorias";

async function listarCartas() {

    const tabela = document.getElementById("tabelaCartas");

    try {

        const resposta = await fetch(API_CARTAS);

        if (!resposta.ok) {
            throw new Error("Servidor não respondeu");
        }

        const cartas = await resposta.json();

        tabela.innerHTML = "";

        cartas.forEach(carta => {

            tabela.innerHTML += `

                <tr>

                    <td>${carta.nome}</td>

                    <td>${carta.atk}</td>

                    <td>

                        <a href="editar.html?id=${carta.id}"
                           class="btn btn-warning btn-sm">
                           Editar
                        </a>

                        <button class="btn btn-danger btn-sm">
                            Excluir
                        </button>

                    </td>

                </tr>

            `;
        });

    } catch (erro) {

        document
        .getElementById("erro")
        .classList.remove("d-none");

        document
        .getElementById("erro")
        .innerText = erro.message;
    }
}

async function criarCarta(event){

    event.preventDefault();

    alert("Carta enviada para backend");
}

async function listarCategorias() {

    const tabela = document.getElementById("tabelaCategorias");

    try {

        const resposta = await fetch(API_CATEGORIAS);

        if (!resposta.ok) {
            throw new Error("Erro ao carregar categorias");
        }

        const categorias = await resposta.json();

        tabela.innerHTML = "";

        categorias.forEach(categoria => {

            tabela.innerHTML += `

                <tr>

                    <td>${categoria.id}</td>

                    <td>${categoria.nome}</td>

                    <td>

                        <a href="editar-categoria.html"
                           class="btn btn-warning btn-sm">
                           Editar
                        </a>

                        <button class="btn btn-danger btn-sm">
                            Excluir
                        </button>

                    </td>

                </tr>

            `;
        });

    } catch (erro) {

        alert(erro.message);
    }
}