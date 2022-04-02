import { sensitiveHeaders } from "http2";
import React, { useState, useEffect } from "react";
import "./App.css";

// @ts-nocheck

/*global chrome */

function App() {
  const [find, setFind] = useState("");
  const [sent, setSent] = useState(false);
  const [replace, setReplace] = useState("");
  const [pascalCase, setPascalCase] = useState(false);

  const getValues = () => {
    console.log("sending message");
    chrome.runtime.sendMessage({ msg: "get values" }, function (response) {
      console.log("data: ", response);
      setFind(response.data.regexFind);
      setReplace(response.data.regexReplace);
      setPascalCase(response.data.regexPascalCase);
    });
  };

  useEffect(() => {
    getValues();
  }, []);

  const handleFind = (event: any) => {
    setFind(event.target.value);
  };
  const handleReplace = (event: any) => {
    setReplace(event.target.value);
  };

  const handlePascalCase = (event: any) => {
    setPascalCase(!pascalCase);
  };

  const handleSent = () => {
    console.log("pascalCase: ", pascalCase);
    chrome.runtime.sendMessage({
      msg: "save",
      data: {
        find,
        replace,
        pascalCase,
      },
    });
    setSent(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ margin: "20px" }}>Set your options</div>
        <div
          style={{
            flex: 1,
            height: "70%",
            width: "80%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
          }}
        >
          <input
            style={{ height: "40px", textAlign: "center" }}
            type="text"
            placeholder="find"
            value={find}
            onChange={handleFind}
          />
          <input
            style={{ height: "40px", textAlign: "center" }}
            type="text"
            placeholder="replace"
            value={replace}
            onChange={handleReplace}
          />
          <div>
            PascalCase
            <input
              type="checkbox"
              value={pascalCase}
              checked={pascalCase}
              onChange={handlePascalCase}
            />
          </div>
          <button onClick={handleSent}>Save</button>
        </div>
      </header>
    </div>
  );
}

export default App;
