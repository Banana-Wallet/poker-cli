# Texas Holdem Poker

CLI based Texas Holdem Poker Game!

# Commands 

Command: `init`: To intialize poker game, Anyone can initialize poker game among the participating players.
Flags: 
- `playerNo [Required]`: Specify player number on the poker table. Used as `--playerNo 1` 

Command: `action`: To make an action during the game which could be (call, check, raise, big, small)
Flags
- `playerNo [Required]`: Specify your number on the poker table. 
- `action [Required]`: Specify what action you want to take in your turn values could be `call`, `check`, `raise`, `big`, `small`. `Small` and `big` action are turn based actions. Used as `--action call`
- `raiseAmount [Optional]`: Specify the amont you wanna raise, Used only in case of raise action. Used as `--raiseAmount 50`

Command: `show`: To see what all cards you hold in the game
Flags: 
- `playerNo [Required]`: Specify player number on the poker table 

Command: `status`: Show the current game status (pot value, highest chips, current round, turn etc).