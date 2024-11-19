import { Box, Paper, Typography } from '@mui/material';
import { type JSX, memo } from 'react';
import { useTranslation } from 'react-i18next';

import type { Card } from '@/common/types';
import CardSquare from './CardSquare';

type Props = { removedCards: Card[] };
const propsEqual = (oldProps: Props, newProps: Props): boolean =>
    JSON.stringify(oldProps.removedCards) === JSON.stringify(newProps.removedCards);

const RemovedCards = ({ removedCards }: Props): JSX.Element => {
    const { t } = useTranslation();

    return (
        <Paper sx={{ mt: 2, pl: 1, pr: 1, pt: 1 }}>
            <Typography textAlign="center">{t('removed-cards')}</Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                }}
            >
                {removedCards.map((card, i) => (
                    <CardSquare key={i} card={card} />
                ))}
            </Box>
        </Paper>
    );
};

const RemovedCardsMemo = memo(RemovedCards, propsEqual);
export default RemovedCardsMemo;
