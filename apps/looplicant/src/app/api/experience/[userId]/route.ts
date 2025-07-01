import { getExperience } from "@/import/lib/dal";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = await params;

  try {
    const experience = await getExperience(userId);
    return NextResponse.json(experience);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch experience" },
      { status: 500 }
    );
  }
}
