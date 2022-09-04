import { useCallback, useEffect, useRef, useState } from "react"
import mapboxgl, { Map } from 'mapbox-gl'
import { v4 } from 'uuid'
import { Subject } from "rxjs";
import { Coord, Markers, MarkerType, NewMarker } from "../interfaces/marker";


mapboxgl.accessToken = 'pk.eyJ1IjoiYWx2YXJvY3JvIiwiYSI6ImNsNzZ6M3NpZDA1YWgzdm8xMWt6a2g4N3kifQ.sp3cbICozrV10A8nerwC7Q';


export const useMapbox = (initialPoint: Coord ) => {

    //* Referencia al div del mapa
    const mapDiv = useRef<HTMLDivElement | null>(null)
    const setRef = useCallback((node) => {
        mapDiv.current = node
    },[])

    //* Referencia a los marcadores
    const markers = useRef<Markers>({})

    //* Observables de Rxjs
    const moveMarker = useRef<Subject<NewMarker>>(new Subject())
    const newMarker = useRef<Subject<NewMarker>>(new Subject())

    //* Mapa y coords
    const mapState = useRef<Map | null>(null)
    const [coords, setCoords] = useState<Coord>(initialPoint)
    
    //* Función para agregar marcadores nuevos propios o agregar la de otros usuarios a nuestro mapa en tiempo real
    const addMarker = useCallback((ev: (mapboxgl.MapMouseEvent & mapboxgl.EventData) | any, id?: string) => {
        const { lng, lat } = ev.lngLat || ev
        const marker = new mapboxgl.Marker() as MarkerType
        marker.id = id ?? v4() //* Si el marcador ya tiene Id
        marker
            .setLngLat([ lng, lat ])
            .addTo(mapState.current!)
            .setDraggable(true)

        //* Asignamos al objeto de marcadores, la key id y su valor el marcador
        markers.current[marker.id] = marker

        //* Si el marcador tiene Id no emitir
        if(!id) {
            newMarker.current.next({
                id: marker.id,
                lng,
                lat
            })
        }

        //* Escuchar movimientos del marcador
        marker.on('drag', ({ target }: any) => {
            const { id } = target
            const { lng, lat } = target.getLngLat()
            // TODO: Emitir los cambios del marcador
            moveMarker.current.next({ id, lng, lat })
        })
    }, [])

    //* Función para actualizar la posición del marcador
    const updatePosition = useCallback(({id, lng, lat}) => {
        markers.current[id].setLngLat([lng, lat])
    }, [])

    //* Configuración inicial del mapa
    useEffect(() => {
        if (mapDiv.current) {
            const map = new mapboxgl.Map({
                container: mapDiv.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [initialPoint.lng, initialPoint.lat],
                zoom: initialPoint.zoom
            });
            
            mapState.current = map
        }
    }, [])

    //* Cuando el mapa se mueve
    useEffect(() => {
        mapState.current?.on('move', () => {
            const { lng, lat } = mapState.current!.getCenter()
            setCoords({
                lng: Number(lng.toFixed(4)),
                lat: Number(lat.toFixed(4)),
                zoom: Number(mapState.current?.getZoom().toFixed(2))
            })
        })
    }, [])

    //* Agregar marcadores cuando se haga click
    useEffect(() => {
        mapState.current?.on('click', (ev) => addMarker(ev))
        // mapState.current?.on('click', addMarker)
    }, [addMarker])

    return {
        coords,
        setRef,
        markers,
        newMarker$: newMarker.current,
        moveMarker$: moveMarker.current,
        addMarker,
        updatePosition,
    }
}

