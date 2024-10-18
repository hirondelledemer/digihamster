import mongoose from "mongoose";

export interface Cycle {
  _id: string;
  dates: {
    startDate: number;
    endDate: number;
  }[];
  futureDates: {
    startDate: number;
    endDate: number;
  }[];
}

export type ICycle = Cycle & mongoose.Document<string>;

const CycleSchema = new mongoose.Schema<string>({
  dates: { type: Array, required: true },
  futureDates: { type: Array, required: true },
  userId: { type: String, required: true },
});

const Cycle = mongoose.models.Cycle || mongoose.model("Cycle", CycleSchema);
export default Cycle;
