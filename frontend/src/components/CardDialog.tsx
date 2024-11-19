import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { type JSX, memo } from 'react';
import { useTranslation } from 'react-i18next';

import type { Card } from '@/common/types';
import CardSquare from './CardSquare';
import DurationBarMemo from './DurationBar';

type Props = { open: boolean; duration: number; card: Card | null; gameEnded: boolean };
const propsEqual = (oldProps: Props, newProps: Props): boolean =>
    oldProps.open === newProps.open &&
    oldProps.duration === newProps.duration &&
    JSON.stringify(oldProps.card) === JSON.stringify(newProps.card) &&
    oldProps.gameEnded === newProps.gameEnded;

const CardDialog = ({ open, duration, card, gameEnded }: Props): JSX.Element => {
    const { t } = useTranslation();

    if (open && card === null) throw new Error('Tried to show null card in CardDialog');

    return (
        <Dialog open={open} sx={{ background: gameEnded ? '#f005' : '' }}>
            <DialogTitle sx={{ pb: 0 }}>{t('card')}</DialogTitle>
            <DialogContent sx={{ p: 1 }}>
                {card !== null && <CardSquare size="large" card={card} />}
                {gameEnded && (
                    <Typography width="100px" textAlign="center" color="error">
                        {t('the-cave-collapsed')}
                    </Typography>
                )}
            </DialogContent>
            <DurationBarMemo duration={duration} />
        </Dialog>
    );
};

const CardDialogMemo = memo(CardDialog, propsEqual);
export default CardDialogMemo;
