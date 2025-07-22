import { useState, useEffect } from 'react';
import { ChartDataItem1, ChartDataItem2 } from '../types/chart.types'; // Import interfaces
import { chartData1, chartData2, facultyChartOptions } from '../data/chartData'; // Import hardcoded data

interface UseChartDataReturn {
  chartData1: ChartDataItem1[] | null;
  chartData2: ChartDataItem2[] | null;
  facultyOptions: string[];
  isLoading: boolean;
  error: string | null;
}

export const useChartData = (): UseChartDataReturn => {
  const [data1, setData1] = useState<ChartDataItem1[] | null>(null);
  const [data2, setData2] = useState<ChartDataItem2[] | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // In a real application, you would make API calls here:
        // const response1 = await ApiService.get('/api/chart1data');
        // const response2 = await ApiService.get('/api/chart2data');
        // const optionsResponse = await ApiService.get('/api/facultyoptions');
        // setData1(response1.data);
        // setData2(response2.data);
        // setOptions(optionsResponse.data);

        // For now, use hardcoded data
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
        setData1(chartData1);
        setData2(chartData2);
        setOptions(facultyChartOptions);

      } catch (err) {
        setError("خطا در بارگذاری داده‌های نمودار.");
        console.error("Failed to fetch chart data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { chartData1: data1, chartData2: data2, facultyOptions: options, isLoading, error };
};