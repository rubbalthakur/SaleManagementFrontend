"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { Client } from "@/types/Client";

interface Props {
  onAddClick: () => void;
  onEditClick: (client: Client) => void;
}
export function DisplayClients({ onAddClick, onEditClick }: Props) {
  const allClients = useSelector((state: RootState) => state.clients.clients);
  const loading = useSelector((state: RootState) => state.clients.loading);
  const processing = useSelector(
    (state: RootState) => state.clients.processing
  );

  const [filteredClients, setFilteredClients] = useState<Client[]>([]);

  const [filterClient, setFilterClient] = useState<string>("");

  const handleFilterChange = (filterType: string, value: string) => {
    if (filterType === "email") {
      setFilterClient(value);
    }
  };

  useEffect(() => {
    let filtered = [...allClients];
    if (filterClient) {
      filtered = filtered.filter(
        (client) => client.id.toString() === filterClient
      );
    }
    setFilteredClients(filtered);
  }, [allClients, filterClient]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <>
      {/*---------------------------------------display client-------------------------------------------------*/}
      <div className="border rounded-lg shadow-md p-8 w-full mx-4">
        <h2 className="text-2xl font-semibold mb-4">
          {" "}
          Clients{" "}
          <div className="flex items-center space-x-4">
            {/* -------------filter by email-------------------- */}
            <select
              value={filterClient}
              onChange={(e) => handleFilterChange("email", e.target.value)}
              className="mt-2 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Filter by email</option>
              {allClients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.emailId}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                onAddClick();
              }}
              className="mt-6 ml-19  hover:bg-yellow-400 text-black font-semibold py-2 px-4 rounded text-base"
              style={{ border: "1px solid black " }}
            >
              Add Client
            </button>
          </div>
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">City</th>
                <th className="py-2 px-4 border-b">State</th>
                <th className="py-2 px-4 border-b">Country</th>
                <th className="py-2 px-4 border-b">ContactNumber</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{client.id}</td>
                  <td className="py-2 px-4 border-b">{client.emailId}</td>
                  <td className="py-2 px-4 border-b">
                    {client.firstName} {client.lastName}
                  </td>
                  <td className="py-2 px-4 border-b">{client.city}</td>
                  <td className="py-2 px-4 border-b">{client.state}</td>
                  <td className="py-2 px-4 border-b">{client.country}</td>
                  <td className="py-2 px-4 border-b">{client.contact}</td>
                  <td className="py-2 px-4 border-b">
                    {processing ? (
                      <button className="mt-6 bg-yellow-400  text-black font-semibold py-2 px-4 rounded">
                        wait...
                      </button>
                    ) : (
                      <span className="flex space-x-2">
                        <button
                          onClick={() => {
                            onEditClick(client);
                          }}
                          className="mt-2 bg-yellow-100 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded"
                        >
                          Update
                        </button>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
