import { PokerGameProxyFactory, PokerGameProxy__factory, PokerGameSingleton__factory, PokerGameProxyFactory__factory, PokerGameSingleton } from "../types";
import { AddressLike, ethers, JsonRpcApiProvider, Signer } from "ethers";
// import { ethers as hardhatEthers } from "hardhat";
import { GameParams, GameContracts } from "./types";

export class Game {

    jsonRpcProvider: JsonRpcApiProvider;
    pokerGameSingletonAddress: AddressLike;
    pokerGameProxyFactoryAddress: AddressLike;
    playerAccounts!: Signer[]; //! TODO fix type here

    constructor(
        params: GameParams
    ) {
        const { rpcUrl, pokerGameSingletonAddress, pokerGameProxyFactoryAddress } = params;
        this.jsonRpcProvider = new ethers.JsonRpcProvider(rpcUrl);
        this.pokerGameSingletonAddress = pokerGameSingletonAddress;
        this.pokerGameProxyFactoryAddress = pokerGameProxyFactoryAddress;
    }

    private _getGameContracts = (signer: ethers.Wallet): GameContracts => {
        let pokerGameSingleton = PokerGameSingleton__factory.connect(this.pokerGameSingletonAddress.toString(), signer);
        let pokerGameProxyFactory = PokerGameProxyFactory__factory.connect(this.pokerGameProxyFactoryAddress.toString(), signer);
        return { pokerGameSingleton, pokerGameProxyFactory };
    }

    _initGame = async (signer: ethers.Wallet, players: string[]) => {
        const gameContract: GameContracts = this._getGameContracts(signer);
        const pokerGameSingleton = gameContract.pokerGameSingleton.connect(signer);
        // initializing the game
        await pokerGameSingleton.initialize(players);
    }

    _action = async (signer: ethers.Wallet, _action: string, _raiseAmount: number) => {
        console.log('take some actions');
        // for now considering raise amount would only pitch in case of raise action
        const gameContract: GameContracts = this._getGameContracts(signer);
        const pokerGameSingleton = gameContract.pokerGameSingleton.connect(signer);
        // taking action
        
        if (_action === 'check') {
            const checkAction = ethers.toBigInt(0);
            await pokerGameSingleton.playHand(checkAction, 0);
        } else if (_action === 'call') {
            const callAction = ethers.toBigInt(1);
            await pokerGameSingleton.playHand(callAction, 0);
        } else if (_action === 'raise') {
            const raiseAction = ethers.toBigInt(2);
            await pokerGameSingleton.playHand(raiseAction, _raiseAmount);
        } else {
            throw new Error('Invalid action');
        }
    }
}
