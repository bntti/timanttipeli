import { Box, Button, FormControl, FormControlLabel, Switch, TextField, Typography } from '@mui/material';
import { type JSX, type SyntheticEvent, memo, useEffect, useState } from 'react';

import { type Settings, settingsSchema } from '@/common/types';

type Props = { settings: Settings; setSettings: (settings: Settings) => void };
const propsEqual = (oldProps: Props, newProps: Props): boolean =>
    JSON.stringify(oldProps.settings) === JSON.stringify(newProps.settings);

const SettingsForm = ({ settings, setSettings }: Props): JSX.Element => {
    const [error, setError] = useState<boolean>(false);

    const [allowCheats, setAllowCheats] = useState<boolean>(settings.allowCheats);
    const [goldGoldGold, setGoldGoldGold] = useState<boolean>(settings.goldGoldGold);
    const [voteShowTime, setVoteShowTime] = useState<string>(settings.voteShowTime.toString());
    const [voteShowTime1, setVoteShowTime1] = useState<string>(settings.voteShowTime1.toString());
    const [cardTime, setCardTime] = useState<string>(settings.cardTime.toString());
    const [cardTime1, setCardTime1] = useState<string>(settings.cardTime1.toString());
    const [afterVoteTime, setAfterVoteTime] = useState<string>(settings.afterVoteTime.toString());

    const unsaved =
        allowCheats !== settings.allowCheats ||
        goldGoldGold !== settings.goldGoldGold ||
        voteShowTime !== (settings.voteShowTime / 1000).toString() ||
        voteShowTime1 !== (settings.voteShowTime1 / 1000).toString() ||
        cardTime !== (settings.cardTime / 1000).toString() ||
        cardTime1 !== (settings.cardTime1 / 1000).toString() ||
        afterVoteTime !== (settings.afterVoteTime / 1000).toString();

    useEffect(() => {
        setVoteShowTime((settings.voteShowTime / 1000).toString());
        setVoteShowTime1((settings.voteShowTime1 / 1000).toString());
        setCardTime((settings.cardTime / 1000).toString());
        setCardTime1((settings.cardTime1 / 1000).toString());
        setAfterVoteTime((settings.afterVoteTime / 1000).toString());
    }, [settings]);

    const handleSubmit = (event: SyntheticEvent): void => {
        event.preventDefault();
        try {
            const newSettings = settingsSchema.parse({
                allowCheats,
                goldGoldGold,
                voteShowTime: parseFloat(voteShowTime) * 1000,
                voteShowTime1: parseFloat(voteShowTime1) * 1000,
                cardTime: parseFloat(cardTime) * 1000,
                cardTime1: parseFloat(cardTime1) * 1000,
                afterVoteTime: parseFloat(afterVoteTime) * 1000,
            });
            setSettings(newSettings);
        } catch {
            setError(true);
        }
    };

    const fields = [
        { label: 'Votes show duration (s)', value: voteShowTime, setValue: setVoteShowTime },
        { label: 'Votes show duration 1 player (s)', value: voteShowTime1, setValue: setVoteShowTime1 },
        { label: 'New card show duration (s)', value: cardTime, setValue: setCardTime },
        { label: 'New card show duration 1 player (s)', value: cardTime1, setValue: setCardTime1 },
        { label: 'After vote delay (s)', value: afterVoteTime, setValue: setAfterVoteTime },
    ];

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1">Settings</Typography>
                {unsaved && (
                    <Typography variant="body2" color="info">
                        Unsaved changes
                    </Typography>
                )}
            </Box>

            <form onSubmit={handleSubmit}>
                <FormControl fullWidth error={error}>
                    <FormControlLabel
                        control={<Switch checked={allowCheats} onChange={() => setAllowCheats(!allowCheats)} />}
                        label="Allow cheats"
                    />
                    <FormControlLabel
                        control={<Switch checked={goldGoldGold} onChange={() => setGoldGoldGold(!goldGoldGold)} />}
                        label="Gold Gold Gold"
                    />
                    {fields.map((field) => (
                        <TextField
                            key={field.label}
                            fullWidth
                            size="small"
                            type="number"
                            variant="outlined"
                            label={field.label}
                            value={field.value}
                            error={error}
                            sx={{ mt: 2 }}
                            onChange={(event) => {
                                setError(false);
                                field.setValue(event.target.value);
                            }}
                        />
                    ))}
                    <Button fullWidth variant={unsaved ? 'contained' : 'outlined'} type="submit" sx={{ mt: 1 }}>
                        Save settings
                    </Button>
                </FormControl>
            </form>
        </>
    );
};

const SettingsFormMemo = memo(SettingsForm, propsEqual);
export default SettingsFormMemo;
