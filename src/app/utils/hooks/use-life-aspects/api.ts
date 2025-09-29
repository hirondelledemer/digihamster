import axios from "axios";
import { LifeAspect } from "@/models/life-aspect.js";

export const api = {
  getLifeAspects: () => axios.get<LifeAspect[]>("/api/life-aspects"),
} as const;
