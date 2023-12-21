import assert from 'assert';

import { Card, RelicCard, Room } from './types';

const USE_RELICS = true;

const relicCards: RelicCard[] = [
    { type: 'relic', value: 5 },
    { type: 'relic', value: 7 },
    { type: 'relic', value: 8 },
    { type: 'relic', value: 10 },
    { type: 'relic', value: 12 }
];

const baseDeck: Card[] = [
    { type: 'points', value: 17 },
    { type: 'points', value: 15 },
    { type: 'points', value: 14 },
    { type: 'points', value: 13 },
    { type: 'points', value: 11 },
    { type: 'points', value: 11 },
    { type: 'points', value: 9 },
    { type: 'points', value: 7 },
    { type: 'points', value: 7 },
    { type: 'points', value: 5 },
    { type: 'points', value: 5 },
    { type: 'points', value: 4 },
    { type: 'points', value: 3 },
    { type: 'points', value: 2 },
    { type: 'points', value: 1 },
    { type: 'trap', trap: 'boulder' },
    { type: 'trap', trap: 'boulder' },
    { type: 'trap', trap: 'boulder' },
    { type: 'trap', trap: 'fire' },
    { type: 'trap', trap: 'fire' },
    { type: 'trap', trap: 'fire' },
    { type: 'trap', trap: 'log' },
    { type: 'trap', trap: 'log' },
    { type: 'trap', trap: 'log' },
    { type: 'trap', trap: 'snake' },
    { type: 'trap', trap: 'snake' },
    { type: 'trap', trap: 'snake' },
    { type: 'trap', trap: 'spider' },
    { type: 'trap', trap: 'spider' },
    { type: 'trap', trap: 'spider' }
];

const createDeck = (room: Room): Card[] => {
    const result = [...baseDeck];

    for (const card of room.data.removedCards) {
        const index = result.indexOf(card);
        result.splice(index, 1);
    }

    if (USE_RELICS) result.push(relicCards[room.data.roundsDone % 5]);

    return result;
};

const handleDraw = (room: Room): void => {
    assert(room.data.roundInProgress);
    const round = room.data.currentRound;

    const index = Math.floor(Math.random() * round.deck.length);
    const card = round.deck.splice(index, 1)[0];

    if (card.type === 'points') {
        const numPlayers = room.data.currentRound.players.length;
        if (card.value >= numPlayers) {
            const pointsPerPlayer = Math.floor(card.value / numPlayers);
            room.data.currentRound.pointsPerPlayer += pointsPerPlayer;
            room.data.currentRound.pointsOnGround += card.value - numPlayers * pointsPerPlayer;
        }
    } else if (card.type === 'trap') {
        const found = round.inPlay.filter((inPlayCard) => inPlayCard.type === 'trap' && inPlayCard.trap === card.trap);
        if (found.length > 0) {
            room.data = {
                ...room.data,
                roundInProgress: false,
                removedCards: room.data.removedCards.concat(card),
                roundsDone: room.data.roundsDone + 1,
                currentRound: null
            };
            return;
        }
    }
    round.inPlay.push(card);
};

export const handleVotes = (room: Room): void => {
    assert(room.data.roundInProgress);

    const round = room.data.currentRound;
    const numLeave = Object.values(round.votes).filter((vote) => vote === 'leave').length;

    for (const [player, vote] of Object.entries(round.votes)) {
        if (vote === 'leave') {
            // Not actually this type but doesn't break anything
            round.players = round.players.filter((rplayer) => rplayer !== player) as [string, ...string[]];

            room.data.players[player] += round.pointsPerPlayer + Math.floor(round.pointsOnGround / numLeave);
            if (numLeave === 1) {
                for (const card of round.inPlay) {
                    if (card.type === 'relic') {
                        room.data.players[player] += card.value;
                        room.data.removedCards.push(card);
                    }
                }
                round.inPlay = round.inPlay.filter((card) => card.type !== 'relic');
            }
        }
    }

    if (round.players.length === 0) {
        room.data = {
            ...room.data,
            roundsDone: room.data.roundsDone + 1,
            roundInProgress: false,
            currentRound: null
        };
    } else {
        room.data.currentRound = {
            ...round,
            votes: {},
            pointsOnGround: numLeave === 0 ? round.pointsOnGround : round.pointsOnGround % numLeave
        };
        handleDraw(room);
    }
};

export const startGame = (room: Room): Room => {
    assert(!room.data.gameInProgress);
    return { ...room, data: { ...room.data, gameInProgress: true } };
};

export const startRound = (room: Room): Room => {
    assert(room.data.gameInProgress && !room.data.roundInProgress);
    assert(Object.keys(room.data.players).length > 0);

    const roundPoints: { [key: string]: number } = {};
    for (const player of Object.keys(room.data.players)) roundPoints[player] = 0;

    let newRemovedCards = room.data.removedCards;
    if (room.data.roundsDone % 5 === 0) newRemovedCards = [];
    const newRoom: Room = {
        ...room,
        data: {
            ...room.data,
            roundInProgress: true,
            removedCards: newRemovedCards,
            currentRound: {
                deck: createDeck(room),
                inPlay: [],
                votes: {},
                players: Object.keys(room.data.players) as [string, ...string[]],
                pointsPerPlayer: 0,
                pointsOnGround: 0
            }
        }
    };
    handleDraw(newRoom);
    return newRoom;
};

// export const handleVote
