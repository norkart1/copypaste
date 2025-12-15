import { NextResponse } from "next/server";
import { getTeams, createTeam, updateTeamById, deleteTeamById } from "@/lib/data";

export async function GET() {
  try {
    const teams = await getTeams();
    return NextResponse.json(teams);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch teams" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const team = await createTeam(body);
    return NextResponse.json(team, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create team" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ error: "Team ID is required" }, { status: 400 });
    }
    await updateTeamById(id, data);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update team" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Team ID is required" }, { status: 400 });
    }
    await deleteTeamById(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete team" }, { status: 400 });
  }
}
