// src/components/DataImport/URLImport.tsx
import { useEffect } from 'react';
import { useData } from '../../context/DataContext';

export const URLImport = () => {
  const { setWorks, setIsLoading, setError } = useData();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('data');
    
    if (encodedData) {
      setIsLoading(true);
      
      try {
        // Decode the base64 encoded data from the URL
        const jsonString = decodeURIComponent(atob(encodedData));
        const data = JSON.parse(jsonString);
        
        setWorks(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to parse URL data:', err);
        setError('Failed to parse data from URL. The data may be corrupted or in an invalid format.');
        setIsLoading(false);
      }
    }
  }, [setWorks, setIsLoading, setError]);

  return null; // This component doesn't render anything
};