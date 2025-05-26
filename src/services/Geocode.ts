class Geocode {
  private readonly API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  async getLatLngByAddress(address: string): Promise<LatLng> {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${this.API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === "OK") {
        const location = data.results[0].geometry.location;

        return {
          lat: +location.lat,
          lng: +location.lng,
        };
      } else {
        throw new Error(`Geocode error: ${data.status}`);
      }
    } catch (error) {
      console.error("Error fetching geocode:", error);
      throw error;
    }
  }
}

export type LatLng = {
  lat: number;
  lng: number;
};

export default new Geocode();
