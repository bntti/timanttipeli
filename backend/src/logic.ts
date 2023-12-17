import assert from 'assert';

import { Card, Room } from './types';

const USE_RELICS = true;

const baseDeck: Card[] = [
    { type: 'points', value: 17 },
    { type: 'points', value: 15 },
    { type: 'points', value: 13 },
    { type: 'points', value: 11 },
    { type: 'points', value: 10 },
    { type: 'points', value: 9 },
    { type: 'points', value: 9 },
    { type: 'points', value: 8 },
    { type: 'points', value: 7 },
    { type: 'points', value: 6 },
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

    if (USE_RELICS) result.push({ type: 'relic', value: 5 + (room.data.roundsDone % 5) * 2 });

    return result;
};

const handleDraw = (room: Room): Room => {
    assert(room.data.roundInProgress);
    const newDeck = [...room.data.currentRound.deck];
    const newInPlay = [...room.data.currentRound.inPlay];
    let newPoints = room.data.currentRound.pointsPerPlayer;
    let newGroundPoints = room.data.currentRound.pointsOnGround;

    const index = Math.floor(Math.random() * newDeck.length);
    const card = newDeck.splice(index, 1)[0];

    if (card.type === 'points') {
        const numPlayers = room.data.currentRound.players.length;
        if (card.value >= numPlayers) {
            const pointsPerPlayer = Math.floor(card.value / numPlayers);
            newPoints += pointsPerPlayer;
            newGroundPoints += card.value - numPlayers * pointsPerPlayer;
        }
    } else if (card.type === 'trap') {
        const found = newInPlay.filter((inPlayCard) => inPlayCard.type === 'trap' && inPlayCard.trap === card.trap);
        if (found.length > 0) {
            return {
                ...room,
                data: {
                    ...room.data,
                    roundInProgress: false,
                    removedCards: room.data.removedCards.concat(card),
                    roundsDone: room.data.roundsDone + 1,
                    currentRound: null
                }
            };
        }
    }
    newInPlay.push(card);

    return {
        ...room,
        data: {
            ...room.data,
            currentRound: {
                ...room.data.currentRound,
                deck: newDeck,
                inPlay: newInPlay,
                pointsPerPlayer: newPoints,
                pointsOnGround: newGroundPoints
            }
        }
    };
};

export const handleVotes = (room: Room): Room => {
    assert(room.data.roundInProgress);

    const round = room.data.currentRound;

    const numLeave = Object.values(round.votes).filter((vote) => vote === 'leave').length;
    const newPlayers = [];
    const newPlayerPoints = { ...room.data.players };
    let newInPlay = [...round.inPlay];
    const newRemovedCards = [...room.data.removedCards];

    for (const [player, vote] of Object.entries(round.votes)) {
        if (vote === 'leave') {
            newPlayerPoints[player] += round.pointsPerPlayer + Math.floor(round.pointsOnGround / numLeave);
            if (numLeave === 1) {
                for (const card of round.inPlay) {
                    if (card.type === 'relic') {
                        newPlayerPoints[player] += card.value;
                        newRemovedCards.push(card);
                    }
                }
                newInPlay = round.inPlay.filter((card) => card.type !== 'relic');
            }
        } else newPlayers.push(player);
    }

    if (newPlayers.length === 0) {
        return {
            ...room,
            data: {
                ...room.data,
                players: newPlayerPoints,
                removedCards: newRemovedCards,
                roundsDone: room.data.roundsDone + 1,
                roundInProgress: false,
                currentRound: null
            }
        };
    }
    return handleDraw({
        ...room,
        data: {
            ...room.data,
            players: newPlayerPoints,
            removedCards: newRemovedCards,
            currentRound: {
                ...room.data.currentRound,
                players: newPlayers as [string, ...string[]],
                votes: {},
                pointsOnGround: numLeave === 0 ? round.pointsOnGround : round.pointsOnGround % numLeave,
                inPlay: newInPlay
            }
        }
    });
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
    return handleDraw({
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
    });
};

// export const handleVote
