import { connect } from "@/config/database/connection";
import { getDataFromToken } from "@/app/helpers/getDataFromToken";
import Tag from "@/models/tag";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);

    const tags = await Tag.find({
      userId,
    });

    return NextResponse.json(tags);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
export async function POST(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const args = await request.json();

    const tag = new Tag({
      userId,
      title: args.title,
      color: args.color,
      deleted: false,
    });

    const savedTag = await tag.save();
    return NextResponse.json(savedTag);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
