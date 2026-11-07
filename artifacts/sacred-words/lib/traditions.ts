export const LAUNCH_TRADITIONS = [
  {
    value: "Catholic",
    label: "Catholic",
    description: "Saints, Mary, and the language of the Mass",
  },
  {
    value: "Christian",
    label: "Christian",
    description: "Scripture-rooted prayer in the Protestant tradition",
  },
  {
    value: "Universal",
    label: "Spiritual",
    description: "For the sacred without a single tradition",
  },
  {
    value: "Jewish",
    label: "Jewish",
    description: "Hebrew blessings and the rhythms of Jewish prayer",
  },
  {
    value: "Islamic",
    label: "Islamic",
    description: "Personal du'a in the spirit of Islam",
  },
  {
    value: "Secular",
    label: "Secular",
    description: "Reflection and intention, no God required",
  },
] as const;

export type LaunchTradition = (typeof LAUNCH_TRADITIONS)[number]["value"];

export function getTraditionLabel(value: string): string {
  return LAUNCH_TRADITIONS.find((tradition) => tradition.value === value)?.label ?? value;
}

export function normalizeLaunchTradition(value: string): LaunchTradition {
  return LAUNCH_TRADITIONS.find((tradition) => tradition.value === value)?.value ?? "Universal";
}
