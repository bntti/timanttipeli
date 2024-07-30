import { Box, Divider, Grid, Paper, Typography } from '@mui/material';
import { memo } from 'react';

import { Card, TrapCard } from '../types';
import CardSquare from './CardSquare';

type Props = { inPlay: Card[] };
const PropsEqual = (oldProps: Props, newProps: Props): boolean => {
    return JSON.stringify(oldProps.inPlay) === JSON.stringify(newProps.inPlay);
};

const RoundCards = ({ inPlay }: Props): JSX.Element => (
    <Grid component={Paper} container sx={{ mt: 2 }}>
        <Grid item xs={6}>
            <Typography sx={{ textAlign: 'center' }}>cards</Typography>
        </Grid>
        <Divider orientation="vertical" flexItem sx={{ mr: '-1px' }} />
        <Grid item xs={6}>
            <Typography sx={{ textAlign: 'center' }}>traps</Typography>
        </Grid>

        <Grid item xs={6}>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                }}
            >
                {inPlay
                    .filter((card) => card.type !== 'trap')
                    .map((card, i) => (
                        <CardSquare key={i} card={card} />
                    ))}
            </Box>
        </Grid>
        <Divider orientation="vertical" flexItem sx={{ mr: '-1px' }} />
        <Grid item xs={6}>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                }}
            >
                {inPlay
                    .filter((card): card is TrapCard => card.type === 'trap')
                    .map((card, i) => (
                        <CardSquare key={i} card={card} />
                    ))}
            </Box>
        </Grid>
    </Grid>
);

const RoundCardsMemo = memo(RoundCards, PropsEqual);
export default RoundCardsMemo;
