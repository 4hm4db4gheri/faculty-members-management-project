import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function StatisticsPanel() {
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');

  const facultyMembersData = {
    labels: [
      'علوم و فناوری زیستی',
      'مهندسی برق و کامپیوتر',
      'شیمی',
      'فیزیک',
      'معماری و شهرسازی',
      'عمران',
      'مکانیک',
      'مهندسی پزشکی',
      'ریاضی و علوم کامپیوتر',
      'مهندسی صنایع',
    ],
    datasets: [
      {
        label: 'پیمانی',
        data: [15, 18, 12, 8, 10, 9, 11, 8, 9, 7],
        backgroundColor: 'rgb(54, 162, 235)',
      },
      {
        label: 'رسمی-پیمانی',
        data: [8, 6, 10, 12, 9, 11, 7, 13, 12, 8],
        backgroundColor: 'rgb(255, 99, 132)',
      },
      {
        label: 'انتقالی',
        data: [5, 4, 6, 3, 7, 5, 4, 6, 5, 4],
        backgroundColor: 'rgb(75, 192, 192)',
      },
      {
        label: 'اخراجی',
        data: [1, 0, 2, 1, 0, 1, 0, 1, 2, 0],
        backgroundColor: 'rgb(255, 205, 86)',
      },
    ],
  };

  const academicRankData = {
    labels: [
      'علوم و فناوری زیستی',
      'مهندسی برق و کامپیوتر',
      'شیمی',
      'فیزیک',
      'معماری و شهرسازی',
      'عمران',
      'مکانیک',
      'مهندسی پزشکی',
      'ریاضی و علوم کامپیوتر',
      'مهندسی صنایع',
    ],
    datasets: [
      {
        label: 'استادیار',
        data: [20, 18, 22, 15, 16, 13, 18, 11, 14, 12],
        backgroundColor: 'rgb(54, 162, 235)',
      },
      {
        label: 'استاد تمام',
        data: [10, 8, 7, 15, 12, 14, 12, 21, 20, 13],
        backgroundColor: 'rgb(255, 99, 132)',
      },
      {
        label: 'دانشیار',
        data: [15, 17, 12, 10, 20, 18, 15, 8, 18, 17],
        backgroundColor: 'rgb(75, 192, 192)',
      },
    ],
  };

  return (
    <div className="flex flex-col p-6 bg-[#EBF2FA]">
      <div className="flex justify-between mb-8">
        <div className="w-64">
          <select 
            className="w-full p-2 rounded-lg bg-white"
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
          >
            <option value="">دانشکده</option>
            {facultyMembersData.labels.map((label) => (
              <option key={label} value={label}>{label}</option>
            ))}
          </select>
        </div>
        <div className="w-64">
          <select
            className="w-full p-2 rounded-lg bg-white"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="">گروه</option>
            <option value="group1">گروه 1</option>
            <option value="group2">گروه 2</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 mb-6">
        <h2 className="text-center mb-4 text-lg font-bold">آمار تفکیکی اعضای هیئت علمی</h2>
        <Bar 
          data={facultyMembersData}
          options={{
            responsive: true,
            scales: {
              x: { stacked: true },
              y: { stacked: true }
            },
            plugins: {
              legend: {
                position: 'bottom' as const,
                rtl: true,
                labels: {
                  font: {
                    family: 'IRANSans'
                  }
                }
              }
            }
          }}
        />
      </div>

      <div className="bg-white rounded-lg p-6">
        <h2 className="text-center mb-4 text-lg font-bold">مرتبه علمی</h2>
        <Bar 
          data={academicRankData}
          options={{
            responsive: true,
            scales: {
              x: { stacked: false },
              y: { stacked: false }
            },
            plugins: {
              legend: {
                position: 'bottom' as const,
                rtl: true,
                labels: {
                  font: {
                    family: 'IRANSans'
                  }
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
}