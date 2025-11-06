// Arquivo: api/webhook.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const evento = req.body;

    console.log("📩 Webhook recebido da MisticPay:", evento);

    if (!evento.transactionId) {
      return res.status(400).json({ error: "Webhook inválido" });
    }

    // Exemplo: quando o pagamento for concluído
    if (evento.transactionState === "COMPLETO") {
      console.log("✅ Pagamento confirmado:", evento.transactionId);

      // Aqui você pode registrar no Firebase ou atualizar o saldo do usuário
      // Exemplo:
      // await fetch("https://seu-banco.firebaseio.com/recarregamentos.json", {
      //   method: "POST",
      //   body: JSON.stringify({
      //     transactionId: evento.transactionId,
      //     valor: evento.transactionAmount,
      //     metodo: evento.transactionMethod,
      //     status: "completo"
      //   })
      // });
    }

    return res.status(200).json({ recebido: true });
  } catch (erro) {
    console.error("Erro no webhook:", erro);
    return res.status(500).json({ error: "Erro ao processar webhook" });
  }
}
