import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { id } = await req.json();

  await supabase
    .from("menu")
    .delete()
    .eq("id", id);

  return Response.json({ success: true });
}