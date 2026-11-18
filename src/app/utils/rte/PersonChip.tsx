import { type NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { IconEyeglass, IconManFilled } from "@tabler/icons-react";
import { usePersonById } from "../hooks/use-people/selectors";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/app/components/ui/context-menu";
import { FC } from "react";
import { useSetSearchParams } from "../url/search-params";
import { QUERY_KEYS } from "../url/constants";

export const InteractivePersonChip: FC<NodeViewProps> = ({ node }) => {
  const { id, label } = node.attrs;
  const personId = id.split(":")[0];
  const person = usePersonById(Number(personId));

  const setParams = useSetSearchParams();

  return (
    <NodeViewWrapper as="span" data-mention-id={id}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className="text-xs font-semibold inline-flex items-center uppercase tracking-widest border-2 rounded-lg px-1 hover:cursor-pointer hover:font-bold"
            style={
              !!person
                ? { color: person.color, borderColor: person.color }
                : undefined
            }
          >
            <IconManFilled size={16} />
            <span>{label ?? id}</span>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuItem
            inset
            onClick={() => setParams(QUERY_KEYS.personId, personId)}
          >
            <IconEyeglass />
            Take a closer look
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </NodeViewWrapper>
  );
};

export const PersonChip: FC<NodeViewProps> = ({ node }) => {
  const { id, label } = node.attrs;
  const personId = id.split(":")[0];
  const person = usePersonById(Number(personId));

  return (
    <NodeViewWrapper
      as="span"
      data-mention-id={id}
      className="text-xs font-semibold inline-flex items-center uppercase tracking-widest border-2 rounded-lg px-1 hover:cursor-pointer hover:font-bold"
      style={
        !!person
          ? { color: person.color, borderColor: person.color }
          : undefined
      }
    >
      <IconManFilled size={16} />
      <span>{label ?? id}</span>
    </NodeViewWrapper>
  );
};
