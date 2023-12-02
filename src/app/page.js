"use client";
import React, { useState, useEffect } from "react";
import { BsChevronLeft, BsChevronRight, BsPencil, BsTrash } from 'react-icons/bs';

function App() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [editingRow, setEditingRow] = useState(null);

  const header = ["Name", "Email", "Role", "Actions"];

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  
    fetchData();
  }, []);
   

  const filteredUsers = users.filter(user => (
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.role.toLowerCase().includes(search.toLowerCase())
  ));

  const totalPages = Math.ceil(filteredUsers.length / 10);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  const displayUsers = filteredUsers.slice((page - 1) * 10, page * 10);

  function toggleUserSelection(user) {
    setSelectedUsers(prevSelected => (
      prevSelected.includes(user) ? prevSelected.filter(u => u !== user) : [...prevSelected, user]
    ));
  }

  function toggleSelectAll() {
    setSelectedUsers(prevSelected => (
      prevSelected.length === displayUsers.length ? [] : [...displayUsers]
    ));
  }

  function editUser(user, field, value) {
    const updatedUsers = users.map(u => (u.id === user.id ? { ...u, [field]: value } : u));
    setUsers(updatedUsers);
  }

  function saveEditing(user) {
    setEditingRow(null);
  }

  function deleteRow(user) {
    const updatedUsers = users.filter(u => u.id !== user.id);
    setUsers(updatedUsers);
  }

  function deleteSelectedRows() {
    const updatedUsers = users.filter(u => !selectedUsers.includes(u));
    setUsers(updatedUsers);
    setSelectedUsers([]);
  }

  function deleteAllRowsOnPage() {
    const updatedUsers = users.filter(u => !displayUsers.includes(u));
    setUsers(updatedUsers);
  }

  function gotoPage(newPage) {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }

  return (
    <div className="font-sans text-gray-800 min-h-screen bg-gray-100">
      <div className="container mx-auto p-8">
        <input
          type="text"
          placeholder="Search..."
          className="border rounded py-2 px-4 w-1/2 mb-4 focus:outline-none focus:border-blue-500"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className="overflow-hidden border rounded-lg bg-white">
          <button
            className="absolute top-0 right-0 m-4 px-4 py-2 bg-red-500 text-white rounded flex items-center"
            onClick={deleteSelectedRows}
            disabled={selectedUsers.length === 0}
          >
            <BsTrash className="mr-2" />
            Delete Selected
          </button>

          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">
                  <input
                    type="checkbox"
                    onChange={toggleSelectAll}
                    checked={selectedUsers.length === displayUsers.length}
                  />
                </th>
                {header.map(title => (
                  <th className="border p-2" key={title}>
                    {title}
                  </th>
                ))}
                <th className="border p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {displayUsers.map((user, index) => (
                <tr
                  className={`${
                    selectedUsers.includes(user) ? 'bg-gray-100' : 'hover:bg-gray-50'
                  } cursor-pointer py-4`}
                  key={user.id}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user)}
                      onChange={() => toggleUserSelection(user)}
                    />
                  </td>

                  {user.id === editingRow ? (
                    <>
                      <td>
                        <input
                          value={user.name}
                          onChange={e => editUser(user, "name", e.target.value)}
                          className="border rounded py-1 px-2 w-full"
                        />
                      </td>
                      <td>
                        <input
                          value={user.email}
                          onChange={e => editUser(user, "email", e.target.value)}
                          className="border rounded py-1 px-2 w-full"
                        />
                      </td>
                      <td>
                        <select
                          value={user.role}
                          onChange={e => editUser(user, "role", e.target.value)}
                          className="border rounded py-1 px-2 w-full"
                        >
                          <option value="member">Member</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded"
                          onClick={() => saveEditing(user)}
                        >
                          Save
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-500 hover:underline"
                            onClick={() => setEditingRow(user.id)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-500 hover:underline"
                            onClick={() => deleteRow(user)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-4">
            <button
              className="px-3 py-2 rounded-lg bg-gray-200 text-gray-700"
              onClick={() => gotoPage(1)}
              disabled={page === 1}
            >
              {'<<'}
            </button>
            <button
              className="px-3 py-2 rounded-lg bg-gray-200 text-gray-700"
              onClick={() => gotoPage(page - 1)}
              disabled={page === 1}
            >
              {'<'}
            </button>
            {pageNumbers.map(num => (
              <button
                key={num}
                className={`px-3 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white focus:outline-none ${num === page && 'bg-blue-500 text-white'}`}
                onClick={() => gotoPage(num)}
              >
                {num}
              </button>
            ))}
            <button
              className="px-3 py-2 rounded-lg bg-gray-200 text-gray-700"
              onClick={() => gotoPage(page + 1)}
              disabled={page === totalPages}
            >
              {'>'}
            </button>
            <button
              className="px-3 py-2 rounded-lg bg-gray-200 text-gray-700"
              onClick={() => gotoPage(totalPages)}
              disabled={page === totalPages}
            >
              {'>>'}
            </button>
          </div>

          <button
            className="px-4 py-2 rounded bg-red-500 text-white"
            onClick={deleteAllRowsOnPage}
          >
            Delete All on Page
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
