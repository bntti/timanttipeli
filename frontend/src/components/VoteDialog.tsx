import { Dialog, DialogContent, DialogTitle, Divider, Grid, List, ListItem, Paper, Typography } from '@mui/material';
import { type JSX, memo } from 'react';

import DurationBarMemo from './DurationBar';

type Props = {
    open: boolean;
    duration: number;
    lastVote: { [key: string]: 'stay' | 'leave' };
};
const propsEqual = (oldProps: Props, newProps: Props): boolean =>
    oldProps.open === newProps.open &&
    oldProps.duration === newProps.duration &&
    JSON.stringify(oldProps.lastVote) === JSON.stringify(newProps.lastVote);

const VoteDialog = ({ open, duration, lastVote }: Props): JSX.Element => {
    const stay = Object.entries(lastVote).filter(([_, vote]) => vote === 'stay');
    const leave = Object.entries(lastVote).filter(([_, vote]) => vote === 'leave');

    return (
        <Dialog open={open} maxWidth="lg" fullWidth>
            <DialogTitle sx={{ pb: 0 }}>Votes</DialogTitle>
            <DialogContent sx={{ p: 1 }}>
                <Grid component={Paper} container sx={{ p: 1 }}>
                    <Grid size={6}>
                        <List sx={{ p: 0 }} subheader="Stay" dense>
                            {stay.map(([username]) => (
                                <ListItem key={username}>
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{username}</span>
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                    <Divider orientation="vertical" flexItem sx={{ mr: '-1px' }} />
                    <Grid size={6}>
                        <List sx={{ p: 0, pl: 1 }} subheader="Leave" dense>
                            {leave.map(([username]) => (
                                <ListItem key={username}>
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{username}</span>
                                </ListItem>
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
