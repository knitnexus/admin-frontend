"use client";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";

// Fix for default marker icons in Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon.src,
    shadowUrl: iconShadow.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

type Props = {
    onSelect: (lat: number, lng: number) => void;
    zoom?: number;
    initial?: { lat: number; lng: number };
};

// Component to update map view when center changes
function MapViewController({ center, zoom }: { center: { lat: number; lng: number }; zoom: number }) {
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.flyTo([center.lat, center.lng], zoom, {
                duration: 0.5
            });
        }
    }, [center.lat, center.lng, zoom, map]);

    return null;
}

function LocationMarker({
    onSelect,
    initial
}: {
    onSelect: (lat: number, lng: number) => void;
    initial?: { lat: number; lng: number };
}) {
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(initial || null);

    // Update position when initial prop changes
    useEffect(() => {
        if (initial) {
            setPosition(initial);
        }
    }, [initial?.lat, initial?.lng]);

    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setPosition({ lat, lng });
            onSelect(lat, lng);
        },
    });

    return position ? <Marker position={[position.lat, position.lng]} /> : null;
}

export default function MapPicker({ onSelect, zoom = 5, initial }: Props) {
    const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // India center
    const center = initial || defaultCenter;

    return (
        <div className="h-[400px] w-full">
            <MapContainer
                center={[center.lat, center.lng]}
                zoom={zoom}
                style={{ height: "100%", width: "100%" }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapViewController center={center} zoom={zoom} />
                <LocationMarker onSelect={onSelect} initial={initial} />
            </MapContainer>
        </div>
    );
}
