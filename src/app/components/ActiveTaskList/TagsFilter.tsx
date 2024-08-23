"use client";

import React, { FC } from "react";

import { Badge } from "../ui/badge";

import { Button } from "../ui/button";
import { Tag } from "@/models/tag";

export interface TagsFilterProps {
  selectedTagIds: string[];
  onSelectedTagsIdsChange(val: string[]): void;
  tags: Tag[];
}

const TagsFilter: FC<TagsFilterProps> = ({
  selectedTagIds,
  onSelectedTagsIdsChange,
  tags,
}): JSX.Element => {
  const handleTagClick = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      onSelectedTagsIdsChange(selectedTagIds.filter((v) => v !== tagId));
    } else {
      onSelectedTagsIdsChange([...selectedTagIds, tagId]);
    }
  };

  return (
    <>
      {tags.map((tag) => (
        <Button
          key={tag._id}
          onClick={() => handleTagClick(tag._id)}
          variant="outline"
          className="p-1 border-none hover:bg-transparent"
        >
          <Badge
            role="available-tag"
            variant={selectedTagIds.includes(tag._id) ? "outline" : "default"}
          >
            {tag.title}
          </Badge>
        </Button>
      ))}
    </>
  );
};

export default TagsFilter;
