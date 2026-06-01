import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { getAllCustomers } from "@/lib/db/queries/customers";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || undefined;

    const result = await getAllCustomers(page, 20, search);
    return NextResponse.json(result);
  } catch (e) {
    console.error("Admin customers fetch error:", e);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}
