"use client";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";

type Props = {
    onSelect: (lat: number, lng: number) => void;
    zoom?: number;
    initial?: { lat: number; lng: number };
};

function LocationMarker({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

    useMapEvents({
        click(e: { latlng: { lat: number; lng: number; }; }) {
            const { lat, lng } = e.latlng;
            setPosition({ lat, lng });
            onSelect(lat, lng);
        },
    });

    return position ? <Marker position={position}></Marker> : null;
}

export default function MapPicker({ onSelect,zoom = 5, initial }: Props) {


    return (
      <div className="h-[400px] w-full">
        <MapContainer
          // @ts-ignore
          center={initial ?? { lat: 20.5937, lng: 78.9629 }} // default India
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            // @ts-ignore
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker onSelect={onSelect} />
        </MapContainer>
      </div>
    );
}
