import { APIProvider, Map as GoogleMap } from "@vis.gl/react-google-maps";
import type { MapProps } from "@vis.gl/react-google-maps";
import type { PropsWithChildren } from "react";
import { DEFAULT_CENTER } from "./constants";

export default function Map(props: PropsWithChildren<MapProps>) {
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        style={{ width: "100%", height: "90%" }}
        defaultCenter={DEFAULT_CENTER}
        defaultZoom={8}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        {...props}
      >
        {props.children}
      </GoogleMap>
    </APIProvider>
  );
}
