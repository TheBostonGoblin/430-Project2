/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./client/helper.js":
/*!**************************!*\
  !*** ./client/helper.js ***!
  \**************************/
/***/ ((module) => {

eval("//helper function used to used to tell the user that their is a error or message that needs to be communicated\nconst handleJsonMessage = message => {\n  document.getElementById('jsonMessage').textContent = message;\n};\nconst handleJsonMessageUp = message => {\n  document.getElementById('jsonMessageUpdate').textContent = message;\n};\nconst updateUploadFile = async (e, handler) => {\n  e.preventDefault();\n  const response = await fetch(e.target.action, {\n    method: 'POST',\n    body: new FormData(e.target)\n  });\n  const result = await response.json();\n  if (result.error) {\n    handleJsonMessageUp(result.error);\n  }\n  if (handler) {\n    handler(result);\n  }\n  return false;\n};\nconst uploadFile = async (e, handler) => {\n  e.preventDefault();\n  const response = await fetch(e.target.action, {\n    method: 'POST',\n    body: new FormData(e.target)\n  });\n  const result = await response.json();\n  if (result.error) {\n    handleJsonMessage(result.error);\n  }\n  if (handler) {\n    handler(result);\n  }\n  return false;\n};\nconst sendPost = async (url, data, handler) => {\n  const response = await fetch(url, {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json'\n    },\n    body: JSON.stringify(data)\n  });\n  const result = await response.json();\n  if (result.error) {\n    handleJsonMessage(result.error);\n  }\n  if (result.redirect) {\n    window.location = result.redirect;\n  }\n  if (handler) {\n    handler(result);\n  }\n};\nconst sendSub = async (url, data, handler) => {\n  console.log(\"Entered send sub\");\n  const response = await fetch(url, {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json'\n    },\n    body: JSON.stringify(data)\n  });\n  console.log(\"exit send sub\");\n  const result = await response.json();\n  if (handler) {\n    handler(result);\n  }\n  return false;\n};\nmodule.exports = {\n  sendPost,\n  uploadFile,\n  sendSub,\n  handleJsonMessage,\n  updateUploadFile,\n  handleJsonMessageUp\n};\n\n//# sourceURL=webpack://Logins/./client/helper.js?");

/***/ }),

/***/ "./client/login.jsx":
/*!**************************!*\
  !*** ./client/login.jsx ***!
  \**************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const helper = __webpack_require__(/*! ./helper.js */ \"./client/helper.js\");\n\n//helper functions handle login request\nconst handleLogin = e => {\n  e.preventDefault();\n  const username = e.target.querySelector('#user').value;\n  const pass = e.target.querySelector(\"#pass\").value;\n  const _csrf = e.target.querySelector(\"#_csrf\").value;\n  if (!username || !pass) {\n    helper.handleJsonMessage('Username or password is empty!');\n    return false;\n  }\n  helper.sendPost(e.target.action, {\n    username,\n    pass,\n    _csrf\n  });\n  return false;\n};\n\n//creates the login form\nconst LoginWindow = props => {\n  return /*#__PURE__*/React.createElement(\"form\", {\n    id: \"loginForm\",\n    name: \"loginForm\",\n    onSubmit: handleLogin,\n    action: \"/login\",\n    method: \"POST\",\n    className: \"mainForm is-centered\"\n  }, /*#__PURE__*/React.createElement(\"h1\", {\n    className: \"column is-12 is-size-4 has-text-weight-bold\"\n  }, \"Login\"), /*#__PURE__*/React.createElement(\"label\", {\n    className: \"label\",\n    htmlFor: \"username\"\n  }, \"Username: \"), /*#__PURE__*/React.createElement(\"input\", {\n    className: \"input\",\n    id: \"user\",\n    type: \"text\",\n    name: \"username\",\n    placeholder: \"Username\"\n  }), /*#__PURE__*/React.createElement(\"label\", {\n    className: \"label\",\n    htmlFor: \"pass\"\n  }, \"Password: \"), /*#__PURE__*/React.createElement(\"input\", {\n    className: \"input mb-2\",\n    id: \"pass\",\n    type: \"password\",\n    name: \"pass\",\n    placeholder: \"Password\"\n  }), /*#__PURE__*/React.createElement(\"input\", {\n    id: \"_csrf\",\n    type: \"hidden\",\n    name: \"_csrf\",\n    value: props.csrf\n  }), /*#__PURE__*/React.createElement(\"input\", {\n    className: \"formSubmit button is-primary is-centered\",\n    type: \"submit\",\n    value: \"Sign in\"\n  }));\n};\n\n//inital function\nconst init = async () => {\n  const response = await fetch('/getToken');\n  const data = await response.json();\n  ReactDOM.render( /*#__PURE__*/React.createElement(LoginWindow, {\n    csrf: data.csrfToken\n  }), document.querySelector('#content'));\n};\nwindow.onload = init;\n\n//# sourceURL=webpack://Logins/./client/login.jsx?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./client/login.jsx");
/******/ 	
/******/ })()
;