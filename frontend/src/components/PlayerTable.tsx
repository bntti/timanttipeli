import { Block, Check, Close, HourglassBottom } from '@mui/icons-material';
import {
    Button,
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
import { type JSX, memo } from 'react';

type Props =
    | {
          roomPlayers: { [key: string]: number };
          gameInProgress: boolean;
          removePlayers: boolean;
          kickPlayer: (username: string) => void;
          roundPlayers?: null;
          votes?: null;
          pointsPerPlayer?: null;
          pointsGained?: null;
          hasRelic?: null;
      }
    | {
          roomPlayers: { [key: string]: number };
          gameInProgress: boolean;
          removePlayers: boolean;
          kickPlayer: (username: string) => void;
          roundPlayers: string[];
          votes: string[];
          pointsPerPlayer: number;
          pointsGained: { [key: string]: number };
          hasRelic: string[];
      };
const propsEqual = (oldProps: Props, newProps: Props): boolean =>
    JSON.stringify(oldProps.roomPlayers) === JSON.stringify(newProps.roomPlayers) &&
    oldProps.gameInProgress === newProps.gameInProgress &&
    oldProps.removePlayers === newProps.removePlayers &&
    JSON.stringify(oldProps.roundPlayers) === JSON.stringify(newProps.roundPlayers) &&
    JSON.stringify(oldProps.votes) === JSON.stringify(newProps.votes) &&
    oldProps.pointsPerPlayer === newProps.pointsPerPlayer &&
    JSON.stringify(oldProps.pointsGained) === JSON.stringify(newProps.pointsGained) &&
    JSON.stringify(oldProps.hasRelic) === JSON.stringify(newProps.hasRelic);

const PlayerTable = ({
    roomPlayers,
    gameInProgress,
    removePlayers,
    kickPlayer,
    roundPlayers = null,
    votes = null,
    pointsPerPlayer = null,
    pointsGained = null,
    hasRelic = null,
}: Props): JSX.Element => {
    const theme = useTheme();
    const roundInProgress =
        roundPlayers !== null &&
        votes !== null &&
        pointsPerPlayer !== null &&
        pointsGained !== null &&
        hasRelic !== null;

    const getPointsText = (player: string): JSX.Element => {
        const points = roomPlayers[player];
        if (!roundInProgress) return <Typography>{points}</Typography>;
        if (roundPlayers.includes(player)) {
            return (
                <Typography>
                    {points} + ({pointsPerPlayer})
                </Typography>
            );
        }
        if (hasRelic.includes(player)) {
            return (
                <Typography>
                    {points} + <strong style={{ color: 'yellow' }}>{pointsGained[player]}</strong>
                </Typography>
            );
        }
        return (
            <Typography>
                {points} + {pointsGained[player]}
            </Typography>
        );
    };
    return (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table size="small" sx={{ tableLayout: 'fixed' }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ width: !removePlayers && gameInProgress ? '50%' : '70%' }}>
                            <Typography>Player</Typography>
                        </TableCell>
                        {removePlayers && (
                            <TableCell>
                                <Typography>Manage</Typography>
                            </TableCell>
                        )}
                        {!removePlayers && gameInProgress && (
                            <TableCell>
                                <Typography color={roundInProgress ? '' : 'gray'}>Voted</Typography>
                            </TableCell>
                        )}
                        {!removePlayers && (
                            <TableCell sx={{ width: '30%' }}>
                                <Typography>Points</Typography>
                            </TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.keys(roomPlayers).map((player) => (
                        <TableRow
                            key={player}
                            sx={{
                                '&:last-child td': {
                                    borderBottom: 0,
                                },
                                background:
                                    roundInProgress && !roundPlayers.includes(player)
                                        ? theme.palette.mode === 'light'
                                            ? '#0002'
                                            : '#aaa1'
                                        : '#0000',
                            }}
                        >
                            <TableCell>
                                <Typography sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {player}
                                </Typography>
                            </TableCell>
                            {removePlayers && (
                                <TableCell>
                                    <Button
                                        sx={{ ml: 1 }}
                                        size="small"
                                        variant="outlined"
                                        onClick={() => kickPlayer(player)}
                                    >
                                        Kick
                                    </Button>
                                </TableCell>
                            )}
                            {!removePlayers && gameInProgress && (
                                <TableCell>
                                    {roundInProgress && roundPlayers.includes(player) && (
                                        <>
                                            {votes.includes(player) && <Check fontSize="small" color="success" />}
                                            {!votes.includes(player) && roundPlayers.length > 1 && (
                                                <Close fontSize="small" color="error" />
                                            )}
                                            {!votes.includes(player) && roundPlayers.length === 1 && (
                                                <HourglassBottom fontSize="small" color="primary" />
                                            )}
                                        </>
                                    )}
                                    {roundInProgress && !roundPlayers.includes(player) && <Block color="disabled" />}
                                </TableCell>
                            )}
                            {!removePlayers && <TableCell>{getPointsText(player)}</TableCell>}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

const PlayerTableMemo = memo(PlayerTable, propsEqual);
export default PlayerTableMemo;
