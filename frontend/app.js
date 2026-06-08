const API_CARTAS = "http://localhost:8000/carta";
const API_CLIENTES = "http://localhost:8000/cliente";
const API_COMPRAS = "http://localhost:8000/compra";

// ================= AUTH CLIENTE =================
function atualizarInterfaceAutenticacao() {
    const authArea = document.getElementById("authArea");
    if (!authArea) return;

    const clienteLogado = JSON.parse(localStorage.getItem("clienteLogado"));

    if (clienteLogado) {
        authArea.innerHTML = `
            <div class="bg-dark border border-secondary p-2 rounded d-flex align-items-center gap-3">
                <span class="text-light">Logado como: <strong style="color: gold;">${clienteLogado.nome}</strong></span>
                <button onclick=\"logoutCliente()\" class=\"btn btn-outline-danger btn-sm\">Sair</button>
            </div>
        `;
    } else {
        authArea.innerHTML = `
            <a href=\"login.html\" class=\"btn btn-warning btn-sm fw-bold\">Fazer Login / Entrar</a>
        `;
    }
}

function logoutCliente() {
    localStorage.removeItem("clienteLogado");
    window.location.reload();
}

// ================= AUTH FUNCIONÁRIO (SENHA: kaibamen) =================
function loginFuncionario(event) {
    event.preventDefault();
    const usuario = document.getElementById("funcUsuario").value;
    const senha = document.getElementById("funcSenha").value;
    const campoErro = document.getElementById("erroFuncionario");

    campoErro.classList.add("d-none");

    if (senha === "kaibamen") {
        localStorage.setItem("funcionarioAutenticado", JSON.stringify({ user: usuario, loginAt: new Date() }));
        window.location.href = "dashboard-funcionario.html";
    } else {
        campoErro.innerText = "Chave de Acesso Inválida para Funcionários!";
        campoErro.classList.remove("d-none");
    }
}

function logoutFuncionario() {
    localStorage.removeItem("funcionarioAutenticado");
    window.location.href = "login-funcionario.html";
}

// Alternar Abas no Dashboard
function mudarPainelAdmin(painel) {
    if (painel === 'cartas') {
        document.getElementById('panel-cartas').classList.remove('d-none');
        document.getElementById('panel-clientes').classList.add('d-none');
        document.getElementById('cartas-tab').classList.add('active');
        document.getElementById('clientes-tab').classList.remove('active');
    } else {
        document.getElementById('panel-cartas').classList.add('d-none');
        document.getElementById('panel-clientes').classList.remove('d-none');
        document.getElementById('cartas-tab').classList.remove('active');
        document.getElementById('clientes-tab').classList.add('active');
    }
}

// ================= RENDERIZADORES DE PAGINAÇÃO =================
function construirLinksPaginas(containerId, totalPages, currentPage, callbackNome) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement("li");
        li.className = `page-item ${i === currentPage ? "active" : ""}`;
        li.innerHTML = `<button class="page-link" onclick="${callbackNome}(${i})">${i}</button>`;
        container.appendChild(li);
    }
}

