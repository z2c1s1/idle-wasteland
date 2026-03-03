/**
 * Calculates the player's level based on current XP.
 * Formula: Level = floor(sqrt(xp)) + 1
 */
export const calculateLevel = (xp: number): number => {
  if (xp < 0) return 1;
  return Math.floor(Math.sqrt(xp)) + 1;
};

/**
 * Calculates how much total XP is required for a specific level.
 * Formula: XP = (Level - 1)^2
 */
export const xpForLevel = (level: number): number => {
  return Math.pow(level - 1, 2);
};

/**
 * Gets the progress percentage (0-100) to the next level.
 */
export const levelProgress = (xp: number): number => {
  const currentLevel = calculateLevel(xp);
  const currentLevelXp = xpForLevel(currentLevel);
  const nextLevelXp = xpForLevel(currentLevel + 1);
  
  const xpIntoLevel = xp - currentLevelXp;
  const xpRequiredForNext = nextLevelXp - currentLevelXp;
  
  if (xpRequiredForNext === 0) return 100;
  return Math.min(100, Math.max(0, (xpIntoLevel / xpRequiredForNext) * 100));
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};
