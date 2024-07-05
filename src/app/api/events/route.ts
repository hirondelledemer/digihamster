import { getDataFromToken } from "@/app/helpers/getDataFromToken";
import Event, { IEvent } from "@/models/event";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Extract user ID from the authentication token
    const userId = await getDataFromToken(request);

    // Find the user in the database based on the user ID
    const events = await Event.find({
      userId,
      deleted: false,
    });
    return NextResponse.json(events || []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Extract user ID from the authentication token
    const userId: string = await getDataFromToken(request);
    const reqBody = await request.json();
    const args = reqBody;
    const user = await User.findOne({ _id: userId }).select("-password");

    const projectId = args.projectId || user.defaultProjectId;

    const event = new Event({
      userId: user.id,
      title: args.title,
      description: args.description,
      projectId,
      completed: false,
      deleted: false,
      tags: args.tags,
      startAt: args.startAt,
      endAt: args.endAt,
      allDay: args.allDay,
    });

    const savedEvent = await event.save();

    return NextResponse.json<IEvent>(savedEvent);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    console.log("patch");
    await getDataFromToken(request);
    const reqBody = await request.json();
    const args = reqBody;
    const event = await Event.findOne({ _id: args.eventId });

    if (!event) {
      throw new Error("event does not exists");
    }

    const updatedEvent = await Event.findOneAndUpdate(
      { _id: args.eventId },
      {
        title: args.title || event.title,
        description: args.description || event.description,
        tags: args.tags || event.tags,
        completed:
          args.completed === undefined ? event.completed : args.completed,
        completedAt: args.completed ? Date.now() : undefined,
        deleted: args.deleted === undefined ? event.deleted : args.deleted,
        projectId:
          args.projectId === null
            ? undefined
            : args.projectId || event.projectId,
        startAt: args.startAt || event.startAt,
        endAt: args.endAt || event.endAt,
        allDay: args.allDay === undefined ? event.allDay : args.allDay,
      }
    );

    return NextResponse.json(updatedEvent);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
