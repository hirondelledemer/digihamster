"use client";

import { TaskV2 as Task } from "@/models/taskV2";
import { ColumnDef } from "@tanstack/react-table";
import { Project } from "@/models/project";
import { format } from "date-fns";
import { Tag } from "@/models/tag";
import { DataTableColumnHeader } from "../Tasks/components/DataTableColumnHeader/DataTableColumnHeader";
import { Badge } from "../ui/badge";
import Estimate from "../Estimate";
import { DataTableRowActions } from "../Tasks/components/DataTableRowActions/DataTableRowActions";

export const getColumns: (
  projects: Project[],
  tags: Tag[]
) => ColumnDef<Task>[] = (projects, tags) => [
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
            {tags
              .filter((tag) => row.original.tags.includes(tag._id))
              .map((tag) => (
                <Badge variant="outline" key={tag._id}>
                  {tag.title}
                </Badge>
              ))}
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
    filterFn: (row, _id, value: string[]) => {
      return !!value.filter((tagId) => row.original.tags.includes(tagId))
        .length;
    },
  },
  {
    accessorKey: "estimate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estimate" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[50px] items-center">
          <Estimate estimate={row.getValue("estimate")} />
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    sortUndefined: false,
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[50px] items-center">
          <span>{row.original.isActive ? "ACTIVE" : ""}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span>{format(row.getValue("createdAt"), "yyyy-MM-dd")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span>{format(row.getValue("updatedAt"), "yyyy-MM-dd")}</span>
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
