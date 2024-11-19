import { Box, Divider, Grid2 as Grid, Paper, Typography } from '@mui/material';
import { type JSX, memo } from 'react';
import { useTranslation } from 'react-i18next';

import type { Card, TrapCard } from '@/common/types';
import CardSquare from './CardSquare';

type Props = { inPlay: Card[] };
const PropsEqual = (oldProps: Props, newProps: Props): boolean =>
    JSON.stringify(oldProps.inPlay) === JSON.stringify(newProps.inPlay);

const RoundCards = ({ inPlay }: Props): JSX.Element => {
    const { t } = useTranslation();

    return (
        <Grid component={Paper} container sx={{ mt: 2 }}>
            <Grid size={6}>
                <Typography sx={{ textAlign: 'center' }}>{t('cards')}</Typography>
            </Grid>
            <Divider orientation="vertical" flexItem sx={{ mr: '-1px' }} />
            <Grid size={6}>
                <Typography sx={{ textAlign: 'center' }}>{t('traps')}</Typography>
            </Grid>

            <Grid size={6}>
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
            <Grid size={6}>
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
};

const RoundCardsMemo = memo(RoundCards, PropsEqual);
export default RoundCardsMemo;
