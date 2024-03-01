import { cliCommands } from './game/cli';
import { Game } from './game/game';
import { GameParams } from './game/types';

(async () => {
    const gameParams: GameParams = {
        rpcUrl: 'http://localhost:8545',
        pokerGameSingletonAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        pokerGameProxyFactoryAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3'
    }

    // define players over here and link those to terminal 
    const game = new Game(gameParams);
    cliCommands(game);
})()
