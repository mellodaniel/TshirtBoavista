document.getElementById("formulario").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;
  const modelo = form.modelo.value;
  const precoMap = {
    "Sweatshirt": 13.83,
    "T-shirt": 4.75,
    "Polo": 7.90
  };
  const quantidade = parseInt(form.quantidade.value);
  const total = (quantidade * precoMap[modelo]).toFixed(2);

  const dados = {
    nome: form.nome.value,
    email: form.email.value,
    telefone: form.telefone.value,
    modelo,
    tamanho: form.tamanho.value,
    quantidade,
    total
  };

  fetch("https://script.google.com/macros/library/d/12KUqQLh2HkxW0hbObmfjn15NLAanXvAZ91OfeJCf6FBpRHQ7gr9ZsQjA/1", {
    method: "POST",
    body: JSON.stringify(dados),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(res => {
    if (res.ok) {
      document.getElementById("mensagem").innerText = "Pedido enviado com sucesso!";
      form.reset();
    } else {
      document.getElementById("mensagem").innerText = "Erro ao enviar pedido.";
    }
  });
});
