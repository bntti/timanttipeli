import { LinearProgress, keyframes, styled } from '@mui/material';
import { memo } from 'react';

const indeterminate1Keyframes = keyframes({
    '0%': { left: '-35%', right: '100%' },
    '100%': { left: '0%', right: '0%' },
});

type Props = { duration: number };
const propsEqual = (oldProps: Props, newProps: Props): boolean => oldProps.duration === newProps.duration;

const DurationBar = ({ duration }: Props): JSX.Element => {
    const StyledLinearProgress = styled(LinearProgress)({
        '& .MuiLinearProgress-bar1Indeterminate': {
            width: 'auto',
            animation: `${indeterminate1Keyframes} ${duration}ms linear forwards`,
        },
        '& .MuiLinearProgress-bar2Indeterminate': {
            display: 'none',
        },
    });

    return <StyledLinearProgress variant="indeterminate" />;
};

const DurationBarMemo = memo(DurationBar, propsEqual);
export default DurationBarMemo;
