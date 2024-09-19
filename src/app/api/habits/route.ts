import { connect } from "@/config/database/connection";
import { getDataFromToken } from "@/app/helpers/getDataFromToken";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import Habit, { IHabit } from "@/models/habit";

connect();

export async function GET(request: NextRequest) {
  try {
    // Extract user ID from the authentication token
    const userId = await getDataFromToken(request);

    // Find the user in the database based on the user ID
    const habits = await Habit.find({
      userId,
      deleted: false,
    });
    return NextResponse.json(habits);
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

    const habit = new Habit({
      userId: userId,
      title: args.title,
      deleted: false,
      timesPerMonth: args.timesPerMonth,
      category: args.category,
      log: [],
    });

    const savedHabit = await habit.save();

    return NextResponse.json<IHabit>(savedHabit);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await getDataFromToken(request);
    const reqBody = await request.json();
    const args = reqBody;
    const habit = await Habit.findOne({ _id: args.id });

    if (!habit) {
      throw new Error("habit does not exists");
    }

    const updatedHabit = await Habit.findOneAndUpdate(
      { _id: args.id },
      {
        title: args.title || habit.title,
        category: args.category || habit.category,
        timesPerMonth:
          args.timesPerWeek === undefined
            ? habit.timesPerWeek
            : args.timesPerWeek,
        deleted: args.deleted === undefined ? habit.deleted : args.deleted,
      }
    );

    return NextResponse.json(updatedHabit);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
