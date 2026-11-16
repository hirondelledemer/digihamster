import Attachments from "../components/Attachments";
import { AttachmentsContextProvider } from "../utils/hooks/use-attachments/provider";

export default function AttachmentsPage() {
  return (
    <AttachmentsContextProvider>
      <Attachments />
    </AttachmentsContextProvider>
  );
}
