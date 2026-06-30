import { NextRequest, NextResponse } from "next/server";
import { searchPosts } from "@/lib/blog";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json([]);
  }

  const results = searchPosts(query);
  return NextResponse.json(results);
}
