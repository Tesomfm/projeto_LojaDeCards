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
                    <td>${carta.Def}</td>
                    <td>R$ ${parseFloat(carta.preco).toFixed(2)}</td> <td>${carta.quantidade}</td> <td>
                        <a href="editar.html?id=${carta.id}" class="btn btn-warning btn-sm">Editar</a>
                        <button onclick="deletarCarta(${carta.id})" class="btn btn-danger btn-sm">Excluir</button
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
    const Def = parseInt(document.getElementById("Def").value);
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
                Def: Def,
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
            document.getElementById("Def").value = carta.Def;
            document.getElementById("preco").value = carta.preco;
            document.getElementById("quantidade").value = carta.quantidade;
        } catch (erro) {
            alert(erro.message);
        }
    }
async function editarCarta(id) {
    const nome = document.getElementById("nome").value;
    const atk = parseInt(document.getElementById("atk").value);
    const Def = parseInt(document.getElementById("Def").value);
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
                Def: Def,
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
            throw new Error("Erro ao carregar clientes");
        }

        const clientes = await resposta.json();
        tabela.innerHTML = "";

        clientes.forEach(cliente => {
            tabela.innerHTML += `
                <tr>
                    <td>${cliente.id}</td>
                    <td>${cliente.nome}</td>
                    <td>R$ ${parseFloat(cliente.preco).toFixed(2)}</td> <td>${cliente.quantidade}</td> <td>
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