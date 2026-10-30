import { NextResponse } from "next/server";
import { getHomepageData } from "@/lib/api/homepage.api";

/**
 * GET /api/homepage
 * Serves curated editorial data for the Saayal Stories storefront homepage.
 */
export async function GET() {
  try {
    const data = await getHomepageData();
    return NextResponse.json(
      {
        success: true,
        message: "Homepage data loaded successfully",
        data,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to load homepage data",
        error: error instanceof Error ? error.message : "Unknown server error",
      },
      { status: 500 }
    );
  }
}

