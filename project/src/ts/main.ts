const app = document.querySelector<HTMLDivElement>("#app")!;
app.innerHTML = `
  <h1>JSON Tree Viewer</h1>
  <p>Simple JSON Viewer that runs completely on-client. No data exchange </p>
  <input id="json-input-file" type="file">Load JSON</button>
`;

const readAndParseFile = async (file: File): Promise<any> => {
  const reader = new FileReader();
  reader.onload = async (e) => {
    postMessage({ msg: "parse", result: e.target!.result });
  };
  reader.readAsText(file);
};

onmessage = async (e) => {
  const { file, msg, result } = e.data;

  if (msg === "parse") {
    const json = JSON.parse(result);
    app.innerHTML = "";
    app.appendChild(await createTree(json));
  }
  if (msg !== "file") return;
  await readAndParseFile(file);
};

const input = document.querySelector<HTMLInputElement>("#json-input-file")!;
input.addEventListener("change", (e) => {
  const file = (e.target as HTMLInputElement).files![0];
  console.log(file);
  postMessage({ file, msg: "file" });
});

const createTree = async (json: any): Promise<HTMLUListElement> => {
  const ul = document.createElement("ul");
  for (const key in json) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.innerText = `${key}: `;
    li.appendChild(span);
    if (typeof json[key] === "object") {
      li.appendChild(await createTree(json[key]));
    } else {
      const span = document.createElement("span");
      span.innerText = json[key];
      li.appendChild(span);
    }
    ul.appendChild(li);
  }
  return ul;
};
