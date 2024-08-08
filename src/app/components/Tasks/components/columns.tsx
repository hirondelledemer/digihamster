"use client";

import { TaskV2 as Task } from "@/models/taskV2";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../../ui/checkbox";
import { DataTableColumnHeader } from "./DataTableColumnHeader/DataTableColumnHeader";
import { DataTableRowActions } from "./DataTableRowActions/DataTableRowActions";
import { Project } from "@/models/project";
import Estimate from "../../Estimate";
import { format } from "date-fns";
import { Tag } from "@/models/tag";
import { Badge } from "../../ui/badge";
import { isIncludedIn } from "remeda";

export const getColumns: (
  projects: Project[],
  tags: Tag[]
) => ColumnDef<Task>[] = (projects, tags) => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate font-medium space-x-2">
            {row.getValue("title")}
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
      // console.log(row, id, value);
      // return isSubset(row.original.tags, value);
      return !!value.filter((tagId) => row.original.tags.includes(tagId))
        .length;

      // return row.original.tags.includes(value);
      // return true;
      // return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "estimate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estimate" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
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
    accessorKey: "projectId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project" />
    ),
    cell: ({ row }) => {
      const project = projects.find((p) => p._id === row.getValue("projectId"));

      if (!project) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          <span>{project.title}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
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
