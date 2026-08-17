"use client";

import { useState, useRef, useCallback } from "react";
import { sendApiRequest } from "@/utils/apiUtils";
import moment from "moment";

export interface QueueItem {
  id: string;
  file: File;
  fileName: string;
  status: "pending" | "uploading" | "success" | "error";
  message?: string;
}

export function useInvoiceUploadQueue(onAllComplete?: () => void) {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const isProcessingRef = useRef(false);

  const updateItem = (id: string, updates: Partial<QueueItem>) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const processOneFile = async (file: File): Promise<{ success: boolean; message: string }> => {
    // Validate PDF
    if (file.type !== "application/pdf") {
      return { success: false, message: "Not a PDF file" };
    }

    try {
      // Step 1: Extract PDF via external service
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(
        "https://hisabr-pdf-extractor.vercel.app/process-invoice",
        {
          method: "POST",
          body: formData,
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        return { success: false, message: "Failed to process PDF" };
      }

      // Step 2: Get store by name
      let getStore: any = [];
      if (responseData?.invoice_details?.store_name !== "Not Found") {
        getStore = await sendApiRequest({
          mode: "getStoreByName",
          storename: responseData?.invoice_details?.store_name,
        });
      }

      // Step 3: Check if invoice already exists
      const checkInvoiceUpload: any = await sendApiRequest({
        mode: "checkInvoiceExist",
        invoiceno: responseData?.invoice_details?.invoice_number,
        storename: responseData?.invoice_details?.store_name,
      });

      if (checkInvoiceUpload?.status !== 200) {
        return { success: false, message: "Invoice already uploaded" };
      }

      // Step 4: Insert invoice
      const jsonData: any = {
        mode: "insertInvoice",
        invoicenumber: responseData?.invoice_details?.invoice_number,
        invoicedate: moment(
          moment(
            responseData?.invoice_details?.invoice_date,
            "MM/DD/YYYY"
          ).toDate()
        ).format("YYYY-MM-DD"),
        storename: responseData?.invoice_details?.store_name,
        duedate: moment(
          moment(
            responseData?.invoice_details?.due_date,
            "MM/DD/YYYY"
          ).toDate()
        ).format("YYYY-MM-DD"),
        total: responseData?.invoice_details?.invoice_total,
        sellername: responseData?.invoice_details?.seller_name,
        quantity: responseData?.invoice_details?.qty_ship_total,
        producttotal:
          responseData?.invoice_details?.product_total ??
          responseData?.invoice_details?.sub_total,
        subtotal: responseData?.invoice_details?.sub_total,
        misc: responseData?.invoice_details?.misc,
        tax: responseData?.invoice_details?.tax_total,
        storeid: getStore?.data?.store?.[0]?.storeid ?? null,
      };

      const result: any = await sendApiRequest(jsonData);
      if (result?.status !== 200) {
        return { success: false, message: "Failed to insert invoice details" };
      }

      // Step 5: Insert bulk invoice items
      const val: any = {
        invoiceDetails: responseData?.invoice_items || [],
      };
      const res: any = await sendApiRequest(
        val,
        `insertBulkInvoiceItems?invoiceid=${result?.data?.invoiceid}`
      );

      if (res?.status === 200) {
        return { success: true, message: "Invoice uploaded successfully" };
      } else {
        return { success: false, message: "Failed to upload invoice items" };
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      return { success: false, message: "Invalid PDF format" };
    }
  };

  const processQueue = useCallback(async (currentQueue: QueueItem[]) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    let workingQueue = [...currentQueue];

    while (true) {
      const nextItem = workingQueue.find((item) => item.status === "pending");
      if (!nextItem) break;

      // Mark as uploading
      updateItem(nextItem.id, { status: "uploading" });

      const result = await processOneFile(nextItem.file);

      // Mark as success or error
      updateItem(nextItem.id, {
        status: result.success ? "success" : "error",
        message: result.message,
      });

      // Update working copy
      workingQueue = workingQueue.map((item) =>
        item.id === nextItem.id
          ? { ...item, status: result.success ? "success" as const : "error" as const, message: result.message }
          : item
      );
    }

    isProcessingRef.current = false;
    onAllComplete?.();
  }, [onAllComplete]);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const newItems: QueueItem[] = Array.from(files)
        .filter((file) => file.type === "application/pdf")
        .map((file) => ({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          fileName: file.name,
          status: "pending" as const,
        }));

      if (newItems.length === 0) return;

      setQueue((prev) => {
        const updated = [...prev, ...newItems];
        // Start processing if not already running
        if (!isProcessingRef.current) {
          // Use setTimeout to allow state to update before processing
          setTimeout(() => processQueue(updated), 0);
        }
        return updated;
      });
    },
    [processQueue]
  );

  const removeFromQueue = useCallback((id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id || item.status === "uploading"));
  }, []);

  const clearCompleted = useCallback(() => {
    setQueue((prev) =>
      prev.filter((item) => item.status === "pending" || item.status === "uploading")
    );
  }, []);

  const isProcessing = queue.some(
    (item) => item.status === "uploading" || item.status === "pending"
  );

  return {
    queue,
    isProcessing,
    addFiles,
    removeFromQueue,
    clearCompleted,
  };
}
