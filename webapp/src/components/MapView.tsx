import { useEffect, useRef } from 'react';
declare global { interface Window { mapgl: any } }

export const MapView = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current || !window.mapgl) return;
    const map = new window.mapgl.Map(ref.current, {
      key: 'dgis_public_api_key',
      center: [55.75, 37.62],
      zoom: 11,
    });
    return () => map.destroy();
  }, []);
  return <div ref={ref} style={{ height: 300 }} />;
};