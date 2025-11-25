import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

// GET /api/timesheets
// Returns all timesheets for the authenticated user
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const timesheets = await prisma.timesheet.findMany({
      where: { userId: session.user.id },
      include: { lineItems: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(timesheets);
  } catch (err) {
    console.error("GET /api/timesheets error:", err);
    return NextResponse.json({ error: "Failed to fetch timesheets" }, { status: 500 });
  }
}

// POST /api/timesheets
// Creates a new timesheet with optional line items
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { rate, lineItems } = body;

    // Validate inputs
    if (typeof rate !== "number" || rate < 0) {
      return NextResponse.json(
        { error: "Invalid rate value" },
        { status: 400 }
      );
    }

    if (!Array.isArray(lineItems) || lineItems.length === 0) {
      return NextResponse.json(
        { error: "At least one line item is required" },
        { status: 400 }
      );
    }

    for (const item of lineItems) {
      if (typeof item.minutes !== "number" || item.minutes < 0) {
        return NextResponse.json(
          { error: "Invalid minutes value" },
          { status: 400 }
        );
      }
    }
    
    const timesheet = await prisma.timesheet.create({
      data: {
        userId: session.user.id,
        rate,
        lineItems: {
          create: lineItems?.map((item: { date: string; minutes: number; description: string }) => ({
            date: new Date(item.date),
            minutes: item.minutes,
            description: item.description,
          })),
        },
      },
      include: { lineItems: true },
    });

    return NextResponse.json(timesheet, { status: 201 });
  } catch (err) {
    console.error("POST /api/timesheets error:", err);
    return NextResponse.json({ error: "Failed to create timesheet" }, { status: 500 });
  }
}