import { connect } from "@/config/database/connection";
import { getDataFromToken } from "@/app/helpers/getDataFromToken";
import Task, { ITask } from "@/models/task";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  try {
    // Extract user ID from the authentication token
    const userId = await getDataFromToken(request);

    // Find the user in the database based on the user ID
    const tasks = await Task.find({
      userId,
      deleted: false,
      $or: [{ event: { $ne: null } }, { deadline: { $ne: null } }],
    });
    return NextResponse.json({
      message: "Tasks found",
      data: tasks,
    });
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
    const tasks = await Task.find({ userId: user.id });

    const projectId = args.projectId || user.defaultProjectId;

    const task = new Task({
      userId: user.id,
      title: args.title,
      description: args.description,
      projectId,
      completed: false,
      deleted: false,
      isActive: args.isActive === undefined ? false : args.isActive,
      estimate: args.estimate || 0,
      sortOrder: tasks.length,
      parentTaskId: args.parentTaskId,
      tags: args.tags,
      deadline: args.deadline,
      activatedAt: args.isActive ? new Date() : undefined,
      event: args.event
        ? {
            startAt: args.event.startAt,
            endAt: args.event.endAt,
            allDay: args.event.allDay,
          }
        : null,
    });

    const savedTask = await task.save();

    return NextResponse.json<ITask>(savedTask);
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
    const task = await Task.findOne({ _id: args.taskId });

    if (!task) {
      throw new Error("task does not exists");
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: args.taskId },
      {
        title: args.title || task.title,
        description: args.description || task.description,
        tags: args.tags || task.tags,
        estimate: args.estimate === undefined ? task.estimate : args.estimate,
        deadline: args.estimate === undefined ? task.deadline : args.deadline,
        sortOrder:
          args.sortOrder === undefined ? task.sortOrder : args.sortOrder,
        completed:
          args.completed === undefined ? task.completed : args.completed,
        completedAt: args.completed ? Date.now() : undefined,
        deleted: args.deleted === undefined ? task.deleted : args.deleted,
        projectId:
          args.projectId === null
            ? undefined
            : args.projectId || task.projectId,
        isActive: args.isActive === undefined ? task.isActive : args.isActive,
        activatedAt: args.isActive ? Date.now() : undefined,
        event: args.event === undefined ? task.event : args.event,
      }
    );

    return NextResponse.json({
      message: "Task updated successfully",
      success: true,
      updatedTask,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
