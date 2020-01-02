const Titles = {
  // Phase Titles
  LOBBY:        ()          => `New Werewolf Game`,
  FIRST_DAY:    ()          => `Day 0`,
  DAY_START:    (gameState) => `Day ${gameState.meta.day}`,
  NIGHT_START:  (gameState) => `Night ${gameState.meta.day}`,
  TRIAL_START:  (accused)   => `Trial of ${accused.name}`,

  // Elimination Titles
  NO_ELIMINATION:       ()           => `Everyone is Safe... For Now`,
  WEREWOLF_ELIMINATION: (eliminated) => `${eliminated.name} Has Been Torn to Shreds`,
  LYNCH_ELIMINATION:    (lynched)    => `${lynched.name} Has Been Lynched`,

  // Trial Results Titles
  ACQUITTED: (acquitted) => `${acquitted.name} Has Been Acquitted... For Now`,

  // Victory Titles
  WEREWOLF_VICTORY: () => `A Blood Moon - Werewolves Win`,
  VILLAGER_VICTORY: () => `A Calm Day - Villagers Win`,

  // Role Titles
  VILLAGER_ROLE: () => `You Are A Villager`,
  WEREWOLF_ROLE: () => `You Are A Werewolf`,
  SEER_ROLE:     () => `You Are A Seer`,

  // Night Action Titles
  WEREWOLF_NIGHT_ACTION: () => `On the Dinner Menu`,
  SEER_NIGHT_ACTION:     () => `Look Into the Crystal Ball`,

  // Rules
  RULES_PART_1: () => `How to Play and What to Expect`,
  RULES_PART_2: () => `How to Play and What to Expect (continued)`,
};

module.exports = Titles;
