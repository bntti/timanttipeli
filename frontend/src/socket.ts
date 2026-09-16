import type { Socket } from 'socket.io-client';

import { io } from 'socket.io-client';

import type { ClientToServerEvents, ServerToClientEvents } from '@timanttipeli/common';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();
