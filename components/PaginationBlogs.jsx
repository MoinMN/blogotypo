"use client";

import { useEffect, useState } from "react";
import Pagination from "react-bootstrap/Pagination";
import 'bootstrap/dist/css/bootstrap.min.css';

const PaginationBlogs = ({ entireData, itemsPerPage, onPageChange }) => {
  const [paginationSize, setPaginationSize] = useState("default");
  const [activePage, setActivePage] = useState(1);

  const totalPages = Math.ceil(entireData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const paginatedData = entireData.slice(startIndex, startIndex + itemsPerPage);
    onPageChange(paginatedData);
  };


  useEffect(() => {
    const handleResize = () => {
      setPaginationSize(window.innerWidth <= 640 ? "sm" : "default");
    };

    handleResize(); // Set size on initial render
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Pagination className="flex justify-center flex-wrap" size={paginationSize}>
      <Pagination.First
        disabled={activePage === 1}
        onClick={() => handlePageChange(1)}
        className="hidden sm:block"
      />
      <Pagination.Prev
        disabled={activePage === 1}
        onClick={() => handlePageChange(activePage - 1)}
      />
      {[...Array(totalPages)].map((_, index) => (
        <Pagination.Item
          key={index}
          active={index + 1 === activePage}
          onClick={() => handlePageChange(index + 1)}
        >
          {index + 1}
        </Pagination.Item>
      ))}
      <Pagination.Next
        disabled={activePage === totalPages}
        onClick={() => handlePageChange(activePage + 1)}
      />
      <Pagination.Last
        disabled={activePage === totalPages}
        onClick={() => handlePageChange(totalPages)}
        className="hidden sm:block"
      />
    </Pagination>
  );
};

export default PaginationBlogs;
