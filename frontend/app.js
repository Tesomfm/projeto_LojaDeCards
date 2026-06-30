const API_CARTAS = "https://projeto-lojadecards.onrender.com/carta/";
const API_CLIENTES = "https://projeto-lojadecards.onrender.com/cliente/";
const API_COMPRAS = "https://projeto-lojadecards.onrender.com/compra/";

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    } catch (e) {
        return null;
    }
}

function atualizarInterfaceAutenticacao() {
    const authArea = document.getElementById("authArea");
    if (!authArea) return;

    const token = localStorage.getItem("clienteToken");
    if (token) {
        const payload = parseJwt(token);
        authArea.innerHTML = `
            <div class="bg-dark border border-secondary p-2 rounded d-flex align-items-center gap-3">
                <span class="text-light">Logado como: <strong style="color: gold;">${payload.nome}</strong></span>
                <button onclick="logoutCliente()" class="btn btn-outline-danger btn-sm">Sair</button>
            </div>
        `;
    } else {
        authArea.innerHTML = `
            <a href="login.html" class="btn btn-warning btn-sm fw-bold">Fazer Login / Entrar</a>
        `;
    }
}

function mostrarToast(message, variant = "info") {
    let container = document.getElementById("toast-container-global");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container-global";
        container.className = "toast-container position-fixed bottom-0 end-0 p-3";
        container.style.zIndex = "1055";
        document.body.appendChild(container);
    }

    const toastEl = document.createElement("div");
    toastEl.className = `toast align-items-center text-bg-${variant} border-0 mb-2`;
    toastEl.setAttribute("role", "alert");
    toastEl.setAttribute("aria-live", "assertive");
    toastEl.setAttribute("aria-atomic", "true");

    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    container.appendChild(toastEl);
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();

    toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
}

function mostrarConfirmModal(title, message, onConfirm) {
    let modalEl = document.getElementById("globalConfirmModal");
    if (!modalEl) {
        modalEl = document.createElement("div");
        modalEl.id = "globalConfirmModal";
        modalEl.className = "modal fade";
        modalEl.tabIndex = "-1";
        document.body.appendChild(modalEl);
    }

    modalEl.innerHTML = `
        <div class="modal-dialog text-light modal-dialog-centered">
            <div class="modal-content bg-dark border border-danger shadow-lg" style="border-radius: 12px;">
                <div class="modal-header border-secondary bg-black bg-gradient py-3" style="border-top-left-radius: 11px; border-top-right-radius: 11px;">
                    <h5 class="modal-title fw-bold text-danger d-flex align-items-center gap-2">
                        ⚠️ ${title}
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body fs-5 py-4 px-4 bg-dark bg-gradient">
                    <p class="mb-0 text-secondary-emphasis" style="line-height: 1.6;">${message}</p>
                </div>
                <div class="modal-footer border-secondary bg-black bg-gradient py-3">
                    <button type="button" class="btn btn-outline-secondary px-4 fw-semibold" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-danger px-4 fw-bold shadow-sm" id="btnConfirmarAcao">Confirmar</button>
                </div>
            </div>
        </div>
    `;

    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    document.getElementById("btnConfirmarAcao").onclick = () => {
        modal.hide();
        onConfirm();
    };
}

