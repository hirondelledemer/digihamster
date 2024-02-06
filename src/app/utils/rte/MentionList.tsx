// import { useLazyQuery } from "@apollo/client";
import { Badge, Button, Paper, Popover } from "@mantine/core";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { GetTags } from "./__generated__/GetTags";
// import { QUERY_GET_TAGS } from './MentionList.queries';
import { COLORS_V2, colorMapper } from "../consts/colors";
import { Tag } from "./__generated__/Tag";
import { getRandomInt } from "../common/random-int";
// import { useCreateTagMutation } from "../tags/use-create-tag-mutation";

export interface MentionListProps {
  command: any;
  query: string;
}

export const MentionList = forwardRef(
  ({ command, query }: MentionListProps, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    // const [createTag] = useCreateTagMutation();

    // const [getTags, { data }] = useLazyQuery<GetTags>(QUERY_GET_TAGS);

    const handleAddTag = (title: string) => {
      console.log("handle add tag");
      // createTag({
      //   variables: {
      //     title,
      //     color:
      //       data && data.tags.length < COLORS_V2.length
      //         ? COLORS_V2[data.tags.length]
      //         : COLORS_V2[getRandomInt(COLORS_V2.length)],
      //   },
      // }).then((response) => {
      //   command({
      //     id: `${response.data?.createTag?.id}:${response.data?.createTag?.color}`,
      //     label: response.data?.createTag?.title,
      //   });
      // });
    };

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

    // const items = (data?.tags || [])
    //   .filter((tag) => tag.title.toLowerCase().startsWith(query.toLowerCase()))
    //   .slice(0, 5);
    const items: any = [];

    const selectItem = (index: number) => {
      const item = items[index];

      if (item) {
        command({
          id: `${item.id}:${item.color}`,
          label: item.title,
        });
      } else {
        handleAddTag(query);
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

    // useEffect(() => {
    //   setSelectedIndex(0);
    // }, [data?.tags]);

    // useEffect(() => {
    //   getTags();
    // }, []);

    return (
      <div>
        <Popover opened>
          <Paper shadow="xs" p="xs" withBorder>
            {items.length ? (
              items.map((tag: Tag, index: number) => (
                <div key={tag.id}>
                  <Badge
                    variant={selectedIndex === index ? "filled" : "outline"}
                    onClick={() => selectItem(index)}
                    color={colorMapper[tag.color]}
                  >
                    {tag.title}
                  </Badge>
                </div>
              ))
            ) : (
              <Button>{`Create"${query}"`}</Button>
            )}
          </Paper>
        </Popover>
      </div>
    );
  }
);

MentionList.displayName = "MentionList";
