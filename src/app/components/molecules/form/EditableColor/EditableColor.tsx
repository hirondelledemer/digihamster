import { FC, useState } from "react";
import { Button } from "../../../ui/button";
import { IconCheckbox, IconPencil } from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { COLORS_V2 } from "@/app/utils/consts/colors";

export const EditableColor: FC<{
  color: string;
  onSave(color: string): void;
}> = ({ color, onSave }) => {
  const [allowEdit, setAllowEdit] = useState<boolean>(false);
  const [value, setValue] = useState<string>(color);

  const handleSave = async () => {
    onSave(value);
    setAllowEdit(false);
  };

  if (!allowEdit) {
    return (
      <div className="flex gap-2 items-center" style={{ color: value }}>
        {value}
        <Button
          size="icon"
          aria-label="Edit color"
          onClick={() => setAllowEdit(true)}
        >
          <IconPencil />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-center">
      <Select
        onValueChange={(v: string) => setValue(v)}
        defaultValue={value}
        value={value}
        aria-label="select color"
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Color" />
        </SelectTrigger>
        <SelectContent>
          {COLORS_V2.map((color) => (
            <SelectItem key={color} value={color} role="option">
              <div className="flex space-x-2">
                <div className="h-4 w-4" style={{ backgroundColor: color }} />
                <div>{color}</div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button size="icon" aria-label="Save" onClick={handleSave}>
        <IconCheckbox />
      </Button>
    </div>
  );
};
