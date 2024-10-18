import { getDataFromToken } from "@/app/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import Cycle, { ICycle } from "@/models/cycle";
import { addDays, differenceInCalendarDays } from "date-fns";

const DAY = 1000 * 60 * 60 * 24;

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);

    const cycle = await Cycle.find({ userId });

    return NextResponse.json(cycle);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const reqBody = await request.json();
    const args = reqBody;

    const cycle = await Cycle.findOne<ICycle>({ userId });

    if (!cycle) {
      const newCycle = new Cycle({
        userId,
        dates: [
          {
            startDate: args.startDate,
            endDate: args.startDate + DAY * 5,
          },
        ],
      });

      const savedCycle = await newCycle.save();
      return NextResponse.json<ICycle>(savedCycle);
    }

    const futureDates = [];

    if (cycle.dates.length > 2) {
      const delta = averageDelta(cycle.dates);

      for (let i = 1; i <= 10; i++) {
        futureDates.push({
          startDate: addDays(args.startDate, delta * i).getTime(),
          endDate: addDays(args.startDate, delta * i + 5).getTime(),
        });
      }
    }

    const updatedCycle = await Cycle.findOneAndUpdate<ICycle>(
      {
        userId,
      },
      {
        futureDates: futureDates,
        $push: {
          dates: {
            startDate: args.startDate,
            endDate: args.startDate + DAY * 5,
          },
        },
      }
    );
    return NextResponse.json(updatedCycle);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

const averageDelta = ([x, ...xs]: {
  startDate: number;
  endDate: number;
}[]) => {
  if (x.startDate === undefined) return NaN;
  else
    return (
      xs.reduce(
        ([acc, last], x) => [
          acc + differenceInCalendarDays(x.startDate, last),
          x.startDate,
        ],
        [0, x.startDate]
      )[0] / xs.length
    );
};
