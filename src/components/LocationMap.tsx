"use client";

import { useEffect, useState } from "react";
import { Navigation, MapPin, AlertCircle } from "lucide-react";
import styles from "./LocationMap.module.css";

interface LocationMapProps {
  officeLat: number;
  officeLng: number;
  officeName: string;
  officeAddress: string;
}

interface VisitorCoords {
  lat: number;
  lng: number;
  accuracy: number;
}

export default function LocationMap({
  officeLat,
  officeLng,
  officeName,
  officeAddress,
}: LocationMapProps) {
  const [visitorCoords, setVisitorCoords] = useState<VisitorCoords | null>(null);
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "loading" | "granted" | "denied" | "unavailable"
  >("idle");

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("unavailable");
      return;
    }
    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setVisitorCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setLocationStatus("granted");
      },
      () => {
        setLocationStatus("denied");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Build OpenStreetMap embed URL
  const mapUrl = visitorCoords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${officeLng - 0.02}%2C${officeLat - 0.015}%2C${officeLng + 0.02}%2C${officeLat + 0.015}&layer=mapnik&marker=${officeLat}%2C${officeLng}`
    : `https://www.openstreetmap.org/export/embed.html?bbox=${officeLng - 0.02}%2C${officeLat - 0.015}%2C${officeLng + 0.02}%2C${officeLat + 0.015}&layer=mapnik&marker=${officeLat}%2C${officeLng}`;

  // Google Maps directions URL
  const directionsUrl = visitorCoords
    ? `https://www.google.com/maps/dir/${visitorCoords.lat},${visitorCoords.lng}/${officeLat},${officeLng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${officeLat},${officeLng}`;

  return (
    <div className={styles.wrapper}>
      {/* Location status banner */}
      {locationStatus === "loading" && (
        <div className={`${styles.banner} ${styles.bannerInfo}`}>
          <div className={styles.spinner} />
          Accessing your location to show directions…
        </div>
      )}
      {locationStatus === "granted" && visitorCoords && (
        <div className={`${styles.banner} ${styles.bannerSuccess}`}>
          <MapPin size={14} />
          Your location detected — directions are personalized from your current position
        </div>
      )}
      {locationStatus === "denied" && (
        <div className={`${styles.banner} ${styles.bannerWarning}`}>
          <AlertCircle size={14} />
          Location access denied — map shows office location only
        </div>
      )}

      {/* Map embed */}
      <div className={styles.mapContainer}>
        <iframe
          src={mapUrl}
          className={styles.mapFrame}
          title={`Map to ${officeName}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Office details + Directions CTA */}
      <div className={styles.officeRow}>
        <div className={styles.officeInfo}>
          <MapPin size={16} className={styles.pinIcon} />
          <div>
            <p className={styles.officeName}>{officeName}</p>
            <p className={styles.officeAddr}>{officeAddress}</p>
          </div>
        </div>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          id="get-directions-btn"
          style={{ flexShrink: 0 }}
        >
          <Navigation size={15} />
          Get Directions
        </a>
      </div>
    </div>
  );
}
