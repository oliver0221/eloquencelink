import { useState, KeyboardEvent, ChangeEvent } from "react";
import clsx from "clsx";

// Define the props that the EditableText component will accept
type IProps = {
  text: string; // Initial text to be displayed and edited
  onSave: (name: string) => void; // Function to be called when saving the edited text
};

export const EditableText = (props: IProps) => {
  const [isEditing, setIsEditing] = useState(false); // State to track whether the text is being edited
  const [text, setText] = useState(props.text); // State to track the current text value

  // Function to handle double click event to start editing
  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  // Function to handle blur event, which stops editing and resets the text value
  const onBlur = () => {
    if (isEditing) {
      setIsEditing(false);
      setText(props.text);
    }
  };

  // Function to handle text change events, updating the text state
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  // Function to handle key down events, to save and stop editing when Enter key is pressed
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) { // 13 is the keycode for Enter key
      setIsEditing(false);
      props.onSave(text);
    }
  };

  // If the component is in editing mode, render an input field
  if (isEditing) {
    return (
      <input
        className={clsx([
          "w-[10rem]", // Width of 10rem
          "flex",      // Use flexbox layout
          "items-center", // Center items vertically
          "h-[2rem]",  // Height of 2rem
          "outline-none", // Remove outline
          "border-0", // Remove border
        ])}
        type="text"
        value={text}
        onKeyDown={onKeyDown}
        onChange={onChange}
        onBlur={onBlur}
        autoFocus // Automatically focus the input field
      />
    );
  } else {
    // If not in editing mode, render a div with the text
    return (
      <div
        className={clsx([
          "leading-9",         // Line height of 9
          "w-[10rem]",         // Width of 10rem
          "h-[2rem]",          // Height of 2rem
          "overflow-hidden",   // Hide overflow
          "text-ellipsis",     // Add ellipsis to overflowing text
          "whitespace-nowrap", // Prevent text wrapping
        ])}
        onDoubleClick={handleDoubleClick} // Set up double click to edit
      >
        {text}
      </div>
    );
  }
};
