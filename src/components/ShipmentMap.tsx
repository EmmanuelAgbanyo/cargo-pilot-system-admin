
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Shipment } from '../types';

// Define the connection point structure
interface ConnectionPoint {
  name: string;
  coordinates: [number, number];
  isHub?: boolean;
}

// Predefined connection points that represent major logistics hubs
const connectionPoints: Record<string, ConnectionPoint> = {
  'New York': { name: 'New York', coordinates: [-74.006, 40.7128], isHub: true },
  'Los Angeles': { name: 'Los Angeles', coordinates: [-118.2437, 34.0522], isHub: true },
  'Chicago': { name: 'Chicago', coordinates: [-87.6298, 41.8781] },
  'Miami': { name: 'Miami', coordinates: [-80.1918, 25.7617] },
  'Dallas': { name: 'Dallas', coordinates: [-96.7970, 32.7767] },
  'London': { name: 'London', coordinates: [-0.1278, 51.5074], isHub: true },
  'Paris': { name: 'Paris', coordinates: [2.3522, 48.8566] },
  'Berlin': { name: 'Berlin', coordinates: [13.4050, 52.5200] },
  'Shanghai': { name: 'Shanghai', coordinates: [121.4737, 31.2304], isHub: true },
  'Tokyo': { name: 'Tokyo', coordinates: [139.6917, 35.6895], isHub: true },
  'Singapore': { name: 'Singapore', coordinates: [103.8198, 1.3521], isHub: true },
  'Sydney': { name: 'Sydney', coordinates: [151.2093, -33.8688] },
  'Dubai': { name: 'Dubai', coordinates: [55.2708, 25.2048], isHub: true },
  'Mumbai': { name: 'Mumbai', coordinates: [72.8777, 19.0760] },
  'São Paulo': { name: 'São Paulo', coordinates: [-46.6333, -23.5505] },
  'Cape Town': { name: 'Cape Town', coordinates: [18.4241, -33.9249] },
};

// Function to extract source and destination from route string
const parseRoute = (route: string): [ConnectionPoint, ConnectionPoint] => {
  const cities = route.split(' to ');
  
  const source = cities[0].trim();
  const destination = cities[1]?.trim() || 'New York'; // Default to New York if no destination
  
  const sourcePoint = connectionPoints[source] || { 
    name: source, 
    coordinates: [-74.006, 40.7128] // Default to New York coordinates
  };
  
  const destPoint = connectionPoints[destination] || { 
    name: destination, 
    coordinates: [139.6917, 35.6895] // Default to Tokyo coordinates
  };
  
  return [sourcePoint, destPoint];
};

interface ShipmentMapProps {
  shipments: Shipment[];
}

