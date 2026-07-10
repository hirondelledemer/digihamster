import { connect } from "@/config/database/connection";
import { getDataFromToken } from "@/app/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import LifeAspect, { ILifeAspect } from "@/models/life-aspect";

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);

    const lifeAspects = await LifeAspect.find<ILifeAspect>({
      userId,
      deleted: false,
    });

    const mapped = lifeAspects.map((la) => ({
      ...la.toJSON(),
      _id: la.toJSON().id,
    }));
    return NextResponse.json(mapped);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const { title, description, asset } = await request.json();

    const newLifeAspect = new LifeAspect({
      userId,
      title,
      description,
      asset: asset || "defaultScore",
      deleted: false,
      boosts: [],
    });

    const saved = await newLifeAspect.save();
    return NextResponse.json(saved);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await getDataFromToken(request);
    const body = await request.json();
    const { id, title, description, asset, deleted } = body;

    const lifeAspect = await LifeAspect.findById(id);
    if (!lifeAspect) {
      return NextResponse.json({ error: "Life aspect not found" }, { status: 404 });
    }

    const updated = await LifeAspect.findByIdAndUpdate(
      id,
      {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(asset !== undefined && { asset }),
        ...(deleted !== undefined && { deleted }),
      },
      { new: true }
    );

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
