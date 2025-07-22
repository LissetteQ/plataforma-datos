import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Box, Typography } from '@mui/material';
import 'leaflet/dist/leaflet.css';

const RM_CENTER = [-33.4489, -70.6693];
const ZOOM = 11;

function AddMarkerOnClick({ onAdd, selectedCategory }) {
  useMapEvents({
    click(e) {
      if (!selectedCategory) {
        alert('Selecciona un grupo económico en la leyenda antes de agregar un marcador.');
        return;
      }
      const { lat, lng } = e.latlng;
      const title = prompt('Título del marcador:', 'Nuevo marcador');
      const description = prompt('Descripción:', '');
      onAdd({ lat, lng, title, description, category: selectedCategory });
    },
  });
  return null;
}

export default function LeafletMap({ selectedCategory }) {
  const [markers, setMarkers] = useState([]);

  const handleAddMarker = (marker) => {
    setMarkers((prev) => [...prev, marker]);
  };

  const filteredMarkers = selectedCategory
    ? markers.filter((m) => m.category === selectedCategory)
    : markers;

  return (
    <Box
      sx={{
        height: { xs: '300px', md: '500px' },
        width: '100%',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <MapContainer center={RM_CENTER} zoom={ZOOM} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AddMarkerOnClick onAdd={handleAddMarker} selectedCategory={selectedCategory} />
        {filteredMarkers.map((m, i) => (
          <Marker key={i} position={[m.lat, m.lng]}>
            <Popup>
              <Typography variant="subtitle1" fontWeight={600}>{m.title}</Typography>
              <Typography variant="body2">{m.description}</Typography>
              <Typography variant="caption">Categoría: {m.category}</Typography><br/>
              Lat: {m.lat.toFixed(4)}, Lng: {m.lng.toFixed(4)}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
}
