const API_CARTAS = "http://localhost:8000/carta";

const API_CLIENTES = "http://localhost:8000/cliente";

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
                    <td>${carta.defesa}</td>
                    <td>R$ ${parseFloat(carta.preco).toFixed(2)}</td> <td>${carta.quantidade}</td> <td>
                        <a href="editar.html?id=${carta.id}" class="btn btn-warning btn-sm">Editar</a>
                        <button onclick="deletarCarta(${carta.id})" class="btn btn-danger btn-sm">Excluir</button>
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

    const nome = document.getElementById("nome").value;
    const atk = parseInt(document.getElementById("atk").value);
    const defesa = parseInt(document.getElementById("defesa").value);
    const preco = parseFloat(document.getElementById("preco").value);
    const quantidade = parseInt(document.getElementById("quantidade").value);

    try {
        const resposta = await fetch(API_CARTAS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nome,
                atk: atk,
                defesa: defesa,
                preco: preco,
                quantidade: quantidade
            })
        });

        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.detail || "Erro ao salvar carta");
        }

        const carta = await resposta.json();
        alert(`Carta criada com sucesso! ID: ${carta.id}`);
        window.location.href = "index.html";
    } catch (erro) {
        alert(erro.message);
    }
}
async function carregarCarta() {//para  carregar a carta na pagina
        try {
            const resposta = await fetch(`${API_CARTAS}/${id}`);
            if (!resposta.ok) throw new Error("Erro ao carregar carta");

            const carta = await resposta.json();
            document.getElementById("nome").value = carta.nome;
            document.getElementById("atk").value = carta.atk;
            document.getElementById("defesa").value = carta.defesa;
            document.getElementById("preco").value = carta.preco;
            document.getElementById("quantidade").value = carta.quantidade;
        } catch (erro) {
            alert(erro.message);
        }
    }
async function editarCarta(id) {
    const nome = document.getElementById("nome").value;
    const atk = parseInt(document.getElementById("atk").value);
    const defesa = parseInt(document.getElementById("defesa").value);
    const preco = parseFloat(document.getElementById("preco").value);
    const quantidade = parseInt(document.getElementById("quantidade").value);

    try {
        const resposta = await fetch(`${API_CARTAS}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nome,
                atk: atk,
                defesa: defesa,
                preco: preco,
                quantidade: quantidade
            })
        });

        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.detail || "Erro ao atualizar carta");
        }

        alert("Carta atualizada com sucesso!");
        window.location.href = "index.html";
    } catch (erro) {
        alert(erro.message);
    }
}
async function deletarCarta(id) {
    if (!confirm("Tem certeza que deseja excluir esta carta?")) {
        return;
    }

    try {
        const resposta = await fetch(`${API_CARTAS}/${id}`, {
            method: "DELETE"
        });

        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.detail || "Erro ao excluir carta");
        }

        alert("Carta excluída com sucesso!");
        listarCartas();
    } catch (erro) {
        alert(erro.message);
    }
}
async function listarClientes() {
    const tabela = document.getElementById("tabelaClientes");

    try {
        const resposta = await fetch(API_CLIENTES);

        if (!resposta.ok) {
            throw new Error("Servidor não respondeu");
        }

        const clientes = await resposta.json();
        tabela.innerHTML = "";

        clientes.forEach(cliente => {
            tabela.innerHTML += `
                <tr>
                    <td>${cliente.id}</td>
                    <td>${cliente.nome}</td>
                    <td>${new Date(cliente.dataDeNascimento).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</td>
                    <td>${cliente.genero}</td>
                    <td>
                        <a href="editarCliente.html?id=${cliente.id}" class="btn btn-warning btn-sm">Editar</a>
                        <button onclick="deletarCliente(${cliente.id})" class="btn btn-danger btn-sm">Excluir</button>
                    </td>
                </tr>
            `;
        });

    } catch (erro) {
        document.getElementById("erro").classList.remove("d-none");
        document.getElementById("erro").innerText = erro.message;
    }
}
async function criarCliente(event){
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const dataDeNascimento = document.getElementById("dataDeNascimento").value;
    const genero = document.getElementById("genero").value;

    try {
        const resposta = await fetch(API_CLIENTES, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nome,
                email: email,
                senha: senha,
                dataDeNascimento: dataDeNascimento,
                genero: genero
            })
        });
        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.detail || "Erro ao salvar cliente");
        }
        const cliente = await resposta.json();
        alert("Cliente criado com sucesso! ID: " + cliente.id);
        window.location.href = "clientes.html";
    } catch (erro) {
        alert(erro.message);
    }
}

async function carregarCliente(id) {
    try {
        const resposta = await fetch(`${API_CLIENTES}/${id}`);
        if (!resposta.ok) throw new Error("Erro ao carregar cliente");

        const cliente = await resposta.json();
        document.getElementById("nome").value = cliente.nome;
        document.getElementById("dataDeNascimento").value = cliente.dataDeNascimento;
        document.getElementById("genero").value = cliente.genero;
    } catch (erro) {
        alert(erro.message);
    }
}

async function editarCliente(id) {
    const nome = document.getElementById("nome").value;
    const dataDeNascimento = document.getElementById("dataDeNascimento").value;
    const genero = document.getElementById("genero").value;

    try {
        const resposta = await fetch(`${API_CLIENTES}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nome,
                dataDeNascimento: dataDeNascimento,
                genero: genero
            })
        });

        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.detail || "Erro ao atualizar cliente");
        }

        alert("Cliente atualizado com sucesso!");
        window.location.href = "clientes.html";
    } catch (erro) {
        alert(erro.message);
    }
}

async function deletarCliente(id) {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) {
        return;
    }

    try {
        const resposta = await fetch(`${API_CLIENTES}/${id}`, {
            method: "DELETE"
        });

        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.detail || "Erro ao excluir cliente");
        }

        alert("Cliente excluído com sucesso!");
        listarClientes();
    } catch (erro) {
        alert(erro.message);
    }
}