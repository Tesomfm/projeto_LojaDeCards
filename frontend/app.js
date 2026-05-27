const API_CARTAS = "http://localhost:8000/cartas";
const API_CLIENTES = "http://localhost:8000/clientes"; // Alterado para clientes

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
                    <td>${carta.def}</td> <!-- Adicionado DEF na listagem -->
                    <td>
                        <a href="editar.html?id=${carta.id}" class="btn btn-warning btn-sm">Editar</a>
                        <button class="btn btn-danger btn-sm">Excluir</button>
                    </td>
                </tr>
            `;
        });

    } catch (erro) {
        document.getElementById("erro").classList.remove("d-none");
        document.getElementById("erro").innerText = erro.message;
    }
}

async function criarCarta(event){
    event.preventDefault();
    alert("Carta enviada para backend");
}

// Substituído listarCategorias por listarClientes
async function listarClientes() {
    const tabela = document.getElementById("tabelaClientes");

    try {
        const resposta = await fetch(API_CLIENTES);

        if (!resposta.ok) {
            throw new Error("Erro ao carregar clientes");
        }

        const clientes = await resposta.json();
        tabela.innerHTML = "";

        clientes.forEach(cliente => {
            tabela.innerHTML += `
                <tr>
                    <td>${cliente.id}</td>
                    <td>${cliente.nome}</td>
                    <td>
                        <a href="editar-cliente.html" class="btn btn-warning btn-sm">Editar</a>
                        <button class="btn btn-danger btn-sm">Excluir</button>
                    </td>
                </tr>
            `;
        });

    } catch (erro) {
        alert(erro.message);
    }
}