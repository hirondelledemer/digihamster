import { connect } from "@/config/database/connection";
import { getDataFromToken } from "@/app/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import { endOfISOWeek, startOfWeek } from "date-fns";
import TaskV2, { ITaskV2 } from "@/models/taskV2";
import JournalEntry from "@/models/entry";
import Event, { IEvent } from "@/models/event";

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const weekIndex = request.nextUrl.searchParams.get("index");

    if (!weekIndex) {
      throw new Error("no week index selected");
    }

    const weekDate = getISOWeek(11).toString();
    const startDate = startOfWeek(weekDate);
    const endDate = endOfISOWeek(weekDate);

    const tasksData = TaskV2.find<ITaskV2>({
      userId,
      deleted: false,
      completedAt: { $gte: startDate, $lt: endDate },
    });

    const entriesData = JournalEntry.find({
      userId,
      deleted: false,
      createdAt: { $gte: startDate, $lt: endDate },
    });

    const eventsData = Event.find<IEvent>({
      userId,
      deleted: false,
      startAt: { $gte: startDate, $lt: endDate },
    });

    const [tasks, events, entries] = await Promise.all([
      tasksData,
      eventsData,
      entriesData,
    ]);

    return NextResponse.json({
      tasks,
      events,
      entries,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

function getISOWeek(w: number, y = new Date().getFullYear()) {
  let d = new Date(y, 0, 4);
  d.setDate(d.getDate() - (d.getDay() || 7) + 1 + 7 * (w - 1));
  return d;
}
