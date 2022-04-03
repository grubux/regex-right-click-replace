/*global chrome */
const contextMenuItem = {
  id: "tutorial01",
  title: "Regex replace" /* what appears in the menu */,
  contexts: [
    "page",
    "selection",
  ] /* to make this appear only when user selects something on page */,
};

// let regexCustomFind = /-/g;

const re = /([a-zA-Z0-9-]+)+/g;

const getStoragePlusDomModifications = (selection) => {
  chrome.storage.local.get(
    ["regexFind", "regexReplace", "regexCase"],
    function (result) {
      domModifications(
        selection,
        result.regexFind,
        result.regexReplace,
        result.regexCase
      );

      console.log("localstorage res: ", result);
    }
  );
};

const domModifications = (selection, regexFind, regexReplace, regexCase) => {
  const find = new RegExp(regexFind, "g");
  console.log("props: ", selection, regexFind, regexReplace, regexCase);
  const regexReplaced = selection.replace(find, regexReplace);

  const pascalCase = regexReplaced.replace(re, function (x) {
    return x.charAt(0).toUpperCase() + x.slice(1);
  });

  const upperCase = regexReplaced.toUpperCase();

  const lowerCase = regexReplaced.toLowerCase();

  console.log("case in bcg: ", regexCase);
  console.log("regexReplaced: ", regexCase, regexReplaced);
  const toInject =
    regexCase === "uppercase"
      ? upperCase
      : regexCase === "lowercase"
      ? lowerCase
      : regexCase === "pascalcase"
      ? pascalCase
      : regexCase === "none" && regexReplaced;
  chrome.tabs.executeScript({
    code: `document.execCommand('insertText', false, '${toInject}')`,
  });
};

chrome.contextMenus.onClicked.addListener(async function (itemData) {
  console.log("itemData.selectionText", itemData.selectionText);
  getStoragePlusDomModifications(itemData.selectionText);
});

const setStorage = async (data) => {
  await chrome.storage.local.set(
    {
      regexFind: data.find,
      regexReplace: data.replace,
      regexCase: data.whichCase,
    },
    function () {
      console.log("Value is set to " + data.whichCase);
      console.log({
        regexFind: data.find,
        regexReplace: data.replace,
        regexCase: data.whichCase,
      });
    }
  );
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request) {
    if (request.msg === "save") {
      setStorage(request.data);
    }

    if (request.msg === "get values") {
      chrome.storage.local.get(
        ["regexFind", "regexReplace", "regexCase"],
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
