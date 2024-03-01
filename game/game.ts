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
        await pokerGameSingleton.initialize(players);
    }

    _action = async (signer: ethers.Wallet, _action: string, _raiseAmount: number) => {
        console.log('take some actions');
        const gameContract: GameContracts = this._getGameContracts(signer);
        const pokerGameSingleton = gameContract.pokerGameSingleton.connect(signer);
        // taking action
        if (_action === 'check') {
            const checkAction = ethers.toBigInt(1);
            await pokerGameSingleton.playHand(checkAction, ethers.toBigInt(0));
        } else if (_action === 'call') {
            const callAction = ethers.toBigInt(2);
            await pokerGameSingleton.playHand(callAction, ethers.toBigInt(0));
        } else if (_action === 'raise') {
            const raiseAction = ethers.toBigInt(3);
            await pokerGameSingleton.playHand(raiseAction, ethers.toBigInt(_raiseAmount));
        } else {
            throw new Error('Invalid action');
        }
    }

    _playerStats = async (signer: ethers.Wallet) => {
        const gameContract: GameContracts = this._getGameContracts(signer);
        const playerAddress = signer.address;

        const playerCard1 = await gameContract.pokerGameSingleton.playerCards(playerAddress, ethers.toBigInt(0));
        const playerCard2 = await gameContract.pokerGameSingleton.playerCards(playerAddress, ethers.toBigInt(1));

        const CARDTYPES = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];

        const cardNumberP1 = playerCard1[0].toString();
        const cardTypeP1 = playerCard1[1].toString();
        const cardNumberP2 = playerCard2[0].toString();
        const cardTypeP2 = playerCard2[1].toString();

        console.log(`Card 1: ${cardNumberP1.toString()} of ${CARDTYPES[Number(cardTypeP1.toString())]}`);
        console.log(`Card 2: ${cardNumberP2.toString()} of ${CARDTYPES[Number(cardTypeP2.toString())]}`);

        const playerChips = await gameContract.pokerGameSingleton.chips(playerAddress);
        console.log('Your Chips: ', playerChips.toString());
    }

    _gameStatus = async (signer: ethers.Wallet) => {
        const gameContract: GameContracts = this._getGameContracts(signer);
        const gameStatus = await gameContract.pokerGameSingleton.pokerTableStatus();
        const currentRound = gameStatus[0].toString();
        const currentRoundStatus = await gameContract.pokerGameSingleton.pokerRoundStatus(currentRound);
        console.log('Current Round: ', currentRound);
        console.log("Total Pot Value: ", gameStatus[4].toString());
        if (gameStatus[8]) {
            console.log('Game Ended');
            console.log('Below are everyone\'s final points: ');
            for (let i = 0; i < gameStatus[9].length; i++) {
                console.log(`Player ${i + 1}: ${gameStatus[9][i].toString()}`);
            }
        }
        console.log('Current Turn: ', currentRoundStatus[0].toString());
        console.log('Highest Chips: ', currentRoundStatus[1].toString());
        console.log('Chips by Players in this round ');
        for (let i = 0; i < currentRoundStatus[2].length; i++) {
            console.log(`Player ${i + 1}: ${currentRoundStatus[2][i].toString()}`);
        }
    }
}
