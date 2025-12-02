declare module 'react-leaflet-cluster' {
  import { ReactNode } from 'react';
  import { MarkerClusterGroupOptions } from 'leaflet';

  interface MarkerClusterGroupProps extends Partial<MarkerClusterGroupOptions> {
    children?: ReactNode;
    chunkedLoading?: boolean;
    maxClusterRadius?: number;
    spiderfyOnMaxZoom?: boolean;
    showCoverageOnHover?: boolean;
    zoomToBoundsOnClick?: boolean;
  }

  const MarkerClusterGroup: React.FC<MarkerClusterGroupProps>;
  export default MarkerClusterGroup;
}
