# Awoo ![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/ThePhar/awoo)

An automated real-time Werewolf game manager and moderator for Discord servers.

## What is this project?

Awoo is a discord bot that manages multiple games of Werewolf over a period of actual days and nights to give players 
the freedom to interact in the game throughout the day.

I created this project because I've been interested in running a Werewolf/Mafia-style game, but getting time to have
all of my friends sit down and put aside at least an hour to play has been getting increasing harder to accomplish with
all the responsibilities we have, so I created a bot to manage a game over the course of a real day.

## Roles
### Villagers 
![Villager](https://cdn.discordapp.com/attachments/663423717753225227/666427023765536799/villager_t.png)

Villagers are basic Villager team roles that have no special actions.

### Werewolves
![Werewolf](https://cdn.discordapp.com/attachments/663423717753225227/666427025887854596/werewolf_t.png)

Werewolves are Werewolf team roles that, once per night, choose a player to eliminate. They win when they outnumber the remaining villagers.

### Seers
![Seer](https://cdn.discordapp.com/attachments/663423717753225227/666427035228307493/seer.png)

Seers are Villager team roles that can, once per night, inspect a player to learn if they are a villager or a werewolf. They are a large threat to the Werewolves.

### Mayors
![Mayor](https://cdn.discordapp.com/attachments/663423717753225227/666427033936592924/mayor.png)

Mayors are Villager team roles that are counted twice during lynching votes. That's how democracy works after all.

### Lycans
![Lycan](https://cdn.discordapp.com/attachments/663423717753225227/666427032007344149/lycan.png)

Lycans are Villager team roles that are for all intents and purposes normal villagers, but they appear to the seer as a werewolf.

### Bodyguards
![Bodyguard](https://cdn.discordapp.com/attachments/663423717753225227/666427028823605258/bodyguard.png)

Bodyguards are Villager team roles that, once per night, can protect a villager from elimination by the werewolves. They can even protect themselves!

### Tanner
![Tanner](https://cdn.discordapp.com/attachments/663423717753225227/666427021949141035/tanner.png)

The Tanner hates his job and hates his life. He only wins if he is eliminated. Take care not to eliminate him, werewolf or villager!

### Princes
![Prince](https://cdn.discordapp.com/attachments/429907716165730308/705540425573859378/prince.png)

The Prince is a Villager team role that for all intents and purposes is a normal villager, but if they are voted to get lynched, they reveal their role and are not eliminated.

### Sorceresses
![Sorceress](https://media.discordapp.net/attachments/663423717753225227/666427037384441856/sorceress.png)

The Sorceress is a Werewolf team villager that is aiming to assist the Werewolves. They, like the seer, can inspect a player each night to determine if they are the Seer. They WANT the werewolves to win! 

### Masons
![Mason](https://cdn.discordapp.com/attachments/429907716165730308/668771401028861962/mason.png)

The Masons are Villager team roles that are a part of a secret society that know who each other are. They are the only villagers they can trust.

### Hunters
![Hunter](https://media.discordapp.net/attachments/663423717753225227/666427030245736472/hunter.png)

The Hunter is a Villager team role that can take a player out with them if they get eliminated. Better be careful who you lynch or eliminate.

### Witches
![Witch](https://media.discordapp.net/attachments/663423717753225227/666427027389415444/witch.png)

The witch is a Villager team role that can, once per game, save any player targeted by werewolf elimination or kill any player of their choosing.

## Features

I am currently in the process of refactoring this application, but I plan for all of these features in the **1.0** release of this build:

- No need for a moderator as all game management is handled by the bot.
- Real day and night cycle, so you have plenty of time to interact in the game once you are free.
- 20+ different roles for wildly different games each time you play.
- Configurable by server administrator to tweak most game settings on a per server basis.
- Games are saved server side so in the event of a failure, your game is safe and will pick back up where it left off when it restores.
- Ability to see an overview of a game through the **[Awoo.io](https://awoo.io)** website outside of Discord.

## Powered By

This project is powered by **Node.js** utilizing the **Discord.js** library. Developed in **TypeScript**.
