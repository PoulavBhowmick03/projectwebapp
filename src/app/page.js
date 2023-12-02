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
        const response = await fetch("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []); 

  const filteredUsers = users.filter(user => {
    return (
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / 10);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  const displayUsers = filteredUsers.slice((page - 1) * 10, page * 10);

  function toggleUserSelection(user) {
    setSelectedUsers(prevSelected => {
      if (prevSelected.includes(user)) {
        return prevSelected.filter(u => u !== user);
      } else {
        return [...prevSelected, user];
      }
    });
  }

  function toggleSelectAll() {
    setSelectedUsers(prevSelected =>
      prevSelected.length === displayUsers.length ? [] : [...displayUsers]
    );
  }

  function editUser(user, field, value) {
    const updatedUsers = users.map(u =>
      u.id === user.id ? { ...u, [field]: value } : u
    );
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
    <div className="font-mono text-center flex flex-col bg-gray-100 min-h-screen">
      <input
        type="text"
        placeholder="Search..."
        className="border rounded py-2 px-4 w-1/3 self-center mt-4 text-black"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="border overflow-x-auto rounded text-black my-32 relative">
        <button
          className="absolute top-0 right-0 m-4 px-4 py-2 bg-red-500 text-white rounded items-center justify-center flex"
          onClick={deleteSelectedRows}
          disabled={selectedUsers.length === 0}
        >
          <BsTrash className="mr-2" />
          Delete Selected
        </button>

        <table className="table-auto w-full my-4">
          <thead>
            <tr className="bg-gray-300">
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
                  selectedUsers.includes(user) ? 'bg-gray-200' : 'hover:bg-gray-100'
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
                      />
                    </td>
                    <td>
                      <input
                        value={user.email}
                        onChange={e => editUser(user, "email", e.target.value)}
                      />
                    </td>
                    <td>
                      <select
                        value={user.role}
                        onChange={e => editUser(user, "role", e.target.value)}
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <button className="save" onClick={() => saveEditing(user)}>
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
                      <div className="flex justify-around">
                        <button
                          className="edit"
                          onClick={() => setEditingRow(user.id)}
                        >
                          <BsPencil />
                        </button>
                        <button
                          className="delete"
                          onClick={() => deleteRow(user)}
                        >
                          <BsTrash />
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
      <div className="fixed bottom-4 right-4 flex">
        <button
          className="h-8 w-8 rounded-full border bg-gray-300 text-black"
          onClick={() => gotoPage(1)}
          disabled={page === 1}
        >
          {'<<'}
        </button>
        <button
          className="h-8 w-8 rounded-full border bg-gray-300 text-black mx-0.5"
          onClick={() => gotoPage(page - 1)}
          disabled={page === 1}
        >
          {'<'}
        </button>
        {pageNumbers.map(num => (
          <button
            key={num}
            className={`h-8 w-8 rounded-full border mx-0.5 bg-gray-300 text-black 
              flex items-center justify-center ${num === page && 'bg-blue-500 text-white'}`}
            onClick={() => gotoPage(num)}
          >
            {num}
          </button>
        ))}
        <button
          className="h-8 w-8 rounded-full border bg-gray-300 text-black mx-0.5"
          onClick={() => gotoPage(page + 1)}
          disabled={page === totalPages}
        >
          {'>'}
        </button>
        <button
          className="h-8 w-8 rounded-full border bg-gray-300 text-black"
          onClick={() => gotoPage(totalPages)}
          disabled={page === totalPages}
        >
          {'>>'}
        </button>
      </div>
      <div className="fixed bottom-4 left-4 flex items-center">
        <button
          className="h-8 w-8 rounded-full border bg-red-500 text-white items-center justify-center flex"
          onClick={deleteAllRowsOnPage}
        >
          <BsTrash />
        </button>
      </div>
    </div>
  );
}

export default App;
