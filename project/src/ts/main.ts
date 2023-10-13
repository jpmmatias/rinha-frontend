const app = document.querySelector<HTMLDivElement>("#app")!;
app.innerHTML = `
  <h1>JSON Tree Viewer</h1>
  <p>Simple JSON Viewer that runs completely on-client. No data exchange </p>
  <input id="json-input-file" type="file">Load JSON</button>
`;

const worker = new Worker("./src/ts/worker.ts");

worker.onmessage = (e) => {
  const { msg, result } = e.data;
  app.innerHTML = "";
  if (msg === "parseChunk") {
    appendChunkToTree(result);
  } else if (msg === "parseComplete") {
    console.log("Parse complete");
  }
};
const createTree = (json: any): HTMLUListElement => {
  const ul = document.createElement("ul");
  const fragment = document.createDocumentFragment(); // Create a DocumentFragment

  for (const key in json) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.innerText = `${key}: `;
    li.appendChild(span);

    if (typeof json[key] === "object") {
      // Recursively process nested objects
      const nestedUl = createTree(json[key]);
      li.appendChild(nestedUl);
    } else {
      const spanValue = document.createElement("span");
      spanValue.innerText = json[key];
      li.appendChild(spanValue);
    }

    fragment.appendChild(li); // Append the li element to the DocumentFragment
  }

  ul.appendChild(fragment); // Append the DocumentFragment to the ul element
  return ul;
};

const input = document.querySelector<HTMLInputElement>("#json-input-file")!;
input.addEventListener("change", (e) => {
  const file = (e.target as HTMLInputElement).files![0];
  console.log(file);
  worker.postMessage({ file, msg: "file" });
});

const appendChunkToTree = (jsonChunk: any) => {
  const ul = createTree(jsonChunk);
  app.appendChild(ul);
};
