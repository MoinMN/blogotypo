"use client";

import { useEffect, useMemo, useState } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Image from "next/image";
import Link from "next/link";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import TableSkeleton from "@components/Skeletons/TableSkeleton";
import { formatDateForAdmin } from "@components/FormatDate";
import useMetadata from "@hooks/metadata";
import {
  exportUsersContactsToExcel,
  exportUsersContactsToPDF,
} from "@utils/exportdata";
import { useUI } from "@context/UIContext";
import UniversalPagination from "@components/UniversalPagination";

const AdminUserPage = () => {


  const { showAlert, showModal } = useUI();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryText = searchParams.get("text") || "";
  const queryPage = Number(searchParams.get("page")) || 1;
  const queryLimit = Number(searchParams.get("limit")) || 10;

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [search, setSearch] = useState(queryText);

  const [currentPage, setCurrentPage] =
    useState(queryPage);

  const [itemsPerPage, setItemsPerPage] =
    useState(queryLimit);

  const [showSkeleton, setShowSkeleton] =
    useState(true);

  const [isSearching, setIsSearching] =
    useState(false);

  // selection
  const [isSelectionMode, setIsSelectionMode] =
    useState(false);

  const [selectedUsers, setSelectedUsers] =
    useState([]);

  // update user
  const [isUpdating, setIsUpdating] = useState({
    id: "",
    top_creator: false,
  });

  // fetch users
  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "/api/admin/user/get",
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (response?.ok) {
        setUsers(data?.data || []);
        setShowSkeleton(false);
        return;
      }

      showAlert(
        data?.msg || "Failed to fetch users!",
        "danger"
      );
    } catch (error) {
      console.log(
        "Error while fetching users data ",
        error
      );

      showAlert("Internal Server Error!", "danger");

      setShowSkeleton(false);
    }
  };

  // filter users
  useEffect(() => {
    let filtered = [];

    if (!queryText) {
      filtered = users;
    } else {
      filtered = users.filter((user) => {
        const text = queryText.toLowerCase();

        return (
          user?.name
            ?.toLowerCase()
            ?.includes(text) ||
          user?.email
            ?.toLowerCase()
            ?.includes(text) ||
          user?.provider
            ?.toLowerCase()
            ?.includes(text)
        );
      });
    }

    setFilteredUsers(filtered);
  }, [users, queryText]);

  // pagination users
  const paginatedUsers = useMemo(() => {
    const start =
      (currentPage - 1) * itemsPerPage;

    const end = start + itemsPerPage;

    return filteredUsers.slice(start, end);
  }, [
    filteredUsers,
    currentPage,
    itemsPerPage,
  ]);

  // search
  const handleSearch = (e) => {
    e.preventDefault();

    setIsSearching(true);

    const params = new URLSearchParams(
      searchParams
    );

    if (search.trim()) {
      params.set("text", search);
    } else {
      params.delete("text");
    }

    params.set("page", 1);
    params.set("limit", itemsPerPage);

    router.push(
      `${pathname}?${params.toString()}`
    );

    setCurrentPage(1);

    setTimeout(() => {
      setIsSearching(false);
    }, 300);
  };

  // pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);

    const params = new URLSearchParams(
      searchParams
    );

    params.set("page", page);
    params.set("limit", itemsPerPage);

    router.push(
      `${pathname}?${params.toString()}`
    );
  };

  // limit
  const handleLimitChange = (e) => {
    const value = Number(e.target.value);

    setItemsPerPage(value);

    setCurrentPage(1);

    const params = new URLSearchParams(
      searchParams
    );

    params.set("limit", value);
    params.set("page", 1);

    router.push(
      `${pathname}?${params.toString()}`
    );
  };

  // select user
  const handleSelectUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id)
        ? prev.filter(
          (userId) => userId !== id
        )
        : [...prev, id]
    );
  };

  // select all
  const handleSelectAll = () => {
    const currentIds = paginatedUsers.map(
      (user) => user._id
    );

    const allSelected = currentIds.every(
      (id) => selectedUsers.includes(id)
    );

    if (allSelected) {
      setSelectedUsers((prev) =>
        prev.filter(
          (id) => !currentIds.includes(id)
        )
      );
    } else {
      setSelectedUsers((prev) => [
        ...new Set([
          ...prev,
          ...currentIds,
        ]),
      ]);
    }
  };

  // bulk verify
  const handleBulkVerify = async (
    verified
  ) => {
    if (!selectedUsers.length) return;

    showModal({
      title: "Confirmation",

      body: `Do you really want to ${verified ? "verify" : "unverify"
        } ${selectedUsers.length} users?`,

      actionBtn: "Confirm",

      actionBtnVariant: verified
        ? "success"
        : "warning",

      confirmAction: async () => {
        try {
          const response = await fetch(
            "/api/admin/user/bulk/toggle-verify",
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                ids: selectedUsers,
                top_creator: verified,
              }),
            }
          );

          const data = await response.json();

          if (response.ok) {
            showAlert(
              data?.msg ||
              "Users updated successfully!",
              "success"
            );

            fetchUsers();

            setSelectedUsers([]);
            setIsSelectionMode(false);

            return;
          }

          showAlert(
            data?.msg ||
            "Failed to update users!",
            "danger"
          );
        } catch (error) {
          console.log(error);

          showAlert(
            "Internal Server Error!",
            "danger"
          );
        }
      },
    });
  };

  // bulk delete
  const handleBulkDelete = () => {
    if (!selectedUsers.length) return;

    showModal({
      title: "Confirmation",

      body: `Delete ${selectedUsers.length} selected users?`,

      actionBtn: "Delete",

      actionBtnVariant: "danger",

      confirmAction: async () => {
        try {
          const response = await fetch(
            "/api/admin/user/bulk/delete-user",
            {
              method: "DELETE",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                ids: selectedUsers,
              }),
            }
          );

          const data = await response.json();

          if (response.ok) {
            showAlert(
              data?.msg ||
              "Users deleted successfully!",
              "success"
            );

            setUsers((prev) =>
              prev.filter(
                (user) =>
                  !selectedUsers.includes(
                    user._id
                  )
              )
            );

            setSelectedUsers([]);
            setIsSelectionMode(false);

            return;
          }

          showAlert(
            data?.msg ||
            "Failed to delete users!",
            "danger"
          );
        } catch (error) {
          console.log(error);

          showAlert(
            "Internal Server Error!",
            "danger"
          );
        }
      },
    });
  };

  // save user
  const handleSaveUserData = async () => {
    try {
      const response = await fetch(
        "/api/admin/user/update",
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(isUpdating),
        }
      );

      const data = await response.json();

      if (response.ok) {
        showAlert(
          data?.msg ||
          "User updated successfully!",
          "success"
        );

        fetchUsers();

        setIsUpdating({
          id: "",
          top_creator: false,
        });

        return;
      }

      showAlert(
        data?.msg ||
        "Failed to update user!",
        "danger"
      );
    } catch (error) {
      console.log(error);

      showAlert(
        "Internal Server Error!",
        "danger"
      );
    }
  };

  // single delete
  const handleDelete = (userId, userName) => {
    showModal({
      title: "Confirmation",

      body: `Do you really want to delete "${userName}"?`,

      actionBtn: "Delete",

      actionBtnVariant: "danger",

      confirmAction: async () =>
        await handleConfirmDelete(userId),
    });
  };

  const handleConfirmDelete = async (
    userId
  ) => {
    try {
      const response = await fetch(
        `/api/admin/user/delete?userId=${userId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.ok) {
        showAlert(
          data?.msg ||
          "User deleted successfully!",
          "success"
        );

        setUsers((prev) =>
          prev.filter(
            (user) => user._id !== userId
          )
        );

        return;
      }

      showAlert(
        data?.msg ||
        "Failed to delete user!",
        "danger"
      );
    } catch (error) {
      console.log(error);

      showAlert(
        "Internal Server Error!",
        "danger"
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3
            className="
              text-2xl md:text-3xl
              font-bold
              text-gray-900 dark:text-gray-100
              montserrat_alternates_font
            "
          >
            Users
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage users, exports and bulk actions
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* export */}
          <div
            className="
              flex items-center overflow-hidden
              rounded-xl
              border border-gray-200 dark:border-gray-100/[0.08]
            "
          >
            <button
              onClick={() =>
                exportUsersContactsToExcel(
                  users,
                  "blogotypo_users",
                  "Blogotypo Users"
                )
              }
              className="
                px-3 py-2 text-sm
                bg-gray-100 dark:bg-[#0f172a]
                text-gray-700 dark:text-gray-200
                hover:bg-gray-200 dark:hover:bg-gray-100/[0.06]
                transition-all
              "
            >
              Excel
            </button>

            <div className="w-px h-5 bg-gray-200 dark:bg-gray-100/[0.08]" />

            <button
              onClick={() =>
                exportUsersContactsToPDF(
                  users,
                  "blogotypo_users"
                )
              }
              className="
                px-3 py-2 text-sm
                bg-gray-100 dark:bg-[#0f172a]
                text-gray-700 dark:text-gray-200
                hover:bg-gray-200 dark:hover:bg-gray-100/[0.06]
                transition-all
              "
            >
              PDF
            </button>
          </div>

          {/* selection */}
          {!isSelectionMode ? (
            <button
              onClick={() =>
                setIsSelectionMode(true)
              }
              className="
                px-3 py-2 rounded-xl
                bg-indigo-600 hover:bg-indigo-500
                text-gray-100 text-sm font-medium
                transition-all
              "
            >
              Select
            </button>
          ) : (
            <>
              <button
                onClick={() =>
                  handleBulkVerify(true)
                }
                disabled={
                  selectedUsers.length === 0
                }
                className="
                  px-3 py-2 rounded-xl
                  bg-emerald-500 hover:bg-emerald-400
                  disabled:opacity-40
                  text-gray-100 text-sm font-medium
                  transition-all
                "
              >
                Verify ({selectedUsers.length})
              </button>

              <button
                onClick={() =>
                  handleBulkVerify(false)
                }
                disabled={
                  selectedUsers.length === 0
                }
                className="
                  px-3 py-2 rounded-xl
                  bg-amber-500 hover:bg-amber-400
                  disabled:opacity-40
                  text-gray-100 text-sm font-medium
                  transition-all
                "
              >
                Unverify
              </button>

              <button
                onClick={handleBulkDelete}
                disabled={
                  selectedUsers.length === 0
                }
                className="
                  px-3 py-2 rounded-xl
                  bg-rose-500 hover:bg-rose-400
                  disabled:opacity-40
                  text-gray-100 text-sm font-medium
                  transition-all
                "
              >
                Delete
              </button>

              <button
                onClick={() => {
                  setSelectedUsers([]);
                  setIsSelectionMode(false);
                }}
                className="
                  px-3 py-2 rounded-xl
                  bg-gray-200 dark:bg-gray-100/[0.06]
                  text-gray-700 dark:text-gray-200
                  text-sm font-medium
                "
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="
          flex flex-col md:flex-row gap-2
        "
      >
        <div
          className="
            flex-1 flex items-center gap-2
            px-3 py-2 rounded-2xl
            border border-gray-200 dark:border-gray-100/[0.08]
            bg-gray-100 dark:bg-[#0f172a]
          "
        >
          <i className="fa-solid fa-magnifying-glass text-gray-400 text-sm" />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search name, email or provider..."
            className="
              w-full bg-transparent outline-none
              text-sm
              text-gray-800 dark:text-gray-100
              placeholder:text-gray-400 dark:placeholder:text-gray-500
            "
          />
        </div>

        <div className="flex items-center gap-2">
          {/* limit */}
          <select
            value={itemsPerPage}
            onChange={handleLimitChange}
            className="
              px-3 py-2 rounded-2xl
              border border-gray-200 dark:border-gray-100/[0.08]
              bg-gray-100 dark:bg-[#0f172a]
              text-sm
              text-gray-700 dark:text-gray-200
              outline-none
            "
          >
            {[10, 20, 30, 40, 50, 100].map(
              (num) => (
                <option
                  key={num}
                  value={num}
                  className="bg-gray-100 dark:bg-[#0f172a] text-gray-800 dark:text-gray-200"
                >
                  {num}
                </option>
              )
            )}
          </select>

          <button
            type="submit"
            disabled={isSearching}
            className="
              px-4 py-2 rounded-2xl
              bg-indigo-600 hover:bg-indigo-500
              disabled:opacity-50
              text-gray-100 text-sm font-medium
              transition-all
            "
          >
            {isSearching
              ? "Searching..."
              : "Search"}
          </button>
        </div>
      </form>

      {/* Table */}
      {showSkeleton ? (
        <TableSkeleton />
      ) : paginatedUsers?.length ? (
        <>
          <div
            className="
              overflow-hidden rounded-3xl
              border border-gray-200 dark:border-gray-100/[0.08]
              bg-gray-100 dark:!bg-[#0f172a]
            "
          >
            <Table
              responsive="xl"
              hover
              className="
                mb-0 align-middle text-sm
                !bg-transparent
                text-gray-700 dark:text-gray-200
              "
            >
              <thead
                className="
                  !bg-gray-100 dark:!bg-[#0f172a]
                  border-b border-gray-200 dark:border-gray-100/[0.06]
                "
              >
                <tr className="!bg-gray-100 dark:!bg-[#0f172a]">
                  <th className="px-3 py-2 text-center !bg-gray-100 dark:!bg-[#0f172a] !text-gray-700 dark:!text-gray-300 font-semibold">
                    {isSelectionMode ? (
                      <Form.Check
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={paginatedUsers.every(
                          (user) =>
                            selectedUsers.includes(
                              user._id
                            )
                        )}
                      />
                    ) : (
                      "Sr"
                    )}
                  </th>

                  <th className="px-3 py-2 !bg-gray-100 dark:!bg-[#0f172a] !text-gray-700 dark:!text-gray-300 font-semibold">
                    Profile
                  </th>

                  <th className="px-3 py-2 !bg-gray-100 dark:!bg-[#0f172a] !text-gray-700 dark:!text-gray-300 font-semibold">
                    Name
                  </th>

                  <th className="px-3 py-2 !bg-gray-100 dark:!bg-[#0f172a] !text-gray-700 dark:!text-gray-300 font-semibold">
                    Email
                  </th>

                  <th className="px-3 py-2 !bg-gray-100 dark:!bg-[#0f172a] !text-gray-700 dark:!text-gray-300 font-semibold">
                    Provider
                  </th>

                  <th className="px-3 py-2 !bg-gray-100 dark:!bg-[#0f172a] !text-gray-700 dark:!text-gray-300 font-semibold">
                    Verified
                  </th>

                  <th className="px-3 py-2 !bg-gray-100 dark:!bg-[#0f172a] !text-gray-700 dark:!text-gray-300 font-semibold">
                    Created
                  </th>

                  <th className="px-3 py-2 text-center !bg-gray-100 dark:!bg-[#0f172a] !text-gray-700 dark:!text-gray-300 font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="!bg-gray-100 dark:!bg-[#0f172a]">
                {paginatedUsers?.map(
                  (user, index) => (
                    <tr
                      key={user?._id}
                      className="
                        !bg-gray-100 dark:!bg-[#0f172a]
                        border-b border-gray-200 dark:border-gray-100/[0.05]
                        hover:!bg-gray-200 dark:hover:!bg-gray-100/[0.04]
                        transition-all
                      "
                    >
                      <td className="px-3 py-2 text-center !bg-transparent !text-gray-700 dark:!text-gray-300">
                        {isSelectionMode ? (
                          <Form.Check
                            type="checkbox"
                            checked={selectedUsers.includes(
                              user._id
                            )}
                            onChange={() =>
                              handleSelectUser(
                                user._id
                              )
                            }
                          />
                        ) : (
                          index +
                          1 +
                          (currentPage - 1) *
                          itemsPerPage
                        )}
                      </td>

                      <td className="px-3 py-2 !bg-transparent">
                        <Image
                          src={user?.image}
                          width={52}
                          height={52}
                          alt="User"
                          className="
                            rounded-xl
                            object-cover
                            border border-gray-200 dark:border-gray-100/[0.08]
                          "
                        />
                      </td>

                      <td className="px-3 py-2 !bg-transparent !text-gray-800 dark:!text-gray-100">
                        <div className="font-medium">
                          {user?.name}
                        </div>
                      </td>

                      <td className="px-3 py-2 !bg-transparent">
                        <Link
                          href={`mailto:${user?.email}`}
                          target="_blank"
                          className="
                            no-underline
                            text-indigo-600 dark:text-indigo-300
                            hover:underline
                            text-sm
                          "
                        >
                          {user?.email}
                        </Link>
                      </td>

                      <td className="px-3 py-2 capitalize !bg-transparent !text-gray-700 dark:!text-gray-300">
                        {user?.provider}
                      </td>

                      <td className="px-3 py-2 !bg-transparent">
                        {isUpdating.id !==
                          user._id ? (
                          user?.top_creator ? (
                            <span
                              className="
                                inline-flex items-center
                                px-2 py-1 rounded-lg
                                bg-emerald-100 dark:bg-emerald-500/10
                                text-emerald-600 dark:text-emerald-400
                                text-[11px] font-medium
                              "
                            >
                              Verified
                            </span>
                          ) : (
                            <span
                              className="
                                inline-flex items-center
                                px-2 py-1 rounded-lg
                                bg-rose-100 dark:bg-rose-500/10
                                text-rose-600 dark:text-rose-400
                                text-[11px] font-medium
                              "
                            >
                              Unverified
                            </span>
                          )
                        ) : (
                          <Form.Check
                            type="checkbox"
                            label="Verified"
                            checked={
                              isUpdating?.top_creator
                            }
                            onChange={(e) =>
                              setIsUpdating(
                                (prev) => ({
                                  ...prev,
                                  top_creator:
                                    e.target
                                      .checked,
                                })
                              )
                            }
                          />
                        )}
                      </td>

                      <td className="px-3 py-2 gray-100space-nowrap !bg-transparent !text-gray-700 dark:!text-gray-300">
                        {formatDateForAdmin(
                          user?.createdAt
                        )}
                      </td>

                      <td className="px-3 py-2 !bg-transparent">
                        <div className="flex justify-center gap-2">
                          {isUpdating.id ===
                            user._id ? (
                            <button
                              onClick={
                                handleSaveUserData
                              }
                              className="
                                w-8 h-8 rounded-xl
                                bg-emerald-500/10
                                text-emerald-500
                                hover:bg-emerald-500/20
                                transition-all
                              "
                            >
                              <i className="fa-regular fa-floppy-disk text-sm" />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                setIsUpdating({
                                  id: user?._id,
                                  top_creator:
                                    user?.top_creator,
                                })
                              }
                              className="
                                w-8 h-8 rounded-xl
                                bg-indigo-500/10
                                text-indigo-500
                                hover:bg-indigo-500/20
                                transition-all
                              "
                            >
                              <i className="fa-regular fa-pen-to-square text-sm" />
                            </button>
                          )}

                          <button
                            onClick={() =>
                              handleDelete(
                                user._id,
                                user.name
                              )
                            }
                            className="
                              w-8 h-8 rounded-xl
                              bg-rose-500/10
                              text-rose-500
                              hover:bg-rose-500/20
                              transition-all
                            "
                          >
                            <i className="fa-solid fa-trash-can text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          <UniversalPagination
            currentPage={currentPage}
            totalSize={filteredUsers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="flex h-56 justify-center items-center">
          <h3
            className="
              text-3xl md:text-5xl
              text-center font-semibold
              text-gray-400
              caveat_font
            "
          >
            No Users Found!
          </h3>
        </div>
      )}
    </div>
  );
}

export default AdminUserPage
