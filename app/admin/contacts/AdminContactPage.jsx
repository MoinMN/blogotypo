"use client";

import { useEffect, useMemo, useState } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import TableSkeleton from "@components/Skeletons/TableSkeleton";
import { formatDateForAdmin } from "@components/FormatDate";
import { exportUsersContactsToExcel, exportUsersContactsToPDF } from "@utils/exportdata";
import { useUI } from "@context/UIContext";
import UniversalPagination from "@components/UniversalPagination";

const AdminContactPage = () => {
  const { showAlert, showModal } = useUI();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryText = searchParams.get("text") || "";
  const queryPage = Number(searchParams.get("page")) || 1;
  const queryLimit = Number(searchParams.get("limit")) || 10;

  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [search, setSearch] = useState(queryText);
  const [currentPage, setCurrentPage] = useState(queryPage);
  const [itemsPerPage, setItemsPerPage] = useState(queryLimit);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);

  const fetchContacts = async () => {
    try {
      const response = await fetch("/api/admin/contact/get", { method: "GET" });
      const data = await response.json();
      if (response?.ok) {
        setContacts(data?.data || []);
        setShowSkeleton(false);
        return;
      }
      showAlert(data?.msg || "Failed to fetch contacts!", "danger");
    } catch (error) {
      console.log("Error while fetching contacts ", error);
      showAlert("Internal Server Error!", "danger");
      setShowSkeleton(false);
    }
  };

  // filter contacts
  useEffect(() => {
    const filtered = !queryText
      ? contacts
      : contacts.filter((contact) => {
        const text = queryText.toLowerCase();
        return (
          contact?.name?.toLowerCase()?.includes(text) ||
          contact?.email?.toLowerCase()?.includes(text) ||
          contact?.subject?.toLowerCase()?.includes(text) ||
          contact?.message?.toLowerCase()?.includes(text)
        );
      });
    setFilteredContacts(filtered);
  }, [contacts, queryText]);

  // paginated
  const paginatedContacts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredContacts.slice(start, start + itemsPerPage);
  }, [filteredContacts, currentPage, itemsPerPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    const params = new URLSearchParams(searchParams);
    if (search.trim()) params.set("text", search);
    else params.delete("text");
    params.set("page", 1);
    params.set("limit", itemsPerPage);
    router.push(`${pathname}?${params.toString()}`);
    setCurrentPage(1);
    setTimeout(() => setIsSearching(false), 300);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    params.set("limit", itemsPerPage);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleLimitChange = (e) => {
    const value = Number(e.target.value);
    setItemsPerPage(value);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams);
    params.set("limit", value);
    params.set("page", 1);
    router.push(`${pathname}?${params.toString()}`);
  };

  // single delete
  const handleDelete = (contactId) => {
    if (!contactId) return;
    showModal({
      title: "Confirmation",
      body: `Do you really want to delete this contact?`,
      actionBtn: "Delete",
      actionBtnVariant: "danger",
      confirmAction: async () => await handleConfirmDelete(contactId),
    });
  };

  const handleConfirmDelete = async (contactId) => {
    try {
      const response = await fetch(`/api/admin/contact/delete?contactId=${contactId}`, { method: "DELETE" });
      const data = await response.json();
      if (response.ok) {
        showAlert(data?.msg || "Contact deleted successfully!", "success");
        setContacts((prev) => prev.filter((c) => c._id !== contactId));
        return;
      }
      showAlert(data?.msg || "Failed to delete contact!", "danger");
    } catch (error) {
      console.log("Error while deleting contact ", error);
      showAlert("Internal Server Error!", "danger");
    }
  };

  // bulk delete
  const handleBulkDelete = () => {
    if (selectedContacts.length === 0) return;
    showModal({
      title: "Confirmation",
      body: `Delete ${selectedContacts.length} selected contacts?`,
      actionBtn: "Delete",
      actionBtnVariant: "danger",
      confirmAction: async () => {
        try {
          await Promise.all(
            selectedContacts.map((id) =>
              fetch(`/api/admin/contact/delete?contactId=${id}`, { method: "DELETE" })
            )
          );
          setContacts((prev) => prev.filter((c) => !selectedContacts.includes(c._id)));
          setSelectedContacts([]);
          setIsSelectionMode(false);
          showAlert("Selected contacts deleted successfully!", "success");
        } catch (error) {
          console.log(error);
          showAlert("Internal Server Error!", "danger");
        }
      },
    });
  };

  // select single
  const handleSelectContact = (id) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id]
    );
  };

  // select all on current page
  const handleSelectAll = () => {
    const currentIds = paginatedContacts.map((c) => c._id);
    const allSelected = currentIds.every((id) => selectedContacts.includes(id));
    if (allSelected) {
      setSelectedContacts((prev) => prev.filter((id) => !currentIds.includes(id)));
    } else {
      setSelectedContacts((prev) => [...new Set([...prev, ...currentIds])]);
    }
  };

  useEffect(() => { fetchContacts(); }, []);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 montserrat_alternates_font">
            Contact Requests
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage contact requests, exports and bulk actions
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export */}
          <div className="flex items-center overflow-hidden rounded-xl border border-gray-200 dark:border-gray-100/[0.08]">
            <button
              onClick={() => exportUsersContactsToExcel(contacts, "blogotypo_contacts", "Blogotypo Contacts")}
              className="px-3 py-2 text-sm bg-gray-100 dark:bg-[#0f172a] text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-100/[0.06] transition-all"
            >
              Excel
            </button>
            <div className="w-px h-5 bg-gray-200 dark:bg-gray-100/[0.08]" />
            <button
              onClick={() => exportUsersContactsToPDF(contacts, "blogotypo_contacts", "Blogotypo Contacts")}
              className="px-3 py-2 text-sm bg-gray-100 dark:bg-[#0f172a] text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-100/[0.06] transition-all"
            >
              PDF
            </button>
          </div>

          {/* Selection */}
          {!isSelectionMode ? (
            <button
              onClick={() => setIsSelectionMode(true)}
              className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-gray-100 text-sm font-medium transition-all"
            >
              Select
            </button>
          ) : (
            <>
              <button
                onClick={handleBulkDelete}
                disabled={selectedContacts.length === 0}
                className="px-3 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 disabled:opacity-40 text-gray-100 text-sm font-medium transition-all"
              >
                Delete ({selectedContacts.length})
              </button>
              <button
                onClick={() => { setSelectedContacts([]); setIsSelectionMode(false); }}
                className="px-3 py-2 rounded-xl bg-gray-200 dark:bg-gray-100/[0.06] text-gray-700 dark:text-gray-200 text-sm font-medium"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-2xl border border-gray-200 dark:border-gray-100/[0.08] bg-gray-100 dark:bg-[#0f172a]">
          <i className="fa-solid fa-magnifying-glass text-gray-400 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, subject or message..."
            className="w-full bg-transparent outline-none text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={itemsPerPage}
            onChange={handleLimitChange}
            className="px-3 py-2 rounded-2xl border border-gray-200 dark:border-gray-100/[0.08] bg-gray-100 dark:bg-[#0f172a] text-sm text-gray-700 dark:text-gray-200 outline-none"
          >
            {[10, 20, 30, 40, 50, 100].map((num) => (
              <option key={num} value={num} className="bg-gray-100 dark:bg-[#0f172a] text-gray-800 dark:text-gray-200">{num}</option>
            ))}
          </select>
          <button
            type="submit"
            disabled={isSearching}
            className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-gray-100 text-sm font-medium transition-all"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {/* Table */}
      {showSkeleton ? (
        <TableSkeleton />
      ) : paginatedContacts?.length ? (
        <>
          <div className="overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-100/[0.08] bg-gray-100 dark:!bg-[#0f172a]">
            <Table responsive="xl" hover className="mb-0 align-middle text-sm !bg-transparent text-gray-700 dark:text-gray-200">
              <thead className="!bg-gray-100 dark:!bg-[#0f172a] border-b border-gray-200 dark:border-gray-100/[0.06]">
                <tr className="!bg-gray-100 dark:!bg-[#0f172a]">
                  <th className="px-3 py-2 text-center !bg-gray-100 dark:!bg-[#0f172a] !text-gray-700 dark:!text-gray-300 font-semibold">
                    {isSelectionMode ? (
                      <Form.Check
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={paginatedContacts.every((c) => selectedContacts.includes(c._id))}
                      />
                    ) : "Sr"}
                  </th>
                  <th className="px-3 py-2 !bg-gray-100 dark:!bg-[#0f172a] !text-gray-700 dark:!text-gray-300 font-semibold">Name</th>
                  <th className="px-3 py-2 !bg-gray-100 dark:!bg-[#0f172a] !text-gray-700 dark:!text-gray-300 font-semibold">Email</th>
                  <th className="px-3 py-2 !bg-gray-100 dark:!bg-[#0f172a] !text-gray-700 dark:!text-gray-300 font-semibold">Subject</th>
                  <th className="px-3 py-2 min-w-[320px] !bg-gray-100 dark:!bg-[#0f172a] !text-gray-700 dark:!text-gray-300 font-semibold">Message</th>
                  <th className="px-3 py-2 !bg-gray-100 dark:!bg-[#0f172a] !text-gray-700 dark:!text-gray-300 font-semibold">Posted</th>
                  <th className="px-3 py-2 text-center !bg-gray-100 dark:!bg-[#0f172a] !text-gray-700 dark:!text-gray-300 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="!bg-gray-100 dark:!bg-[#0f172a]">
                {paginatedContacts?.map((contact, index) => (
                  <tr
                    key={contact?._id}
                    className="!bg-gray-100 dark:!bg-[#0f172a] border-b border-gray-200 dark:border-gray-100/[0.05] hover:!bg-gray-200 dark:hover:!bg-gray-100/[0.04] transition-all"
                  >
                    <td className="px-3 py-2 text-center !bg-transparent !text-gray-700 dark:!text-gray-300">
                      {isSelectionMode ? (
                        <Form.Check
                          type="checkbox"
                          checked={selectedContacts.includes(contact._id)}
                          onChange={() => handleSelectContact(contact._id)}
                        />
                      ) : (
                        index + 1 + (currentPage - 1) * itemsPerPage
                      )}
                    </td>
                    <td className="px-3 py-2 !bg-transparent">
                      <div className="font-medium !text-gray-800 dark:!text-gray-100">{contact?.name}</div>
                    </td>
                    <td className="px-3 py-2 !bg-transparent">
                      <Link
                        href={`mailto:${contact?.email}`}
                        target="_blank"
                        className="no-underline text-indigo-600 dark:text-indigo-300 hover:underline text-sm"
                      >
                        {contact?.email}
                      </Link>
                    </td>
                    <td className="px-3 py-2 !bg-transparent">
                      <div className="font-medium !text-gray-800 dark:!text-gray-100">{contact?.subject}</div>
                    </td>
                    <td className="px-3 py-2 !bg-transparent">
                      <p className="mb-0 line-clamp-3 text-sm !text-gray-600 dark:!text-gray-300">{contact?.message}</p>
                    </td>
                    <td className="px-3 py-2 gray-100space-nowrap !bg-transparent !text-gray-700 dark:!text-gray-300">
                      {formatDateForAdmin(contact?.postedOn)}
                    </td>
                    <td className="px-3 py-2 !bg-transparent">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleDelete(contact._id)}
                          className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all"
                        >
                          <i className="fa-solid fa-trash-can text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <UniversalPagination
            currentPage={currentPage}
            totalSize={filteredContacts.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="flex h-56 justify-center items-center">
          <h3 className="text-3xl md:text-5xl text-center font-semibold text-gray-400 caveat_font">
            No Contacts Found!
          </h3>
        </div>
      )}
    </div>
  );
}

export default AdminContactPage
