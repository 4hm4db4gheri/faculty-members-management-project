import { useState, useEffect } from 'react';
import { ChartDataItem1, ChartDataItem2 } from '../types/chart.types';
import { chartData1, chartData2, facultyChartOptions } from '../data/chartData';
import { ApiService } from '../Services/ApiService';

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
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // For now, use hardcoded data, but prepared for API integration
        // try {
        //   const response1 = await ApiService.get('/chart/chart1data');
        //   const response2 = await ApiService.get('/chart/chart2data');
        //   const optionsResponse = await ApiService.get('/chart/facultyoptions');
        //   setData1(response1.data);
        //   setData2(response2.data);
        //   setOptions(optionsResponse.data);
        // } catch (apiError) {
        //   console.error("API call failed, falling back to mock data:", apiError);
        // }

        // Fallback to mock data
        await new Promise(resolve => setTimeout(resolve, 300));
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