function mostrarPromptModal(title, message, onConfirm) {
    let modalEl = document.getElementById("globalPromptModal");
    if (!modalEl) {
        modalEl = document.createElement("div");
        modalEl.id = "globalPromptModal";
        modalEl.className = "modal fade";
        modalEl.tabIndex = "-1";
        document.body.appendChild(modalEl);
    }
    modalEl.innerHTML = `
        <div class="modal-dialog text-light modal-dialog-centered">
            <div class="modal-content bg-dark border border-warning shadow-lg" style="border-radius: 12px;">
                <div class="modal-header border-secondary bg-black bg-gradient py-3" style="border-top-left-radius: 11px; border-top-right-radius: 11px;">
                    <h5 class="modal-title fw-bold text-warning d-flex align-items-center gap-2">
                        🛒 ${title}
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body py-4 px-4 bg-dark bg-gradient">
                    <label class="form-label fw-semibold text-light mb-2 fs-5">${message}</label>
                    <input type="number" id="promptInput" class="form-control form-control-lg text-center fw-bold text-warning bg-black border-secondary" value="1" min="1" style="max-width: 150px; margin: 0 auto; font-size: 1.5rem;">
                </div>
                <div class="modal-footer border-secondary bg-black bg-gradient py-3">
                    <button type="button" class="btn btn-outline-secondary px-4 fw-semibold" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-warning px-4 fw-bold shadow-sm text-dark" id="btnPromptConfirmar">Confirmar</button>
                </div>
            </div>
        </div>
    `;

    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    document.getElementById("btnPromptConfirmar").onclick = () => {
        const val = document.getElementById("promptInput").value;
        modal.hide();
        onConfirm(val);
    };
}
async function loginCliente(event) {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const senha = document.getElementById("loginSenha").value;

    try {
        const resposta = await fetch("https://projeto-lojadecards.onrender.com/cliente/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });

        if (!resposta.ok) {
            throw new Error("E-mail ou senha incorretos! Tente novamente.");
        }

        const dados = await resposta.json();
        localStorage.setItem("clienteToken", dados.access_token);
        localStorage.setItem("clienteLogado", JSON.stringify({
            id: dados.id,
            nome: dados.nome
        }));
        mostrarToast("Login realizado com sucesso!", "success");
        setTimeout(() => window.location.href = "index.html", 1000);
    } catch (erro) {
        mostrarToast(erro.message, "danger");
    }
}

function logoutCliente() {
    localStorage.removeItem("clienteToken");
    mostrarToast("Sessão encerrada.", "info");
    setTimeout(() => window.location.reload(), 1000);
}

async function comprarCarta(cartaId) {
   const token = localStorage.getItem("clienteToken");
    if (!token) {
        mostrarToast("Ação negada! Você precisa estar logado no sistema para comprar cartas.", "warning");
        setTimeout(() => window.location.href = "login.html", 1500);
        return;
    }

    const payload = parseJwt(token);
    
    mostrarPromptModal("Comprar Carta", "Quantas unidades desta carta deseja comprar?", async (qtdInformada) => {
        const quantidade = parseInt(qtdInformada);
        
        if (isNaN(quantidade) || quantidade <= 0) {
            mostrarToast("Quantidade inválida informada.", "warning");
            return;
        }

        try {
            const resposta = await fetch(API_COMPRAS, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    cliente_id: payload.id,
                    carta_id: cartaId,
                    quantidade: quantidade
                })
            });

            if (!resposta.ok) {
                const erro = await resposta.json();
                throw new Error(erro.detail || "Erro ao processar compra. Verifique o estoque da carta.");
            }

            mostrarToast("Compra efetuada com sucesso!", "success");
            listarCartas();

        } catch (erro) {
            mostrarToast(erro.message, "danger");
        }
    });
}
//clientes ussa
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
        });

        if (resultado.pages) {
            paginacaoDiv.innerHTML = "";

            const btnVoltar = document.createElement("button");
            btnVoltar.className = "btn btn-outline-secondary btn-sm me-1";
            btnVoltar.innerHTML = "&laquo;";
            btnVoltar.disabled = resultado.page <= 1;
            btnVoltar.onclick = () => listarCartas(resultado.page - 1);
            paginacaoDiv.appendChild(btnVoltar);

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

            const btnAvancar = document.createElement("button");
            btnAvancar.className = "btn btn-outline-secondary btn-sm";
            btnAvancar.innerHTML = "&raquo;";
            btnAvancar.disabled = resultado.page >= resultado.total_pages;
            btnAvancar.onclick = () => listarCartas(resultado.page + 1);
            paginacaoDiv.appendChild(btnAvancar);
        }

    } catch (erro) {
        const erroDiv = document.getElementById("erro");
        if (erroDiv) {
            mostrarToast(erro.message, "danger");
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
        });

        if (resultado.pages) {
            paginacaoDiv.innerHTML = "";

            const btnVoltar = document.createElement("button");
            btnVoltar.className = "btn btn-outline-secondary btn-sm me-1";
            btnVoltar.innerHTML = "&laquo;";
            btnVoltar.disabled = resultado.page <= 1;
            btnVoltar.onclick = () => pesquisarCartas(resultado.page - 1);
            paginacaoDiv.appendChild(btnVoltar);

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

            const btnAvancar = document.createElement("button");
            btnAvancar.className = "btn btn-outline-secondary btn-sm";
            btnAvancar.innerHTML = "&raquo;";
            btnAvancar.disabled = resultado.page >= resultado.total_pages;
            btnAvancar.onclick = () => pesquisarCartas(resultado.page + 1);
            paginacaoDiv.appendChild(btnAvancar);
        }

    } catch (erro) {
        const erroDiv = document.getElementById("erro");
        if (erroDiv) {
            mostrarToast(erro.message, "danger");
        }
    }
}

