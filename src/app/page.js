"use client";
import React, { useState, useEffect } from "react";
import data from "./data.json";

function App() {

  const [users, setUsers] = useState(data);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [editingRow, setEditingRow] = useState(null);

  const header = ["Name", "Email", "Role"];

  const filteredUsers = users.filter(user => {
    return (
      user.name.includes(search) || 
      user.email.includes(search)  
    );
  });
  
  const displayUsers = filteredUsers.slice((page - 1) * 10, page * 10);
  
  function toggleUserSelection(user) {
    setSelectedUsers(prevSelected => {
      if (prevSelected.includes(user)) {
        return prevSelected.filter(u => u !== user)
      } else {
        return [...prevSelected, user]
      }
    })
  }
  return (
    <div className="font-mono text-center flex h-full flex-col bg-gray-100">

      <input 
        type="text"
        placeholder="Start typing to Search"
        className="border rounded py-2 px-4 w-1/3 self-center mt-4"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="border overflow-x-auto rounded text-black my-32">
        <table className="table-auto w-full my-4">
          <thead>
            <tr className="bg-gray-300">
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
                className="hover:bg-gray-100 cursor-pointer"
                key={user.id}
                onClick={() => toggleUserSelection(user)}  
               >


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
                      <button 
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
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
          


    </div>
  );
}

export default App;

