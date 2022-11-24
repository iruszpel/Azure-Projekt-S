import { TextareaAutosize } from "@mui/material";

interface TextAreaProps {
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const TextArea: React.FC<TextAreaProps> = (props) => {
  const { setValue } = props;
  return (
    <TextareaAutosize
      id="textarea"
      aria-label="Enter your article ..."
      placeholder="Enter your article ..."
      autoFocus={true}
      style={{
        width: "80%",
        height: "90%",
        borderRadius: "15px",
        backgroundColor: "#3b3b3b",
        color: "white",
        padding: "20px",
        fontFamily: "system-ui",
      }}
      onChange={(e) => {
        setValue(e.target.value);
      }}
    />
  );
};

export default TextArea;
