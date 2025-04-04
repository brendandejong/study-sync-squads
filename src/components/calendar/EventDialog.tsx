
import * as React from "react";
import { Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserEvent } from "@/types/calendar";
import EventForm from "./EventForm";
import { EventFormValues } from "./schema/eventFormSchema";

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  onSave: (event: Omit<UserEvent, "id">) => void;
  onDelete?: (eventId: string) => void;
  event?: UserEvent | null;
  mode?: "create" | "view" | "edit";
}

const EventDialog: React.FC<EventDialogProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onSave,
  onDelete,
  event,
  mode = "create",
}) => {
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isCreateMode = mode === "create";
  
  const dialogTitle = isCreateMode 
    ? "Add New Event" 
    : isViewMode 
      ? "Event Details" 
      : "Edit Event";
      
  const dialogDescription = isCreateMode 
    ? "Create a new event for your calendar." 
    : isViewMode 
      ? "View your event details." 
      : "Edit your event details.";

  // Prepare default values for the form
  const defaultValues = React.useMemo(() => ({
    title: event?.title || "",
    date: event?.date || selectedDate || new Date(),
    startTime: event?.startTime || "09:00",
    endTime: event?.endTime || "10:00",
    description: event?.description || "",
  }), [event, selectedDate]);
  
  const handleSubmit = (values: EventFormValues) => {
    // Ensure we convert form values to match UserEvent type
    const eventData: Omit<UserEvent, "id"> = {
      title: values.title,
      date: values.date,
      startTime: values.startTime,
      endTime: values.endTime,
      description: values.description || "", // Ensure description is always a string
    };
    
    onSave(eventData);
    onClose();
  };

  const handleDelete = () => {
    if (event?.id && onDelete) {
      onDelete(event.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>

        <EventForm 
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          readOnly={isViewMode}
        />

        <DialogFooter>
          {isViewMode && event?.id && onDelete && (
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete}
              className="mr-auto"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          )}
          
          <Button type="button" variant="outline" onClick={onClose}>
            {isViewMode ? "Close" : "Cancel"}
          </Button>
          
          {!isViewMode && (
            <Button type="button" onClick={() => {
              // Find the hidden submit button in the form and click it
              const form = document.querySelector("form");
              const submitButton = form?.querySelector('button[type="submit"]') as HTMLButtonElement | null;
              submitButton?.click();
            }}>
              {isCreateMode ? "Save Event" : "Update Event"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;
