import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { getUser } from "@/lib/auth";
export async function POST(req: Request) {
  if (!(await getUser())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const file = (await req.formData()).get("file") as File | null;
  if (!file) return NextResponse.json({ error: "Berkas kosong" }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Maksimal 5 MB" }, { status: 400 });
  const ext = path.extname(file.name).toLowerCase();
  if (![".pdf", ".jpg", ".jpeg", ".png"].includes(ext)) return NextResponse.json({ error: "Format harus PDF/JPG/PNG" }, { status: 400 });
  const name = randomUUID() + ext;
  await writeFile(path.join(process.cwd(), "public/uploads", name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: "/uploads/" + name });
}
