import { connect } from "@/config/database/connection";
import { getDataFromToken } from "@/app/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import LifeAspect, { ILifeAspect } from "@/models/life-aspect";

connect();

export async function GET(request: NextRequest) {
  try {
    // Extract user ID from the authentication token
    const userId = await getDataFromToken(request);

    // Find the user in the database based on the user ID
    const lifeAspects = await LifeAspect.find<ILifeAspect>({
      userId,
      deleted: false,
    });

    console.log(await LifeAspect.find());
    const mapped = lifeAspects.map((la) => ({
      ...la.toJSON(),
      _id: la.toJSON().id,
    }));
    return NextResponse.json(mapped);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
