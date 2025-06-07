import assert from 'node:assert';

import type { Card, RelicCard, Room, TrapCard } from '@/common/types';

const USE_RELICS = true;

const relicCards: RelicCard[] = [
    { type: 'relic', value: 5 },
    { type: 'relic', value: 7 },
    { type: 'relic', value: 8 },
    { type: 'relic', value: 10 },
    { type: 'relic', value: 12 },
];

const goldGoldGoldCards: RelicCard[] = [
    { type: 'relic', value: 5 },
    { type: 'relic', value: 7 },
    { type: 'relic', value: 8 },
    { type: 'relic', value: 10 },
    { type: 'relic', value: 12 },
    { type: 'relic', value: 14 },
    { type: 'relic', value: 16 },
    { type: 'relic', value: 18 },
    { type: 'relic', value: 20 },
    { type: 'relic', value: 22 },
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
    { type: 'trap', trap: 'spider' },
];

const goldGoldGoldExtraCards: Card[] = [
    { type: 'trap', trap: 'boulder' },
    { type: 'trap', trap: 'fire' },
    { type: 'trap', trap: 'log' },
    { type: 'trap', trap: 'snake' },
    { type: 'trap', trap: 'spider' },
];

export const generateRoom = (id: number = -1, name: string = '-1'): Room => ({
    id,
    hidden: false,
    name,
    settings: {
        allowCheats: true,
        goldGoldGold: false,
        voteShowTime: 2000,
        voteShowTime1: 1000,
        cardTime: 2000,
        cardTime1: 1000,
        afterVoteTime: 5000,
    },
    data: {
        players: {},
        gameInProgress: false,
        roundInProgress: false,
        removedCards: [],
        roundsDone: 0,
        currentRound: null,
    },
});

const createDeck = (room: Room): Card[] => {
    const result = room.settings.goldGoldGold ? [...baseDeck, ...goldGoldGoldExtraCards] : [...baseDeck];

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (USE_RELICS) {
        if (room.settings.goldGoldGold) {
            for (let i = 0; i <= room.data.roundsDone % 10; i++) {
                result.push(goldGoldGoldCards[i]);
                if (goldGoldGoldCards[i].value <= 12) result.push(goldGoldGoldCards[i]);
            }
        } else {
            for (let i = 0; i <= room.data.roundsDone % 5; i++) result.push(relicCards[i]);
        }
    }
    for (const card of room.data.removedCards) {
        const index = result.indexOf(card);
        result.splice(index, 1);
    }

    return result;
};

const handleRoundEnd = (room: Room, card?: TrapCard): void => {
    assert.ok(room.data.roundInProgress);
    for (const [player, points] of Object.entries(room.data.currentRound.pointsGained)) {
        room.data.players[player] += points;
    }
    if (card) room.data.removedCards.push(card);

    const numRounds = room.settings.goldGoldGold ? 10 : 5;
    room.data = {
        ...room.data,
        roundInProgress: false,
        removedCards: (room.data.roundsDone + 1) % numRounds === 0 ? [] : room.data.removedCards,
        roundsDone: room.data.roundsDone + 1,
        lastCard: card ?? null,
        currentRound: null,
    };
    room.data.deckSize = createDeck(room).length;
};

const handleDraw = (room: Room): void => {
    assert.ok(room.data.roundInProgress);
    const round = room.data.currentRound;

    const index = Math.floor(Math.random() * round.deck.length);
    const card = round.deck.splice(index, 1)[0];
    room.data.lastCard = card;

    if (card.type === 'points') {
        const numPlayers = round.players.length;
        if (card.value >= numPlayers) {
            const pointsPerPlayer = Math.floor(card.value / numPlayers);
            round.pointsPerPlayer += pointsPerPlayer;
            round.pointsOnGround += card.value - numPlayers * pointsPerPlayer;
        } else {
            round.pointsOnGround += card.value;
        }
    } else if (card.type === 'trap') {
        const found = round.inPlay.filter((inPlayCard) => inPlayCard.type === 'trap' && inPlayCard.trap === card.trap);
        if (found.length > 0) {
            handleRoundEnd(room, card);
            return;
        }
    }
    round.inPlay.push(card);
};

export const handleVotes = (room: Room, endRound: boolean = false): void => {
    assert.ok(room.data.roundInProgress);
    const round = room.data.currentRound;

    // Force everyone to leave if round was forcibly ended
    if (endRound) {
        for (const player of round.players) {
            round.votes[player] = 'leave';
        }
    }

    const numLeave = Object.values(round.votes).filter((vote) => vote === 'leave').length;

    for (const [player, vote] of Object.entries(round.votes)) {
        if (vote === 'leave') {
            // Not actually this type but doesn't break anything
            round.players = round.players.filter((rPlayer) => rPlayer !== player) as [string, ...string[]];

            round.pointsGained[player] = round.pointsPerPlayer + Math.floor(round.pointsOnGround / numLeave);
            if (numLeave === 1) {
                for (const card of round.inPlay) {
                    if (card.type === 'relic') {
                        round.pointsGained[player] += card.value;
                        round.hasRelic.push(player);
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
            lastVote: round.votes,
            currentRound: {
                ...round,
                votes: {},
            },
        };
        handleRoundEnd(room);
    } else {
        room.data = {
            ...room.data,
            lastVote: round.votes,
            currentRound: {
                ...round,
                votes: {},
                pointsOnGround: numLeave === 0 ? round.pointsOnGround : round.pointsOnGround % numLeave,
            },
        };
        handleDraw(room);
    }
};

export const startGame = (room: Room): void => {
    assert.ok(!room.data.gameInProgress);
    room.data = {
        ...room.data,
        gameInProgress: true,
        deckSize: 0,
        lastVote: {},
        lastCard: null,
    };
    room.data.deckSize = createDeck(room).length;
};

export const startRound = (room: Room): void => {
    assert.ok(room.data.gameInProgress && !room.data.roundInProgress);
    assert.ok(Object.keys(room.data.players).length > 0);

    const roundPoints: { [key: string]: number } = {};
    for (const player of Object.keys(room.data.players)) roundPoints[player] = 0;

    const deck = createDeck(room);
    room.data = {
        ...room.data,
        roundInProgress: true,
        deckSize: deck.length,
        lastVote: {},
        lastCard: null,
        currentRound: {
            deck,
            inPlay: [],
            votes: {},
            voteEndTime: null,
            players: Object.keys(room.data.players) as [string, ...string[]],
            pointsGained: {},
            hasRelic: [],
            pointsPerPlayer: 0,
            pointsOnGround: 0,
        },
    };
    handleDraw(room);
};

export const handleLeave = (room: Room, player: string): void => {
    assert.ok(!room.data.roundInProgress);
    assert.ok(player in room.data.players);

    delete room.data.players[player];
    if (room.data.gameInProgress && Object.keys(room.data.players).length === 0) {
        room.data = generateRoom().data;
    }
};
