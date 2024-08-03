import React, { FC } from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { TaskV2 as Task } from "@/models/taskV2";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import useProjects from "@/app/utils/hooks/use-projects";
import { Project } from "@/models/project";
import { lightFormat } from "date-fns";

export interface TasksListProps {
  testId?: string;
  data: Task[];
}

const getColumns: (projects: Project[]) => ColumnDef<Task>[] = (projects) => [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "eta",
    header: "ETA",
    cell: ({ row }) => {
      return row.original.estimate;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      if (row.original.isActive) {
        return "Active";
      }
      return "";
    },
  },
  {
    accessorKey: "project",
    header: "Project",
    cell: ({ row }) => {
      return projects.find((p) => p._id === row.original.projectId)?.title;
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      return lightFormat(new Date(row.original.updatedAt || 0), "yyyy-MM-dd");
    },
  },
];

const TasksList: FC<TasksListProps> = ({ testId, data }): JSX.Element => {
  const { data: projects } = useProjects();
  const columns = getColumns(projects);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div data-testid={testId}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TasksList;
