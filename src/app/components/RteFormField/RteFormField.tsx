"use client";
import React, { FC } from "react";
import RichTextEditor from "../RichTextEditor";
import { RteValue, useRte } from "@/app/utils/rte/rte-hook";

interface RteFormFieldProps {
  testId?: string;
  value: string;
  onChange(val: RteValue): void;
}

const MinimalNote: FC<RteFormFieldProps> = ({
  testId,
  value,
  onChange,
}): JSX.Element | null => {
  const { editor, getRteValue } = useRte({
    value,
    editable: true,
  });

  if (!editor) {
    return null;
  }

  return (
    <RichTextEditor
      testId={testId}
      editor={editor}
      onBlur={() => onChange(getRteValue())}
    />
  );
};

export default MinimalNote;
