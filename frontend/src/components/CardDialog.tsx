import { Close } from '@mui/icons-material';
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { memo } from 'react';

import CardSquare from './CardSquare';
import DurationBarMemo from './DurationBar';
import { Card } from '../types';

type Props = { open: boolean; duration: number; card: Card | null; gameEnded: boolean; handleClose: () => void };
const propsEqual = (oldProps: Props, newProps: Props): boolean => {
    return (
        oldProps.open === newProps.open &&
        oldProps.duration === newProps.duration &&
        JSON.stringify(oldProps.card) === JSON.stringify(newProps.card) &&
        oldProps.gameEnded === newProps.gameEnded
    );
};

const CardDialog = ({ open, duration, card, gameEnded, handleClose }: Props): JSX.Element => {
    if (open && card === null) throw new Error('Tried to show null card in CardDialog');

    return (
        <Dialog open={open} sx={{ background: gameEnded ? '#f005' : '' }}>
            <DialogTitle sx={{ pb: 0 }}>Card</DialogTitle>
            <IconButton
                aria-label="close"
                size="small"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 16,
                    top: 16,
                    p: 0,
                }}
            >
                <Close />
            </IconButton>
            <DialogContent sx={{ p: 1 }}>
                {card !== null && <CardSquare size="large" card={card} />}
                {gameEnded && (
                    <Typography width="100px" textAlign="center" color="error">
                        The cave collapsed
                    </Typography>
                )}
            </DialogContent>
            <DurationBarMemo duration={duration} />
        </Dialog>
    );
};

const CardDialogMemo = memo(CardDialog, propsEqual);
export default CardDialogMemo;