const ShipmentMap: React.FC<ShipmentMapProps> = ({ shipments }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;
    
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      projection: 'globe',
      zoom: 1.5,
      center: [0, 20],
      pitch: 30,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Disable scroll zoom for smoother experience
    map.current.scrollZoom.disable();

    // Add atmosphere and fog effects
    map.current.on('style.load', () => {
      if (!map.current) return;
      
      map.current.setFog({
        color: 'rgb(255, 255, 255)',
        'high-color': 'rgb(200, 200, 225)',
        'horizon-blend': 0.2,
      });

      // Once the map style is loaded, add the routes and points
      addRoutesToMap();
    });

    // Add rotation animation
    const secondsPerRevolution = 360;
    let userInteracting = false;
    
    function spinGlobe() {
      if (!map.current || userInteracting) return;
      
      const center = map.current.getCenter();
      center.lng -= 0.1;
      map.current.easeTo({ center, duration: 100, easing: (n) => n });
      
      setTimeout(spinGlobe, 100);
    }

    // Event listeners for interaction
    map.current.on('mousedown', () => {
      userInteracting = true;
    });
    
    map.current.on('mouseup', () => {
      userInteracting = false;
      setTimeout(spinGlobe, 5000);
    });
    
    map.current.on('touchstart', () => {
      userInteracting = true;
    });
    
    map.current.on('touchend', () => {
      userInteracting = false;
      setTimeout(spinGlobe, 5000);
    });

    // Start the globe spinning after 2 seconds
    setTimeout(spinGlobe, 2000);
  };

  const addRoutesToMap = () => {
    if (!map.current) return;

    // Wait for the map to be loaded
    if (!map.current.isStyleLoaded()) {
      setTimeout(addRoutesToMap, 100);
      return;
    }

    // Add a source for the lines
    map.current.addSource('routes', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });

    // Add a layer for the lines
    map.current.addLayer({
      id: 'routes-layer',
      type: 'line',
      source: 'routes',
      paint: {
        'line-color': [
          'case',
          ['==', ['get', 'status'], 'Delivered'], '#10b981', // Green for delivered
          ['==', ['get', 'status'], 'In Transit'], '#f59e0b', // Amber for in transit
          ['==', ['get', 'status'], 'Processing'], '#3b82f6', // Blue for processing
          ['==', ['get', 'status'], 'Cancelled'], '#ef4444', // Red for cancelled
          '#6b7280' // Gray default
        ],
        'line-width': 2,
        'line-opacity': 0.8
      }
    });

    // Create features for all routes
    const features = shipments.map(shipment => {
      const [source, destination] = parseRoute(shipment.route);
      
      return {
        type: 'Feature',
        properties: {
          id: shipment.id,
          sender: shipment.sender,
          receiver: shipment.receiver,
          status: shipment.status
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            source.coordinates,
            destination.coordinates
          ]
        }
      };
    });

    // Update the source data
    const routesSource = map.current.getSource('routes') as mapboxgl.GeoJSONSource;
    
    if (routesSource) {
      routesSource.setData({
        type: 'FeatureCollection',
        features: features as any
      });
    }

    // Add connection points
    Object.values(connectionPoints).forEach(point => {
      // Only add points that are used in shipments or are major hubs
      const isUsedInShipments = shipments.some(shipment => {
        const route = shipment.route;
        return route.includes(point.name);
      });

      if (isUsedInShipments || point.isHub) {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.width = point.isHub ? '18px' : '12px';
        el.style.height = point.isHub ? '18px' : '12px';
        el.style.borderRadius = '50%';
        el.style.border = '2px solid white';
        el.style.backgroundColor = point.isHub ? '#f97316' : '#3b82f6';
        el.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)';
        el.style.cursor = 'pointer';

        const tooltip = document.createElement('div');
        tooltip.className = 'marker-tooltip';
        tooltip.style.position = 'absolute';
        tooltip.style.bottom = '100%';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '4px 8px';
        tooltip.style.borderRadius = '4px';
        tooltip.style.fontSize = '12px';
        tooltip.style.whiteSpace = 'nowrap';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.opacity = '0';
        tooltip.style.transition = 'opacity 0.3s';
        tooltip.textContent = point.name;

        el.appendChild(tooltip);

        el.addEventListener('mouseenter', () => {
          tooltip.style.opacity = '1';
        });

        el.addEventListener('mouseleave', () => {
          tooltip.style.opacity = '0';
        });

        new mapboxgl.Marker(el)
          .setLngLat(point.coordinates)
          .addTo(map.current!);
      }
    });
  };

  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (mapboxToken && !map.current) {
      initializeMap();
    }
  }, [mapboxToken]);

  useEffect(() => {
    if (map.current && mapboxToken) {
      addRoutesToMap();
    }
  }, [shipments]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowTokenInput(false);
    initializeMap();
  };

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden border border-border">
      {showTokenInput ? (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
          <form onSubmit={handleTokenSubmit} className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Mapbox API Token Required</h3>
            <p className="mb-4 text-muted-foreground">
              To visualize the shipment map, please enter your Mapbox public token.
              You can get one from <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>
            </p>
            <div className="space-y-4">
              <input 
                type="text"
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                placeholder="Enter your Mapbox public token"
                className="w-full p-2 border border-input rounded"
                required
              />
              <Button type="submit" className="w-full">
                Load Map
              </Button>
            </div>
          </form>
        </div>
      ) : null}
      
      <div ref={mapContainer} className="w-full h-full" />
      
      <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm p-3 rounded-lg shadow-md">
        <h4 className="font-medium mb-2">Status Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm">Delivered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-sm">In Transit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm">Processing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm">Cancelled</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm p-3 rounded-lg shadow-md">
        <h4 className="font-medium mb-2">Location Types</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-white bg-orange-500"></div>
            <span className="text-sm">Major Hub</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-white bg-blue-500"></div>
            <span className="text-sm">Destination</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentMap;
