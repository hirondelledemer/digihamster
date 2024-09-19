import { getDataFromToken } from "@/app/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import Habit, { IHabit } from "@/models/habit";

export async function PATCH(request: NextRequest) {
  try {
    await getDataFromToken(request);
    const reqBody = await request.json();
    const args = reqBody;

    const habit = await Habit.findOne({ _id: args.id });
    const habitLog = await Habit.findOne({ _id: args.id, "log.at": args.at });

    if (!habit) {
      throw new Error("habit does not exists");
    }

    if (!habitLog) {
      await Habit.findOneAndUpdate(
        {
          _id: args.id,
        },

        { $push: { log: { at: args.at, completed: args.completed } } }
      );
    } else {
      await Habit.findOneAndUpdate(
        { _id: args.id, "log.at": args.at },
        {
          $set: {
            "log.$.completed": args.completed,
            "log.$.at": args.at,
          },
        }
      );
    }

    const habitUpdate: IHabit | null = await Habit.findOne({
      _id: habit.id,
    });

    return NextResponse.json(habitUpdate);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
