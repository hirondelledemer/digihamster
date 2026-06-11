import apiClient from "../../api-client";
import { Habit } from "@/models/habit";

export type CreateHabitParams = {
  title: string;
  times_per_month: number;
  life_aspect_id: number;
};

export const api = {
  getHabits: () => apiClient.get<Habit[]>("/habits/with-logs"),
  createHabit: (data: CreateHabitParams) =>
    apiClient.post<Habit>("/habits", {
      ...data,
      description: "des",
    }),
  addLog: (
    habitId: string,
    data: { habit_id: string; log_date: string; completed: boolean },
  ) => apiClient.post(`/habits/${habitId}/logs`, data),
  updateLog: (habitId: string, logDate: string, data: { completed: boolean }) =>
    apiClient.patch(`/habits/${habitId}/logs/${logDate}`, data),
  updateHabit: (habitId: string, data: Partial<Habit>) =>
    apiClient.patch(`/habits/${habitId}`, data),
  deleteHabit: (habitId: string) => apiClient.delete(`/habits/${habitId}`),
} as const;
