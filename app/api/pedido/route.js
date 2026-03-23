export async function POST(req) {
  const body = await req.json();

  const { items, tipo, direccion, telefono, hora } = body;

  const message = `
🧾 Nuevo Pedido

🍔 Productos:
- ${items.join("\n- ")}

📦 Tipo: ${tipo}
🏠 Dirección: ${direccion}
📞 Teléfono: ${telefono}
⏰ Hora: ${hora}
  `;

  const token = "8711605440:AAHJrJWR379XyMZO_MdMs4W8Z22nBEErc9U";
  const chatId = "5009557425";

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message
    })
  });

  return Response.json({ success: true });
}