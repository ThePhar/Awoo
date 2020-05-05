import TeamsInPlay from "../enum/teams-in-play"

type Field = {
  name: string;
  value: string | string[];
  inline?: boolean;
}

const eliminateWerewolves = (): string =>
  "You must also eliminate the werewolves."
const eliminateVampires = (): string =>
  "You must also eliminate the vampires."

export const villagerObjective = (teamsInPlay: TeamsInPlay): string => {
  switch (teamsInPlay) {
    case TeamsInPlay.WerewolvesOnly:
      return "Find the werewolves, then eliminate them."
    case TeamsInPlay.VampiresOnly:
      return "Find the vampires, then eliminate them."
    case TeamsInPlay.Both:
      return "Find both werewolves and vampires, then eliminate them."
  }
}

export const werewolfObjective = (vampires: boolean): string =>
  `Eliminate villagers until the werewolves outnumber the villagers. ${ vampires ? eliminateVampires() : "" }`

export const vampireObjective = (werewolves: boolean): string =>
  `Eliminate villagers until the vampires outnumber the villagers. ${ werewolves ? eliminateWerewolves() : "" }`

export const tannerObjective = (): string =>
  "Get yourself eliminated."

export const cultLeaderObjective = (): string =>
  "Indoctrinate all living players into your cult."

export const loneWolfObjective = (): string =>
  "Eliminate everyone and be the last one alive or reach parity with one other player."

export const cupidObjective = (): string =>
  "Eliminate everyone, until you and your lover are the only living players."
