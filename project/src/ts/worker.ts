// worker.ts

const CHUNK_SIZE = 1000; // Adjust the chunk size as needed

const readAndParseFile = async (file: File) => {
  const reader = new FileReader();
  let textBuffer = "";

  reader.onload = async (e) => {
    textBuffer += e.target!.result as string;
  };

  reader.onloadend = () => {
    postMessage({ msg: "parseChunk", result: JSON.parse(textBuffer) });
    textBuffer = "";
  };

  reader.onerror = (error) => {
    // Handle any errors
    console.error(error);
  };

  reader.readAsText(file);
};

onmessage = async (e) => {
  const { file, msg } = e.data;

  if (msg === "file") {
    await readAndParseFile(file);
    postMessage({ msg: "parseComplete" });
  }
};
