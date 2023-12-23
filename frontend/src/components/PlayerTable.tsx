import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useTheme,
} from '@mui/material';
import { memo } from 'react';

type Props = {
    roomPlayers: { [key: string]: number };
    roundPlayers: [string, ...string[]] | null;
};
const propsEqual = (oldProps: Props, newProps: Props): boolean => {
    const roomPlayersEqual = JSON.stringify(oldProps.roomPlayers) === JSON.stringify(newProps.roomPlayers);
    const roundPlayersEqual = JSON.stringify(oldProps.roundPlayers) === JSON.stringify(newProps.roundPlayers);
    return roomPlayersEqual && roundPlayersEqual;
};
const PlayerTable = ({ roomPlayers, roundPlayers }: Props): JSX.Element => {
    const theme = useTheme();
    return (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Typography>Player</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography>Points</Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.entries(roomPlayers).map(([player, points]) => (
                        <TableRow
                            key={player}
                            sx={{
                                '&:last-child td': {
                                    borderBottom: 0,
                                },
                                background:
                                    roundPlayers && roundPlayers.includes(player)
                                        ? theme.palette.mode === 'light'
                                            ? '#00f3'
                                            : '#99f3'
                                        : '#0000',
                            }}
                        >
                            <TableCell sx={{ width: '60%' }}>
                                <Typography>{player}</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography>{points}</Typography>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

const PlayerTableMemo = memo(PlayerTable, propsEqual);
export default PlayerTableMemo;
