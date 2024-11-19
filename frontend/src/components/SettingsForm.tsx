import { Box, Button, FormControl, FormControlLabel, Switch, TextField, Typography } from '@mui/material';
import { type JSX, type SyntheticEvent, memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { type Settings, settingsSchema } from '@/common/types';

type Props = { settings: Settings; setSettings: (settings: Settings) => void };
const propsEqual = (oldProps: Props, newProps: Props): boolean =>
    JSON.stringify(oldProps.settings) === JSON.stringify(newProps.settings);

const SettingsForm = ({ settings, setSettings }: Props): JSX.Element => {
    const { t } = useTranslation();
    const [error, setError] = useState<boolean>(false);

    const [allowCheats, setAllowCheats] = useState<boolean>(settings.allowCheats);
    const [voteShowTime, setVoteShowTime] = useState<string>(settings.voteShowTime.toString());
    const [voteShowTime1, setVoteShowTime1] = useState<string>(settings.voteShowTime1.toString());
    const [cardTime, setCardTime] = useState<string>(settings.cardTime.toString());
    const [cardTime1, setCardTime1] = useState<string>(settings.cardTime1.toString());
    const [afterVoteTime, setAfterVoteTime] = useState<string>(settings.afterVoteTime.toString());

    const unsaved =
        allowCheats !== settings.allowCheats ||
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
        { label: t('votes-show-duration'), value: voteShowTime, setValue: setVoteShowTime },
        { label: t('votes-show-duration-1'), value: voteShowTime1, setValue: setVoteShowTime1 },
        { label: t('new-card-show-duration'), value: cardTime, setValue: setCardTime },
        { label: t('new-card-show-duration-1'), value: cardTime1, setValue: setCardTime1 },
        { label: t('after-vote-delay'), value: afterVoteTime, setValue: setAfterVoteTime },
    ];

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1">{t('settings')}</Typography>
                {unsaved && (
                    <Typography variant="body2" color="info">
                        {t('unsaved-changes')}
                    </Typography>
                )}
            </Box>

            <form onSubmit={handleSubmit}>
                <FormControl fullWidth error={error}>
                    <FormControlLabel
                        control={<Switch checked={allowCheats} onChange={() => setAllowCheats(!allowCheats)} />}
                        label={t('allow-cheats')}
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
                        {t('save-settings')}
                    </Button>
                </FormControl>
            </form>
        </>
    );
};

const SettingsFormMemo = memo(SettingsForm, propsEqual);
export default SettingsFormMemo;
