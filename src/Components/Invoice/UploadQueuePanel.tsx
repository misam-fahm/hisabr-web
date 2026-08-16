"use client";

import React, { useState } from "react";
import { QueueItem } from "@/hooks/useInvoiceUploadQueue";

interface UploadQueuePanelProps {
  queue: QueueItem[];
  onRemove: (id: string) => void;
  onClearCompleted: () => void;
}

const UploadQueuePanel: React.FC<UploadQueuePanelProps> = ({
  queue,
  onRemove,
  onClearCompleted,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (queue.length === 0) return null;

  const completedCount = queue.filter(
    (item) => item.status === "success" || item.status === "error"
  ).length;
  const totalCount = queue.length;
  const uploadingItem = queue.find((item) => item.status === "uploading");
  const hasCompleted = completedCount > 0;
  const isAllDone = completedCount === totalCount;

  const getStatusIcon = (status: QueueItem["status"]) => {
    switch (status) {
      case "pending":
        return (
          <span className="text-[#9CA3AF] text-[14px]" title="Waiting">
            ⏳
          </span>
        );
      case "uploading":
        return (
          <span className="inline-block animate-spin text-[14px]" title="Uploading">
            ⟳
          </span>
        );
      case "success":
        return (
          <span className="text-[#168A6F] text-[14px]" title="Success">
            ✓
          </span>
        );
      case "error":
        return (
          <span className="text-[#CD6D6D] text-[14px]" title="Failed">
            ✗
          </span>
        );
    }
  };

  const getStatusColor = (status: QueueItem["status"]) => {
    switch (status) {
      case "pending":
        return "bg-[#F3F4F6]";
      case "uploading":
        return "bg-[#E8F5F1]";
      case "success":
        return "bg-[#F0FDF4]";
      case "error":
        return "bg-[#FEF2F2]";
    }
  };

  return (
    <div
      className="fixed bottom-4 right-4 z-[100] w-[340px] below-md:w-[calc(100%-24px)] below-md:right-3 below-md:bottom-[80px] rounded-lg shadow-2xl border border-[#E4E4EF] overflow-hidden"
      style={{
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-[#0F1044] text-white cursor-pointer select-none"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          {!isAllDone && (
            <span className="inline-block w-2 h-2 rounded-full bg-[#168A6F] animate-pulse" />
          )}
          <span className="text-[13px] font-medium">
            {isAllDone
              ? `Upload Complete (${totalCount})`
              : `Uploading Invoices (${completedCount}/${totalCount})`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {hasCompleted && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClearCompleted();
              }}
              className="text-[11px] text-[#9CA3AF] hover:text-white transition-colors"
              title="Clear completed"
            >
              Clear
            </button>
          )}
          <span
            className={`text-[12px] transition-transform duration-200 ${
              isCollapsed ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </div>
      </div>

      {/* Progress bar */}
      {!isAllDone && (
        <div className="h-[3px] bg-[#E4E4EF]">
          <div
            className="h-full bg-[#168A6F] transition-all duration-500 ease-out"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      )}

      {/* File list */}
      {!isCollapsed && (
        <div className="bg-white max-h-[250px] overflow-y-auto scrollbar-thin">
          {queue.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between px-4 py-2.5 border-b border-[#F3F3F6] last:border-b-0 ${getStatusColor(
                item.status
              )} transition-colors duration-300`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {getStatusIcon(item.status)}
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] text-[#3D3D3D] truncate font-medium">
                    {item.fileName}
                  </p>
                  {item.status === "error" && item.message && (
                    <p className="text-[10px] text-[#CD6D6D] mt-0.5 truncate">
                      {item.message}
                    </p>
                  )}
                  {item.status === "success" && (
                    <p className="text-[10px] text-[#168A6F] mt-0.5">
                      Uploaded successfully
                    </p>
                  )}
                  {item.status === "uploading" && (
                    <p className="text-[10px] text-[#636363] mt-0.5">
                      Processing...
                    </p>
                  )}
                </div>
              </div>
              {item.status === "pending" && (
                <button
                  onClick={() => onRemove(item.id)}
                  className="ml-2 text-[#9CA3AF] hover:text-[#CD6D6D] transition-colors flex-shrink-0"
                  title="Remove from queue"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadQueuePanel;
