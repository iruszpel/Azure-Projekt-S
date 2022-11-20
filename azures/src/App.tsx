import { useEffect, useRef, useState } from "react";
import {
  Box,
  Card,
  formLabelClasses,
  IconButton,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { KeyboardDoubleArrowRight } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import ReplayIcon from "@mui/icons-material/Replay";
import TextArea from "./components/text-area";
import TagCard from "./components/tag-card";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";


type Tag = {
    category: string;
    confidenceScore: number;
}

function App() {
  const [height, setHeight] = useState<number>(0);
  const [tags, setTags] = useState<Tag[]>([]);

  const boxRef = useRef(null);
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    const setDimensions = () => {
      if (boxRef.current) {
        setHeight(boxRef.current.offsetHeight);
      }
    };
    if (height == 0) {
      setDimensions();
    }

    window.addEventListener("resize", () => {
      setDimensions();
    });

    return () =>
      window.removeEventListener("resize", () => {
        setDimensions();
      });
  }, [boxRef]);
  const elementHeight = (height - 50) / tags.length + "px";
  const fontSize = (height - 50) / tags.length / 3 + "px";

  async function fetchTags(article: object) {
    setIsLoading(true);
    setErrorMessage("");
    setTags([]);
    const response = await fetch(
      "https://articles-api.azurewebsites.net/api/GetArticleTags",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(article),
      }
    );
    if (!response.ok) {
      setErrorMessage("An error occured");
      setIsLoading(false);
      setIsFinished(true);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    // console.log
    data.class.forEach((d: any) => {
      console.log(d);
      setTags((prev) => [...prev, d]);
    });
    setIsLoading(false);
    setIsFinished(true);
  }

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  console.log("tags ", tags);

  const onClickHandler = () => {
    const article = { article: inputValue.replace(/(\r\n|\n|\r)/gm, "") };
    setIsFinished(false);

    if (inputValue.length === 0) {
      setErrorMessage("Article cannot be empty");
      setIsFinished(true);
      setTags([""]);
    } else {
      fetchTags(article);
    }
  };

  return (
    <Box sx={{ marginX: "30px" }}>
      <Box sx={{ height: "80px", marginTop: "30px", marginLeft: "25px" }}>
        <Typography variant="h3" sx={{ color: "white" }}>
          Azure S Project
        </Typography>
      </Box>

      <Card
        variant="outlined"
        sx={{
          height: "75vh",
          borderRadius: "15px",
          padding: "20px",
          display: "flex",
          border: "0px solid red",
          background:
            "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(66,71,84,1) 100%)",
        }}
      >
        <Box
          sx={{
            width: "40%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextArea setValue={setInputValue} />
        </Box>
        <Box
          sx={{
            width: "20%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="label"
            onClick={onClickHandler}
            disabled={isLoading}
          >
            {isLoading && <CircularProgress sx={{ fontSize: "50px" }} />}
            {!isLoading && errorMessage.length === 0 && !isFinished && (
              <KeyboardDoubleArrowRight sx={{ fontSize: "50px" }} />
            )}
            {!isLoading && isFinished && (
              <ReplayIcon sx={{ fontSize: "50px" }} />
            )}
          </IconButton>
        </Box>
        <Box
          sx={{
            width: "40%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
          ref={boxRef}
        >
          {!isFinished && tags.length === 0 && errorMessage.length === 0 && (
            <TagCard
              tag={"Your tags will be here"}
              elementHeight={"100vh"}
              fontSize={"40px"}
            />
          )}
          {isFinished && tags.length === 0 && errorMessage.length === 0 && (
            <TagCard
              tag={"No tags were found"}
              elementHeight={"100vh"}
              fontSize={"40px"}
            />
          )}
          {errorMessage.length !== 0 && (
            <TagCard
              tag={errorMessage}
              elementHeight={"100vh"}
              fontSize={"40px"}
              borderColor="#9F0000"
            />
          )}
          {tags.length === 1 && errorMessage.length === 0 && (
            <TagCard tag={tags[0].category} confidenceScore={tags[0].confidenceScore} elementHeight={"100vh"} fontSize={"40px"} />
          )}
          {tags.length > 1 &&
            errorMessage.length === 0 &&
            tags.map((t) => (
              <TagCard
                tag={t.category}
                confidenceScore={t.confidenceScore}
                elementHeight={elementHeight}
                fontSize={fontSize}
              />
            ))}
        </Box>
      </Card>
    </Box>
  );
}

export default App;
