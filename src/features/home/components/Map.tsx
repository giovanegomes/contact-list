import { Marker } from "@vis.gl/react-google-maps";
import Map from "../../../components/Map";
import { useSelectedContactStore } from "../../../hooks/useSelectedContactStore";
import { useMemo } from "react";

export default function ContactsMap() {
  const { selectedContact } = useSelectedContactStore();

  const location = useMemo(() => {
    if (!selectedContact?.lat || !selectedContact?.lng) return;

    return { lat: selectedContact.lat, lng: selectedContact.lng };
  }, [selectedContact]);

  return (
    <Map center={location} zoom={15}>
      {location && <Marker position={location} />}
    </Map>
  );
}
