export const TIMES_PER_MONTH = [
  {
    label: "Every day",
    value: 28,
  },
  {
    label: "5 times per week",
    value: 20,
  },
  {
    label: "3 times per week",
    value: 12,
  },
  {
    label: "2 times per week",
    value: 8,
  },
  {
    label: "Once a week",
    value: 4,
  },
  {
    label: "Twice a month",
    value: 2,
  },
  {
    label: "Once a month",
    value: 1,
  },
] as const;

// export const CATEGORIES = [
//   "health", // asset - tree
//   "selfCare",
//   "petCare",
//   "learning",
//   "profLearning",
//   "home",
//   "relationships",
//   "mental",
// ] as const;
// export type Category = (typeof CATEGORIES)[number];

// export const CATEGORY_OPTIONS = [
//   { label: "Health", value: "health" },
//   { label: "Self-care", value: "selfCare" },
//   { label: "Pet Care", value: "petCare" },
//   { label: "Learning & Reading", value: "learning" },
//   { label: "Professional Learning", value: "profLearning" },
//   { label: "Home", value: "home" },
//   { label: "Relationships", value: "relationships" },
//   { label: "Emotional Health", value: "mental" },
// ] satisfies { label: string; value: Category }[];

// export const CATEGORY_LABELS: Record<Category, string> = {
//   health: "Health",
//   selfCare: "Self-care",
//   petCare: "Pet Care",
//   learning: "Learning & Reading",
//   profLearning: "Professional Learning",
//   home: "Home",
//   relationships: "Relationships",
//   mental: "Emotional Health",
// };
