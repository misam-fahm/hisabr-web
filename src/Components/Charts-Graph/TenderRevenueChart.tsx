import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { format } from 'date-fns';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import NoDataFound from '@/Components/UI/NoDataFound/NoDataFound';
import { sendApiRequest } from '@/utils/apiUtils';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface PluginOptionsByType<TType extends ChartType> {
  datalabels?: ChartDataLabelsOptions;
}

type ChartType = 'line' | 'bar' | 'radar' | 'doughnut' | 'pie' | 'polarArea' | 'bubble' | 'scatter';

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

interface TenderRevenueChartProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  storeid: number;
  setCustomToast: (toast: { message: string; type: string }) => void;
}

const predefinedColors = [
  '#00BFFF',
  '#3CB371',
  '#FFA500',
  '#4B4B4B',
  '#DAB777',
  '#653C59',
  '#1F77B4',
  '#FF7F0E',
  '#A05195',
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

const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const generateColors = (count: number) => {
  const colors = [...predefinedColors];
  if (count > predefinedColors.length) {
    const additionalColors = new Set<string>();
    while (additionalColors.size < count - predefinedColors.length) {
      additionalColors.add(generateRandomColor());
    }
    colors.push(...Array.from(additionalColors));
  }
  return colors.slice(0, count);
};

const TenderRevenueChart: React.FC<TenderRevenueChartProps> = ({
  startDate,
  endDate,
  storeid,
  setCustomToast,
}) => {
  const [tenderData, setTenderData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isLargeMobile, setIsLargeMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);
  const [isSpecificMobilePortrait, setIsSpecificMobilePortrait] = useState<boolean>(false);
  const [isSpecificTabletLandscape, setIsSpecificTabletLandscape] = useState<boolean>(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const largeMobileQuery = window.matchMedia('(min-width: 430px) and (max-width: 767px) and (min-height: 932px)');
    const tabletQuery = window.matchMedia('(min-width: 768px) and (max-width: 1024px)');
    const specificMobilePortraitQuery = window.matchMedia('(min-width: 414px) and (max-width: 414px) and (min-height: 896px) and (max-height: 896px)');
    const specificTabletLandscapeQuery = window.matchMedia('(min-width: 1180px) and (max-width: 1180px) and (min-height: 820px) and (max-height: 820px)');
    const landscapeQuery = window.matchMedia('(orientation: landscape)');

    setIsMobile(mobileQuery.matches);
    setIsLargeMobile(largeMobileQuery.matches);
    setIsTablet(tabletQuery.matches);
    setIsSpecificMobilePortrait(specificMobilePortraitQuery.matches);
    setIsSpecificTabletLandscape(specificTabletLandscapeQuery.matches);

    const handleMobileResize = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    const handleLargeMobileResize = (e: MediaQueryListEvent) => setIsLargeMobile(e.matches);
    const handleTabletResize = (e: MediaQueryListEvent) => setIsTablet(e.matches);
    const handleSpecificMobilePortraitResize = (e: MediaQueryListEvent) => setIsSpecificMobilePortrait(e.matches);
    const handleSpecificTabletLandscapeResize = (e: MediaQueryListEvent) => setIsSpecificTabletLandscape(e.matches);

    mobileQuery.addEventListener('change', handleMobileResize);
    largeMobileQuery.addEventListener('change', handleLargeMobileResize);
    tabletQuery.addEventListener('change', handleTabletResize);
    specificMobilePortraitQuery.addEventListener('change', handleSpecificMobilePortraitResize);
    specificTabletLandscapeQuery.addEventListener('change', handleSpecificTabletLandscapeResize);

    return () => {
      mobileQuery.removeEventListener('change', handleMobileResize);
      largeMobileQuery.removeEventListener('change', handleLargeMobileResize);
      tabletQuery.removeEventListener('change', handleTabletResize);
      specificMobilePortraitQuery.removeEventListener('change', handleSpecificMobilePortraitResize);
      specificTabletLandscapeQuery.removeEventListener('change', handleSpecificTabletLandscapeResize);
    };
  }, []);

  useEffect(() => {
    const fetchTenderData = async () => {
      try {
        setLoading(true);
        if (startDate && endDate) {
          const response: any = await sendApiRequest({
            mode: 'getLatestTenders',
            storeid,
            startdate: format(startDate, 'yyyy-MM-dd'),
            enddate: format(endDate, 'yyyy-MM-dd'),
          });

          if (response?.status === 200) {
            const tenders = response?.data?.tenders || [];
            const colors = generateColors(tenders.length);
            const enhancedTenderData = tenders.map((tender: any, index: number) => ({
              ...tender,
              color: colors[index],
            }));
            setTenderData(enhancedTenderData);
          } else {
            setCustomToast({
              message: response?.message || 'Failed to fetch tender data',
              type: 'error',
            });
            setTenderData([]);
          }
        }
      } catch (error) {
        console.error('Error fetching tender data:', error);
        setCustomToast({
          message: 'Error fetching tender data',
          type: 'error',
        });
        setTenderData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTenderData();
  }, [startDate, endDate, storeid, setCustomToast]);

  const totalRevenue = tenderData?.reduce((sum, row) => sum + (row.payments || 0), 0) || 0;
  const hasData = totalRevenue > 0;

  const adjustedData = hasData
    ? tenderData.map((row) => ({
        ...row,
        payments: Math.max(row.payments || 0, totalRevenue * 0.01),
      }))
    : tenderData;

  const topIndices = tenderData
    ? tenderData
        .map((row, index) => ({ index, payments: row.payments }))
        .sort((a, b) => b.payments - a.payments)
        .slice(0, 6)
        .map((item) => item.index)
    : [];

  const data = hasData
    ? {
        labels: adjustedData.map((row) => row.tendername || 'Unknown'),
        datasets: [
          {
            data: adjustedData.map((row) => row.payments),
            backgroundColor: adjustedData.map((row) => row.color || '#CCCCCC'),
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
            color: (context) => adjustedData[context.dataIndex]?.color || '#000000',
            font: {
              size: 12,
            },
            formatter: (value, context) => {
              const index = context.dataIndex;
              if (topIndices.includes(index)) {
                const originalPayments = tenderData[index]?.payments || 0;
                const percentage = (originalPayments / totalRevenue) * 100;
                const label = context.chart.data.labels[index];
                const isSpecificMobilePortrait = window.matchMedia('(min-width: 414px) and (max-width: 414px) and (min-height: 896px) and (max-height: 896px)').matches;
                const isSpecificTabletLandscape = window.matchMedia('(min-width: 1180px) and (max-width: 1180px) and (min-height: 820px) and (max-height: 820px)').matches;
                const maxLabelLength = isSpecificMobilePortrait ? 15 : isSpecificTabletLandscape ? 16 : 20;
                const formattedPercentage = percentage > 0.50 ? Math.round(percentage) : percentage.toFixed(1);
                return `${
                  label.length > maxLabelLength ? label.slice(0, maxLabelLength) + '...' : label
                }: ${formattedPercentage}%`;
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
      return <p className="m-0 font-bold text-[14px]">No Data Available</p>;
    }

    if (hoveredIndex === null) {
      return (
        <p className="m-0 font-bold" style={{ fontSize: '28px' }}>
          ${Math.round(totalRevenue).toLocaleString()}
        </p>
      );
    }

    const originalItem = tenderData[hoveredIndex];
    const percentage = ((originalItem.payments / totalRevenue) * 100).toFixed(2);
    const amount = Math.round(originalItem.payments).toLocaleString();
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
          <p className="m-0 font-bold text-[14px]">{firstLine}</p>
          <p className="m-0 font-bold text-[14px]">{secondLine}</p>
          <p className="m-0 text-[14px]">{percentage}%</p>
          <p className="m-0 text-[14px]">${amount}</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center space-y-1">
        <p className="m-0 font-bold text-[14px]">{label}</p>
        <p className="m-0 text-[14px]">{percentage}%</p>
        <p className="m-0 text-[14px]">${amount}</p>
      </div>
    );
  };

  const truncateTenderName = (name: string) => {
    const isSpecificMobilePortrait = window.matchMedia('(min-width: 414px) and (max-width: 414px) and (min-height: 896px) and (max-height: 896px)').matches;
    const isSpecificTabletLandscape = window.matchMedia('(min-width: 1180px) and (max-width: 1180px) and (min-height: 820px) and (max-height: 820px)').matches;
    const isLandscape = window.matchMedia('(orientation: landscape)').matches;
    const isLargeMobile = window.matchMedia('(min-width: 430px) and (max-width: 767px) and (min-height: 932px)').matches;
    const isTabletPortrait = window.matchMedia('(min-width: 760px) and (max-width: 1024px) and (min-height: 820px)').matches;

    // Show full name for specified resolutions and mobile landscape
    if (
      isLandscape ||
      isLargeMobile ||
      isTabletPortrait ||
      window.matchMedia('(min-width: 820px) and (max-width: 820px) and (min-height: 1180px) and (max-height: 1180px)').matches
    ) {
      return name;
    }

    // Apply character limits for specific cases
    if (isSpecificMobilePortrait) {
      return name.length > 15 ? name.slice(0, 15) + '..' : name;
    }
    if (isSpecificTabletLandscape) {
      return name.length > 16 ? name.slice(0, 16) + '..' : name;
    }

    // Default truncation for other mobile and tablet cases
    const maxLength = isTablet ? 25 : 15;
    return (isMobile || isTablet) && name.length > maxLength ? name.slice(0, maxLength) + '..' : name;
  };

  return (
    <div className="flex flex-row items-center justify-between below-md:flex-col tablet:flex-col 2xl:flex-row 2xl:gap-6">
      {/* Chart Section */}
      <div className="w-full flex justify-center items-center lg:mr-5 xl:mr-10 2xl:mr-20 2xl:translate-x-[10%]">
        {loading ? (
          <div className="relative w-[451.5px] h-[451.5px] sm:w-[493.5px] sm:h-[493.5px] tablet:w-[525px] tablet:h-[525px] rounded-lg pt-8 pb-8 flex justify-center items-center">
            <Skeleton circle height={200} width={200} />
          </div>
        ) : tenderData?.length === 0 ? (
          <div className="relative w-[451.5px] h-[451.5px] sm:w-[493.5px] sm:h-[493.5px] tablet:w-[525px] tablet:h-[525px] rounded-lg pt-8 pb-8 flex justify-center items-center">
            <NoDataFound />
          </div>
        ) : (
          <div className="relative w-[451.5px] h-[451.5px] sm:w-[493.5px] sm:h-[493.5px] tablet:w-[525px] tablet:h-[525px] rounded-lg pt-8 pb-8 flex justify-center items-center">
            <Doughnut data={data} options={options} plugins={[ChartDataLabels]} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-[14px] text-gray-800 max-w-[80%]">
              {renderCenterText()}
            </div>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="w-full below-md:w-full tablet:w-full lg:w-[125%] xl:w-[125%] 2xl:w-[86.56875%] flex justify-center items-center">
        <div className="w-full max-w-[99%] md:max-w-full lg:max-w-[125%] xl:max-w-[125%] 2xl:max-w-[86.56875%]">
          {loading ? (
            <table className="w-full border-collapse text-white table-fixed rounded-[10px] border border-[#E4E4EF]">
              <thead className="bg-[#0F1044] top-0 z-10 sticky">
                <tr>
                  <th className="text-center px-2 py-1.5 text-[#FFFFFF] font-normal text-[14px] border-r border-[#E4E4EF] w-[50%]">
                    Tender
                  </th>
                  <th className="text-center px-2 py-1.5 text-[#FFFFFF] font-normal text-[14px] border-r border-[#E4E4EF] w-[27.5%]">
                    Revenue
                  </th>
                  <th className="text-center px-2 py-1.5 text-[#FFFFFF] font-normal text-[14px] w-[22.5%]">
                    %
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, index) => (
                  <tr key={index} className={index % 2 === 1 ? 'bg-[#F3F3F6]' : 'bg-white'}>
                    <td className="px-2 py-1 text-[13px] border-r border-[#E4E4EF] text-left truncate flex items-center gap-1.5">
                      <Skeleton circle width={8} height={8} />
                      <Skeleton width="80%" />
                    </td>
                    <td className="px-2 py-1 text-[13px] text-right border-r border-[#E4E4EF]">
                      <Skeleton width="60%" />
                    </td>
                    <td className="px-2 py-1 text-[13px] text-right">
                      <Skeleton width="60%" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : tenderData?.length === 0 ? (
            <table className="w-full border-collapse text-white table-fixed rounded-[10px] border border-[#E4E4EF]">
              <thead className="bg-[#0F1044] top-0 z-10 sticky">
                <tr>
                  <th className="text-center px-2 py-1.5 text-[#FFFFFF] font-normal text-[14px] border-r border-[#E4E4EF] w-[50%]">
                    Tender
                  </th>
                  <th className="text-center px-2 py-1.5 text-[#FFFFFF] font-normal text-[14px] border-r border-[#E4E4EF] w-[27.5%]">
                    Revenue
                  </th>
                  <th className="text-center px-2 py-1.5 text-[#FFFFFF] font-normal text-[14px] w-[22.5%]">
                    %
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={3} className="px-2 py-1 text-[13px] text-center bg-white">
                    <NoDataFound />
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <table className="w-full border-collapse text-white table-fixed rounded-[10px] border border-[#E4E4EF]">
              <thead className="bg-[#0F1044] top-0 z-10 sticky">
                <tr>
                  <th className="text-center px-2 py-1.5 text-[#FFFFFF] font-normal text-[14px] border-r border-[#E4E4EF] w-[50%]">
                    Tender
                  </th>
                  <th className="text-center px-2 py-1.5 text-[#FFFFFF] font-normal text-[14px] border-r border-[#E4E4EF] w-[27.5%]">
                    Revenue
                  </th>
                  <th className="text-center px-2 py-1.5 text-[#FFFFFF] font-normal text-[14px] w-[22.5%]">
                    %
                  </th>
                </tr>
              </thead>
              <tbody>
                {tenderData
                  .sort((a, b) => (b.payments / totalRevenue) * 100 - (a.payments / totalRevenue) * 100)
                  .map((row, index) => (
                    <tr key={index} className={index % 2 === 1 ? 'bg-[#F3F3F6]' : 'bg-white'}>
                      <td className="px-2 py-1 text-[#636363] text-[13px] border-r border-[#E4E4EF] text-left truncate flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: row.color || '#E0E0E0' }}
                        ></span>
                        {truncateTenderName(row.tendername || 'N/A')}
                      </td>
                      <td className="px-2 py-1 text-[#636363] text-[13px] text-right border-r border-[#E4E4EF]">
                        ${Math.round(row.payments).toLocaleString()}
                      </td>
                      <td className="px-2 py-1 text-[#636363] text-[13px] text-right">
                        {((row.payments / totalRevenue) * 100).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenderRevenueChart;