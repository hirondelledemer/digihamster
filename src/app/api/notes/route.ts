import { connect } from "@/config/database/connection";
import { getDataFromToken } from "@/app/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import Note from "@/models/note";

connect();

// todo: add query params
export async function GET(request: NextRequest) {
  try {
    // Extract user ID from the authentication token
    const userId = await getDataFromToken(request);
    const getIsActive =
      request.nextUrl.searchParams.get("isActive") || undefined;

    // Find the user in the database based on the user ID
    const notes = await Note.find({
      userId,
      deleted: false,
      isActive: getIsActive,
    });

    console.log("notes", notes);
    return NextResponse.json(notes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await getDataFromToken(request);
    const reqBody = await request.json();
    const args = reqBody;
    const note = await Note.findOne({ _id: args.id });

    if (!note) {
      throw new Error("note does not exists");
    }

    const updatedNote = await Note.findOneAndUpdate(
      { _id: args.id },
      {
        title: args.title || note.title,
        note: args.note || note.note,
        tags: args.tags || note.tags,
        isActive: args.isActive === undefined ? note.isActive : args.isActive,
        deleted: args.deleted === undefined ? note.deleted : args.deleted,
      }
    );

    return NextResponse.json(updatedNote);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
