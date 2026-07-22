import axios from "axios";

export const getApiErrorMessage = (e: unknown): string =>
  axios.isAxiosError(e)
    ? (e.response?.data?.message ?? "An unexpected error occurred")
    : "An unexpected error occurred";
