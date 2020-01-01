const Commands = {
  JOIN:     "!join",      // Complete
  LEAVE:    "!leave",     // Complete
  STATUS:   "!status",
  RULES:    "!rules",     // Complete
  CONFIRM:  "!confirm",   // Complete
  ROLE:     "!role",      // Complete
  ACCUSE:   "!accuse",    // Complete
  LYNCH:    "!lynch",     // Complete
  ACQUIT:   "!acquit",    // Complete
  TARGET:   "!target",    // Complete

  // For development purposes only.
  DEBUG:    "!debug",

  // Helper functions
  Example:         (command) => `\`${command}\``,
  TargetedExample: (command) => `\`${command} <name>\``,
};

module.exports = Commands;
