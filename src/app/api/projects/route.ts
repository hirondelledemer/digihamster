import { connect } from "@/config/database/connection";
import { getDataFromToken } from "@/app/helpers/getDataFromToken";
import Project from "@/models/project";
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
      (p) => p._id === user.defaultProjectId
    );

    return NextResponse.json({
      projects,
      defaultProject,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
