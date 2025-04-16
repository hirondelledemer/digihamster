"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Input } from "../../../ui/input";
import { DataTableFacetedFilter } from "../DataTableFacetedFilter/DataTableFacetedFilter";
import { Button } from "../../../ui/button";
import { DataTableViewOptions } from "../DataTableViewOptions/DataTableViewOptions";
import useTags from "@/app/utils/hooks/use-tags";
import { useProjectsState } from "@/app/utils/hooks/use-projects/state-context";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { data: projects, isLoading } = useProjectsState();
  const { data: tags } = useTags();

  const projectOptions = projects.map((project) => ({
    label: project.title,
    value: project._id,
  }));

  const tagOptions = tags.map((tag) => ({
    label: tag.title,
    value: tag._id,
  }));

  if (isLoading || !projects) {
    return "loading";
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("projectId") && (
          <DataTableFacetedFilter
            column={table.getColumn("projectId")}
            title="Projects"
            options={projectOptions}
          />
        )}
        {table.getColumn("description") && (
          <DataTableFacetedFilter
            column={table.getColumn("description")}
            title="Tags"
            options={tagOptions}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
