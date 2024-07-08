import { Event } from "@/models/event";
import useEvents from "./use-events";
import { updateObjById } from "../common/update-array";
import axios from "axios";
import { useToast } from "@/app/components/ui/use-toast";

const useEditEvent = () => {
  const { setData: setEventsData } = useEvents();
  const { toast } = useToast();

  const editEvent = async (
    eventId: string,
    props: Partial<Event>,
    onDone?: () => void
  ) => {
    try {
      setEventsData((t) =>
        updateObjById<Event>(t, eventId, {
          ...props,
        })
      );
      onDone && onDone();
      await axios.patch("/api/events", {
        eventId,
        ...props,
      });
      toast({
        title: "Success",
        description: "Event has been updated",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: JSON.stringify(e),
        variant: "destructive",
      });
    }
  };
  return { editEvent };
};

export default useEditEvent;
