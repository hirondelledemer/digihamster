import { connect } from "@/config/database/connection";
import { getDataFromToken } from "@/app/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import TaskV2, { ITaskV2 } from "@/models/taskV2";
import User from "@/models/user";
import Relationship from "@/models/relationship";

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);

    const tasks = await TaskV2.find<ITaskV2>({
      userId,
      deleted: false,
    });

    const tasksWithRelationships = await Promise.all(
      tasks.map(async (task) => {
        // Find all relations where the current task is either sourceEntity or targetEntity
        const relationsAsSource = await Relationship.find({
          sourceEntity: task._id,
          type: "task",
        }).populate("targetEntity");

        const relationsAsTarget = await Relationship.find({
          targetEntity: task._id,
          type: "task",
        }).populate("sourceEntity");

        // Extract related tasks from both sets of relations
        const relatedTasksIds = [
          ...relationsAsSource.map((relation) => relation.targetEntity),
          ...relationsAsTarget.map((relation) => relation.sourceEntity),
        ];

        const relatedTasks = tasks
          .filter((task) => {
            return relatedTasksIds.includes(task._id.toString());
          })
          .map((task) => ({ ...task.toObject(), relatedTasks: undefined }));

        return {
          ...task.toObject(),
          relatedTasks,
        };
      })
    );

    return NextResponse.json(tasksWithRelationships);
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

    const parentTask = new TaskV2({
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

    const savedTask = await parentTask.save();

    const childTasksArgs = args.subtasks.map((subTask) => ({
      userId: user.id,
      title: subTask,
      projectId,
      completed: false,
      deleted: false,
      isActive: args.isActive === undefined ? false : args.isActive,
      estimate: 0,
      sortOrder: tasks.length,
      parentTaskId: parentTask._id,
      tags: args.tags,
      deadline: args.deadline,
      eventId: args.eventId,
      activatedAt: args.isActive ? new Date() : undefined,
    }));

    const childTasks = await TaskV2.insertMany(childTasksArgs);

    const parentChildRelations = childTasks.map((childTask) => ({
      userId,
      sourceEntity: parentTask._id,
      targetEntity: childTask._id,
      type: "task",
    }));

    await Relationship.insertMany(parentChildRelations);

    const childChildRelations = [];
    for (let i = 0; i < childTasks.length; i++) {
      for (let j = i + 1; j < childTasks.length; j++) {
        childChildRelations.push({
          userId,
          sourceEntity: childTasks[i]._id,
          targetEntity: childTasks[j]._id,
          type: "task",
        });
      }
    }
    await Relationship.insertMany(childChildRelations);

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