// ================= FLUXOS PÚBLICOS (CLIENTE) =================
async function pesquisarCartas(page = 1) {
    const nomeBusca = document.getElementById("buscaNome")?.value || "";
    try {
        const resposta = await fetch(`${API_CARTAS}/pesquisar?page=${page}&limit=10&nome=${nomeBusca}`);
        if (!resposta.ok) throw new Error("Erro ao coletar dados das cartas.");
        const dados = await resposta.json();

        const tbody = document.getElementById("tabelaCartas");
        if (!tbody) return;
        tbody.innerHTML = "";

        dados.data.forEach(carta => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${carta.nome}</strong></td>
                <td><span class="text-warning">${carta.atk}</span></td>
                <td><span class="text-info">${carta.defesa}</span></td>
                <td>R$ ${carta.preco.toFixed(2)}</td>
                <td>${carta.quantidade > 0 ? `${carta.quantidade} un` : '<span class="text-danger">Esgotado</span>'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-warning" onclick="comprarCarta(${carta.id})" ${carta.quantidade <= 0 ? 'disabled' : ''}>
                        🛒 Comprar
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        construirLinksPaginas("paginacaoCartas", dados.total_pages, page, "pesquisarCartas");
    } catch (erro) {
        console.error(erro);
    }
}

async function pesquisarClientes(page = 1) {
    const nomeBusca = document.getElementById("buscaNome")?.value || "";
    try {
        const resposta = await fetch(`${API_CLIENTES}/pesquisar?page=${page}&limit=10&nome=${nomeBusca}`);
        if (!resposta.ok) throw new Error("Erro ao coletar dados dos clientes.");
        const dados = await resposta.json();

        const tbody = document.getElementById("tabelaClientes");
        if (!tbody) return;
        tbody.innerHTML = "";

        dados.data.forEach(cliente => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${cliente.id}</td>
                <td>${cliente.nome}</td>
                <td>${new Date(cliente.dataDeNascimento).toLocaleDateString('pt-BR')}</td>
                <td>${cliente.genero}</td>
            `;
            tbody.appendChild(tr);
        });

        construirLinksPaginas("paginacaoClientes", dados.total_pages, page, "pesquisarClientes");
    } catch (erro) {
        console.error(erro);
    }
}

// ================= FLUXOS DE OPERAÇÕES DO FUNCIONÁRIO =================
async function pesquisarCartasAdmin(page = 1) {
    const nomeBusca = document.getElementById("buscaNomeCartaAdmin")?.value || "";
    try {
        const resposta = await fetch(`${API_CARTAS}/pesquisar?page=${page}&limit=10&nome=${nomeBusca}`);
        const dados = await resposta.json();

        const tbody = document.getElementById("tabelaCartasAdmin");
        if (!tbody) return;
        tbody.innerHTML = "";

        dados.data.forEach(carta => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${carta.nome}</td>
                <td>${carta.atk}</td>
                <td>${carta.defesa}</td>
                <td>R$ ${carta.preco.toFixed(2)}</td>
                <td>${carta.quantidade} un</td>
                <td>
                    <a href="editar.html?id=${carta.id}" class="btn btn-warning btn-sm me-1">✏️ Editar</a>
                    <button onclick="deletarCartaAdmin(${carta.id})" class="btn btn-danger btn-sm">🗑️ Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        construirLinksPaginas("paginacaoCartasAdmin", dados.total_pages, page, "pesquisarCartasAdmin");
    } catch (erro) {
        console.error("Falha ao listar cartas no painel admin", erro);
    }
}

async function pesquisarClientesAdmin(page = 1) {
    const nomeBusca = document.getElementById("buscaNomeClienteAdmin")?.value || "";
    try {
        const resposta = await fetch(`${API_CLIENTES}/pesquisar?page=${page}&limit=10&nome=${nomeBusca}`);
        const dados = await resposta.json();

        const tbody = document.getElementById("tabelaClientesAdmin");
        if (!tbody) return;
        tbody.innerHTML = "";

        dados.data.forEach(cliente => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${cliente.id}</td>
                <td><strong>${cliente.nome}</strong></td>
                <td>${cliente.dataDeNascimento}</td>
                <td>${cliente.genero}</td>
                <td>
                    <a href="editarCliente.html?id=${cliente.id}" class="btn btn-warning btn-sm me-1">✏️ Alterar</a>
                    <button onclick="deletarClienteAdmin(${cliente.id})" class="btn btn-danger btn-sm">🗑️ Remover</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        construirLinksPaginas("paginacaoClientesAdmin", dados.total_pages, page, "pesquisarClientesAdmin");
    } catch (erro) {
        console.error("Falha ao listar clientes no painel admin", erro);
    }
}

// Ações exclusivas de exclusão disparadas pelo funcionário
async function deletarCartaAdmin(id) {
    if (!confirm("Remover permanentemente esta carta do inventário?")) return;
    try {
        const res = await fetch(`${API_CARTAS}/${id}`, { method: "DELETE" });
        if (res.ok) {
            alert("Carta removida do acervo!");
            pesquisarCartasAdmin(1);
        }
    } catch (e) { alert("Erro ao deletar carta"); }
}

async function deletarClienteAdmin(id) {
    if (!confirm("Excluir o registro completo deste cliente?")) return;
    try {
        const res = await fetch(`${API_CLIENTES}/${id}`, { method: "DELETE" });
        if (res.ok) {
            alert("Cliente removido do sistema!");
            pesquisarClientesAdmin(1);
        }
    } catch (e) { alert("Erro ao deletar cliente"); }
}

// Mantido fluxo simulado ou real de compra do cliente
async function comprarCarta(cartaId) {
    const clienteLogado = JSON.parse(localStorage.getItem("clienteLogado"));
    if (!clienteLogado) {
        alert("Você precisa estar logado para realizar compras.");
        window.location.href = "login.html";
        return;
    }
    try {
        const resposta = await fetch(API_COMPRAS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cliente_id: clienteLogado.id, carta_id: cartaId, quantidade: 1 })
        });
        if (resposta.ok) {
            alert("Compra processada com sucesso!");
            window.location.reload();
        } else {
            const erro = await resposta.json();
            alert(`Erro na transação: ${erro.detail}`);
        }
    } catch (erro) {
        alert("Não foi possível processar a compra.");
    }
}