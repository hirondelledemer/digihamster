import apiClient from "../../api-client";
import { IHabitWithLogs } from "../../types/habit";

export type CreateHabitParams = {
  title: string;
  times_per_month: number;
  life_aspect_id: number;
  description: string;
};

export const api = {
  getHabits: () => apiClient.get<IHabitWithLogs[]>("/habits/with-logs"),
  createHabit: (data: CreateHabitParams) =>
    apiClient.post<IHabitWithLogs>("/habits", {
      ...data,
      description: "des",
    }),
  addLog: (
    habitId: number,
    data: { habit_id: number; log_date: string; completed: boolean },
  ) => apiClient.post(`/habits/${habitId}/logs`, data),
  updateLog: (habitId: number, logDate: string, data: { completed: boolean }) =>
    apiClient.patch(`/habits/${habitId}/logs/${logDate}`, data),
  updateHabit: (habitId: number, data: Partial<IHabitWithLogs>) =>
    apiClient.patch(`/habits/${habitId}`, data),
  deleteHabit: (habitId: number) => apiClient.delete(`/habits/${habitId}`),
} as const;
