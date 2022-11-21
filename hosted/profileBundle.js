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

eval("// const socket = io();\n\n// const handleSocket = () =>{\n\n// }\nconst handleError = message => {\n  document.getElementById('errorMessage').textContent = message;\n  document.getElementById('domoMessage').classList.remove('hidden');\n};\nconst sendPost = async (url, data, handler) => {\n  const response = await fetch(url, {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json'\n    },\n    body: JSON.stringify(data)\n  });\n  const result = await response.json();\n  document.getElementById('domoMessage').classList.add('hidden');\n  if (result.error) {\n    handleError(result.error);\n  }\n  if (result.redirect) {\n    window.location = result.redirect;\n  }\n  if (handler) {\n    handler(result);\n  }\n};\nconst hideError = () => {\n  document.querySelector(\"#domoMessage\").classList.add('hidden');\n};\nmodule.exports = {\n  handleError,\n  sendPost,\n  hideError\n};\n\n//# sourceURL=webpack://Logins/./client/helper.js?");

/***/ }),

/***/ "./client/profile.jsx":
/*!****************************!*\
  !*** ./client/profile.jsx ***!
  \****************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const helper = __webpack_require__(/*! ./helper.js */ \"./client/helper.js\");\nlet csrfToken;\nvar socket = io();\nconst UserInfo = props => {};\nconst DomoList = props => {\n  if (props.domos.length === 0) {\n    return /*#__PURE__*/React.createElement(\"div\", {\n      className: \"domoList columns is-multiline\"\n    }, /*#__PURE__*/React.createElement(\"h3\", {\n      className: \"emptyDomo\"\n    }, \"No Domos Yet!\"));\n  }\n  console.log(props);\n  const domoNodes = props.domos.map(domo => {\n    return /*#__PURE__*/React.createElement(\"div\", {\n      key: domo._id,\n      className: \"domo card card-equal-height column is-4\"\n    }, /*#__PURE__*/React.createElement(\"div\", {\n      className: \"card-image\"\n    }, /*#__PURE__*/React.createElement(\"figure\", {\n      className: \"image is-square \"\n    }, /*#__PURE__*/React.createElement(\"img\", {\n      src: \"/assets/img/recipePlaceholder.png\",\n      alt: \"domo face\",\n      className: \"recipeImage\"\n    }))), /*#__PURE__*/React.createElement(\"div\", {\n      className: \"card-content\"\n    }, /*#__PURE__*/React.createElement(\"h3\", {\n      className: \"dishName title has-text-centered\"\n    }, \" \", domo.dishName, \" \"), /*#__PURE__*/React.createElement(\"h3\", {\n      className: \"dishNuritPlus subtitle has-text-centered\"\n    }, \" Nutritional Plus: \", domo.nutri, \" \"), /*#__PURE__*/React.createElement(\"h3\", {\n      className: \"dishIngredients subtitle has-text-centered\"\n    }, \" Ingerdients: \", domo.ingre, \" \"), /*#__PURE__*/React.createElement(\"h3\", {\n      className: \"likes subtitle has-text-centered\"\n    }, \" Food Likes: \", domo.likes, \" \"), /*#__PURE__*/React.createElement(\"h3\", {\n      className: \"likedBy subtitle has-text-centered\"\n    }, \" Who Liked The Post: \", domo.likedBy, \" \")));\n  });\n  return /*#__PURE__*/React.createElement(\"div\", {\n    className: \"domoList columns is-multiline\"\n  }, domoNodes);\n};\nconst loadDomosFromServer = async () => {\n  const response = await fetch('/getMyPost');\n  const data = await response.json();\n  ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {\n    domos: data.domos\n  }), document.querySelector(\"#domos\"));\n};\nconst init = async () => {\n  console.log(`socket is : ${socket}`);\n  const response = await fetch('/getToken');\n  const data = await response.json();\n  csrfToken = data.csrfToken;\n  ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {\n    csrf: data.csrfToken,\n    domos: []\n  }), document.querySelector(\"#domos\"));\n  loadDomosFromServer();\n};\nwindow.onload = init;\n\n//# sourceURL=webpack://Logins/./client/profile.jsx?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./client/profile.jsx");
/******/ 	
/******/ })()
;