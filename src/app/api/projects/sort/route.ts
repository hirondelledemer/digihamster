import { getDataFromToken } from "@/app/helpers/getDataFromToken";
import Project from "@/models/project";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    await getDataFromToken(request);
    const reqBody = await request.json();
    const args: { sortOrder: { projectId: string; order: number }[] } = reqBody;

    const operations = args.sortOrder.map((sortValue) => ({
      updateOne: {
        filter: { _id: sortValue.projectId },
        update: { order: sortValue.order },
      },
    }));

    const result = await Project.bulkWrite(operations);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