async function criarCarta(event){
    event.preventDefault();
    const token = localStorage.getItem("funcionarioToken");

    const nome = document.getElementById("nome").value;
    const atk = parseInt(document.getElementById("atk").value);
    const defesa = parseInt(document.getElementById("defesa").value);
    const preco = parseFloat(document.getElementById("preco").value);
    const quantidade = parseInt(document.getElementById("quantidade").value);

    try {
        const resposta = await fetch(API_CARTAS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token 
            },
            body: JSON.stringify({ nome, atk, defesa, preco, quantidade })
        });

        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.detail || "Erro ao salvar carta");
        }

        const carta = await resposta.json();
        mostrarToast(`Carta criada com sucesso! ID: ${carta.id}`, "success");
        setTimeout(()=> window.location.href = "dashboard-funcionario.html", 1500);
    } catch (erro) {
        mostrarToast(erro.message, "danger");
    }
}

async function carregarCarta(id) {
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
        mostrarToast(erro.message, "danger");
    }
}

async function editarCarta(id) {
    const token = localStorage.getItem("funcionarioToken");
    const nome = document.getElementById("nome").value;
    const atk = parseInt(document.getElementById("atk").value);
    const defesa = parseInt(document.getElementById("defesa").value);
    const preco = parseFloat(document.getElementById("preco").value);
    const quantidade = parseInt(document.getElementById("quantidade").value);

    try {
        const resposta = await fetch(`${API_CARTAS}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ nome, atk, defesa, preco, quantidade })
        });

        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.detail || "Erro ao atualizar carta");
        }

        mostrarToast("Carta atualizada com sucesso!", "success");
        setTimeout(()=> window.location.href = "dashboard-funcionario.html", 1500);
    } catch (erro) {
        mostrarToast(erro.message, "danger");
    }
}

async function deletarCarta(id) {
    mostrarConfirmModal(
        "Excluir Carta", 
        "Tem certeza que deseja excluir esta carta? ESTA AÇÃO NÃO PODE SER DESFEITA.", 
        async () => {
            const token = localStorage.getItem("funcionarioToken");
            try {
                const resposta = await fetch(`${API_CARTAS}/${id}`, {
                    method: "DELETE",
                    headers: { "Authorization": "Bearer " + token }
                });

                if (!resposta.ok) {
                    const erro = await resposta.json();
                    throw new Error(erro.detail || "Erro ao excluir carta");
                }

                mostrarToast("Carta excluída com sucesso!", "success");
                listarCartasAdmin();
            } catch (erro) {
                mostrarToast(erro.message, "danger");
            }
        }
    );
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
        mostrarToast("Cliente criado com sucesso! ID: " + cliente.id, "success");
        setTimeout(()=> window.location.href = "login.html", 3000); 
    } catch (erro) {
        mostrarToast(erro.message, "danger");
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
        mostrarToast(erro.message, "danger");
    }
}

async function editarCliente(id) {
    const token = localStorage.getItem("funcionarioToken");
    const nome = document.getElementById("nome").value;
    const dataDeNascimento = document.getElementById("dataDeNascimento").value;
    const genero = document.getElementById("genero").value;

    try {
        const resposta = await fetch(`${API_CLIENTES}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ nome, dataDeNascimento, genero })
        });

        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.detail || "Erro ao atualizar cliente");
        }

        mostrarToast("Cliente atualizado com sucesso!", "success");
        setTimeout(() => window.location.href = "dashboard-funcionario.html", 1500);
    } catch (erro) {
        mostrarToast(erro.message, "danger");
    }
}

