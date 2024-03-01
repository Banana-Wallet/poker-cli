import { AddressLike } from "ethers";

export type GameParams = {
    rpcUrl: string;
    pokerGameSingletonAddress: AddressLike;
    pokerGameProxyFactoryAddress: AddressLike;
}
