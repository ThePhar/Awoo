import Team from "./team"

enum Color {
  Default      = 0xEEEEEE,
  VillagerBlue = 0x0000FF,
  WerewolfRed  = 0xFF0000
}

export default Color

export function colorFromTeam(team: Team): Color {
  switch (team) {
    case Team.Villagers:
      return Color.VillagerBlue
    case Team.Werewolves:
      return Color.WerewolfRed
  }
}
