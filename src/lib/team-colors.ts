import type { Team, TeamColorConfig } from "./types";

const DEFAULT_COLORS: TeamColorConfig = {
  primary: "#6B7280",
  gradient: "#4B5563",
  light: "#F3F4F6",
  stroke: "#4B5563",
  accent: "#D1D5DB",
  shadow: "#6B7280",
};

export function getTeamColors(team: Team): TeamColorConfig {
  if (team.colorConfig && team.colorConfig.primary) {
    return team.colorConfig;
  }
  
  return generateColorConfig(team.color || DEFAULT_COLORS.primary);
}

export function generateColorConfig(primaryColor: string): TeamColorConfig {
  const hex = primaryColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) || 107;
  const g = parseInt(hex.substring(2, 4), 16) || 114;
  const b = parseInt(hex.substring(4, 6), 16) || 128;
  
  const darken = (val: number, amount: number) => Math.max(0, Math.min(255, Math.floor(val * (1 - amount))));
  const lighten = (val: number, amount: number) => Math.max(0, Math.min(255, Math.floor(val + (255 - val) * amount)));
  
  const darkR = darken(r, 0.2);
  const darkG = darken(g, 0.2);
  const darkB = darken(b, 0.2);
  const darkColor = `#${darkR.toString(16).padStart(2, '0')}${darkG.toString(16).padStart(2, '0')}${darkB.toString(16).padStart(2, '0')}`;
  
  const lightR = lighten(r, 0.85);
  const lightG = lighten(g, 0.85);
  const lightB = lighten(b, 0.85);
  const lightColor = `#${lightR.toString(16).padStart(2, '0')}${lightG.toString(16).padStart(2, '0')}${lightB.toString(16).padStart(2, '0')}`;
  
  const accentR = lighten(r, 0.6);
  const accentG = lighten(g, 0.6);
  const accentB = lighten(b, 0.6);
  const accentColor = `#${accentR.toString(16).padStart(2, '0')}${accentG.toString(16).padStart(2, '0')}${accentB.toString(16).padStart(2, '0')}`;
  
  return {
    primary: primaryColor,
    gradient: darkColor,
    light: lightColor,
    stroke: darkColor,
    accent: accentColor,
    shadow: primaryColor,
  };
}

export function getTeamColorMap(teams: Team[]): Record<string, TeamColorConfig> {
  const colorMap: Record<string, TeamColorConfig> = {};
  for (const team of teams) {
    colorMap[team.name] = getTeamColors(team);
  }
  return colorMap;
}
