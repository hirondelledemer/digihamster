import { connect } from "@/config/database/connection";
import { getDataFromToken } from "@/app/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import TaskV2, { ITaskV2 } from "@/models/taskV2";
import User from "@/models/user";

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);

    const tasks = await TaskV2.find<ITaskV2>({
      userId,
      deleted: false,
    });

    return NextResponse.json(tasks);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
interface TasksPostRequestParams {
  title: string;
  projectId: string;
  description: string;
  descriptionFull: object;
  isActive?: boolean;
  estimate?: number;
  parentTaskId?: string;
  tags?: string[];
  deadline?: number;
  eventId?: string;
  subtasks: string[];
}

export async function POST(request: NextRequest) {
  try {
    // Extract user ID from the authentication token
    const userId: string = await getDataFromToken(request);
    const args: TasksPostRequestParams = await request.json();
    const user = await User.findOne({ _id: userId }).select("-password");
    const tasks = await TaskV2.find({ userId: user.id });

    const projectId = args.projectId || user.defaultProjectId;

    const task = new TaskV2({
      userId: user.id,
      title: args.title,
      description: args.description,
      descriptionFull: args.descriptionFull,
      projectId,
      completed: false,
      deleted: false,
      isActive: args.isActive === undefined ? false : args.isActive,
      estimate: args.estimate || 0,
      sortOrder: tasks.length,
      parentTaskId: args.parentTaskId,
      tags: args.tags,
      deadline: args.deadline,
      eventId: args.eventId,
      activatedAt: args.isActive ? new Date() : undefined,
    });

    args.subtasks.forEach(async (subTask) => {
      const newSubtask = new TaskV2({
        userId: user.id,
        title: subTask,
        projectId,
        completed: false,
        deleted: false,
        isActive: args.isActive === undefined ? false : args.isActive,
        estimate: 0,
        sortOrder: tasks.length,
        parentTaskId: task._id,
        tags: args.tags,
        deadline: args.deadline,
        eventId: args.eventId,
        activatedAt: args.isActive ? new Date() : undefined,
      });
      await newSubtask.save();
    });

    const savedTask = await task.save();

    return NextResponse.json<ITaskV2>(savedTask);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await getDataFromToken(request);
    const reqBody = await request.json();
    const args = reqBody;
    const task = await TaskV2.findOne({ _id: args.taskId });

    if (!task) {
      throw new Error("task does not exists");
    }

    const updatedTask = await TaskV2.findOneAndUpdate(
      { _id: args.taskId },
      {
        title: args.title || task.title,
        description: args.description || task.description,
        descriptionFull: args.descriptionFull || task.descriptionFull,
        tags: args.tags || task.tags,
        estimate: args.estimate === undefined ? task.estimate : args.estimate,
        eventId: args.eventId === undefined ? task.eventId : args.eventId,
        deadline: args.deadline === undefined ? task.deadline : args.deadline,
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
      }
    );

    return NextResponse.json(updatedTask);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
