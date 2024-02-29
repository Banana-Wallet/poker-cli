// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.7.0 <0.9.0;

interface IPokerGameSingleton {

    enum CardType {
        SPADE,
        HEART,
        DIAMOND,
        CLUB
    }

    enum PlayerAction {
        FOLD,
        CHECK,
        CALL, // matching the bet 
        RAISE
    }

    struct PokerTable {
        // uint totalHands; // total Hands till now
        uint8 currentRound; // index of the current round
        uint128 buyInAmount;
        uint8 maxPlayers;
        address[] players;
        uint128 potValue;
        uint8 bigBlind;
        uint8 smallBlind;
        uint128[] playerChips; // chips for each player
        // IERC20 token; // the token to be used to play in the table
    }

    // Round related stats 
    struct PokerRound {
        // index of the player who has current turn 
        uint8 currentTurn;
        // current highest chip of the round
        uint128 highestChips;
        // amount of chips each player has putted in the round
        uint128[] chips;
        // player who are still playing and not folded 
        address[] gamePlayers;
    }

    struct Card {
        uint8 number;
        CardType cardType;
    }

}