"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CogsChart from "@/Components/Charts-Graph/cogschart";
import { sendApiRequest } from "@/utils/apiUtils";
import NoDataFound from "@/Components/UI/NoDataFound/NoDataFound";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface CogsPageData {
  storeid: string;
  startdate: string;
  enddate: string;
}

const CogsPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cogsData, setCogsData] = useState<{ sellername: string; producttotal: number }[]>([]);
  const [pageData, setPageData] = useState<CogsPageData | null>(null);
  const [chartColors, setChartColors] = useState<string[]>([]);

  // Color palette
  const colorPalette = ["#00CED1","#4682B4"];

  useEffect(() => {
    const storedData = localStorage.getItem("cogsPageData");
    if (storedData) {
      try {
        const parsedData: CogsPageData = JSON.parse(storedData);
        if (parsedData.storeid && parsedData.startdate && parsedData.enddate) {
          setPageData(parsedData);
        } else {
          setError("Incomplete data in storage");
          setLoading(false);
        }
      } catch (err) {
        setError("Error parsing stored data");
        setLoading(false);
      }
    } else {
      setError("Missing required parameters");
      setLoading(false);
    }
  }, []);

  const handleBackClick = () => {
    if (pageData) {
      router.push("/sales-kpi");
    }
  };

  useEffect(() => {
    if (!pageData) return;

    const { storeid, startdate, enddate } = pageData;

    const fetchCogsData = async () => {
      setLoading(true);
      try {
        const response: any = await sendApiRequest({
          mode: "getCOGS",
          storeid,
          startdate,
          enddate,
        });
        if (response?.status === 200) {
          const data = response.data.cogs || [];
          const sortedData = data.sort((a: any, b: any) => b.producttotal - a.producttotal);
          const maxValueIndex = sortedData.length > 0 ? 0 : -1;
          const colors = sortedData.map((_: any, index: number) =>
            index === maxValueIndex ? "#1E90FF" : colorPalette[index % colorPalette.length]
          );
          setCogsData(sortedData);
          setChartColors(colors);
        } else {
          setError("Failed to fetch COGS data");
        }
      } catch (err) {
        setError("Error fetching COGS data");
      } finally {
        setLoading(false);
      }
    };

    fetchCogsData();
  }, [pageData]);

  const renderTableSkeleton = (isMobile: boolean) => {
    const rowCount = 5;
    return (
      <table className="w-full border-collapse text-white table-fixed rounded-[10px] border border-[#E4E4EF]">
        <thead className="bg-[#0F1044] top-0 z-10">
          <tr>
            <th
              className={`text-center ${
                isMobile ? "px-2 py-1.5 text-[12px]" : "px-4 py-2 text-[15px]"
              } text-[#FFFFFF] font-normal border-r border-[#E4E4EF] w-[55%]`}
            >
              Label
            </th>
            <th
              className={`text-center ${
                isMobile ? "px-2 py-1.5 text-[12px]" : "px-4 py-2 text-[15px]"
              } text-[#FFFFFF] font-normal border-r border-[#E4E4EF] w-[22.5%]`}
            >
              Amount
            </th>
            <th
              className={`text-center ${
                isMobile ? "px-2 py-1.5 text-[12px]" : "px-4 py-2 text-[15px]"
              } text-[#FFFFFF] font-normal w-[22.5%]`}
            >
              %
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(rowCount)].map((_, index) => (
            <tr
              key={index}
              className={index % 2 === 1 ? "bg-[#F3F3F6]" : "bg-white"}
            >
              <td
                className={`${
                  isMobile
                    ? "px-2 py-1 text-[11px]"
                    : "px-4 py-1.5 text-[14px]"
                } border-r border-[#E4E4EF] text-left truncate flex items-center gap-2`}
              >
                <Skeleton circle width={isMobile ? 8 : 12} height={isMobile ? 8 : 12} />
                <Skeleton width="80%" />
              </td>
              <td
                className={`${
                  isMobile
                    ? "px-2 py-1 text-[11px]"
                    : "px-4 py-1.5 text-[14px]"
                } text-right border-r border-[#E4E4EF]`}
              >
                <Skeleton width="60%" />
              </td>
              <td
                className={`${
                  isMobile
                    ? "px-2 py-1 text-[11px]"
                    : "px-4 py-1.5 text-[14px]"
                } text-right`}
              >
                <Skeleton width="60%" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-red-500 text-center px-4">
        {error}
      </div>
    );
  }

  const canRenderChart = pageData?.storeid && pageData?.startdate && pageData?.enddate;

  return (
    <div className="w-full flex flex-col p-4 md:p-6">
      {/* Header with Back Button and Title */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-[#0F1044] hover:text-[#36A2EB] font-bold text-xl md:text-2xl transition-colors"
        >
          <svg
            className="w-5 h-5 md:w-6 md:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          COGS Chart
        </button>
      </div>

      {/* Mobile and Tablet View (below 2xl) */}
      <div className="flex flex-col gap-4 2xl:hidden">
        <div className="w-full flex justify-center">
          {loading ? (
            <div className="w-full max-w-[300px] h-[300px]">
              <Skeleton circle height="100%" width="100%" />
            </div>
          ) : canRenderChart && cogsData.length > 0 ? (
            <CogsChart
              storeid={pageData!.storeid}
              startdate={pageData!.startdate}
              enddate={pageData!.enddate}
              cogsData={cogsData}
              colors={chartColors}
            />
          ) : (
            <NoDataFound />
          )}
        </div>
        <div className="w-full flex justify-center items-center">
          <div className="w-full max-w-[99%] md:max-w-[31rem]">
            {loading ? (
              renderTableSkeleton(true)
            ) : cogsData.length > 0 ? (
              (() => {
                const total = cogsData.reduce((sum, item) => sum + item.producttotal, 0);
                return (
                  <table className="w-full border-collapse text-white table-fixed rounded-[10px] border border-[#E4E4EF]">
                    <thead className="bg-[#0F1044] top-0 z-10">
                      <tr>
                        <th className="text-center px-2 py-1.5 text-[#FFFFFF] font-normal text-[12px] border-r border-[#E4E4EF] w-[55%]">
                          Label
                        </th>
                        <th className="text-center px-2 py-1.5 text-[#FFFFFF] font-normal text-[12px] border-r border-[#E4E4EF] w-[22.5%]">
                          Amount
                        </th>
                        <th className="text-center px-2 py-1.5 text-[#FFFFFF] font-normal text-[12px] w-[22.5%]">
                          %
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cogsData.map((item, index) => (
                        <tr
                          key={index}
                          className={index % 2 === 1 ? "bg-[#F3F3F6]" : "bg-white"}
                        >
                          <td className="px-2 py-1 text-[#636363] text-[11px] border-r border-[#E4E4EF] text-left truncate flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: chartColors[index] || "#E0E0E0" }}
                            ></span>
                            {item.sellername === "Gordon Food Service Inc" ? item.sellername : item.sellername || "N/A"}
                          </td>
                          <td className="px-2 py-1 text-[#636363] text-[11px] text-right border-r border-[#E4E4EF]">
                            ${Math.round(item.producttotal).toLocaleString()}
                          </td>
                          <td className="px-2 py-1 text-[#636363] text-[11px] text-right">
                            {((item.producttotal / total) * 100).toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              })()
            ) : (
              <NoDataFound />
            )}
          </div>
        </div>
      </div>

      {/* Desktop View (2xl and above) */}
      <div className="hidden 2xl:flex 2xl:flex-row 2xl:gap-6 flex-1">
        <div className="w-full 2xl:w-2/3 flex justify-center items-center">
          {loading ? (
            <div className="w-full max-w-[450px] h-[450px]">
              <Skeleton circle height="100%" width="100%" />
            </div>
          ) : canRenderChart && cogsData.length > 0 ? (
            <CogsChart
              storeid={pageData!.storeid}
              startdate={pageData!.startdate}
              enddate={pageData!.enddate}
              cogsData={cogsData}
              colors={chartColors}
            />
          ) : (
            <NoDataFound />
          )}
        </div>
        <div className="w-full 2xl:w-1/3 flex justify-center items-center">
          <div className="w-full max-w-[31rem]">
            {loading ? (
              renderTableSkeleton(false)
            ) : cogsData.length > 0 ? (
              (() => {
                const total = cogsData.reduce((sum, item) => sum + item.producttotal, 0);
                return (
                  <table className="w-full border-collapse text-white table-fixed rounded-[10px] border border-[#E4E4EF]">
                    <thead className="bg-[#0F1044] top-0 z-10">
                      <tr>
                        <th className="text-center px-4 py-2 text-[#FFFFFF] font-normal text-[15px] border-r border-[#E4E4EF] w-[55%]">
                          Label
                        </th>
                        <th className="text-center px-4 py-2 text-[#FFFFFF] font-normal text-[15px] border-r border-[#E4E4EF] w-[22.5%]">
                          Amount
                        </th>
                        <th className="text-center px-4 py-2 text-[#FFFFFF] font-normal text-[15px] w-[22.5%]">
                          %
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cogsData.map((item, index) => (
                        <tr
                          key={index}
                          className={index % 2 === 1 ? "bg-[#F3F3F6]" : "bg-white"}
                        >
                          <td className="px-4 py-1.5 text-[#636363] text-[14px] border-r border-[#E4E4EF] text-left truncate flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: chartColors[index] || "#E0E0E0" }}
                            ></span>
                            {item.sellername === "Gordon Food Service Inc" ? item.sellername : item.sellername || "N/A"}
                          </td>
                          <td className="px-4 py-1.5 text-[#636363] text-[14px] text-right border-r border-[#E4E4EF]">
                            ${Math.round(item.producttotal).toLocaleString()}
                          </td>
                          <td className="px-4 py-1.5 text-[#636363] text-[14px] text-right">
                            {((item.producttotal / total) * 100).toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              })()
            ) : (
              <NoDataFound />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CogsPage;