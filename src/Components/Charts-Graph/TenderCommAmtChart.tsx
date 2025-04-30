import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  ChartDataLabels
);

declare module 'chart.js' {
  interface ChartDataLabelsOptions {
    align?: 'start' | 'end' | 'center' | 'bottom' | 'left' | 'right' | 'top';
    anchor?: 'start' | 'end' | 'center' | 'bottom' | 'left' | 'right' | 'top';
    offset?: number;
    clamp?: boolean;
    clip?: boolean;
    color?: string | ((context: any) => string);
    font?: {
      size?: number;
    };
    formatter?: (value: any, context: any) => string;
    display?: boolean;
  }
}

const TenderCommAmtChart = ({ tenderData }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    setIsMobile(mediaQuery.matches);

    const handleResize = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handleResize);

    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  const totalCommission =
    tenderData?.reduce(
      (sum, row) => sum + ((row.payments * row.commission) / 100 || 0),
      0
    ) || 0;

  // Filter out tenders with zero or no commission amount
  const validData = tenderData
    ?.map((row) => ({
      ...row,
      commissionAmt: (row.payments * row.commission) / 100 || 0,
    }))
    .filter((row) => row.commissionAmt > 0) || [];

  const hasData = validData.length > 0 && totalCommission > 0;

  // Sort validData in descending order based on commissionAmt
  const sortedData = hasData
    ? [...validData].sort((a, b) => b.commissionAmt - a.commissionAmt)
    : [];

  // Adjust data to ensure minimum value for visualization
  const adjustedData = sortedData.map((row) => ({
    ...row,
    commissionAmt: Math.max(row.commissionAmt, totalCommission * 0.01),
  }));

  // Determine top 6 indices based on commission amount (descending order)
  const topIndices = validData
    .map((row, index) => ({ index, commissionAmt: row.commissionAmt }))
    .sort((a, b) => b.commissionAmt - a.commissionAmt)
    .slice(0, 6)
    .map((item) => item.index);

  const backgroundColors = [
    '#00BFFF',
    '#3CB371',
    '#FFA500',
    '#4B4B4B',
    '#DAB777',
    '#653C59',
    '#1F77B4',
    '#FF7F0E',
    '#2CA02C',
    '#D62728',
    '#9467BD',
    '#8C564B',
    '#E377C2',
    '#7F7F7F',
    '#BCBD22',
    '#17BECF',
    '#005082',
    '#A05195',
    '#F28E2B',
    '#76B7B2',
  ];

  const data = hasData
    ? {
        labels: adjustedData.map((row) => row.tendername || 'Unknown'),
        datasets: [
          {
            data: adjustedData.map((row) => row.commissionAmt),
            backgroundColor: backgroundColors.slice(0, adjustedData.length),
            borderWidth: 2.42,
            borderColor: '#FFFFFF',
            hoverOffset: 20,
            hoverBorderWidth: 3,
            hoverBorderColor: 'rgba(0, 0, 0, 0.5)',
            radius: '70%',
          },
        ],
      }
    : {
        labels: ['No Data Available'],
        datasets: [
          {
            data: [100],
            backgroundColor: ['#E0E0E0'],
            borderWidth: 2.42,
            borderColor: '#FFFFFF',
            hoverOffset: 0,
            hoverBorderWidth: 0,
            radius: '48%',
          },
        ],
      };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      datalabels: {
        display: hasData && !isMobile,
        color: (context) => backgroundColors[context.dataIndex % backgroundColors.length],
        font: {
          size: 14,
        },
        formatter: (value, context) => {
          const index = context.dataIndex;
          if (topIndices.includes(index)) {
            const originalCommissionAmt = adjustedData[index].commissionAmt;
            const percentage = ((originalCommissionAmt / totalCommission) * 100).toFixed(1);
            const label = context.chart.data.labels[index];
            return `${label.length > 10 ? label.slice(0, 10) + '...' : label}: ${percentage}%`;
          }
          return null;
        },
        align: 'end',
        anchor: 'end',
        offset: 8,
        clamp: true,
        clip: false,
      },
    },
    onHover: (event, chartElement) => {
      if (chartElement.length > 0) {
        setHoveredIndex(chartElement[0].index);
      } else {
        setHoveredIndex(null);
      }
    },
    animation: { duration: 300 },
  } as const;

  const renderCenterText = () => {
    if (!hasData) {
      return <p className="m-0 font-bold">No Data Available</p>;
    }

    if (hoveredIndex === null) {
      return (
        <p className="m-0 font-bold" style={{ fontSize: '28px' }}>
          ${Math.round(totalCommission).toLocaleString()}
        </p>
      );
    }

    // Use validData (unadjusted) instead of adjustedData for real values
    const originalItem = validData[hoveredIndex];
    const realCommissionAmt = (originalItem.payments * originalItem.commission) / 100 || 0;
    const percentage = ((realCommissionAmt / totalCommission) * 100).toFixed(2);
    const amount = Math.round(realCommissionAmt).toLocaleString();
    const label = originalItem.tendername || 'Unknown';
    const maxLength = 'Delivery-GrubHub Integ'.length;

    if (label.length > maxLength) {
      const words = label.split(' ');
      let firstLine = '';
      let secondLine = '';
      let currentLine = '';

      for (const word of words) {
        if ((currentLine + word).length <= maxLength) {
          currentLine += (currentLine ? ' ' : '') + word;
        } else {
          if (!firstLine) {
            firstLine = currentLine;
            currentLine = word;
          } else {
            secondLine += (secondLine ? ' ' : '') + word;
          }
        }
      }
      if (!secondLine) secondLine = currentLine;

      return (
        <div className="flex flex-col items-center space-y-1">
          <p className="m-0 font-bold text-sm">{firstLine}</p>
          <p className="m-0 font-bold text-sm">{secondLine}</p>
          <p className="m-0 text-sm">{percentage}%</p>
          <p className="m-0 text-sm">${amount}</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center space-y-1">
        <p className="m-0 font-bold text-sm">{label}</p>
        <p className="m-0 text-sm">{percentage}%</p>
        <p className="m-0 text-sm">${amount}</p>
      </div>
    );
  };

  return (
    <div className="relative w-full h-[360px] md:h-[432px] mx-auto rounded-lg pt-8 pb-8 below-md:w-[430px] below-md:h-[430px]">
      <Doughnut data={data} options={options} plugins={[ChartDataLabels]} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-base text-gray-800 max-w-[80%]">
        {renderCenterText()}
      </div>
    </div>
  );
};

export default TenderCommAmtChart;