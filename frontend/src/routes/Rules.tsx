import { Typography } from '@mui/material';
import type { JSX } from 'react';

const RulesRoute = (): JSX.Element => (
    <>
        <Typography variant="h4" sx={{ mb: 2 }}>
            Rules
        </Typography>

        <Typography variant="h5">Gameplay</Typography>
        <Typography>
            The game plays over 5 rounds corresponding to 5 caves. Inside a cave each round consists of each player
            deciding to either leave the cave or advance further into it.
        </Typography>
        <Typography>The game has a deck of cards which contains treasure cards, trap cards and relic cards.</Typography>

        <Typography variant="h5">Round overview</Typography>
        <Typography>
            At the beginning of a round, a new relic card is inserted into the deck before shuffling. The added relic
            card values are <b>5, 7, 8, 10, 12,</b> in that order.
        </Typography>

        <Typography variant="h6">1. Card reveal</Typography>
        <Typography>The top card is revealed.</Typography>
        <ul>
            <li>
                <Typography>
                    <b>Treasure card</b>: The card corresponds to some number of points. They are shared equally among
                    all players still in the cave. The remaining points that cannot be shared equally are left on the
                    ground. When you leave the cave, the points you have gathered during the expedition are added to
                    your point total.
                </Typography>
            </li>
            <li>
                <Typography>
                    <b>Trap card</b>: If a trap appears for the first time since you entered the cave, nothing happens
                    and the expedition continues. However, if the same trap is revealed a second time, the cave
                    collapses and all players still in the cave immediately leave empty handed. The expedition ends
                    immediately.
                </Typography>
            </li>
            <li>
                <Typography>
                    <b>Relic card</b>: The relic card stays in the cave and nothing happens. The card isn&apos;t worth
                    any points until a player leaves the cave alone.
                </Typography>
            </li>
        </ul>

        <Typography variant="h6">2. Voting</Typography>
        <Typography>
            Each player still in the cave must decide to either continue into the cave, or leave it to actually get the
            points from the expedition. Players vote by pressing either the <b>Stay</b> button or the <b>Leave</b>{' '}
            button. When everyone is ready, the votes are revealed.
        </Typography>
        <ul>
            <li>
                <Typography>
                    <b>Stay</b>: Advance into the cave to get more treasure.
                </Typography>
            </li>
            <li>
                <Typography>
                    <b>Leave</b>: Leave the cave:
                </Typography>
                <ul>
                    <li>
                        <Typography>The points from the expedition are added to your point total.</Typography>
                    </li>
                    <li>
                        <Typography>
                            If leaving alone you receive all the points left on the ground. If multiple players are
                            leaving at the same time, they equally share all the points. If there are any points left
                            after this, they are left on the ground.
                        </Typography>
                    </li>
                    <li>
                        <Typography>
                            If multiple players leave at the same time, no one takes the relic cards. However, if only
                            one player leaves, they take all relics in the cave. The relics are removed from the game
                            and the player receives the corresponding amount of points.
                        </Typography>
                    </li>
                </ul>
            </li>
        </ul>
        <Typography>Steps 1 and 2 are repeated until either everyone leaves the cave or the cave collapses.</Typography>

        <Typography variant="h6">3. End of a round</Typography>
        <Typography>
            An expedition ends when all players return to camp or when the same trap appears twice in the cave. Continue
            to the next round:
        </Typography>
        <ul>
            <li>
                <Typography>
                    If the cave collapsed due to a trap card, that trap card is removed from the game.
                </Typography>
            </li>
            <li>
                <Typography>
                    A new relic card is added to the deck and the deck is shuffled for the next round
                </Typography>
            </li>
        </ul>

        <Typography variant="h5">End of the game</Typography>
        <Typography>
            The game ends when the players finish exploring the 5th cave. The player with the most points wins. On a
            tie, the tied players share the victory
        </Typography>
    </>
);

export default RulesRoute;
