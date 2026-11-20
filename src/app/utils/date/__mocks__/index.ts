// Manual mock for the date barrel. Only the clock is mocked (see ./now); the
// rest of the helpers are the real implementation. Without this file,
// `jest.mock("@/utils/date")` automocks every export and `now()` hands back
// undefined, which takes down anything building a Date from it.
export { toBackendDateTime, parseBackendDate, toBackendDate } from "../date";
export { now } from "./now";
