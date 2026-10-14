"use client";
import React, { FC, useEffect } from "react";
import RichTextEditor from "../RichTextEditor";
import { RteValue, useRte } from "@/app/utils/rte/rte-hook";

interface RteFormFieldProps {
  testId?: string;
  value: string;
  placeholder?: string;
  onChange(val: RteValue): void;
}

const RteFormField: FC<RteFormFieldProps> = ({
  testId,
  value,
  placeholder,
  onChange,
}): JSX.Element | null => {
  const { editor, getRteValue } = useRte({
    value,
    editable: true,
    placeholder,
  });

  useEffect(() => {
    if (editor && value !== undefined) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

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

export default RteFormField;
