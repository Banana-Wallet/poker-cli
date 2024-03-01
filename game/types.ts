import { AddressLike } from "ethers";
import { PokerGameProxyFactory, PokerGameSingleton } from "../types";

export type GameParams = {
    rpcUrl: string;
    pokerGameSingletonAddress: AddressLike;
    pokerGameProxyFactoryAddress: AddressLike;
}

export type GameContracts = {
    pokerGameSingleton: PokerGameSingleton;
    pokerGameProxyFactory: PokerGameProxyFactory;
}