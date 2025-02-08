"use client";

import { useEffect, useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Link from 'next/link';

import ModalBox from '@components/Modal';
import AlertBox from '@components/Alert';
import TableSkeleton from '@components/Skeletons/TableSkeleton';
import PaginationBlogs from '@components/PaginationBlogs';
import { formatDateForAdmin } from '@components/FormatDate';
import useMetadata from '@hooks/metadata';

const AdminContacts = () => {
  // set title for page
  useMetadata('Admin Contacts - Blogotypo', 'Admin Contacts for view or delete');

  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({
    variant: '',
    dismissible: true,
    header: '',
  });

  // modal
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    title: '',
    body: '',
    actionBtn: '',
    actionBtnVariant: '',
    confirmAction: () => { }
  });

  // for pagination
  const [paginatedContacts, setPaginatedContacts] = useState([]);
  const itemsPerPage = 10;

  const [showSkeleton, setShowSkeleton] = useState(true);


  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/admin/contact/get', { method: 'GET' });
      const data = await response.json();

      if (response?.ok) {
        setContacts(data.data);
        setFilteredContacts(data.data);
        setPaginatedContacts(data.data.slice(0, itemsPerPage));
        setShowSkeleton(false);
        return;
      }
      setAlertData((prev) => ({ ...prev, header: data.msg, variant: "danger" }));
      setShowAlert(true);
    } catch (error) {
      console.log('Error while fetching contact detail info ', error);
      setAlertData((prev) => ({ ...prev, header: "Internal Server Error!", variant: "danger" }));
      setShowAlert(true);
      setShowSkeleton(false);
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();

    setIsSearching(true);
    setShowSkeleton(true);
    let filtered = [];

    if (!search) {
      filtered = contacts;
    } else {
      filtered = contacts.filter((contact) =>
        contact.user.name.toLowerCase().includes(search.toLowerCase()) ||
        contact.user.email.toLowerCase().includes(search.toLowerCase()) ||
        contact.subject.toLowerCase().includes(search.toLowerCase()) ||
        contact.message.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredContacts(filtered);
    setPaginatedContacts(filtered.slice(0, itemsPerPage));

    setIsSearching(false);
    setShowSkeleton(false);
  }

  const handleDelete = (contactId) => {
    if (!contactId) return;

    setModalData({
      title: 'Confirmation',
      body: `Do you really want to delete contact detail?`,
      actionBtn: 'delete',
      actionBtnVariant: 'danger',
      confirmAction: () => handleConfirmDelete(contactId)
    });
    setShowModal(true);
  }

  const handleConfirmDelete = async (contactId) => {
    if (!contactId) return;

    try {
      const response = await fetch(`/api/admin/contact/delete?contactId=${contactId}`, { method: "DELETE" });
      const data = await response.json();

      if (response.ok) {
        setAlertData((prev) => ({ ...prev, header: data.msg, variant: "success" }));
        setShowAlert(true);
        setShowModal(false);
        // fake update of deleting contact
        setPaginatedContacts((contacts) => contacts.filter((contact) => contact._id !== contactId));
        return;
      }
      setAlertData((prev) => ({ ...prev, header: data.msg, variant: "danger" }));
    } catch (error) {
      console.log('error while deleting contact ', error);
      setAlertData((prev) => ({ ...prev, header: 'Internal Server Error!', variant: "danger" }));
    } finally {
      setShowAlert(true);
      setShowModal(false);
    }
  }

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <>
      <div className="">

        <h3 className="montserrat_alternates_font font-bold text-lg md:text-2xl lg:text-3xl">
          Contact Requests
        </h3>

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
            placeholder="Search by user name, email, subject & message"
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
          : paginatedContacts.length !== 0
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
                    <th className="p-2 text-center align-middle" style={{ width: "6%" }}>#</th>
                    <th className="p-2 text-center align-middle" style={{ width: "15%" }}>Name</th>
                    <th className="p-2 text-center align-middle" style={{ width: "15%" }}>Email</th>
                    <th className="p-2 text-center align-middle" style={{ width: "18%" }}>Subject</th>
                    <th className="p-2 text-center align-middle" style={{ width: "25%" }}>Message</th>
                    <th className="p-2 text-center align-middle" style={{ width: "15%" }}>Posted On</th>
                    <th className="p-2 text-center align-middle whitespace-nowrap" style={{ width: "6%" }}>Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedContacts?.map((contact, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="p-2 text-center align-middle">{index + 1 + "."}</td>
                      <td className="p-2 text-center align-middle">
                        {contact?.user?.name}
                      </td>
                      <td className="p-2 text-center align-middle">
                        <Link href={`mailto:${contact.user?.email}`} target='_blank' className='no-underline hover:underline'>
                          {contact?.user?.email}
                        </Link>
                      </td>
                      <td className="p-2 text-center align-middle">
                        {contact?.subject}
                      </td>
                      <td className="p-2 text-center align-middle">
                        {contact?.message}
                      </td>
                      <td className="p-2 text-center align-middle">
                        {formatDateForAdmin(contact?.postedOn)}
                      </td>
                      <td className="p-2 text-center align-middle text-lg md:text-2xl">
                        <i
                          onClick={() => handleDelete(contact._id)}
                          className="fa-solid fa-trash-can text-gray-500 hover:text-gray-700 transition-colors duration-150 mx-2 cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Pagination */}
              <PaginationBlogs
                entireData={filteredContacts}
                itemsPerPage={itemsPerPage}
                onPageChange={setPaginatedContacts}
              />
            </>
            : <div className="flex h-56 justify-center items-center">
              <h3 className="caveat_font text-3xl md:text-5xl text-center font-semibold">
                No Contact Yet!
              </h3>
            </div>
        }
      </div>


      <ModalBox
        showModal={showModal}
        setShowModal={setShowModal}
        title={modalData.title}
        body={modalData.body}
        actionBtn={modalData.actionBtn}
        actionBtnVariant={modalData.actionBtnVariant}
        confirmAction={modalData.confirmAction}
      />

      <AlertBox
        show={showAlert}
        setShow={setShowAlert}
        variant={alertData?.variant}
        dismissible={alertData?.dismissible}
        header={alertData?.header}
        position={"top-right-with-space"}
      />

    </>
  )
}

export default AdminContacts
