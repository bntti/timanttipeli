import type { Socket } from 'socket.io-client';

import { io } from 'socket.io-client';

import type { ClientToServerEvents, ServerToClientEvents } from '../../common/types';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();
