// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.7.0 <0.9.0;

import "../interfaces/IPokerGameSingleton.sol";

contract PokerGameSingleton is IPokerGameSingleton {
    mapping(address => uint) public chips;
    mapping(address => Card[2]) public playerCards;

    address[] public players; // 0 -> small blind, 1 -> big blind and so on

    Card[5] public hiddenCards; // cards which are hidden
    Card[52] public deck; // deck of cards

    PokerTable public pokerTable;
    mapping(uint8 => PokerRound) public pokerRounds;
    // for now cards 14 -> ace, 13 -> king, 12 -> queen, 11 -> jack, 2-10 -> 2-10

    uint8 public remainingCards = 52;

    function initialize(address[] memory _players) external {
        // setting somethings here
        // initialize a poker table
        pokerTable = PokerTable({
            currentRound: 0,
            buyInAmount: 100,
            maxPlayers: 5,
            players: _players,
            potValue: 0,
            bigBlind: 10,
            smallBlind: 5,
            playerChips: new uint128[](100), // initially all players would be given 5 chips to play
            gameEnded: false,
            finalPoints: new uint128[](0)
        });

        pokerRounds[0] = PokerRound({
            currentTurn: 0,
            highestChips: 0,
            chips: new uint128[](0), // chips by player in the current round
            gamePlayers: _players
        });

        //  initialize the deck
        _initializeDeck();

        // deal card
        _dealCards(_players);

        // allot chips
        _allotChips(_players);
    }

    function _initializeDeck() internal {
        uint8 index = 0;
        for (uint8 i = 0; i < 4; i++) {
            for (uint8 j = 2; j <= 14; j++) {
                deck[index] = Card(j, CardType(i));
                index++;
            }
        }
    }

    function _dealCards(address[] memory _players) internal {
        require(remainingCards >= 8, "Not enough cards remaining in the deck.");

        for (
            uint8 _dealtCardIndex = 0;
            _dealtCardIndex < 2;
            _dealtCardIndex++
        ) {
            for (
                uint8 _playerIndex = 0;
                _playerIndex < _players.length;
                _playerIndex++
            ) {
                uint256 randIndex = uint256(
                    keccak256(
                        abi.encodePacked(
                            block.timestamp,
                            block.prevrandao,
                            _dealtCardIndex
                        )
                    )
                ) % remainingCards;
                uint8 randCardIndex = uint8(randIndex);
                playerCards[_players[_playerIndex]][_dealtCardIndex] = deck[
                    randCardIndex
                ];
                _removeCardFromDeck(randCardIndex);
            }
        }

        for (
            uint8 _hiddenCardIndex = 0;
            _hiddenCardIndex < 5;
            _hiddenCardIndex++
        ) {
            uint256 randIndex = uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.prevrandao,
                        _hiddenCardIndex
                    )
                )
            ) % remainingCards;
            uint8 randCardIndex = uint8(randIndex);
            hiddenCards[_hiddenCardIndex] = deck[randCardIndex];
            _removeCardFromDeck(randCardIndex);
        }
    }

    function _allotChips(address[] memory _players) internal {
        for (
            uint8 _playerIndex = 0;
            _playerIndex < _players.length;
            _playerIndex++
        ) {
            chips[_players[_playerIndex]] = 100; // alloting 100 chips to each player to play
        }
    }

    function _removeCardFromDeck(uint8 index) internal {
        if (index != remainingCards - 1) {
            deck[index] = deck[remainingCards - 1];
        }
        delete deck[remainingCards - 1];
        remainingCards--;
    }

    function playHand(PlayerAction _action, uint128 _raiseAmount) external {
        PokerRound storage _currentPokerRound = pokerRounds[
            pokerTable.currentRound
        ];
        require(
            _currentPokerRound.gamePlayers[_currentPokerRound.currentTurn] ==
                msg.sender,
            "Not your turn to play"
        );
        // no fold for now
        require(
            _action != PlayerAction.FOLD,
            "Folding is not allowed in this version"
        );

        if (_action == PlayerAction.CALL) {
            _callAction();
        } else if (_action == PlayerAction.RAISE) {
            _raiseAction(_raiseAmount);
        } else if (_action == PlayerAction.CHECK) {
            _checkAction();
        }

        _endRound();
    }

    function _callAction() internal {
        PokerRound storage _currentPokerRound = pokerRounds[
            pokerTable.currentRound
        ];
        uint128 _callAmount = _currentPokerRound.highestChips - 
        _currentPokerRound.chips[_currentPokerRound.currentTurn];
        require(
            chips[msg.sender] >= _callAmount,
            "Not enough chips to call"
        );
        chips[msg.sender] -= _callAmount;
        pokerTable.potValue += _callAmount;
    }

    function _raiseAction(uint128 _raiseAmount) internal {
        PokerRound storage _currentPokerRound = pokerRounds[
            pokerTable.currentRound
        ];
        require(
            _raiseAmount > _currentPokerRound.highestChips,
            "Raise amount should be greater than the highest raise"
        );
        uint128 _callAmount = _currentPokerRound.highestChips -
            _currentPokerRound.chips[_currentPokerRound.currentTurn];
        require(
            chips[msg.sender] >= _callAmount + _raiseAmount,
            "Not enough chips to raise"
        );
        chips[msg.sender] -= (_callAmount + _raiseAmount);
        pokerTable.potValue += (_callAmount + _raiseAmount);
        _currentPokerRound.highestChips =
            _currentPokerRound.chips[_currentPokerRound.currentTurn] +
            _callAmount +
            _raiseAmount;
    }

    function _checkAction() internal view {
        PokerRound storage _currentPokerRound = pokerRounds[
            pokerTable.currentRound
        ];
        for (uint8 i = 0; i < _currentPokerRound.gamePlayers.length; i++) {
            if (_currentPokerRound.chips[i] > 0) {
                require(false, "Check is not possible");
            }
        }
    }

    function _raiseOrNot(
        uint128[] memory _chips
    ) internal pure returns (bool _raise) {
        uint128 _chip = _chips[0];
        _raise = true;
        for (uint i = 0; i < _chips.length; i++) {
            if (_chips[i] != _chip) {
                _raise = false;
                break;
            }
        }
    }

    function _updateTurn(
        uint8 _currentTurn,
        uint _totalLength
    ) internal pure returns (uint8) {
        if (_currentTurn == _totalLength - 1) {
            return 0;
        } else {
            return _currentTurn + 1;
        }
    }

    function _endRound() internal {
        PokerRound storage _currentPokerRound = pokerRounds[
            pokerTable.currentRound
        ];
        uint _noOfPlayers = _currentPokerRound.gamePlayers.length;
        bool isLevelGame = _raiseOrNot(_currentPokerRound.chips);

        // no raise
        if (isLevelGame) {
            if (pokerTable.currentRound == 3) {
                pokerTable.gameEnded = true;
                _allotPoints();
            }
            else if (_currentPokerRound.currentTurn == _noOfPlayers - 1) {
                pokerTable.currentRound++;
                pokerRounds[pokerTable.currentRound] = PokerRound({
                    currentTurn: 0,
                    highestChips: 0,
                    chips: new uint128[](0), // chips by player in the current round
                    gamePlayers: _currentPokerRound.gamePlayers
                });
            }
        } else {
            _currentPokerRound.currentTurn = _updateTurn(
                _currentPokerRound.currentTurn,
                _noOfPlayers
            );
        }
    }

    function pokerTableStatus() external view returns (PokerTable memory) {
        return pokerTable;
    }

    function pokerRoundStatus(uint8 _round) external view returns (PokerRound memory) {
        return pokerRounds[_round];
    }

    // added just for testing for now can be called by anyone
    function resetGame() external {
        delete pokerTable;
        delete pokerRounds[0];
        delete deck;
        delete hiddenCards;
        delete players;
        remainingCards = 52;
    }

    function _allotPoints() internal {
        // for now just allotting 100 points to all players
        for (uint8 i = 0; i < pokerTable.players.length; i++) {
            pokerTable.finalPoints[i] = 100;
        }
    }
}