async function deletarCliente(id) {
    mostrarConfirmModal(
        "Remover Cliente", 
        "Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.", 
        async () => {
            const token = localStorage.getItem("funcionarioToken");
            try {
                const resposta = await fetch(`${API_CLIENTES}/${id}`, {
                    method: "DELETE",
                    headers: { "Authorization": "Bearer " + token }
                });

                if (!resposta.ok) {
                    const erro = await resposta.json();
                    throw new Error(erro.detail || "Erro ao excluir cliente");
                }

                mostrarToast("Cliente excluído com sucesso!", "success");
                listarClientesAdmin();
            } catch (erro) {
                mostrarToast(erro.message, "danger");
            }
        }
    );
}

async function loginFuncionario(event) {
    event.preventDefault();
    const usuario = document.getElementById("funcUsuario").value;
    const senha = document.getElementById("funcSenha").value;
    const campoErro = document.getElementById("erroFuncionario");

    campoErro.classList.add("d-none");
    try {
        const resposta = await fetch("https://projeto-lojadecards.onrender.com/cliente/funcionario/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario, senha })
        });

        if (!resposta.ok) {
            throw new Error("Chave de acesso inválida para Funcionários!");
        }
        const dados = await resposta.json();

        localStorage.setItem("funcionarioToken", dados.access_token);

        mostrarToast("Autenticação realizada com sucesso! Entrando no painel...", "success");
        setTimeout(() => window.location.href = "dashboard-funcionario.html", 1000);
    } catch (erro) {
        mostrarToast(erro.message, "danger");
    }
}
function logoutFuncionario() {
    localStorage.removeItem("funcionarioToken");
    mostrarToast("Autenticação encerrada! Redirecionando para a página de login...", "success");
    setTimeout(() => window.location.href = "login-funcionario.html", 1000);
}

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
//fucionario ussa
async function listarCartasAdmin(page = 1) {
    const limite = 10;
    const tabela = document.getElementById("tabelaCartasAdmin");
    const paginacaoDiv = document.getElementById("paginacaoCartasAdmin");
    if (!tabela) return;

    try {
        const resposta = await fetch(`${API_CARTAS}/pesquisar?page=${page}&limit=${limite}`);
        if (!resposta.ok) throw new Error("Servidor não respondeu");

        const resultado = await resposta.json();
        const cartas = resultado.data || [];

        tabela.innerHTML = "";
        cartas.forEach(carta => {
            tabela.innerHTML += `
                <td>${carta.nome}</td>
                <td>${carta.atk}</td>
                <td>${carta.defesa}</td>
                <td>R$ ${carta.preco.toFixed(2)}</td>
                <td>${carta.quantidade} un</td>
                <td>
                    <a href="editar.html?id=${carta.id}" class="btn btn-warning btn-sm me-1">✏️ Editar</a>
                    <button type="button" onclick="event.preventDefault(); deletarCarta(${carta.id})" class="btn btn-danger btn-sm">🗑️ Excluir</button>
                </td>
            `;
        });

        if (resultado.pages) {
            paginacaoDiv.innerHTML = "";

            const btnVoltar = document.createElement("button");
            btnVoltar.className = "btn btn-outline-secondary btn-sm me-1";
            btnVoltar.innerHTML = "&laquo;";
            btnVoltar.disabled = resultado.page <= 1;
            btnVoltar.onclick = () => listarCartas(resultado.page - 1);
            paginacaoDiv.appendChild(btnVoltar);

            resultado.pages.forEach(p => {
                const btn = document.createElement("button");
                btn.className = "btn btn-outline-primary btn-sm me-1";
                btn.innerText = p;
                btn.disabled = (p === "..." || parseInt(p) === resultado.page);
                if (p !== "...") {
                    btn.onclick = () => listarCartasAdmin(parseInt(p));
                }
                paginacaoDiv.appendChild(btn);
            });

            const btnAvancar = document.createElement("button");
            btnAvancar.className = "btn btn-outline-secondary btn-sm";
            btnAvancar.innerHTML = "&raquo;";
            btnAvancar.disabled = resultado.page >= resultado.total_pages;
            btnAvancar.onclick = () => listarCartas(resultado.page + 1);
            paginacaoDiv.appendChild(btnAvancar);
        }

    } catch (erro) {
        mostrarToast(erro.message, "danger");
    }
}

