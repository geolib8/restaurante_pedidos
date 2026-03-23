import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { name, price } = await req.json();

    if (!name || !price) {
      return Response.json(
        { error: "Missing name or price" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("menu")
      .insert({
        name,
        price
      })
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return Response.json(
        { error: "Database error" },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      item: data
    });

  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}