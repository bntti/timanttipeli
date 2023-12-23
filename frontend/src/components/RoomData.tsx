import { Grid, Paper, Typography } from '@mui/material';
import { memo } from 'react';

type Props = {
    gameNumber: number;
    roundNumber: number;
    deckSize: number;
    pointsOnGround: number | null;
};

const propsEqual = (oldProps: Props, newProps: Props): boolean => {
    return (
        oldProps.gameNumber === newProps.gameNumber &&
        oldProps.roundNumber === newProps.roundNumber &&
        oldProps.deckSize === newProps.deckSize &&
        oldProps.pointsOnGround === newProps.pointsOnGround
    );
};

const RoomData = ({ gameNumber, roundNumber, deckSize, pointsOnGround }: Props): JSX.Element => (
    <Grid container spacing={2} sx={{ mt: -1 }}>
        <Grid item xs={4}>
            <Typography component={Paper} textAlign="center" sx={{ p: 1 }}>
                round {gameNumber > 1 ? `${gameNumber}-${roundNumber}` : roundNumber}
            </Typography>
        </Grid>
        <Grid item xs={4}>
            <Typography component={Paper} textAlign="center" sx={{ p: 1 }}>
                deck size {deckSize}
            </Typography>
        </Grid>

        <Grid item xs={4}>
            <Typography component={Paper} textAlign="center" sx={{ p: 1 }}>
                on ground {pointsOnGround}
            </Typography>
        </Grid>
    </Grid>
);

const RoomDataMemo = memo(RoomData, propsEqual);
export default RoomDataMemo;
