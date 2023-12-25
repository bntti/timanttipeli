import { Box, Typography, useTheme } from '@mui/material';

import { Card } from '../types';

const CardSquare = ({ card, size = 'small' }: { card: Card; size?: 'small' | 'large' }): JSX.Element => {
    const theme = useTheme();
    const trapMap = {
        boulder: '🪨',
        fire: '🔥',
        snake: '🐍',
        log: '🪵',
        spider: '🕷️',
    };

    let background = '';
    let borderColor = '';
    let text = '';
    switch (card.type) {
        case 'points':
            background = '#aaa3';
            borderColor = theme.palette.mode === 'light' ? '#888' : 'gray';
            text = card.value.toString();
            break;
        case 'relic':
            background = theme.palette.mode === 'light' ? '#ff06' : '#ff07';
            borderColor = theme.palette.mode === 'light' ? '#cc0' : '#ff0';
            text = card.value.toString();
            break;
        case 'trap':
            background = theme.palette.mode === 'light' ? '#f002' : '#f007';
            borderColor = 'red';
            text = trapMap[card.trap];
            break;
    }

    return (
        <Box
            sx={{
                m: 1,
                p: 1,
                width: size === 'small' ? 40 : 80,
                height: size === 'small' ? 40 : 80,
                border: '1px solid',
                borderRadius: 2,
                background,
                borderColor,
            }}
        >
            <Typography
                sx={{
                    textAlign: 'center',
                    fontSize: size === 'small' ? '1rem' : '300%',
                }}
            >
                {text}
            </Typography>
        </Box>
    );
};

export default CardSquare;
