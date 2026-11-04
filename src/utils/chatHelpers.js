export const getId = (person) => String(person?._id ?? person?.id ?? "");

export const formatTime = (value) => {
    if (!value) return "";
    const date = new Date(value);
    
    if (Number.isNaN(date.getTime())) return "";
    if (date.toDateString() === new Date().toDateString()) {
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
    }
    return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
    });
};

export const getPreview = (person) => 
    person.lastMessageIsImage ? "Photo" 
    : person.lastMessage || "Start a conversation";

export const getInitials = (name) =>
    (name || "?").trim().charAt(0).toUpperCase();
