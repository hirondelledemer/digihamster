import { useAttachmentsActions } from "@/app/utils/hooks/use-attachments/actions-context";
import { FC, useState } from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { IconCheckbox, IconPencil } from "@tabler/icons-react";

export const EditableFileName: FC<{ id: number; title: string }> = ({
  id,
  title,
}) => {
  const [allowEdit, setAllowEdit] = useState<boolean>(false);
  const [value, setValue] = useState<string>(title);

  const { update } = useAttachmentsActions();

  const handleSave = async () => {
    await update(id, { file_name: value });
    setAllowEdit(false);
  };

  if (!allowEdit) {
    return (
      <div className="flex gap-2 items-center">
        {title}
        <Button size="icon">
          <IconPencil onClick={() => setAllowEdit(true)} />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-center">
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button size="icon">
        <IconCheckbox onClick={handleSave} />
      </Button>
    </div>
  );
};
