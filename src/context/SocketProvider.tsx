import { FC } from 'react';
import { useSocket } from '../hooks/useSocket';
import { SocketContext } from './';

export const SocketProvider: FC = ({children}) => {

    const { online, socket } = useSocket('http://localhost:8081');


    return (
        <SocketContext.Provider value={{
            // ...state,
            online,
            socket
        }}>
            { children }
        </SocketContext.Provider>
    )
}