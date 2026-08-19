"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Tag } from "@/models/tag";
import { DataTableColumnHeader } from "../Tasks/components/DataTableColumnHeader/DataTableColumnHeader";
import { Badge } from "../ui/badge";
import { DataTableRowActions } from "../Tasks/components/DataTableRowActions/DataTableRowActions";
import { IProject } from "@/app/utils/types/project";
import { ITask } from "@/app/utils/types/task";

export const getColumns: (
  projects: IProject[],
  tags: Tag[],
) => ColumnDef<ITask>[] = (_projects, _tags) => [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex">
          <span className="max-w-[300px] truncate font-medium space-x-2">
            <span>{row.getValue("title")}</span>
            {row.original.deadline && (
              <Badge variant="destructive">Deadline</Badge>
            )}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate font-medium">
            {row.getValue("description")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[50px] items-center">
          <span>{row.original.status}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span>{format(row.getValue("created_at"), "yyyy-MM-dd")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
