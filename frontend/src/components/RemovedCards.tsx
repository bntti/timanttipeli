import type { JSX } from 'react';

import { Box, Paper, Typography } from '@mui/material';
import { memo } from 'react';

import type { Card } from '@timanttipeli/common';

import CardSquare from './CardSquare';

type Props = { removedCards: Card[] };
const propsEqual = (oldProps: Props, newProps: Props): boolean =>
    JSON.stringify(oldProps.removedCards) === JSON.stringify(newProps.removedCards);

const RemovedCards = ({ removedCards }: Props): JSX.Element => (
    <Paper sx={{ mt: 2, pl: 1, pr: 1, pt: 1 }}>
        <Typography align="center">Removed cards</Typography>
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
            }}
        >
            {removedCards.map((card, i) => (
                // TODO: Fix the warning
                // oxlint-disable-next-line react/no-array-index-key
                <CardSquare key={i} card={card} />
            ))}
        </Box>
    </Paper>
);

const RemovedCardsMemo = memo(RemovedCards, propsEqual);
export default RemovedCardsMemo;
