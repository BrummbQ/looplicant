import { getSkills } from "@/import/lib/dal";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = await params;

  try {
    const skills = await getSkills(userId);
    return NextResponse.json(skills);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 }
    );
  }
}
