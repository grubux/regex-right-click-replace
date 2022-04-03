import React, { useState, useEffect } from "react";
import "./App.css";

// @ts-nocheck

/*global chrome */

function App() {
  const [find, setFind] = useState("");
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
          <div>
            <div style={{ fontSize: "12px" }}>find</div>
            <input
              style={{
                height: "15%",
                textAlign: "center",
                borderRadius: "5px",
              }}
              type="text"
              placeholder="find"
              value={find}
              onChange={handleFind}
            />
          </div>
          <div>
            <div style={{ fontSize: "12px" }}>replace</div>
            <input
              style={{
                height: "15%",
                textAlign: "center",
                borderRadius: "5px",
              }}
              type="text"
              placeholder="replace"
              value={replace}
              onChange={handleReplace}
            />
          </div>
          <div>
            PascalCase
            <input
              type="checkbox"
              value={pascalCase}
              checked={pascalCase}
              onChange={handlePascalCase}
            />
          </div>
          <button
            style={{ borderRadius: "5px", height: "40px", margin: "10px" }}
            onClick={handleSent}
          >
            Save
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
