import React, { useState, useEffect } from "react";
import "./App.css";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

// @ts-nocheck

/*global chrome */

function App() {
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [whichCase, setWhichCase] = useState("uppercase");

  const getValues = () => {
    console.log("sending message");
    chrome.runtime.sendMessage({ msg: "get values" }, function (response) {
      console.log("data: ", response);
      setFind(response.data.regexFind);
      setReplace(response.data.regexReplace);
      setWhichCase(response.data.regexCase);
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWhichCase(event.target.value);
  };

  const controlProps = (item: string) => ({
    checked: whichCase === item,
    onChange: handleChange,
    value: item,
    name: "size-radio-button-demo",
    inputProps: { "aria-label": item },
  });

  const handleSent = () => {
    console.log("whichCase: ", whichCase);
    chrome.runtime.sendMessage({
      msg: "save",
      data: {
        find,
        replace,
        whichCase,
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
                height: "20%",
                width: "80%",
                textAlign: "center",
                borderRadius: "10px",
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
                width: "80%",
                height: "20%",
                textAlign: "center",
                borderRadius: "10px",
              }}
              type="text"
              placeholder="replace"
              value={replace}
              onChange={handleReplace}
            />
          </div>
          <div>
            <FormControl style={{ marginTop: "10px   auto" }}>
              <FormLabel
                id="demo-row-radio-buttons-group-label"
                style={{ color: "#1976D2" }}
              >
                case
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-column-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <div>
                  <FormControlLabel
                    value="uppercase"
                    control={
                      <Radio {...controlProps("uppercase")} size="small" />
                    }
                    label="Uppercase"
                  />
                  <FormControlLabel
                    value="pascalcase"
                    control={
                      <Radio {...controlProps("pascalcase")} size="small" />
                    }
                    label="PascalCase"
                  />
                </div>
                <div>
                  <FormControlLabel
                    value="lowercase"
                    control={
                      <Radio {...controlProps("lowercase")} size="small" />
                    }
                    label="LowerCase"
                  />
                  <FormControlLabel
                    value="none"
                    control={<Radio {...controlProps("none")} size="small" />}
                    label="None"
                  />
                </div>
              </RadioGroup>
            </FormControl>
          </div>
          <button
            style={{ borderRadius: "10px", height: "40px", margin: "30px" }}
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
