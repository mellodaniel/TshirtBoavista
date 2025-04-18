document.addEventListener("DOMContentLoaded", function () {
  const tamanhos = ["S", "M", "L", "XL", "XXL"];

  // Adiciona uma nova linha de tamanho + quantidade
  function criarLinha(modeloWrapper) {
    const linha = document.createElement("div");
    linha.classList.add("linha-pedido");

    const select = document.createElement("select");
    select.innerHTML = `<option value="">Tamanho</option>` + tamanhos.map(t => `<option>${t}</option>`).join("");

    const input = document.createElement("input");
    input.type = "number";
    input.min = "1";
    input.placeholder = "Quantidade";

    const btnRemover = document.createElement("button");
    btnRemover.type = "button";
    btnRemover.innerText = "✕";
    btnRemover.classList.add("remover");
    btnRemover.onclick = () => linha.remove();

    linha.appendChild(select);
    linha.appendChild(input);
    linha.appendChild(btnRemover);

    modeloWrapper.appendChild(linha);
  }

  // Inicializar todos os blocos com 1 linha por modelo
  document.querySelectorAll(".modelo-wrapper").forEach(wrapper => criarLinha(wrapper));

  // Botões de "+ Adicionar outro tamanho"
  document.querySelectorAll(".adicionar").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      const wrapper = document.getElementById(targetId);
      criarLinha(wrapper);
    });
  });

  // Envio do formulário
  document.getElementById("formulario").addEventListener("submit", function (e) {
    e.preventDefault();
    const form = e.target;
    const botao = form.querySelector('button[type="submit"]');
    botao.disabled = true;
    botao.innerText = "Enviando...";

    const nome = form.nome.value;
    const email = form.email.value;
    const telefone = form.telefone.value;

    const pedidos = [];

    document.querySelectorAll(".modelo-wrapper").forEach(wrapper => {
      const modelo = wrapper.dataset.modelo;
      const preco = parseFloat(wrapper.dataset.preco);

      wrapper.querySelectorAll(".linha-pedido").forEach(linha => {
        const tamanho = linha.querySelector("select").value;
        const quantidade = parseInt(linha.querySelector("input").value) || 0;

        if (tamanho && quantidade > 0) {
          pedidos.push({
            nome,
            email,
            telefone,
            modelo,
            tamanho,
            quantidade,
            total: (quantidade * preco).toFixed(2)
          });
        }
      });
    });

    if (pedidos.length === 0) {
      document.getElementById("mensagem").innerText = "⚠️ Por favor selecione pelo menos um item.";
      botao.disabled = false;
      botao.innerText = "Enviar Pedido";
      return;
    }

    const fetches = pedidos.map(dados =>
      fetch("https://tshirt-boavista.vercel.app/api/proxy", {
        method: "POST",
        body: JSON.stringify(dados),
        headers: {
          "Content-Type": "application/json"
        }
      })
    );

    Promise.all(fetches)
      .then(respostas => {
        if (respostas.every(res => res.ok)) {
          document.getElementById("mensagem").innerText = "✅ Pedido enviado com sucesso!";

          const totalComIVA = pedidos.reduce((acc, p) => acc + p.quantidade * parseFloat(p.total / p.quantidade) * 1.23, 0);
          alert(`Total com IVA (23%): €${totalComIVA.toFixed(2)}`);

          form.reset();
          document.querySelectorAll(".modelo-wrapper").forEach(wrapper => {
            wrapper.innerHTML = "";
            criarLinha(wrapper);
          });
        } else {
          document.getElementById("mensagem").innerText = "❌ Erro ao enviar um ou mais pedidos.";
        }
        botao.disabled = false;
        botao.innerText = "Enviar Pedido";
      })
      .catch(() => {
        document.getElementById("mensagem").innerText = "❌ Erro na comunicação com o servidor.";
        botao.disabled = false;
        botao.innerText = "Enviar Pedido";
      });
  });

  // Limpar formulário
  document.getElementById("limpar").addEventListener("click", function () {
    const form = document.getElementById("formulario");
    form.reset();
    document.getElementById("mensagem").innerText = "";

    document.querySelectorAll(".modelo-wrapper").forEach(wrapper => {
      wrapper.innerHTML = "";
      criarLinha(wrapper);
    });
  });
});
