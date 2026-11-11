import { CSSProperties, FC } from "react";
import { cn } from "../../utils";
import { format } from "date-fns";

export const EntryContainer: FC<{
  value: number;
  title: string;
  date: string;
  style?: CSSProperties;
}> = ({ value, title, date, style }) => {
  return (
    <tr className={cn("py-[3px] leading-2")} style={style}>
      <td className="w-6 border border-[2px] border-dotted border-l-0">
        {value}
      </td>
      <td className="max-w-12 truncate border border-[2px] border-dotted">
        {title}
      </td>
      <td className="border border-[2px] border-dotted border-l-0">
        {format(date, "MMM d")}
      </td>
    </tr>
  );
};
