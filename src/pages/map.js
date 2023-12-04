import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "react-leaflet-markercluster/dist/styles.min.css";
import L from "leaflet";
import axios from "axios";

import MapHeader from "../components/MapHeader";
import markerIcon from "../assets/marker.png";
import activeMarkerIcon from "../assets/active_marker.png";

const MyMarkers = ({ map, data, active = false }) => {
  const pointerIcon = new L.Icon({
    iconUrl: active ? activeMarkerIcon : markerIcon,
    iconSize: [35, 36],
    iconAnchor: [20, 58],
    popupAnchor: [-2, -60],
  });

  return data.map(({ latitude, longitude, desc }, index) => (
    <Marker
      key={index}
      icon={pointerIcon}
      position={[latitude, longitude]}
      isNearest={active}
      eventHandlers={{
        click(e) {
          const location = e.target.getLatLng();
          map.flyToBounds([location]);
        },
      }}
    >
      <Popup>{desc}</Popup>
    </Marker>
  ));
};

const createClusterCustomIcon = function (cluster) {
  const count = cluster.getChildCount();
  const nearestCount = cluster
    .getAllChildMarkers()
    .filter((marker) => marker.options.isNearest).length;

  const digits = (count + "").length;

  return L.divIcon({
    html: count,
    className: `cluster digits-${digits} ${nearestCount ? "hasnearest" : ""}`,
    iconSize: null,
  });
};

const MapWrapper = () => {
  const [map, setMap] = useState(null);
  const [trucksPionts, setTrucksPionts] = useState([]);
  const [location, setLocation] = useState({
    lat: 37.7412902847707,
    lng: -122.49437792043544,
  });

  const {
    data: trucksPiontsData,
    status: trucksPiontsStatus,
    isFetching: loadingTrucksPionts,
    refetch: refetchTrucksPiontsData,
  } = useQuery("trucks", () => {
    return axios
      .get(
        `http://127.0.0.1:8000/api/food-trucks?lat=${location.lat}&lng=${location.lng}`
      )
      .then((res) => {
        return res.data;
      });
  });

  useEffect(() => {
    setTrucksPionts(trucksPiontsStatus === "success" ? trucksPiontsData : []);
  }, [trucksPiontsData, trucksPiontsStatus]);

  useEffect(() => {
    if (!map || !trucksPionts.nearests || !trucksPionts.remains) return;

    map.flyToBounds([...trucksPionts.nearests, ...trucksPionts.remains]);
  }, [trucksPionts, map]);

  return (
    <>
      <MapHeader
        loading={loadingTrucksPionts}
        location={location}
        setLocation={setLocation}
        onSearch={refetchTrucksPiontsData}
      />
      <MapContainer
        whenCreated={setMap}
        center={[location.lat, location.lng]}
        zoom={10}
      >
        <TileLayer url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"} />
        <MarkerClusterGroup
          spiderfyDistanceMultiplier={1}
          iconCreateFunction={createClusterCustomIcon}
          showCoverageOnHover
        >
          <MyMarkers map={map} data={trucksPionts?.nearests || []} active />
          <MyMarkers map={map} data={trucksPionts?.remains || []} />
        </MarkerClusterGroup>
      </MapContainer>
    </>
  );
};

export default MapWrapper;
