"use client";

import { useEffect, useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Image from 'next/image';
import Link from 'next/link';

import PaginationBlogs from '@components/PaginationBlogs';
import TableSkeleton from '@components/Skeletons/TableSkeleton';
import { formatDateForAdmin } from '@components/FormatDate';
import useMetadata from '@hooks/metadata';
import { exportUsersContactsToExcel, exportUsersContactsToPDF } from '@utils/exportdata';
import { useUI } from '@context/UIContext';

const AdminUsers = () => {
  // set title for page
  useMetadata(`Admin Users - Blogotypo`, `Admin users to view or delete users`);

  const { showAlert, showModal } = useUI();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');
  // user data update 
  const [isUpdating, setIsUpdating] = useState({ id: '', top_creator: '' });
  const [isSearching, setIsSearching] = useState(false);

  // for pagination
  const [paginatedUsers, setPaginatedUsers] = useState([]);
  const itemsPerPage = 10;

  const [showSkeleton, setShowSkeleton] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/user/get', { method: 'GET' });
      const data = await response.json();

      if (response?.ok) {
        setUsers(data.data);
        setFilteredUsers(data.data);
        setPaginatedUsers(data.data.slice(0, itemsPerPage));
        setShowSkeleton(false);
        return;
      }
      showAlert(data?.msg || "failed to fetch users!", "danger");
    } catch (error) {
      console.log('Error while fetching users data ', error);
      showAlert("Internal Server Error!", "danger");
      setShowSkeleton(false);
    }
  }

  const handleSaveUserData = async () => {
    try {
      const response = await fetch('/api/admin/user/update', {
        method: 'PUT',
        'Content-Type': "application/json",
        body: JSON.stringify(isUpdating),
      });
      const data = await response.json();

      if (response.ok) {
        showAlert(data?.msg || "User data has been updated!", "success");
        // update users data
        fetchUsers();
        setIsUpdating({ id: '', top_creator: '' });
        return;
      }

      showAlert(data?.msg || "failed to update user data!", "danger");
    } catch (error) {
      console.log('Error while save user data ', error);
      showAlert("Internal Server Error!", "danger");
    } finally {
      setIsUpdating({ id: '', top_creator: '' });
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setShowSkeleton(true);
    let filtered = [];

    if (!search) {
      filtered = users
    } else {
      filtered = users.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
    setPaginatedUsers(filtered.slice(0, itemsPerPage));

    setIsSearching(false);
    setShowSkeleton(false);
  }

  const handleDelete = (userId, userName) => {
    if (!userId || !userName) return;

    showModal({
      title: 'Confirmation',
      body: `Do you really want to delete user "${userName}" ?`,
      actionBtn: 'delete',
      actionBtnVariant: 'danger',
      confirmAction: async () => await handleConfirmDelete(userId)
    });
  }

  const handleConfirmDelete = async (userId) => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/admin/user/delete?userId=${userId}`, { method: "DELETE" });
      const data = await response.json();

      if (response.ok) {
        showAlert(data?.msg || "User deleted successfully!", "success");
        // fake update of deleting blog
        setPaginatedUsers((users) => users.filter((user) => user._id !== userId));
        return;
      }
      setAlertData((prev) => ({ ...prev, header: data.msg, variant: "danger" }));
      showAlert(data?.msg || "failed to delete user!", "danger");
    } catch (error) {
      console.log('error while deleting user ', error);
      showAlert("Internal Server Error!", "danger");
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div className="">
        <div className="flex items-center justify-between">
          <h3 className="montserrat_alternates_font font-bold text-lg md:text-2xl lg:text-3xl">
            Users
          </h3>

          <span className="">
            Export to{` `}
            <button
              className='text-blue-500 underline'
              onClick={() => exportUsersContactsToExcel(users, "cpms_users", "CPMS Users")}
            >
              Excel
            </button>
            {` , `}
            <button
              className='text-blue-500 underline'
              onClick={() => exportUsersContactsToPDF(users, "cpms_users")}
            >
              PDF
            </button>
          </span>
        </div>

        {/* Search box */}
        <form
          onSubmit={handleSearch}
          className="bg-white w-full flex max-sm:flex-col rounded-lg md:px-3 md:py-2 max-md:px-1 max-md:py-1 text-gray-600 border border-gray-300 shadow-md text-sm md:text-base md:my-2 max-md:my-1"
        >
          <input
            type="text"
            name="search"
            id="search"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            className="outline-none w-full md:px-4 md:py-2 max-md:px-2 max-md:py-1 rounded-lg transition-all"
            placeholder="Search by name or email"
          />
          <button
            type="submit"
            className={`px-4 py-2 text-white rounded-lg flex justify-center items-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-purple-400 ${isSearching ? 'cursor-not-allowed bg-purple-300' : 'bg-purple-600 hover:bg-purple-900'}`}
            disabled={isSearching}
          >
            <i className="fa-solid fa-magnifying-glass text-lg" />
            <span className="">
              {isSearching ? 'Searching...' : 'Search'}
            </span>
          </button>
        </form>


        {showSkeleton
          ? <TableSkeleton />
          : paginatedUsers?.length !== 0
            ? <>
              <Table
                striped
                bordered
                hover
                responsive="sm"
                className="rounded-xl shadow-md overflow-hidden text-sm md:text-base"
              >
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2 text-center align-middle" style={{ width: "4%" }}>#</th>
                    <th className="p-2 text-center align-middle" style={{ width: "12%" }}>Profile</th>
                    <th className="p-2 text-center align-middle" style={{ width: "18%" }}>Name</th>
                    <th className="p-2 text-center align-middle" style={{ width: "18%" }}>Email</th>
                    <th className="p-2 text-center align-middle" style={{ width: "12%" }}>Provider</th>
                    <th className="p-2 text-center align-middle" style={{ width: "11%" }}>Top Creator</th>
                    <th className="p-2 text-center align-middle" style={{ width: "15%" }}>Created At</th>
                    <th className="p-2 text-center align-middle whitespace-nowrap" style={{ width: "10%" }}>Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedUsers?.map((user, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="p-2 text-center align-middle">{index + 1 + "."}</td>
                      <td className="p-2 text-center align-middle">
                        <Image
                          src={user?.image}
                          width={60}
                          height={60}
                          className="rounded-lg shadow-md block mx-auto"
                          alt="User Avatar"
                        />
                      </td>
                      <td className="p-2 text-center align-middle">
                        {user?.name}
                      </td>
                      <td className="p-2 text-center align-middle">
                        <Link href={`mailto:${user.email}`} target='_blank' className='no-underline hover:underline'>
                          {user?.email}
                        </Link>
                      </td>
                      <td className="p-2 text-center align-middle">
                        {user?.provider}
                      </td>
                      <td className="p-2 text-center align-middle text-lg md:text-2xl">
                        {isUpdating.id !== user._id && (
                          user?.top_creator
                            ? <i className="fa-solid fa-square-check text-green-500 hover:text-green-700 transition-colors duration-150" />
                            : <i className="fa-solid fa-square-xmark text-red-500 hover:text-red-700 transition-colors duration-150" />
                        )}
                        {isUpdating.id === user._id &&
                          <Form.Check
                            type='checkbox'
                            name="top_creator"
                            label="Verified"
                            className='text-sm md:text-base'
                            onChange={(e) => setIsUpdating((prev) => ({ ...prev, top_creator: e.target.checked }))}
                            checked={isUpdating?.top_creator}
                          />
                        }
                      </td>
                      <td className="p-2 text-center align-middle">
                        {formatDateForAdmin(user?.createdAt)}
                      </td>
                      <td className="p-2 text-center align-middle text-lg md:text-2xl">
                        {isUpdating.id === user._id
                          ? <i
                            onClick={handleSaveUserData}
                            className="fa-regular fa-floppy-disk text-green-500 hover:text-green-700 transition-colors duration-150 mx-2 cursor-pointer"
                          />
                          : <i
                            onClick={() => setIsUpdating({ id: user?._id, top_creator: user?.top_creator })}
                            className="fa-regular fa-pen-to-square text-blue-500 hover:text-blue-700 transition-colors duration-150 mx-2 cursor-pointer"
                          />
                        }
                        <i
                          onClick={() => handleDelete(user._id, user.name)}
                          className="fa-solid fa-trash-can text-gray-500 hover:text-gray-700 transition-colors duration-150 mx-2 cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Pagination */}
              <PaginationBlogs
                entireData={filteredUsers}
                itemsPerPage={itemsPerPage}
                onPageChange={setPaginatedUsers}
              />
            </>
            : <div className="flex h-56 justify-center items-center">
              <h3 className="caveat_font text-3xl md:text-5xl text-center font-semibold">
                No User Found!
              </h3>
            </div>
        }
      </div>
    </>
  )
}

export default AdminUsers
