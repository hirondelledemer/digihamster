import { FC, Fragment, useContext } from "react";
import { IconChevronRight } from "@tabler/icons-react";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { RelationshipNavigatorContext } from "../../../../navigator-context";
import { EntityTypeIcon } from "../../../EntityTypeIcon";
import { useEntityColor } from "../../../../use-entity-color";
import { useEntityLabel } from "../../../../use-entity-label";

export const pathTestId = "NavigatorPath-testid";
export const crumbTestId = "NavigatorPath-crumb-testid";

interface CrumbProps {
  id: number;
  type: RelationshipEntityType;
  index: number;
  isCurrent: boolean;
}

const Crumb: FC<CrumbProps> = ({ id, type, index, isCurrent }) => {
  const { goToIndex } = useContext(RelationshipNavigatorContext);

  const label = useEntityLabel(id, type);
  const color = useEntityColor(id, type);

  // the type is a reasonable stand-in while the entity is still loading, and
  // for the types that have no title of their own
  const text = label || type;

  return (
    <button
      type="button"
      data-testid={crumbTestId}
      title={text}
      aria-current={isCurrent ? "page" : undefined}
      disabled={isCurrent}
      onClick={() => goToIndex(index)}
      className={`flex min-w-0 items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors ${
        isCurrent
          ? "border-transparent bg-accent font-medium text-accent-foreground"
          : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <span className="shrink-0">
        <EntityTypeIcon type={type} size={13} color={color || "currentColor"} />
      </span>
      <span className="max-w-[120px] truncate">{text}</span>
    </button>
  );
};

/**
 * The trail of what has been opened, as chips joined by arrows.
 *
 * Each compact column below renders an entity's *neighbours*, never the entity
 * itself, so without this the only trace of where you are is which icon
 * happens to be outlined. This says it outright.
 */
export const NavigatorPath: FC = () => {
  const { entities } = useContext(RelationshipNavigatorContext);

  if (entities.length === 0) {
    return null;
  }

  return (
    <nav
      data-testid={pathTestId}
      aria-label="relationship trail"
      className="mb-3 flex flex-wrap items-center gap-1"
    >
      {entities.map((entity, idx) => (
        <Fragment key={`${entity.type}-${entity.id}`}>
          {idx > 0 && (
            <IconChevronRight
              size={12}
              className="shrink-0 text-muted-foreground/50"
              aria-hidden
            />
          )}
          <Crumb
            id={entity.id}
            type={entity.type}
            index={idx}
            isCurrent={idx === entities.length - 1}
          />
        </Fragment>
      ))}
    </nav>
  );
};
