const API_CARTAS = "http://localhost:8000/carta";
const API_CLIENTES = "http://localhost:8000/cliente";
const API_COMPRAS = "http://localhost:8000/compra";


function atualizarInterfaceAutenticacao() {
    const authArea = document.getElementById("authArea");
    if (!authArea) return;

    const clienteLogado = JSON.parse(localStorage.getItem("clienteLogado"));

    if (clienteLogado) {
        authArea.innerHTML = `
            <div class="bg-dark border border-secondary p-2 rounded d-flex align-items-center gap-3">
                <span class="text-light">Logado como: <strong style="color: gold;">${clienteLogado.nome}</strong></span>
                <button onclick="logoutCliente()" class="btn btn-outline-danger btn-sm">Sair</button>
            </div>
        `;
    } else {
        authArea.innerHTML = `
            <a href="login.html" class="btn btn-warning btn-sm fw-bold">Fazer Login / Entrar</a>
        `;
    }
}

async function loginCliente(event) {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const senha = document.getElementById("loginSenha").value;

    try {
        const resposta = await fetch(API_CLIENTES);
        if (!resposta.ok) throw new Error("Erro ao conectar com o banco de dados de clientes.");

        const clientes = await resposta.json();

        // Validação robusta cruzando e-mail e senha informados
        const clienteValido = clientes.find(c => c.email === email && c.senha === senha);

        if (!clienteValido) {
            throw new Error("E-mail ou senha incorretos! Tente novamente.");
        }

        // Salva os dados essenciais da sessão no navegador
        localStorage.setItem("clienteLogado", JSON.stringify({
            id: clienteValido.id,
            nome: clienteValido.nome
        }));

        alert(`Bem-vindo, ${clienteValido.nome}!`);
        window.location.href = "index.html";

    } catch (erro) {
        alert(erro.message);
    }
}

function logoutCliente() {
    localStorage.removeItem("clienteLogado");
    alert("Sessão encerrada.");
    window.location.reload();
}

async function comprarCarta(cartaId) {
    const clienteLogado = JSON.parse(localStorage.getItem("clienteLogado"));

    if (!clienteLogado) {
        alert("Ação negada! Você precisa estar logado no sistema para comprar cartas.");
        window.location.href = "login.html";
        return;
    }

    const qtdInformada = prompt("Quantas unidades desta carta deseja comprar?", "1");
    if (qtdInformada === null) return;
    const quantidade = parseInt(qtdInformada);
    if (isNaN(quantidade) || quantidade <= 0) {
        alert("Quantidade inválida informada.");
        return;
    }

    try {
        const resposta = await fetch(API_COMPRAS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cliente_id: clienteLogado.id,
                carta_id: cartaId,
                quantidade: quantidade
            })
        });

        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.detail || "Erro ao processar compra. Verifique o estoque da carta.");
        }

        alert("Compra efetuada com sucesso!");
        listarCartas();

    } catch (erro) {
        alert(erro.message);
    }
}

async function listarCartas(page = 1) {
    const limite = 10;
    const tabela = document.getElementById("tabelaCartas");
    const paginacaoDiv = document.getElementById("paginacao");
    if (!tabela) return;

    try {
        const resposta = await fetch(`${API_CARTAS}/pesquisar?page=${page}&limit=${limite}`);
        if (!resposta.ok) throw new Error("Servidor não respondeu");

        const resultado = await resposta.json();
        const cartas = resultado.data || [];

        tabela.innerHTML = "";
        cartas.forEach(carta => {
            tabela.innerHTML += `
                <tr>
                    <td>${carta.nome}</td>
                    <td>${carta.atk}</td>
                    <td>${carta.defesa}</td>
                    <td>R$ ${parseFloat(carta.preco).toFixed(2)}</td>
                    <td>${carta.quantidade}</td>
                    <td>
                        <button onclick="comprarCarta(${carta.id})" class="btn btn-success btn-sm me-1">Comprar</button>
                        <a href="editarCarta.html?id=${carta.id}" class="btn btn-warning btn-sm">Editar</a>
                        <button onclick="deletarCarta(${carta.id})" class="btn btn-danger btn-sm">Excluir</button>
                    </td>
                </tr>
            `;
        });

        if (resultado.pages) {
            paginacaoDiv.innerHTML = "";
            resultado.pages.forEach(p => {
                const btn = document.createElement("button");
                btn.className = "btn btn-outline-primary btn-sm me-1";
                btn.innerText = p;
                btn.disabled = (p === "..." || parseInt(p) === resultado.page);
                if (p !== "...") {
                    btn.onclick = () => pesquisarCartas(parseInt(p));
                }
                paginacaoDiv.appendChild(btn);
            });
        }

    } catch (erro) {
        const erroDiv = document.getElementById("erro");
        if (erroDiv) {
            erroDiv.classList.remove("d-none");
            erroDiv.innerText = erro.message;
        }
    }
}

