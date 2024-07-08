import { connect } from "@/config/database/connection";
import { getDataFromToken } from "@/app/helpers/getDataFromToken";
import Task, { ITask } from "@/models/task";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import TaskV2 from "@/models/taskV2";
import Event, { IEvent } from "@/models/event";

connect();

export async function GET(request: NextRequest) {
  try {
    // Extract user ID from the authentication token
    // const userId: string = await getDataFromToken(request);
    // await User.findOne({ _id: userId }).select("-password");
    // const tasks = await Task.find({
    //   event: null,
    //   deleted: false,
    // });

    // const events = await Task.find({
    //   event: { $ne: null },
    //   deleted: false,
    // });

    // tasks.map(async (task) => {
    //   const newTask = new TaskV2({
    //     _id: task._id,
    //     userId: task.userId,
    //     title: task.title,
    //     description: task.description,
    //     projectId: task.projectId,
    //     completed: task.completed,
    //     deleted: task.deleted,
    //     isActive: task.isActive,
    //     estimate: task.estimate,
    //     parentTaskId: task.parentTaskId,
    //     tags: task.tags,
    //     deadline: task.deadline,
    //     activatedAt: task.activatedAt,
    //   });
    //   await newTask.save();
    // });

    // events.map(async (task) => {
    //   const event = new Event({
    //     _id: task._id,
    //     userId: task.userId,
    //     title: task.title,
    //     description: task.description,
    //     projectId: task.projectId,
    //     completed: task.completed,
    //     deleted: task.deleted,
    //     tags: task.tags,
    //     startAt: task.event.startAt,
    //     endAt: task.event.endAt,
    //     allDay: task.event.allDay,
    //   });
    //   await event.save();
    // });

    return NextResponse.json({
      success: "true",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
