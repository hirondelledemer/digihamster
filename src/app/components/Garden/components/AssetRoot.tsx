import React, { FC, PropsWithChildren, SVGProps } from "react";

export type AssetRootProps = SVGProps<SVGSVGElement> & {
  /**
   * Transform that places the asset inside the Garden scene. It is dropped in
   * standalone mode, so `viewBox` can be measured in the asset's own space.
   */
  placement?: string;
};

/**
 * Root element shared by every Garden asset.
 *
 * Inside the Garden the asset is just a `<g>` placed by `placement`. Pass a
 * `viewBox` and it instead renders as its own `<svg>`, framed by that box and
 * unplaced, so it can be dropped anywhere in the app as a standalone figure.
 */
export const AssetRoot: FC<PropsWithChildren<AssetRootProps>> = ({
  placement,
  viewBox,
  className,
  style,
  children,
  ...props
}) => {
  const groupProps = props as SVGProps<SVGGElement>;

  if (viewBox) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
        className={className}
        style={style}
      >
        <g {...groupProps}>{children}</g>
      </svg>
    );
  }

  return (
    <g transform={placement} className={className} style={style} {...groupProps}>
      {children}
    </g>
  );
};
