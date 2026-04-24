import { NextResponse } from "next/server";

/**
 * POST /api/admin/auth
 * Server-side password validation endpoint.
 * Validates the admin password and returns success/failure.
 *
 * This endpoint provides a server-side auth check that can be used
 * as an additional verification layer alongside Firebase Auth.
 *
 * Environment variables (set in Vercel):
 *   - NEXT_PUBLIC_ADMIN_PASSWORD: The expected admin password
 *   - NEXT_PUBLIC_ADMIN_PASSWORD_FALLBACK: Fallback password for emergencies
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, message: "Password is required." },
        { status: 400 }
      );
    }

    const expectedPassword =
      process.env.ADMIN_PASSWORD ||
      process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
      process.env.NEXT_PUBLIC_ADMIN_PASSWORD_FALLBACK ||
      "";

    if (!expectedPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Server-side auth not configured. Set ADMIN_PASSWORD env var.",
          code: "auth/not-configured"
        },
        { status: 500 }
      );
    }

    if (password !== expectedPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid password.",
          code: "auth/invalid-credential"
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Authentication successful.",
      mode: "server",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Server error during authentication.",
        code: "auth/server-error"
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { status: "ok", endpoint: "admin-auth" },
    { status: 200 }
  );
}
