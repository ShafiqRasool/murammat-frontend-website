import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import API from '../utils/api';

export interface City {
  id: string;
  name: string;
}

export interface Area {
  id: string;
  city_id?: string;
  name: string;
}

export interface Service {
  id: string;
  name: string;
  category_id?: string;
}

interface DataContextType {
  cities: City[];
  areas: Area[];
  services: Service[];
  getAreasByCity: (cityId: string) => Area[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Fallback Static Data (used when API is unavailable or returns empty)
const STATIC_CITIES: City[] = [
  { id: 'ccc11111-1111-4111-8111-111111111111', name: 'Lahore' },
  { id: 'ccc22222-2222-4222-8222-222222222222', name: 'Karachi' },
  { id: 'ccc33333-3333-4333-8333-333333333333', name: 'Islamabad' }
];

const STATIC_AREAS: Area[] = [
  { id: 'aaa11111-1111-4111-8111-111111111111', city_id: 'ccc11111-1111-4111-8111-111111111111', name: 'Johar Town' },
  { id: 'aaa22222-2222-4222-8222-222222222222', city_id: 'ccc11111-1111-4111-8111-111111111111', name: 'DHA Phase 5' },
  { id: 'aaa33333-3333-4333-8333-333333333333', city_id: 'ccc11111-1111-4111-8111-111111111111', name: 'Gulberg III' },
  { id: 'aaa44444-4444-4444-8444-444444444444', city_id: 'ccc22222-2222-4222-8222-222222222222', name: 'Clifton' },
  { id: 'aaa55555-5555-4555-8555-555555555555', city_id: 'ccc22222-2222-4222-8222-222222222222', name: 'Defence Housing Authority' },
  { id: 'aaa66666-6666-4666-8666-666666666666', city_id: 'ccc33333-3333-4333-8333-333333333333', name: 'Blue Area' },
  { id: 'aaa77777-7777-4777-8777-777777777777', city_id: 'ccc33333-3333-4333-8333-333333333333', name: 'Sector F-7' }
];

const STATIC_SERVICES: Service[] = [
  { id: 'fff11111-1111-4111-8111-111111111111', name: 'Plumbing' },
  { id: 'fff22222-2222-4222-8222-222222222222', name: 'Electrical Repair' },
  { id: 'fff33333-3333-4333-8333-333333333333', name: 'Carpentry' },
  { id: 'fff44444-4444-4444-8444-444444444444', name: 'Home Cleaning' },
  { id: 'fff55555-5555-4555-8555-555555555555', name: 'AC Service & Repair' },
  { id: 'fff66666-6666-4666-8666-666666666666', name: 'Painting' }
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cities, setCities] = useState<City[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [citiesRes, areasRes, servicesRes] = await Promise.allSettled([
          API.get('/public/cities'),
          API.get('/public/areas'),
          API.get('/public/services') 
        ]);

        let loadedCities = STATIC_CITIES;
        let loadedAreas = STATIC_AREAS;
        let loadedServices = STATIC_SERVICES;

        if (citiesRes.status === 'fulfilled' && citiesRes.value.data.length > 0) {
          loadedCities = citiesRes.value.data;
        }

        if (areasRes.status === 'fulfilled' && areasRes.value.data.length > 0) {
          loadedAreas = areasRes.value.data;
        }

        // We check /public/services
        if (servicesRes.status === 'fulfilled' && servicesRes.value.data.length > 0) {
          loadedServices = servicesRes.value.data;
        } else {
          // Attempt alternate endpoint for services just in case
          try {
             const altServicesRes = await API.get('/public/services');
             if (altServicesRes.data?.length > 0) {
               loadedServices = altServicesRes.data;
             }
          } catch (e) {
            // retain static fallback
          }
        }

        setCities(loadedCities);
        setAreas(loadedAreas);
        setServices(loadedServices);

      } catch (error) {
        console.error('Error fetching data context, using static fallbacks', error);
        setCities(STATIC_CITIES);
        setAreas(STATIC_AREAS);
        setServices(STATIC_SERVICES);
      }
    };

    fetchInitialData();
  }, []);

  const getAreasByCity = (cityId: string) => {
    const filtered = areas.filter(a => a.city_id === cityId);
    // If not found in dynamic areas or backend hasn't joined city_id in some endpoints,
    // fallback logic might be needed but for now rely on exact match.
    return filtered.length > 0 ? filtered : STATIC_AREAS.filter(a => a.city_id === cityId);
  };

  return (
    <DataContext.Provider value={{ cities, areas, services, getAreasByCity }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
