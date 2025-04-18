document.getElementById("formulario").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;
  const botao = form.querySelector('button[type="submit"]');
  botao.disabled = true;
  botao.innerText = "Enviando...";

  const nome = form.nome.value;
  const email = form.email.value;
  const telefone = form.telefone.value;

  const tamanhos = ["S", "M", "L", "XL", "XXL"];
  const modelos = [
    { nome: "T-shirt", preco: 4.75, prefix: "tshirt" },
    { nome: "Sweatshirt", preco: 13.83, prefix: "sweatshirt" },
    { nome: "Polo", preco: 7.90, prefix: "polo" }
  ];

  const pedidos = [];

  modelos.forEach((modelo) => {
    tamanhos.forEach((tam) => {
      const input = form.querySelector(`input[name="${modelo.prefix}_${tam}"]`);
      const quantidade = parseInt(input?.value) || 0;

      if (quantidade > 0) {
        pedidos.push({
          nome,
          email,
          telefone,
          modelo: modelo.nome,
          tamanho: tam,
          quantidade: quantidade,
          total: (quantidade * modelo.preco).toFixed(2)
        });
      }
    });
  });

  const fetches = pedidos.map((dados) =>
    fetch("https://tshirt-boavista.vercel.app/api/proxy", {
      method: "POST",
      body: JSON.stringify(dados),
      headers: {
        "Content-Type": "application/json"
      }
    })
  );

  Promise.all(fetches)
    .then((respostas) => {
      if (respostas.every((res) => res.ok)) {
        document.getElementById("mensagem").innerText = "✅ Pedido enviado com sucesso!";

        // 💶 Cálculo total com IVA
        const totalComIVA = pedidos.reduce((acc, p) => acc + (p.quantidade * p.total / p.quantidade * 1.23), 0);
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

document.getElementById("limpar").addEventListener("click", function () {
  document.getElementById("formulario").reset();
  document.getElementById("mensagem").innerText = "";
});
