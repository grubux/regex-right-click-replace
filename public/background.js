/*global chrome */
const contextMenuItem = {
  id: "tutorial01",
  title: "My Chrome context menu 👆" /* what appears in the menu */,
  contexts: [
    "page",
    "selection",
  ] /* to make this appear only when user selects something on page */,
};

// let regexCustomFind = /-/g;

const re = /([a-zA-Z0-9-]+)+/g;

const getStoragePlusDomModifications = (selection) => {
  chrome.storage.local.get(
    ["regexFind", "regexReplace", "regexPascalCase"],
    function (result) {
      domModifications(
        selection,
        result.regexFind,
        result.regexReplace,
        result.regexPascalCase
      );

      console.log("localstorage res: ", result);
    }
  );
};

const domModifications = (
  selection,
  regexFind,
  regexReplace,
  regexPascalCase
) => {
  const find = new RegExp(regexFind, "g");
  console.log("props: ", selection, regexFind, regexReplace, regexPascalCase);
  const regexReplaced = selection.replace(find, regexReplace);

  const pascalCase = regexReplaced.replace(re, function (x) {
    return x.charAt(0).toUpperCase() + x.slice(1);
  });
  console.log("pascalCaseActivated", regexPascalCase);
  console.log("here", pascalCase, regexReplaced);
  // return regexPascalCase ? pascalCase : regexReplaced;
  const toInject = regexPascalCase ? pascalCase : regexReplaced;
  chrome.tabs.executeScript({
    code: `document.execCommand('insertText', false, '${toInject}')`,
  });
};

chrome.contextMenus.onClicked.addListener(async function (itemData) {
  // console.log("x", getStoragePlusDomModifications(itemData.selectionText));
  console.log("itemData.selectionText", itemData.selectionText);
  getStoragePlusDomModifications(itemData.selectionText);

  // console.log("toInject: ", toInject);
});
// await chrome.storage.sync.get(
//   { pascalCase: defaultValue },
//   function (result) {
//     console.log(result.pascalCase);
//     if (!result) {
//     }

const setStorage = async (data) => {
  await chrome.storage.local.set(
    {
      regexFind: data.find,
      regexReplace: data.replace,
      regexPascalCase: data.pascalCase,
    },
    function () {
      console.log("Value is set to " + data.find);
      console.log({
        regexFind: data.find,
        regexReplace: data.replace,
        regexPascalCase: data.pascalCase,
      });
    }
  );
};

const sendValues = (sendRes) => {
  chrome.storage.local.get(["regexFind"], function (result) {});
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request) {
    if (request.msg === "save") {
      setStorage(request.data);
    }

    if (request.msg === "get values") {
      chrome.storage.local.get(
        ["regexFind", "regexReplace", "regexPascalCase"],
        function (result) {
          console.log("resu: ", result);
          sendResponse({ msg: "received value", data: result });
        }
      );
    }
    // console.log(request);
    if (request.msg === "send this message") {
      // alert(request.type);
    }
  }
  return true;
  // alert(request);
});
chrome.contextMenus.removeAll(function () {
  chrome.contextMenus.create(contextMenuItem);
});

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
