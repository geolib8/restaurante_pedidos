import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    const formData = await req.formData();

    const items = JSON.parse(formData.get("items") as string);
    const tipo = formData.get("tipo");
    const direccion = formData.get("direccion");
    const telefono = formData.get("telefono");
    const hora = formData.get("hora");
    const total = formData.get("total");
    const image = formData.get("image") as File | null;
    const metodoPago = formData.get("metodoPago");

    const message = `
  🧾 Nuevo Pedido

  🍔 Productos:
  - ${items.join("\n- ")}

  📦 Tipo: ${tipo}
  ${tipo === "Entrega" ? `🏠 Dirección: ${direccion}` : ""}
  📞 Teléfono: ${telefono}
  ${tipo === "Recoger" ? `⏰ Hora: ${hora}` : ""}
  💳 Método de pago: ${metodoPago}
  💰 Total: $${total}
  `;

    const token = "8711605440:AAHJrJWR379XyMZO_MdMs4W8Z22nBEErc9U"; 
    const chatId = "5009557425";

    // ✅ VALIDATION
    if (image) {
      if (!image.type.startsWith("image/")) {
        return Response.json({ error: "Archivo inválido" }, { status: 400 });
      }

      if (image.size > 5 * 1024 * 1024) {
        return Response.json({ error: "Imagen muy grande" }, { status: 400 });
      }
    }

    // 🔥 SEND WITH IMAGE
    if (image) {
      const telegramForm = new FormData();

      telegramForm.append("chat_id", chatId);
      telegramForm.append("caption", message);
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      telegramForm.append("photo", new Blob([buffer]), image.name);

      await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
        method: "POST",
        body: telegramForm
      });

    } else {
      // fallback text only
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message
        })
      });
    }

    return Response.json({ success: true });
}
export async function GET() {
  const { data, error } = await supabase
    .from("menu")
    .select("*");

  if (error) {
    console.error(error);
    return Response.json([]); // 👈 ALWAYS return array
  }

  return Response.json(data || []); // 👈 ensure array
}