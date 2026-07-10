import mongoose from "mongoose";

export interface Cycle {
  tracker_id: string;
  start_date: string;
  end_date: string;
  is_predicted: boolean;
  created_at: string;
}

export type ICycle = Cycle & mongoose.Document<string>;

const CycleSchema = new mongoose.Schema<string>({
  dates: { type: Array, required: true },
  futureDates: { type: Array, required: true },
  userId: { type: String, required: true },
});

const Cycle = mongoose.models.Cycle || mongoose.model("Cycle", CycleSchema);
export default Cycle;
