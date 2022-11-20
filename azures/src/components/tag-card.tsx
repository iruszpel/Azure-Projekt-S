import { Card } from "@mui/material";
interface TagCardProps {
  tag: string;
  elementHeight: string;
  borderColor?: string;
  fontSize: string;
}

const TagCard: React.FC<TagCardProps> = (props) => {
  const { tag, elementHeight, fontSize, borderColor } = props;
  return (
    <Card
      sx={{
        height: elementHeight,
        backgroundColor: "#3b3b3b",
        border: "2px solid ",
        borderColor: borderColor || "#a2c8fa",
        boxSizing: "border-box",
        borderRadius: "15px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: 700,
        marginX: "20px",
        fontSize: fontSize,
        "&:hover": {
          border: "2px solid white",
        },
      }}
    >
      {tag}
    </Card>
  );
};

export default TagCard;
