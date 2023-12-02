"use client";
import React, { useState } from "react";
import { BsChevronLeft, BsChevronRight, BsPencil, BsTrash } from 'react-icons/bs';
import data from "./data.json";

function App() {
  const [users, setUsers] = useState(data);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [editingRow, setEditingRow] = useState(null);

  const header = [" ", "Name", "Email", "Role", "Actions"];

  const filteredUsers = users.filter(user => {
    return (
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
  });

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

  function editUser(user, field, value) {
    // Implement your edit logic here
    const updatedUsers = users.map(u =>
      u.id === user.id ? { ...u, [field]: value } : u
    );
    setUsers(updatedUsers);
  }

  function saveEditing(user) {
    // Implement your save editing logic here
    setEditingRow(null);
  }

  function deleteRow(user) {
    // Implement your delete logic here
    const updatedUsers = users.filter(u => u.id !== user.id);
    setUsers(updatedUsers);
  }

  const totalPages = Math.ceil(filteredUsers.length / 10);

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  function gotoPage(page) {
    setPage(page);
  }

  function prevPage() {
    if (page > 1) {
      setPage(page - 1);
    }
  }

  function nextPage() {
    if (page < totalPages) {
      setPage(page + 1);
    }
  }

  return (
    <div className="font-mono text-center flex h-full flex-col bg-gray-100 h-screen">

      <input
        type="text"
        placeholder="Start typing to Search"
        className="border rounded py-2 px-4 w-1/3 self-center mt-4 text-black"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="border overflow-x-auto rounded text-black my-32">
        <table className="table-auto w-full my-4">
          <thead>
            <tr className="bg-gray-300 ">
              {header.map(title => (
                <th className="border p-2" key={title}>
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
  {displayUsers.map(user => (
       <tr
       className="hover:bg-gray-100 cursor-pointer py-4"
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
            <button onClick={() => saveEditing(user)}>Save</button>
          </td>
        </>
      ) : (
        <>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td>{user.role}</td>
          <td>
            <div className="flex">
              <BsPencil
                className="cursor-pointer text-blue-500 mr-2"
                onClick={() => setEditingRow(user.id)}
              />
              <BsTrash
                className="cursor-pointer text-red-500"
                onClick={() => deleteRow(user)}
              />
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
          onClick={prevPage}
          disabled={page === 1}
        >
          <BsChevronLeft className="m-1" />
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
          className="h-8 w-8 rounded-full border bg-gray-300 text-black"
          onClick={nextPage}
          disabled={page === totalPages}
        >
          <BsChevronRight className="m-1" />
        </button>

      </div>
    </div>
  );
}

export default App;
