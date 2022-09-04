export interface Coord {
    lng: number;
    lat: number;
    zoom: number;
}

export interface MarkerType extends mapboxgl.Marker{
    id: string,
    lng: number;
    lat: number;
}

export interface NewMarker {
    id: string,
    lng: number;
    lat: number;
}

export interface Markers {
    [key: string]: MarkerType
}