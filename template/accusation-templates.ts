import Player from '../struct/player';

const AccusationTemplate = {
  success: (accuser: Player, accused: Player): string => `${accuser} has voted to lynch ${accused}.`,

  /* Failure messages */
  selfLynch: (accuser: Player): string => `${accuser} cannot vote to lynch yourself.`,
  ghostLynch: (accuser: Player): string => `${accuser} cannot vote to lynch players when you are eliminated.`,
  deadLynch: (accuser: Player): string => `${accuser} cannot vote to lynch eliminated players.`,
  nonDayLynch: (accuser: Player): string => `${accuser} cannot vote to lynch players outside the day phase.`,
};

export default AccusationTemplate;
