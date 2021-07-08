import rand from "random-item";

const tips = [
    "You can get help commands by typing /awoo help.",
    "Phar likes to order Chipotle, but really shouldn't, because he's always broke.",
    "Cainsith was like a second father. Keyword: `was.`",
    "Everytime I crash, I grow stronger! At least that's what Phar tells me.",
    "I think Dori is a pretty cool guy. Eh streams games and doesnt afraid of anything.",
    "You are not forced to accuse any player. Although, it's usually in your best interest to.",
    "The tanner wins on any type of elimination. Be careful who you eliminate, werewolf or villager.",
    "Not all villagers are on your team. Be careful who you trust.",
];

export default function Tip(): string {
    return `Tip: ${rand(tips)}`;
}
