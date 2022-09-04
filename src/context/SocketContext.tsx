import { createContext } from 'react';
import { Socket } from "socket.io-client";
import { NewMarker } from '../interfaces/marker';
// import { BandType, NameBandType } from '../interfaces/Band';

export interface ServerToClientEvents {
    // current_bands: (bands: BandType[]) => void
    new_marker: (marker: NewMarker) => void;
    active_markers: (markers: NewMarker[]) => void;
    marker_updated: (marker: NewMarker) => void;
}

export interface ClientToServerEvents {
    new_marker: (marker: NewMarker) => void;
    marker_updated: (marker: NewMarker) => void;
}

interface ContextProps {
    online: boolean;
    socket: Socket<ServerToClientEvents, ClientToServerEvents>,
}

export const SocketContext = createContext({} as ContextProps)