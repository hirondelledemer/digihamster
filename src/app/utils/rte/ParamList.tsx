import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

import { Card, CardContent } from "@/app/components/ui/card";

import { Badge } from "@/app/components/ui/badge";

export interface ParamsMentionsProps {
  command: any;
  query: string;
}

interface ParamType {
  value: string;
  label: string;
}
const PARAMS = [
  { value: "active", label: "active" },
  { value: "today", label: "today" },
  { value: "tmr", label: "tmr" },
] as const satisfies Array<ParamType>;

export const ParamsList = forwardRef(
  ({ command, query }: ParamsMentionsProps, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
      setSelectedIndex(0);
    }, []);

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

    const items = PARAMS.filter((param) =>
      param.label.toLowerCase().startsWith(query.toLowerCase())
    ).slice(0, 5);

    const selectItem = (index: number) => {
      const item = items[index];

      if (item) {
        command({
          id: item.value,
          label: item.label,
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
            items.map((param: ParamType, index: number) => (
              <div key={param.value}>
                <Badge
                  variant={selectedIndex === index ? "secondary" : "outline"}
                  onClick={() => selectItem(index)}
                >
                  {param.label}
                </Badge>
              </div>
            ))
          ) : (
            <div>no command found</div>
          )}
        </CardContent>
      </Card>
    );
  }
);

ParamsList.displayName = "ProjectMentions";
