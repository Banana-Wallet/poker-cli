import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Game } from './game';

export const cliCommands = (game: Game) => {
    yargs(hideBin(process.argv))
    .command('init', 'Initialize a new game', () => {}, (argv) => {
        game._initGame();
    })
    .command('deal', 'Deal a new hand', () => {}, (argv) => {
        console.log('Dealing a new hand');
    })
    .command('show', 'Show current hand', () => {}, (argv) => {
        console.log('Show current hand');
    })
    .demandCommand(1, 'You must provide a valid command.')
    .help()
    .argv;
}