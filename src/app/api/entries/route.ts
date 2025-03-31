import { connect } from "@/config/database/connection";
import { getDataFromToken } from "@/app/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import JournalEntry, { IJournalEntry } from "@/models/entry";

connect();

// todo: types
export async function GET(request: NextRequest) {
  try {
    // Extract user ID from the authentication token
    const userId = await getDataFromToken(request);

    // Find the user in the database based on the user ID
    const journalEntries = await JournalEntry.find({
      userId,
    });
    return NextResponse.json({
      message: "Journal entries found",
      data: journalEntries,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Extract user ID from the authentication token
    const userId = await getDataFromToken(request);
    const args = await request.json();

    const entry = new JournalEntry({
      userId,
      title: args.title,
      note: args.note,
      jsonNote: args.jsonNote,
      tags: args.tags,
    });

    const savedEntry = await entry.save();

    return NextResponse.json<IJournalEntry>(savedEntry);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