async function pesquisarCartasAdmin(page = 1) {
    const limite = 10;
    const nome = document.getElementById("buscaNomeCartaAdmin").value.trim();
    const tabela = document.getElementById("tabelaCartasAdmin");
    const paginacaoDiv = document.getElementById("paginacaoCartasAdmin");
    if (!tabela) return;

    try {
        const resposta = await fetch(`${API_CARTAS}/pesquisar?page=${page}&limit=${limite}&nome=${encodeURIComponent(nome)}`);
        if (!resposta.ok) throw new Error("Servidor não respondeu");

        const resultado = await resposta.json();
        const cartas = resultado.data || [];

        tabela.innerHTML = "";
        cartas.forEach(carta => {
            tabela.innerHTML += `
                    <td>${carta.nome}</td>
                    <td>${carta.atk}</td>
                    <td>${carta.defesa}</td>
                    <td>R$ ${carta.preco.toFixed(2)}</td>
                    <td>${carta.quantidade} un</td>
                    <td>
                        <a href="editar.html?id=${carta.id}" class="btn btn-warning btn-sm me-1">✏️ Editar</a>
                        <button type="button" onclick="event.preventDefault(); deletarCarta(${carta.id})" class="btn btn-danger btn-sm">🗑️ Remover</button>
                    </td>
            `;
        });

        if (resultado.pages) {
            paginacaoDiv.innerHTML = "";

            const btnVoltar = document.createElement("button");
            btnVoltar.className = "btn btn-outline-secondary btn-sm me-1";
            btnVoltar.innerHTML = "&laquo;";
            btnVoltar.disabled = resultado.page <= 1;
            btnVoltar.onclick = () => pesquisarCartasAdmin(resultado.page - 1);
            paginacaoDiv.appendChild(btnVoltar);

            resultado.pages.forEach(p => {
                const btn = document.createElement("button");
                btn.className = "btn btn-outline-primary btn-sm me-1";
                btn.innerText = p;
                btn.disabled = (p === "..." || parseInt(p) === resultado.page);
                if (p !== "...") {
                    btn.onclick = () => pesquisarCartasAdmin(parseInt(p));
                }
                paginacaoDiv.appendChild(btn);
            });

            const btnAvancar = document.createElement("button");
            btnAvancar.className = "btn btn-outline-secondary btn-sm";
            btnAvancar.innerHTML = "&raquo;";
            btnAvancar.disabled = resultado.page >= resultado.total_pages;
            btnAvancar.onclick = () => pesquisarCartasAdmin(resultado.page + 1);
            paginacaoDiv.appendChild(btnAvancar);
        }

    } catch (erro) {
        mostrarToast(erro.message, "danger");
    }
}

