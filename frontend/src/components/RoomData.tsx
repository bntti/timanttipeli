import { Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { memo } from 'react';

type Props =
    | {
          roundNumber: number;
          deckSize: number;
          numVotes: number;
          pointsPerPlayer: number;
          pointsOnGround: number;
      }
    | {
          roundNumber: number;
          deckSize?: null;
          numVotes?: null;
          pointsPerPlayer?: null;
          pointsOnGround?: null;
      };
const propsEqual = (oldProps: Props, newProps: Props): boolean => {
    if (oldProps.deckSize !== newProps.deckSize) return false;
    if (newProps.deckSize === null) {
        return oldProps.roundNumber !== newProps.roundNumber;
    }

    return (
        oldProps.numVotes === newProps.numVotes &&
        oldProps.pointsPerPlayer === newProps.pointsPerPlayer &&
        oldProps.pointsOnGround === newProps.pointsOnGround
    );
};

const RoomData = ({
    roundNumber,
    deckSize = null,
    numVotes = null,
    pointsPerPlayer = null,
    pointsOnGround = null,
}: Props): JSX.Element => (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table size="small">
            <TableBody>
                <TableRow>
                    <TableCell sx={{ width: '60%' }}>
                        <Typography>Round #</Typography>
                    </TableCell>
                    <TableCell>
                        <Typography>{roundNumber}</Typography>
                    </TableCell>
                </TableRow>

                {deckSize && (
                    <>
                        <TableRow>
                            <TableCell sx={{ width: '60%' }}>
                                <Typography>Deck size</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography>{deckSize}</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ width: '60%' }}>
                                <Typography>Number of votes</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography>{numVotes}</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ width: '60%' }}>
                                <Typography>Points per player</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography>{pointsPerPlayer}</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow
                            sx={{
                                '&:last-child td': {
                                    borderBottom: 0,
                                },
                            }}
                        >
                            <TableCell sx={{ width: '60%' }}>
                                <Typography>Points on ground</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography>{pointsOnGround}</Typography>
                            </TableCell>
                        </TableRow>
                    </>
                )}
            </TableBody>
        </Table>
    </TableContainer>
);

const RoomDataMemo = memo(RoomData, propsEqual);
export default RoomDataMemo;
