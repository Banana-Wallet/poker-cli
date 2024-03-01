import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Game } from './game';
import { Signer, ethers, ripemd160 } from 'ethers';

const pvKey1 = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const pvKey2 = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d';
const pvKey3 = '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a';
const pvKey4 = '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6';
const jsonRpcProvider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');

const player1 = new ethers.Wallet(pvKey1, jsonRpcProvider);
const player2 = new ethers.Wallet(pvKey2, jsonRpcProvider);
const player3 = new ethers.Wallet(pvKey3, jsonRpcProvider);
const player4 = new ethers.Wallet(pvKey4, jsonRpcProvider);

const getWallet = (playerNo: number): ethers.Wallet => {
    switch (playerNo) {
        case 1:
            return player1;
        case 2:
            return player2;
        case 3:
            return player3;
        case 4:
            return player4;
        default:
            throw new Error('Invalid player number');
    }
}

export const cliCommands = (game: Game) => {

    const choosePlayer = (yargs: any) => {
        return yargs.options({
            playerNo: {
                describe: 'Player no in the game (according to the seating)',
                demandOption: true,
                type: 'number',
            },
        });
    }

    const actionBuilder = (yargs: any) => {
        return yargs.options({
            playerNo: {
                describe: 'Player no in the game (according to the seating)',
                demandOption: true,
                type: 'number',
            },
            action: {
                describe: 'Which action you want to take',
                type: 'string',
            },
            raiseAmount: {
                describe: 'Amount to raise',
                type: 'number',
            }
        });
    };

    yargs(hideBin(process.argv))
        .command('init', 'Initialize a new game', choosePlayer, (argv) => {
            const wallet = getWallet(argv.playerNo as number);
            console.log('Got wallet', wallet);
            game._initGame(wallet, [player1.address, player2.address, player3.address, player4.address]);
            console.log("inside init ");
            console.log('Extra arguments ', argv);
        })
        .command('action', 'Take some game action (raise, call, check, big, small)', actionBuilder, (argv) => {
            const wallet = getWallet(argv.playerNo as number);
            const action = argv.action as string;
            const raiseAmount = argv.raiseAmount as number || 0;
            console.log('action and amount ', raiseAmount, action);
            game._action(wallet, action, raiseAmount);
        })
        .command('show', 'Show current hand', choosePlayer, (argv) => {
            const wallet = getWallet(argv.playerNo as number);
            game._playerStats(wallet);
        })
        .command('status', 'Shows current game status', () => {}, (argv) => {
            const wallet = getWallet(1);
            game._gameStatus(wallet);
        })
        .demandCommand(1, 'You must provide a valid command.')
        .help()
        .argv;
}