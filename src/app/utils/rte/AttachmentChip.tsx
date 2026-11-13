import { type NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { IconPaperclip } from "@tabler/icons-react";

export const AttachmentChip: React.FC<NodeViewProps> = ({ node }) => {
  const { id, label } = node.attrs;

  return (
    <NodeViewWrapper
      as="span"
      data-mention-id={id}
      className="text-xs flex items-center text-[hsl(var(--chart-1))]"
    >
      <IconPaperclip size={16} />
      <span>{label ?? id}</span>
    </NodeViewWrapper>
  );
};
