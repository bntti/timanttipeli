import { Button, FormControl, FormHelperText, TextField } from '@mui/material';
import { type JSX, type SyntheticEvent, memo, useEffect, useState } from 'react';

import { type Settings, SettingsSchema } from '@/common/types';

type Props = { settings: Settings; setSettings: (settings: Settings) => void };
const propsEqual = (oldProps: Props, newProps: Props): boolean =>
    JSON.stringify(oldProps.settings) === JSON.stringify(newProps.settings);

const SettingsForm = ({ settings, setSettings }: Props): JSX.Element => {
    const [error, setError] = useState<boolean>(false);
    const [unsaved, setUnsaved] = useState<boolean>(false);
    const [voteShowTime, setVoteShowTime] = useState<string>(settings.voteShowTime.toString());
    const [voteShowTime1, setVoteShowTime1] = useState<string>(settings.voteShowTime1.toString());
    const [cardTime, setCardTime] = useState<string>(settings.cardTime.toString());
    const [cardTime1, setCardTime1] = useState<string>(settings.cardTime1.toString());
    const [afterVoteTime, setAfterVoteTime] = useState<string>(settings.afterVoteTime.toString());

    useEffect(() => {
        setVoteShowTime(settings.voteShowTime.toString());
        setVoteShowTime1(settings.voteShowTime1.toString());
        setCardTime(settings.cardTime.toString());
        setCardTime1(settings.cardTime1.toString());
        setAfterVoteTime(settings.afterVoteTime.toString());
    }, [settings]);

    const handleSubmit = (event: SyntheticEvent): void => {
        event.preventDefault();
        try {
            const newSettings = SettingsSchema.parse({
                voteShowTime: parseInt(voteShowTime),
                voteShowTime1: parseInt(voteShowTime1),
                cardTime: parseInt(cardTime),
                cardTime1: parseInt(cardTime1),
                afterVoteTime: parseInt(afterVoteTime),
            });
            setSettings(newSettings);
            setUnsaved(false);
        } catch {
            setError(true);
        }
    };

    const fields = [
        { label: 'Votes show duration (ms)', value: voteShowTime, setValue: setVoteShowTime },
        { label: 'Votes show duration 1 player (ms)', value: voteShowTime1, setValue: setVoteShowTime1 },
        { label: 'new card show duration (ms)', value: cardTime, setValue: setCardTime },
        { label: 'New card show duration 1 player (ms)', value: cardTime1, setValue: setCardTime1 },
        { label: 'After vote delay (ms)', value: afterVoteTime, setValue: setAfterVoteTime },
    ];

    return (
        <form onSubmit={handleSubmit}>
            <FormControl fullWidth error={error}>
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
                            setUnsaved(true);
                            field.setValue(event.target.value);
                        }}
                    />
                ))}
                {unsaved && <FormHelperText variant="standard">Unsaved changes</FormHelperText>}
                <Button fullWidth variant="outlined" type="submit" sx={{ mt: 1 }}>
                    Save settings
                </Button>
            </FormControl>
        </form>
    );
};

const SettingsFormMemo = memo(SettingsForm, propsEqual);
export default SettingsFormMemo;
