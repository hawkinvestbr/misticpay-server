// Arquivo: api/misticpay/gerar-pix.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { amount, payerName, payerDocument, description } = req.body;

    if (!amount || !payerName || !payerDocument || !description) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }

    // Gera um ID único para a transação
    const transactionId = Math.random().toString(36).substring(2, 12);

    // Envia requisição para API MisticPay
    const response = await fetch("https://api.misticpay.com/api/transactions/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ci": "ci_mlnqt7n4x2d78iw", // substitua pelo seu client_id real
        "cs": "cs_qlfkr3cr9zhxv0yqp23h9k76s", // substitua pelo seu client_secret real
      },
      body: JSON.stringify({
        amount: Number(amount),
        payerName,
        payerDocument,
        transactionId,
        description,
        projectWebhook: "https://seu-webhook-na-vercel.vercel.app/api/webhook"
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        error: "Erro ao gerar Pix",
        detalhes: data
      });
    }

    return res.status(200).json({
      mensagem: "PIX gerado com sucesso!",
      qrcodeUrl: data.qrcodeUrl,
      copyPaste: data.copyPaste,
      transactionId: data.transactionId
    });

  } catch (erro) {
    console.error("Erro no servidor:", erro);
    return res.status(500).json({ error: "Erro interno ao gerar PIX" });
  }
}
