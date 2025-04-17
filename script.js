document.getElementById("formulario").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;
  const botao = form.querySelector('button[type="submit"]');
  botao.disabled = true;
  botao.innerText = "Enviando...";

  const nome = form.nome.value;
  const email = form.email.value;
  const telefone = form.telefone.value;

  const modelos = [
    {
      nome: "Sweatshirt",
      tamanho: form.tamanho_sweatshirt.value,
      quantidade: parseInt(form.quantidade_sweatshirt.value),
      preco: 13.83
    },
    {
      nome: "T-shirt",
      tamanho: form.tamanho_tshirt.value,
      quantidade: parseInt(form.quantidade_tshirt.value),
      preco: 4.75
    },
    {
      nome: "Polo",
      tamanho: form.tamanho_polo.value,
      quantidade: parseInt(form.quantidade_polo.value),
      preco: 7.90
    }
  ];

  const pedidos = modelos
    .filter((m) => m.quantidade > 0 && m.tamanho !== "")
    .map((m) => {
      const dados = {
        nome,
        email,
        telefone,
        modelo: m.nome,
        tamanho: m.tamanho,
        quantidade: m.quantidade,
        total: (m.quantidade * m.preco).toFixed(2)
      };

      return fetch("https://tshirt-boavista.vercel.app/api/proxy", {
        method: "POST",
        body: JSON.stringify(dados),
        headers: {
          "Content-Type": "application/json"
        }
      });
    });

  Promise.all(pedidos)
    .then((respostas) => {
      if (respostas.every((res) => res.ok)) {
        document.getElementById("mensagem").innerText = "✅ Pedido enviado com sucesso!";

        // 💶 Calcular o total com IVA (23%)
        const totalComIVA = modelos
          .filter((m) => m.quantidade > 0 && m.tamanho !== "")
          .reduce((acc, m) => acc + (m.quantidade * m.preco * 1.23), 0);

        // 💬 Mostrar popup com total final
        alert(`Total com IVA (23%): €${totalComIVA.toFixed(2)}`);

        form.reset();
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


// 🔁 Botão "Limpar / Novo Pedido"
document.getElementById("limpar").addEventListener("click", function () {
  document.getElementById("formulario").reset();
  document.getElementById("mensagem").innerText = "";
});