async function listarClientesAdmin(page = 1) {
    const limite = 10;
    const tabela = document.getElementById("tabelaClientesAdmin");
    const paginacaoDiv = document.getElementById("paginacaoClientesAdmin");
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
                <td><strong>${cliente.nome}</strong></td>
                <td>${new Date(cliente.dataDeNascimento).toLocaleDateString("pt-BR")}</td>
                <td>${cliente.genero}</td>
                <td>
                    <a href="editarCliente.html?id=${cliente.id}" class="btn btn-warning btn-sm me-1">✏️ Alterar</a>
                    <button type="button" onclick="event.preventDefault(); deletarCliente(${cliente.id})" class="btn btn-danger btn-sm">🗑️ Remover</button>
                </td>
            </tr>
            `;
        });

        if (resultado.pages) {
            paginacaoDiv.innerHTML = "";

            const btnVoltar = document.createElement("button");
            btnVoltar.className = "btn btn-outline-secondary btn-sm me-1";
            btnVoltar.innerHTML = "&laquo;";
            btnVoltar.disabled = resultado.page <= 1;
            btnVoltar.onclick = () => pesquisarClientesAdmin(resultado.page - 1);
            paginacaoDiv.appendChild(btnVoltar);

            resultado.pages.forEach(p => {
                const btn = document.createElement("button");
                btn.className = "btn btn-outline-primary btn-sm me-1";
                btn.innerText = p;
                btn.disabled = (p === "..." || parseInt(p) === resultado.page);
                if (p !== "...") {
                    btn.onclick = () => pesquisarClientesAdmin(parseInt(p));
                }
                paginacaoDiv.appendChild(btn);
            });

            const btnAvancar = document.createElement("button");
            btnAvancar.className = "btn btn-outline-secondary btn-sm";
            btnAvancar.innerHTML = "&raquo;";
            btnAvancar.disabled = resultado.page >= resultado.total_pages;
            btnAvancar.onclick = () => pesquisarClientesAdmin(resultado.page + 1);
            paginacaoDiv.appendChild(btnAvancar);
        }

    } catch (erro) {
        mostrarToast(erro.message, "danger");
    }
}

async function pesquisarClientesAdmin(page = 1) {
    const limite = 10;
    const nome = document.getElementById("buscaNomeClienteAdmin").value.trim();
    const tabela = document.getElementById("tabelaClientesAdmin");
    const paginacaoDiv = document.getElementById("paginacaoClientesAdmin");
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
                    <td><strong>${cliente.nome}</strong></td>
                    <td>${new Date(cliente.dataDeNascimento).toLocaleDateString("pt-BR")}</td>
                    <td>${cliente.genero}</td>
                    <td>
                        <a href="editarCliente.html?id=${cliente.id}" class="btn btn-warning btn-sm me-1">✏️ Alterar</a>
                        <button type="button" onclick="event.preventDefault(); deletarCliente(${cliente.id})" class="btn btn-danger btn-sm">🗑️ Remover</button>
                    </td>
            </tr>
            `;
        });

        if (resultado.pages) {
            paginacaoDiv.innerHTML = "";

            const btnVoltar = document.createElement("button");
            btnVoltar.className = "btn btn-outline-secondary btn-sm me-1";
            btnVoltar.innerHTML = "&laquo;";
            btnVoltar.disabled = resultado.page <= 1;
            btnVoltar.onclick = () => pesquisarClientesAdmin(resultado.page - 1);
            paginacaoDiv.appendChild(btnVoltar);

            resultado.pages.forEach(p => {
                const btn = document.createElement("button");
                btn.className = "btn btn-outline-primary btn-sm me-1";
                btn.innerText = p;
                btn.disabled = (p === "..." || parseInt(p) === resultado.page);
                if (p !== "...") {
                    btn.onclick = () => pesquisarClientesAdmin(parseInt(p));
                }
                paginacaoDiv.appendChild(btn);
            });

            const btnAvancar = document.createElement("button");
            btnAvancar.className = "btn btn-outline-secondary btn-sm";
            btnAvancar.innerHTML = "&raquo;";
            btnAvancar.disabled = resultado.page >= resultado.total_pages;
            btnAvancar.onclick = () => pesquisarClientesAdmin(resultado.page + 1);
            paginacaoDiv.appendChild(btnAvancar);
        }

    } catch (erro) {
        mostrarToast(erro.message, "danger");
    }
}