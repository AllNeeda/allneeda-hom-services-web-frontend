/// <reference types="@types/google.maps" />
"use client";

import React, { useRef, useState } from "react";
import {
  GoogleMap,
  DrawingManager,
  
} from "@react-google-maps/api";
import { X, Info } from "lucide-react";
import { useGoogleMaps } from "./GoogleMapProvider";

interface DrawOnMapModalProps {
  onClose: () => void;
  onContinue: () => void;
}



const center = {
  lat: 53.046,
  lng: -2.9925,
};

const DrawOnMapModal: React.FC<DrawOnMapModalProps> = ({
  onClose,
  onContinue,
}) => {
  const [drawingMode, setDrawingMode] = useState<
    google.maps.drawing.OverlayType | null
  >(null);

const { isLoaded } = useGoogleMaps();


  const drawingRef = useRef<google.maps.drawing.DrawingManager | null>(null);
  const [polygons, setPolygons] = useState<google.maps.Polygon[]>([]);
  const [selectedPolygonIndex, setSelectedPolygonIndex] = useState<number | null>(null);

  // Add new polygon drawing mode
  const handleAddNewArea = () => {
    setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
  };

  // When polygon is completed, add to list and stop drawing mode
  const onPolygonComplete = (polygon: google.maps.Polygon) => {
    setPolygons((prev) => [...prev, polygon]);
    setDrawingMode(null);

    // Add event listeners for edit/select
    polygon.setEditable(true);
    polygon.addListener("click", () => {
      setSelectedPolygonIndex(polygons.length); // select the new polygon
    });
  };

  // Edit selected polygon (toggle editable)
  const handleEditArea = () => {
    if (selectedPolygonIndex === null) {
      return;
    }
    const polygon = polygons[selectedPolygonIndex];
    polygon.setEditable(!polygon.getEditable());
  };

  // Remove selected polygon
  const handleRemoveArea = () => {
    if (selectedPolygonIndex === null) {
      return;
    }
    const polygon = polygons[selectedPolygonIndex];
    polygon.setMap(null); // remove from map
    setPolygons((prev) =>
      prev.filter((_, idx) => idx !== selectedPolygonIndex)
    );
    setSelectedPolygonIndex(null);
  };

  if (!isLoaded) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-sm shadow-lg border border-gray-200 dark:border-gray-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto text-[12px] text-gray-700 dark:text-gray-300"
      >
        {/* Header */}
        <div className="relative bg-[#0077B6] text-white p-5 rounded-sm">
          <h2 className="text-[14px] font-semibold leading-tight">
            Draw on a map
          </h2>
          <p className="mt-1 text-[11px] opacity-90">
            Click on the map to start drawing your area. Click an area to
            select it.
          </p>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 text-grey-800 dark:text-blue-200 p-3 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 text-[11px]">
          <Info className="w-4 h-4 flex-shrink-0" />
          <span>
            You can add multiple drawn areas to define the specific places you
            provide services.
          </span>
        </div>

        {/* Button Group */}
        <div className="flex gap-3 p-4 border-b border-gray-200 dark:border-gray-700 text-[11px]">
          <button
            onClick={handleAddNewArea}
            className="px-3 py-1.5 rounded bg-[#F1F5F9] text-gray-800 hover:bg-gray-200 font-medium text-[11px] flex items-center gap-1"
          >
            ➕ Add new area
          </button>
          <button
            onClick={handleEditArea}
            className="px-3 py-1.5 rounded bg-[#F1F5F9] text-gray-800 hover:bg-gray-200 font-medium text-[11px]"
          >
            ✏️ Toggle edit selected area
          </button>
          <button
            onClick={handleRemoveArea}
            className="px-3 py-1.5 rounded bg-[#F1F5F9] text-gray-800 hover:bg-gray-200 font-medium text-[11px]"
          >
            🗑 Remove selected area
          </button>
        </div>

        {/* Map */}
        <div className="h-70 w-full border-t border-b border-gray-200 dark:border-gray-700">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={center}
            zoom={10}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            <DrawingManager
              onLoad={(drawingManager) => (drawingRef.current = drawingManager)}
              drawingMode={drawingMode}
              onPolygonComplete={onPolygonComplete}
              options={{
                drawingControl: false,
                polygonOptions: {
                  fillColor: "#0077B6",
                  fillOpacity: 0.2,
                  strokeWeight: 2,
                  strokeColor: "#0077B6",
                  clickable: true,
                  editable: false,
                  zIndex: 1,
                },
              }}
            />
          </GoogleMap>
        </div>

        {/* Footer */}
        <div className="p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-[11px]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Back
          </button>
          <button
            onClick={onContinue}
            className="px-4 py-2 text-white bg-[#0077B6] hover:bg-[#005f8e] rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DrawOnMapModal;
