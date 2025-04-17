document.getElementById("formulario").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;
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

  modelos.forEach((m) => {
    if (m.quantidade > 0 && m.tamanho !== "") {
      const dados = {
        nome,
        email,
        telefone,
        modelo: m.nome,
        tamanho: m.tamanho,
        total: (m.quantidade * m.preco).toFixed(2)
      };

      fetch("https://tshirt-boavista.vercel.app/api/proxy", {
        method: "POST",
        body: JSON.stringify(dados),
        headers: {
          "Content-Type": "application/json"
        }
      }).then((res) => {
        if (res.ok) {
          document.getElementById("mensagem").innerText = "✅ Pedido enviado com sucesso!";
        } else {
          document.getElementById("mensagem").innerText = "❌ Erro ao enviar pedido.";
        }
      });
    }
  });

  form.reset();
});
