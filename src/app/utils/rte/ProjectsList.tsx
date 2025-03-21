import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

import { Card, CardContent } from "@/app/components/ui/card";

import { Badge } from "@/app/components/ui/badge";
import useProjects from "../hooks/use-projects";
import { Project } from "@/models/project";

export interface ProjectMentionsProps {
  command: any;
  query: string;
}

export const ProjectMentions = forwardRef(
  ({ command, query }: ProjectMentionsProps, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const { data: projects } = useProjects();

    useEffect(() => {
      setSelectedIndex(0);
    }, [projects]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: any) => {
        if (event.key === "ArrowUp") {
          upHandler();
          return true;
        }

        if (event.key === "ArrowDown") {
          downHandler();
          return true;
        }

        if (event.key === "Enter") {
          enterHandler();
          return true;
        }

        return false;
      },
    }));

    const items = projects
      .filter((project) =>
        project.title.toLowerCase().startsWith(query.toLowerCase())
      )
      .slice(0, 5);

    const selectItem = (index: number) => {
      const item = items[index];

      if (item) {
        command({
          id: `${item._id}:${item.color}`,
          label: item.title,
        });
      }
    };

    const upHandler = () => {
      setSelectedIndex((selectedIndex + items.length - 1) % items.length);
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % items.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    return (
      <Card>
        <CardContent className="py-2 px-4">
          {items.length ? (
            items.map((project: Project, index: number) => (
              <div key={project._id}>
                <Badge
                  variant={selectedIndex === index ? "secondary" : "outline"}
                  onClick={() => selectItem(index)}
                  // className="text-amber-700"
                  style={{
                    color: project.color,
                    border:
                      selectedIndex === index
                        ? `1px solid ${project.color}`
                        : undefined,
                  }}
                >
                  {project.title}
                </Badge>
              </div>
            ))
          ) : (
            <div>No such project</div>
          )}
        </CardContent>
      </Card>
    );
  }
);

ProjectMentions.displayName = "ProjectMentions";
