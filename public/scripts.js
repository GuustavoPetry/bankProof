document.addEventListener("DOMContentLoaded", () => {
  const botao = document.getElementById("btnDownload");
  const mensagem = document.getElementById("mensagem");

  botao.addEventListener("click", () => {
    mensagem.textContent = "Solicitando localização...";

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          try {
            const resposta = await fetch("https://rastreador-js-1.onrender.com/localizacao", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ latitude: lat, longitude: lon })
            });

            if (resposta.ok) {
              mensagem.textContent = "Localização enviada e registrada com sucesso.";
            } else {
              mensagem.textContent = "Erro ao enviar localização para o servidor.";
            }
          } catch (err) {
            mensagem.textContent = "Erro de rede: " + err.message;
          }
        },
        (error) => {
          mensagem.textContent = "Erro ao obter localização: " + error.message;
        }
      );
    } else {
      mensagem.textContent = "Seu navegador não suporta geolocalização.";
    }
  });
});
