import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: true,
    message: "Dummy data seeding is disabled. Project starts fresh with live user repositories.",
    count: 0,
  });
}
