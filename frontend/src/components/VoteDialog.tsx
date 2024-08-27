import { Close } from '@mui/icons-material';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Grid2 as Grid,
    IconButton,
    List,
    ListItem,
    Paper,
    Typography,
} from '@mui/material';
import { type JSX, memo } from 'react';

import DurationBarMemo from './DurationBar';

type Props = {
    open: boolean;
    duration: number;
    lastVote: { [key: string]: 'stay' | 'leave' };
    handleClose: () => void;
};
const propsEqual = (oldProps: Props, newProps: Props): boolean =>
    oldProps.open === newProps.open &&
    oldProps.duration === newProps.duration &&
    JSON.stringify(oldProps.lastVote) === JSON.stringify(newProps.lastVote);

const VoteDialog = ({ open, duration, lastVote, handleClose }: Props): JSX.Element => {
    const stay = Object.entries(lastVote).filter(([_, vote]) => vote === 'stay'); //eslint-disable-line
    const leave = Object.entries(lastVote).filter(([_, vote]) => vote === 'leave'); //eslint-disable-line

    return (
        <Dialog open={open}>
            <DialogTitle sx={{ pb: 0 }}>Votes</DialogTitle>
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
                <Grid component={Paper} container sx={{ p: 1 }}>
                    <Grid size={6}>
                        <List sx={{ p: 0 }} subheader="Stay" dense>
                            {stay.map(([username]) => (
                                <ListItem key={username}>{username}</ListItem>
                            ))}
                        </List>
                    </Grid>
                    <Divider orientation="vertical" flexItem sx={{ mr: '-1px' }} />
                    <Grid size={6}>
                        <List sx={{ p: 0, pl: 1 }} subheader="Leave" dense>
                            {leave.map(([username]) => (
                                <ListItem key={username}>{username}</ListItem>
                            ))}
                        </List>
                    </Grid>
                </Grid>
                {stay.length === 0 && (
                    <Typography textAlign="center" sx={{ mt: 1 }}>
                        Everyone left the cave
                    </Typography>
                )}
            </DialogContent>
            <DurationBarMemo duration={duration} />
        </Dialog>
    );
};

const VoteDialogMemo = memo(VoteDialog, propsEqual);
export default VoteDialogMemo;
