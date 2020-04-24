import Player from '../structs/player';

const AccusationTemplate = {
  success: (accused: Player): string => `You are now voting to lynch ${accused}.`,

  /* Failure messages */
  selfLynch: (): string => 'You cannot vote to lynch yourself.',
  ghostLynch: (): string => 'You cannot vote to lynch players when you are eliminated.',
  deadLynch: (): string => 'You cannot vote to lynch eliminated players.',
  nonDayLynch: (): string => 'You cannot vote to lynch players outside the day phase.',
};

export default AccusationTemplate;
