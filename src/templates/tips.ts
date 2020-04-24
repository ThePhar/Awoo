import rand from 'random-item';

const tips = [
  'You can make private accusations via DM with the bot.',
  "Zach likes to order Chipotle, but really shouldn't, because he's always broke.",
  'Travis was like a second father. Keyword: `was.`',
];

export default function Tip(): string {
  return `Tip: ${rand(tips)}`;
}
