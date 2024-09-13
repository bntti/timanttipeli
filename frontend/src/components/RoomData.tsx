import { Grid2 as Grid, Paper, Typography, useTheme } from '@mui/material';
import { type JSX, memo, useContext } from 'react';

import type { Card, TrapCard } from '@/common/types';
import { type User, UserContext } from '../app/StateProvider';

type Props = {
    gameNumber: number;
    roundNumber: number;
    deckSize: number;
    pointsOnGround: number | null;
    deck: Card[] | null;
    inPlay: Card[] | null;
};

const propsEqual = (oldProps: Props, newProps: Props): boolean =>
    oldProps.gameNumber === newProps.gameNumber &&
    oldProps.roundNumber === newProps.roundNumber &&
    oldProps.deckSize === newProps.deckSize &&
    oldProps.pointsOnGround === newProps.pointsOnGround &&
    JSON.stringify(oldProps.deck) === JSON.stringify(newProps.deck) &&
    JSON.stringify(oldProps.inPlay) === JSON.stringify(newProps.inPlay);

const RoomData = ({ gameNumber, roundNumber, deckSize, pointsOnGround, deck, inPlay }: Props): JSX.Element => {
    const theme = useTheme();
    const { user } = useContext(UserContext) as { user: User };

    const pointsCard: { ev: number | null; prob: number | null } = { ev: null, prob: null };
    const relicCard: { ev: number | null; prob: number | null } = { ev: null, prob: null };
    let deathProb = null;

    if (user.cheats && deck && inPlay) {
        const numPointsCards = deck.filter((card) => card.type === 'points').length;
        if (numPointsCards === 0) pointsCard.ev = 0;
        else {
            pointsCard.ev = deck.reduce(
                (ev, card) => (card.type === 'points' ? ev + card.value / numPointsCards : ev),
                0,
            );
            pointsCard.ev = Math.round(pointsCard.ev * 10) / 10;
        }
        pointsCard.prob = Math.round((numPointsCards / deck.length) * 100);

        const numRelicCards = deck.filter((card) => card.type === 'relic').length;
        if (numRelicCards === 0) relicCard.ev = 0;
        else {
            relicCard.ev = deck.reduce((ev, card) => (card.type === 'relic' ? ev + card.value / numRelicCards : ev), 0);
            relicCard.ev = Math.round(relicCard.ev * 10) / 10;
        }
        relicCard.prob = Math.round((numRelicCards / deck.length) * 100);

        const traps = new Set(inPlay.filter((card): card is TrapCard => card.type === 'trap').map((card) => card.trap));
        const numKills = deck.filter((card) => card.type === 'trap' && traps.has(card.trap)).length;
        deathProb = Math.round((numKills / deck.length) * 100);
    }

    return (
        <Grid container columnSpacing={2} rowSpacing={1} sx={{ mt: 2 }}>
            <Grid size={4}>
                <Typography component={Paper} textAlign="center" sx={{ p: 1 }}>
                    round {gameNumber > 1 ? `${gameNumber}-${roundNumber}` : roundNumber}
                </Typography>
            </Grid>
            <Grid size={4}>
                <Typography component={Paper} textAlign="center" sx={{ p: 1 }}>
                    deck size {deckSize}
                </Typography>
            </Grid>

            <Grid size={4}>
                <Typography component={Paper} textAlign="center" sx={{ p: 1 }}>
                    on ground {pointsOnGround}
                </Typography>
            </Grid>
            {user.cheats && (
                <>
                    <Grid size={4}>
                        <Typography
                            component={Paper}
                            textAlign="center"
                            sx={{
                                p: 1,
                                border: '1px solid',
                                borderColor: theme.palette.mode === 'light' ? '#888' : 'gray',
                                background: '#aaa3',
                            }}
                        >
                            {pointsCard.ev === null ? '---' : `${pointsCard.ev} | ${pointsCard.prob}%`}
                        </Typography>
                    </Grid>
                    <Grid size={4}>
                        <Typography
                            component={Paper}
                            textAlign="center"
                            sx={{
                                p: 1,
                                border: '1px solid',
                                background: theme.palette.mode === 'light' ? '#ff06' : '#ff07',
                                borderColor: theme.palette.mode === 'light' ? '#cc0' : '#ff0',
                            }}
                        >
                            {relicCard.ev === null ? '---' : `${relicCard.ev} | ${relicCard.prob}%`}
                        </Typography>
                    </Grid>
                    <Grid size={4}>
                        <Typography
                            component={Paper}
                            textAlign="center"
                            sx={{
                                p: 1,
                                border: '1px solid',
                                background: theme.palette.mode === 'light' ? '#f002' : '#f007',
                                borderColor: 'red',
                            }}
                        >
                            {deathProb === null ? '---' : `${deathProb}%`}
                        </Typography>
                    </Grid>
                </>
            )}
        </Grid>
    );
};

const RoomDataMemo = memo(RoomData, propsEqual);
export default RoomDataMemo;
