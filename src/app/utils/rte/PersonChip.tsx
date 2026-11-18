import { type NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { IconEyeglass, IconManFilled } from "@tabler/icons-react";
import { usePersonById } from "../hooks/use-people/selectors";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/app/components/ui/context-menu";

export const InteractivePersonChip: React.FC<NodeViewProps> = ({ node }) => {
  const { id, label } = node.attrs;
  const person = usePersonById(Number(id));

  if (!person) {
    return "unknown person"; // TODO: make is still look good, even if it is an error
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <NodeViewWrapper
          as="span"
          data-mention-id={id}
          className="text-xs font-semibold inline-flex items-center uppercase tracking-widest border-2 rounded-lg px-1 hover:cursor-pointer hover:font-bold"
          style={{ color: person.color, borderColor: person.color }}
        >
          <IconManFilled size={16} />
          <span>{label ?? id}</span>
        </NodeViewWrapper>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem inset onClick={() => {}}>
          <IconEyeglass />
          Take a closer look
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export const PersonChip: React.FC<NodeViewProps> = ({ node }) => {
  const { id, label } = node.attrs;
  const person = usePersonById(Number(id));

  if (!person) {
    return "unknown person"; // TODO: make is still look good, even if it is an error
  }

  return (
    <NodeViewWrapper
      as="span"
      data-mention-id={id}
      className="text-xs font-semibold inline-flex items-center uppercase tracking-widest border-2 rounded-lg px-1"
      style={{ color: person.color, borderColor: person.color }}
    >
      <IconManFilled size={16} />
      <span>{label ?? id}</span>
    </NodeViewWrapper>
  );
};
