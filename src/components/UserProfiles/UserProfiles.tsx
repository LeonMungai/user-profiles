import React, { useEffect, useState } from "react";
import axios from "axios";
import { useReactTable, ColumnDef, getCoreRowModel, flexRender } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  picture: string;
};

type ApiUser = {
  login: { uuid: string };
  name: { first: string; last: string };
  email: string;
  phone: string;
  location: { country: string };
  picture: { thumbnail: string };
};

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios.get("https://randomuser.me/api/?results=10")
      .then((response) => {
        const fetchedUsers = response.data.results.map((user: ApiUser) => ({
          id: user.login.uuid,
          name: `${user.name.first} ${user.name.last}`,
          email: user.email,
          phone: user.phone,
          country: user.location.country,
          picture: user.picture.thumbnail,
        }));
        setUsers(fetchedUsers);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "picture",
      header: "Avatar",
      cell: ({ row }) => (
        <img src={row.original.picture} alt="User" className="w-10 h-10 rounded-full" />
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "country",
      header: "Country",
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="max-w-6xl mx-auto p-6 sm:p-10">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">User Profiles</h1>
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white">
        <Table className="min-w-full text-sm text-gray-700">
          <TableHeader className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}  className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}  className="hover:bg-gray-50 transition-colors duration-200">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} 
                    className="px-4 py-4 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserTable;
