// src/assets/scripts/hooks/useChartData.ts

import { useState, useEffect } from 'react';
import { ChartDataItem1, ChartDataItem2 } from '../types/chart.types';
import { ApiService } from '../Services/ApiService'; // Import ApiService

// تعریف ساختار پاسخ API
interface ApiResponse<T> {
  data: T;
  error: boolean;
  message: string[];
}

// تعریف ساختار داده‌های خام دریافتی از API برای نمودارها
// این ساختار یک آبجکت است که کلیدهای آن نام دانشکده‌ها هستند
interface RawChartData1 {
  [facultyName: string]: {
    "استادیار": number;
    "دانشیار": number; // توجه: در API شما "دانشیار" است اما در اینترفیس شما " دانشيار" (با فاصله) بود. اینجا API را در نظر می‌گیریم.
    "استاد تمام": number;
  };
}

interface RawChartData2 {
  [facultyName: string]: {
    "پیمانی": number;
    "رسمی‌آزمایشی": number;
    "رسمی‌قطعی": number;
    "بازنشسته": number;
  };
}

interface UseChartDataReturn {
  chartData1: ChartDataItem1[] | null;
  chartData2: ChartDataItem2[] | null;
  facultyOptions: string[];
  isLoading: boolean;
  error: string | null;
}

export const useChartData = (
  selectedFaculties1: string[] = [], // دانشکده‌های انتخاب شده برای نمودار ۱
  selectedFaculties2: string[] = []  // دانشکده‌های انتخاب شده برای نمودار ۲
): UseChartDataReturn => {
  const [data1, setData1] = useState<ChartDataItem1[] | null>(null);
  const [data2, setData2] = useState<ChartDataItem2[] | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Only show loading spinner on initial load
        if (isInitialLoad) {
          setIsLoading(true);
        }
        setError(null);

        // 1. دریافت لیست دانشکده‌ها (فقط یک بار)
        if (options.length === 0) {
          const facultyApiResponse = await ApiService.get<ApiResponse<string[]>>('/panel/v1/teacher/faculties');
          if (facultyApiResponse.error) {
            throw new Error(facultyApiResponse.message.join(', ') || 'خطا در دریافت لیست دانشکده‌ها');
          }
          setOptions(facultyApiResponse.data);
        }

        // 2. دریافت داده‌های نمودار ۱ (مرتبه علمی) - فقط اگر دانشکده‌ای انتخاب شده باشد
        if (selectedFaculties1.length > 0) {
          const chart1ApiResponse = await ApiService.post<ApiResponse<RawChartData1>>(
            '/panel/v1/teacher/faculties/academic-ranks',
            selectedFaculties1
          );

          if (chart1ApiResponse.error) {
            throw new Error(chart1ApiResponse.message.join(', ') || 'خطا در دریافت داده‌های مرتبه علمی');
          }

          // تبدیل آبجکت دریافتی از API به آرایه‌ای از ChartDataItem1
          const transformedData1: ChartDataItem1[] = Object.entries(chart1ApiResponse.data).map(([name, ranks]) => ({
            name,
            // توجه به تطابق دقیق نام کلیدها با اینترفیس ChartDataItem1 و داده‌های API
            " دانشيار": ranks["دانشیار"] || 0,
            " استادیار": ranks["استادیار"] || 0,
            " استاد تمام": ranks["استاد تمام"] || 0,
          }));
          setData1(transformedData1);
        } else {
          // اگر هیچ دانشکده‌ای انتخاب نشده، داده‌ها را خالی کن
          setData1([]);
        }

        // 3. دریافت داده‌های نمودار ۲ (آمار تفکیکی اعضای هیئت علمی) - فقط اگر دانشکده‌ای انتخاب شده باشد
        if (selectedFaculties2.length > 0) {
          const chart2ApiResponse = await ApiService.post<ApiResponse<RawChartData2>>(
            '/panel/v1/teacher/faculties/employment-types',
            selectedFaculties2
          );

          if (chart2ApiResponse.error) {
            throw new Error(chart2ApiResponse.message.join(', ') || 'خطا در دریافت داده‌های آمار تفکیکی');
          }

          // تبدیل آبجکت دریافتی از API به آرایه‌ای از ChartDataItem2
          const transformedData2: ChartDataItem2[] = Object.entries(chart2ApiResponse.data).map(([name, types]) => ({
            name,
            // این بخش نیازمند تطابق دقیق کلیدهای API با اینترفیس ChartDataItem2 است.
            // بر اساس شماتیک جدید شما و داده‌های Mock قبلی، این نگاشت فرضی انجام شده است.
            // اگر API در آینده کلیدهای مستقیم‌تری را برگرداند، باید اینجا را تغییر دهید.
            " اجرایی": types["رسمی‌قطعی"] || 0, // فرض بر این است که "رسمی‌قطعی" در API معادل "اجرایی" در چارت است
            " انتقال": types["رسمی‌آزمایشی"] || 0, // فرض بر این است که "رسمی‌آزمایشی" در API معادل "انتقال" در چارت است
            " بازنشسته": types["بازنشسته"] || 0,
            " پیمانی": types["پیمانی"] || 0,
          }));
          setData2(transformedData2);
        } else {
          // اگر هیچ دانشکده‌ای انتخاب نشده، داده‌ها را خالی کن
          setData2([]);
        }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "خطا در بارگذاری داده‌های نمودار.";
        setError(errorMessage);
        console.error("Failed to fetch chart data:", err);
      } finally {
        if (isInitialLoad) {
          setIsLoading(false);
          setIsInitialLoad(false);
        }
      }
    };

    fetchData();
  }, [selectedFaculties1, selectedFaculties2, isInitialLoad, options.length]);

  return { chartData1: data1, chartData2: data2, facultyOptions: options, isLoading, error };
};