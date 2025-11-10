// src/components/DataImport/URLImport.tsx
import { useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { validateWorkData } from '../../utils/dataProcessing';

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

        // Validate the structure of the imported data
        if (!validateWorkData(data)) {
          throw new Error('Invalid data structure');
        }

        setWorks(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to parse URL data:', err);
        const errorMessage = err instanceof Error && err.message === 'Invalid data structure'
          ? 'Invalid data format in URL. Please make sure the URL contains valid AO3 history data.'
          : 'Failed to parse data from URL. The data may be corrupted or in an invalid format.';
        setError(errorMessage);
        setIsLoading(false);
      }
    }
  }, [setWorks, setIsLoading, setError]);

  return null; // This component doesn't render anything
};