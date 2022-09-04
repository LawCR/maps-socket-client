import { useMapbox } from '../hooks/useMapbox';
import { useContext, useEffect } from 'react';
import { SocketContext } from '../context/SocketContext';
import { NewMarker } from '../interfaces/marker';

interface Coord {
    lng: number;
    lat: number;
    zoom: number;
}

const initialPoint: Coord = {
    lng: -76.9365,
    lat: -12.2097,
    zoom: 13
}

export const MapPage = () => {

    const { coords, setRef, newMarker$, moveMarker$, addMarker, updatePosition } = useMapbox(initialPoint)

    const { socket } = useContext(SocketContext)

    //* Escuchar los marcadores existentes
    useEffect(() => {
        socket.on('active_markers', (markers: NewMarker[]) => {
            for(const value of Object.values(markers)) {
                addMarker(value, value.id)
            }
        })
    }, [socket, addMarker])

    //* Efecto para crear nuevo marcador
    useEffect(() => {
        newMarker$.subscribe((marker: NewMarker) => {
            //* Emitir socket de nuevo marcador
            socket.emit('new_marker', marker)
        })
    }, [newMarker$, socket])

    //* Efecto escuchar nuevos marcadores y mostrarlos
    useEffect(() => {
        socket.on('new_marker', (marker: NewMarker) => {
            addMarker(marker, marker.id)
        })
    }, [socket])

    //* Efecto para movimiento del marcador
    useEffect(() => {
        moveMarker$.subscribe((marker: NewMarker) => {
            socket.emit('marker_updated', marker)
        })
    }, [socket, moveMarker$])

    //* Efecto para escuchar el movimiento y mostrarlo
    useEffect(() => {
        socket.on('marker_updated', (marker) => {
            updatePosition(marker)
        })
    }, [socket, updatePosition])

    


    return (
        <>
            <div className='info'>
                Lng: {coords.lng} | Lat: {coords.lat} | Zoom: {coords.zoom}
            </div>
            <div 
                className='mapContainer'
                ref={setRef}
            />
        </>
    )
}
