import XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportUsersContactsToPDF = (data, filename = "export") => {
  if (!Array.isArray(data) || data.length === 0) {
    console.error("No data to export.");
    return;
  }

  // Step 1: Format and flatten data like in Excel version
  const formattedData = data.map((item) => {
    const flattenedItem = { ...item };

    if (flattenedItem.user) {
      flattenedItem.name = flattenedItem.user.name || "";
      flattenedItem.email = flattenedItem.user.email || "";
      delete flattenedItem.user;
    }

    Object.keys(flattenedItem).forEach((key) => {
      const val = flattenedItem[key];
      if (typeof val === "string" && val.includes("T") && val.includes("Z")) {
        flattenedItem[key] = new Date(val).toLocaleString();
      }
    });

    return flattenedItem;
  });

  // Step 2: Extract headers from the keys of the first object
  const headers = Object.keys(formattedData[0] || {});

  // Step 3: Create table body
  const body = formattedData.map((row) =>
    headers.map((key) => row[key] ?? "")
  );

  // Step 4: Generate PDF in landscape mode
  const doc = new jsPDF("landscape");

  autoTable(doc, {
    head: [headers],
    body: body,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [22, 160, 133] },
  });

  doc.save(`${filename}.pdf`);
};

export const exportUsersContactsToExcel = (data, filename = "export", sheetName = "Sheet1") => {
  if (!Array.isArray(data) || data.length === 0) {
    console.error("No data to export.");
    return;
  }

  const formattedData = data.map((item) => {
    const flattenedItem = { ...item };

    // Flatten nested user fields
    if (flattenedItem.user) {
      flattenedItem.name = flattenedItem.user.name || "";
      flattenedItem.email = flattenedItem.user.email || "";
      delete flattenedItem.user;
    }

    // Format ISO date strings to JS Date objects
    Object.keys(flattenedItem).forEach((key) => {
      if (
        typeof flattenedItem[key] === "string" &&
        flattenedItem[key].includes("T") &&
        flattenedItem[key].includes("Z")
      ) {
        const date = new Date(flattenedItem[key]);
        flattenedItem[key] = date;
      }
    });

    return flattenedItem;
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  // Format Date cells
  Object.keys(worksheet).forEach((cellKey) => {
    const cell = worksheet[cellKey];
    if (cell && cell.v instanceof Date) {
      cell.t = "d";
      cell.z = "dd-mmm-yyyy hh:mm:ss";
    }
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, `${filename}.xlsx`);
};

export const exportBlogsToPDF = (data, filename = "blogs") => {
  if (!Array.isArray(data) || data.length === 0) {
    console.error("No data to export.");
    return;
  }

  const doc = new jsPDF("landscape");

  const headers = ["Title", "Category", "Creator Name", "Creator Email", "Date", "Image URL"];

  const body = data.map((blog) => {
    return [
      blog.title || "",
      (blog.categories || []).join(", "),
      blog.creator?.name || "",
      blog.creator?.email || "",
      blog.date ? new Date(blog.date).toLocaleString() : "",
      blog.thumbnail_image || "",
    ];
  });

  autoTable(doc, {
    head: [headers],
    body: body,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [44, 62, 80] },
  });

  doc.save(`${filename}.pdf`);
};

export const exportBlogsToExcel = async (data, filename = "blogs") => {
  if (!Array.isArray(data) || data.length === 0) {
    console.error("No data to export.");
    return;
  }

  const workbook = await XlsxPopulate.fromBlankAsync();
  const sheet = workbook.sheet(0);
  sheet.name("Blogs");

  // Set headers
  const headers = ["Title", "Category", "Creator Name", "Creator Email", "Date", "Image"];
  headers.forEach((header, i) => {
    sheet.cell(1, i + 1).value(header);
  });

  for (let i = 0; i < data.length; i++) {
    const blog = data[i];
    const row = i + 2;

    sheet.cell(row, 1).value(blog.title || "");
    sheet.cell(row, 2).value((blog.categories || []).join(", "));
    sheet.cell(row, 3).value(blog.creator?.name || "");
    sheet.cell(row, 4).value(blog.creator?.email || "");

    if (blog.date) {
      const jsDate = new Date(blog.date);
      sheet.cell(row, 5).value(jsDate).style("numberFormat", "dd-mmm-yyyy hh:mm:ss");
    }

    // Simply add the image URL as a link
    if (blog.thumbnail_image) {
      sheet.cell(row, 6).value(blog.thumbnail_image).hyperlink(blog.thumbnail_image);
      sheet.column(6).width(40); // Optional: Adjust column width for visibility
    }
  }

  const blob = await workbook.outputAsync();
  saveAs(blob, `${filename}.xlsx`);
};

