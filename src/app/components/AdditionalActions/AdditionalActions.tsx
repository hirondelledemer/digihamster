import { FC, ReactNode } from "react";
import { ContextMenuItem, ContextMenuSeparator } from "../ui/context-menu";

/**
 * A menu item the surrounding context adds to a card's own.
 *
 * What a thing affords depends on where it is being looked at - something
 * reached from an event can be pulled into that event - and the card has no
 * way of knowing where it was drawn. So the context hands the finished item
 * over rather than the card learning to recognise every situation it might
 * find itself in.
 */
export interface AdditionalAction {
  label: string;
  icon?: ReactNode;
  onClick(): void;
}

/**
 * The context-added items, above the card's own and fenced off from them.
 * Every card's menu opens this way, so the ordering and the rule about the
 * divider live here rather than being copied into each one.
 */
export const AdditionalActions: FC<{ actions?: AdditionalAction[] }> = ({
  actions = [],
}) => {
  if (!actions.length) {
    return null;
  }

  return (
    <>
      {actions.map((action) => (
        <ContextMenuItem key={action.label} inset onClick={action.onClick}>
          {action.icon}
          {action.label}
        </ContextMenuItem>
      ))}
      <ContextMenuSeparator />
    </>
  );
};