async function pesquisarCartas(page = 1) {
    const limite = 10;
    const nome = document.getElementById("buscaNome").value.trim();
    const tabela = document.getElementById("tabelaCartas");
    const paginacaoDiv = document.getElementById("paginacao");
    if (!tabela) return;

    try {
        const resposta = await fetch(`${API_CARTAS}/pesquisar?page=${page}&limit=${limite}&nome=${encodeURIComponent(nome)}`);
        if (!resposta.ok) throw new Error("Servidor não respondeu");

        const resultado = await resposta.json();
        const cartas = resultado.data || [];

        tabela.innerHTML = "";
        cartas.forEach(carta => {
            tabela.innerHTML += `
                <tr>
                    <td>${carta.nome}</td>
                    <td>${carta.atk}</td>
                    <td>${carta.defesa}</td>
                    <td>R$ ${parseFloat(carta.preco).toFixed(2)}</td>
                    <td>${carta.quantidade}</td>
                    <td>
                        <button onclick="comprarCarta(${carta.id})" class="btn btn-success btn-sm me-1">Comprar</button>
                        <a href="editarCarta.html?id=${carta.id}" class="btn btn-warning btn-sm">Editar</a>
                        <button onclick="deletarCarta(${carta.id})" class="btn btn-danger btn-sm">Excluir</button>
                    </td>
                </tr>
            `;
        });

        if (resultado.pages) {
            paginacaoDiv.innerHTML = "";
            resultado.pages.forEach(p => {
                const btn = document.createElement("button");
                btn.className = "btn btn-outline-primary btn-sm me-1";
                btn.innerText = p;
                btn.disabled = (p === "..." || parseInt(p) === resultado.page);
                if (p !== "...") {
                    btn.onclick = () => pesquisarCartas(parseInt(p));
                }
                paginacaoDiv.appendChild(btn);
            });
        }

    } catch (erro) {
        const erroDiv = document.getElementById("erro");
        if (erroDiv) {
            erroDiv.classList.remove("d-none");
            erroDiv.innerText = erro.message;
        }
    }
}

async function criarCarta(event){
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const atk = parseInt(document.getElementById("atk").value);
    const defensa = parseInt(document.getElementById("defesa").value);
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
                defesa: defensa,
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

async function carregarCarta(id) { // CORRIGIDO: Adicionado parâmetro 'id' que faltava
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

async function listarClientes(page = 1) {
    const limite = 10;
    const tabela = document.getElementById("tabelaClientes");
    const paginacaoDiv = document.getElementById("paginacao");
    if (!tabela) return;

    try {
        const resposta = await fetch(`${API_CLIENTES}/pesquisar?page=${page}&limit=${limite}`);
        if (!resposta.ok) throw new Error("Servidor não respondeu");

        const resultado = await resposta.json();
        const clientes = resultado.data || [];

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

        if (resultado.pages) {
            paginacaoDiv.innerHTML = "";
            resultado.pages.forEach(p => {
                const btn = document.createElement("button");
                btn.className = "btn btn-outline-primary btn-sm me-1";
                btn.innerText = p;
                btn.disabled = (p === "..." || parseInt(p) === resultado.page);
                if (p !== "...") {
                    btn.onclick = () => listarClientes(parseInt(p));
                }
                paginacaoDiv.appendChild(btn);
            });
        }

    } catch (erro) {
        const erroDiv = document.getElementById("erro");
        if (erroDiv) {
            erroDiv.classList.remove("d-none");
            erroDiv.innerText = erro.message;
        }
    }
}

async function pesquisarClientes(page = 1) {
    const limite = 10;
    const nome = document.getElementById("buscaNome").value.trim();
    const tabela = document.getElementById("tabelaClientes");
    const paginacaoDiv = document.getElementById("paginacao");
    if (!tabela) return;

    try {
        const resposta = await fetch(`${API_CLIENTES}/pesquisar?page=${page}&limit=${limite}&nome=${encodeURIComponent(nome)}`);
        if (!resposta.ok) throw new Error("Servidor não respondeu");

        const resultado = await resposta.json();
        const clientes = resultado.data || [];

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

        if (resultado.pages) {
            paginacaoDiv.innerHTML = "";
            resultado.pages.forEach(p => {
                const btn = document.createElement("button");
                btn.className = "btn btn-outline-primary btn-sm me-1";
                btn.innerText = p;
                btn.disabled = (p === "..." || parseInt(p) === resultado.page);
                if (p !== "...") {
                    btn.onclick = () => pesquisarClientes(parseInt(p));
                }
                paginacaoDiv.appendChild(btn);
            });
        }

    } catch (erro) {
        const erroDiv = document.getElementById("erro");
        if (erroDiv) {
            erroDiv.classList.remove("d-none");
            erroDiv.innerText = erro.message;
        }
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
