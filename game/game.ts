import { PokerGameProxyFactory, PokerGameSingleton, PokerGameProxy__factory, PokerGameSingleton__factory, PokerGameProxyFactory__factory } from "../types";
import { AddressLike, ethers, JsonRpcApiProvider } from "ethers";
import { GameParams } from "./types";

export class Game {

    jsonRpcProvider: JsonRpcApiProvider;
    pokerGameSingletonAddress: AddressLike;
    pokerGameSingleton: PokerGameSingleton;
    pokerGameProxyFactoryAddress: AddressLike;
    pokerGameProxyFactory: PokerGameProxyFactory;

    constructor(
        params: GameParams
    ) {
        const { rpcUrl, pokerGameSingletonAddress, pokerGameProxyFactoryAddress } = params;
        this.jsonRpcProvider = new ethers.JsonRpcProvider(rpcUrl);
        this.pokerGameSingletonAddress = pokerGameSingletonAddress;
        this.pokerGameSingleton = PokerGameSingleton__factory.connect(pokerGameSingletonAddress.toString(), this.jsonRpcProvider);
        this.pokerGameProxyFactoryAddress = pokerGameProxyFactoryAddress;
        this.pokerGameProxyFactory = PokerGameProxyFactory__factory.connect(pokerGameProxyFactoryAddress.toString(), this.jsonRpcProvider);
    }

    _initGame = async () => {
        console.log('Game Initialized')
    }

    _action = async () => {
        console.log('take some actions');
    }
}
