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
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";

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

//Reusable columns
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

// Main Component
const UserTables: React.FC = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="max-w-6xl mx-auto p-6 sm:p-10">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">User Profiles</h1>
        <AxiosTable />
        <QueryTable />
      </div>
    </QueryClientProvider>
  );
};

{/*Axios Table*/ }
const AxiosTable = () => {
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

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mb-12">
      <h2 className="text-2xl text-center font-semibold mb-4">Axios Table</h2>
      <TableUI table={table} />
    </div>
  );
};

{/*Tanstack Query Table*/ }
const QueryTable = () => {
  const { data = [], isLoading, error } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axios.get("https://randomuser.me/api/?results=10");
      return response.data.results.map((user: ApiUser) => ({
        id: user.login.uuid,
        name: `${user.name.first} ${user.name.last}`,
        email: user.email,
        phone: user.phone,
        country: user.location.country,
        picture: user.picture.thumbnail,
      }));
    },
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading users.</p>;

  return (
    <div>
      <h2 className="text-2xl text-center font-semibold mb-4">TanStack Query Table</h2>
      <TableUI table={table} />
    </div>
  );
};
{/*Table UI*/ }
type TableUIProps<T> = {
  table: ReturnType<typeof useReactTable<T>>;
};

const TableUI = <T,>({ table }: TableUIProps<T>) => (
  <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white">
    <Table className="min-w-full text-sm text-gray-700">
      <TableHeader className="bg-gray-100">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} className="hover:bg-gray-50 transition-colors duration-200">
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id} className="px-4 py-4 align-middle">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default UserTables;