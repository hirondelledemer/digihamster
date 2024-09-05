import { connect } from "@/config/database/connection";
import { getDataFromToken } from "@/app/helpers/getDataFromToken";
import Project, { IProject } from "@/models/project";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);

    const projects = await Project.find({
      userId,
    });
    const user = await User.findOne({ _id: userId }).select("-password");

    const defaultProject = projects.find(
      (p) => p._id.toString() === user.defaultProjectId
    );

    return NextResponse.json({
      projects,
      defaultProject,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId: string = await getDataFromToken(request);
    const reqBody = await request.json();
    const args = reqBody;

    const projects = await Project.find({ userId });

    const newProject = new Project({
      userId,
      title: args.title,
      color: args.color,
      deleted: false,
      order: projects.length,
    });

    const savedProject = await newProject.save();

    return NextResponse.json(savedProject);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await getDataFromToken(request);
    const reqBody = await request.json();
    const args = reqBody;
    const project = await Project.findOne({ _id: args.id });

    if (!project) {
      throw new Error("project does not exists");
    }

    const updatedProject = await Project.findOneAndUpdate(
      { _id: args.id },
      {
        title: args.title || project.title,
        color: args.color || project.color,
        deleted: args.deleted === undefined ? project.deleted : args.deleted,
        sortOrder:
          args.sortOrder === undefined ? project.sortOrder : args.sortOrder,
      }
    );

    return NextResponse.json(updatedProject);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
