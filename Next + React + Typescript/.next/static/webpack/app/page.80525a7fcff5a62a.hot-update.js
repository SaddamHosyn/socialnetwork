/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/page",{

/***/ "(app-pages-browser)/./app/page.tsx":
/*!**********************!*\
  !*** ./app/page.tsx ***!
  \**********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Page)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _components_Header__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/Header */ \"(app-pages-browser)/./components/Header.tsx\");\n/* harmony import */ var _components_pages_HomePage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/pages/HomePage */ \"(app-pages-browser)/./components/pages/HomePage.tsx\");\n/* harmony import */ var _components_pages_HomePage__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_components_pages_HomePage__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _components_pages_PostsPage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/pages/PostsPage */ \"(app-pages-browser)/./components/pages/PostsPage.tsx\");\n/* harmony import */ var _components_pages_PostsPage__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_components_pages_PostsPage__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _components_pages_ProfilePage__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../components/pages/ProfilePage */ \"(app-pages-browser)/./components/pages/ProfilePage.tsx\");\n/* harmony import */ var _components_pages_ProfilePage__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_components_pages_ProfilePage__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _components_pages_LoginPage__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../components/pages/LoginPage */ \"(app-pages-browser)/./components/pages/LoginPage.tsx\");\n/* harmony import */ var _components_pages_LoginPage__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_components_pages_LoginPage__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var _components_pages_RegisterPage__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../components/pages/RegisterPage */ \"(app-pages-browser)/./components/pages/RegisterPage.tsx\");\n/* harmony import */ var _components_pages_RegisterPage__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_components_pages_RegisterPage__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var _components_pages_GroupsPage__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../components/pages/GroupsPage */ \"(app-pages-browser)/./components/pages/GroupsPage.tsx\");\n/* harmony import */ var _components_pages_GroupsPage__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_components_pages_GroupsPage__WEBPACK_IMPORTED_MODULE_8__);\n// app/page.tsx - Main page with navigation\n/* __next_internal_client_entry_do_not_use__ default auto */ \nvar _s = $RefreshSig$();\n\n\n\n\n\n\n\n\nfunction Page() {\n    _s();\n    const [categories, setCategories] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);\n    const [selectedCategoryId, setSelectedCategoryId] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [isLoggedIn, setIsLoggedIn] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const [authChecked, setAuthChecked] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const [currentPage, setCurrentPage] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(\"home\");\n    const handleLogout = async ()=>{\n        try {\n            const res = await fetch(\"/api/logout\", {\n                method: \"POST\"\n            });\n            if (res.ok) {\n                setIsLoggedIn(false);\n                setCurrentPage(\"home\"); // Redirect to home after logout\n            } else {\n                console.error(\"Logout failed:\", await res.text());\n            }\n        } catch (error) {\n            console.error(\"An error occurred during logout:\", error);\n        }\n    };\n    const handleLoginSuccess = ()=>{\n        setIsLoggedIn(true);\n        setCurrentPage(\"posts\"); // Redirect to posts after login\n    };\n    const handleRegisterSuccess = ()=>{\n        setCurrentPage(\"login\"); // Redirect to login after successful registration\n    };\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)({\n        \"Page.useEffect\": ()=>{\n            const checkAuthStatus = {\n                \"Page.useEffect.checkAuthStatus\": async ()=>{\n                    try {\n                        const res = await fetch(\"/api/me\");\n                        if (res.ok) {\n                            setIsLoggedIn(true);\n                            // If user is already logged in, show posts page instead of home\n                            if (currentPage === \"home\") {\n                                setCurrentPage(\"posts\");\n                            }\n                        } else {\n                            setIsLoggedIn(false);\n                        }\n                    } catch (error) {\n                        setIsLoggedIn(false);\n                    } finally{\n                        setAuthChecked(true);\n                    }\n                }\n            }[\"Page.useEffect.checkAuthStatus\"];\n            checkAuthStatus();\n            // Fetch categories\n            fetch(\"/api/categories\").then({\n                \"Page.useEffect\": (res)=>res.json()\n            }[\"Page.useEffect\"]).then({\n                \"Page.useEffect\": (data)=>{\n                    if (data.success) setCategories(data.data);\n                }\n            }[\"Page.useEffect\"]);\n        }\n    }[\"Page.useEffect\"], []);\n    // Render current page\n    const renderCurrentPage = ()=>{\n        switch(currentPage){\n            case \"home\":\n                return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((_components_pages_HomePage__WEBPACK_IMPORTED_MODULE_3___default()), {\n                    onLogin: ()=>setCurrentPage(\"login\"),\n                    onRegister: ()=>setCurrentPage(\"register\")\n                }, void 0, false, {\n                    fileName: \"/Users/eliza.john/Downloads/social-network/Next + React + Typescript/app/page.tsx\",\n                    lineNumber: 85,\n                    columnNumber: 11\n                }, this);\n            case \"posts\":\n                return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((_components_pages_PostsPage__WEBPACK_IMPORTED_MODULE_4___default()), {\n                    categories: categories,\n                    selectedCategoryId: selectedCategoryId,\n                    setSelectedCategoryId: setSelectedCategoryId\n                }, void 0, false, {\n                    fileName: \"/Users/eliza.john/Downloads/social-network/Next + React + Typescript/app/page.tsx\",\n                    lineNumber: 92,\n                    columnNumber: 11\n                }, this);\n            case \"profile\":\n                return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((_components_pages_ProfilePage__WEBPACK_IMPORTED_MODULE_5___default()), {}, void 0, false, {\n                    fileName: \"/Users/eliza.john/Downloads/social-network/Next + React + Typescript/app/page.tsx\",\n                    lineNumber: 99,\n                    columnNumber: 16\n                }, this);\n            case \"login\":\n                return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((_components_pages_LoginPage__WEBPACK_IMPORTED_MODULE_6___default()), {\n                    onSuccess: handleLoginSuccess,\n                    onCancel: ()=>setCurrentPage(\"home\")\n                }, void 0, false, {\n                    fileName: \"/Users/eliza.john/Downloads/social-network/Next + React + Typescript/app/page.tsx\",\n                    lineNumber: 102,\n                    columnNumber: 11\n                }, this);\n            case \"register\":\n                return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((_components_pages_RegisterPage__WEBPACK_IMPORTED_MODULE_7___default()), {\n                    onSuccess: handleRegisterSuccess,\n                    onCancel: ()=>setCurrentPage(\"home\")\n                }, void 0, false, {\n                    fileName: \"/Users/eliza.john/Downloads/social-network/Next + React + Typescript/app/page.tsx\",\n                    lineNumber: 109,\n                    columnNumber: 11\n                }, this);\n            case \"groups\":\n                return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((_components_pages_GroupsPage__WEBPACK_IMPORTED_MODULE_8___default()), {}, void 0, false, {\n                    fileName: \"/Users/eliza.john/Downloads/social-network/Next + React + Typescript/app/page.tsx\",\n                    lineNumber: 115,\n                    columnNumber: 16\n                }, this);\n            default:\n                return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((_components_pages_HomePage__WEBPACK_IMPORTED_MODULE_3___default()), {\n                    onLogin: ()=>setCurrentPage(\"login\"),\n                    onRegister: ()=>setCurrentPage(\"register\")\n                }, void 0, false, {\n                    fileName: \"/Users/eliza.john/Downloads/social-network/Next + React + Typescript/app/page.tsx\",\n                    lineNumber: 118,\n                    columnNumber: 11\n                }, this);\n        }\n    };\n    if (!authChecked) {\n        return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n            children: \"Loading...\"\n        }, void 0, false, {\n            fileName: \"/Users/eliza.john/Downloads/social-network/Next + React + Typescript/app/page.tsx\",\n            lineNumber: 127,\n            columnNumber: 12\n        }, this);\n    }\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_Header__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n                onLogout: handleLogout,\n                isLoggedIn: isLoggedIn,\n                currentPage: currentPage,\n                onNavigate: setCurrentPage\n            }, void 0, false, {\n                fileName: \"/Users/eliza.john/Downloads/social-network/Next + React + Typescript/app/page.tsx\",\n                lineNumber: 132,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"main\", {\n                className: \"main-content\",\n                children: renderCurrentPage()\n            }, void 0, false, {\n                fileName: \"/Users/eliza.john/Downloads/social-network/Next + React + Typescript/app/page.tsx\",\n                lineNumber: 138,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true);\n}\n_s(Page, \"SJsAxMxzZqIK4OD+LFaS9nkGm0s=\");\n_c = Page;\nvar _c;\n$RefreshReg$(_c, \"Page\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2FwcC9wYWdlLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJDQUEyQzs7O0FBRUM7QUFDRjtBQUNVO0FBQ0U7QUFDSTtBQUNKO0FBQ007QUFDSjtBQUt6QyxTQUFTUzs7SUFDdEIsTUFBTSxDQUFDQyxZQUFZQyxjQUFjLEdBQUdYLCtDQUFRQSxDQUFhLEVBQUU7SUFDM0QsTUFBTSxDQUFDWSxvQkFBb0JDLHNCQUFzQixHQUFHYiwrQ0FBUUEsQ0FDMUQ7SUFFRixNQUFNLENBQUNjLFlBQVlDLGNBQWMsR0FBR2YsK0NBQVFBLENBQUM7SUFDN0MsTUFBTSxDQUFDZ0IsYUFBYUMsZUFBZSxHQUFHakIsK0NBQVFBLENBQUM7SUFDL0MsTUFBTSxDQUFDa0IsYUFBYUMsZUFBZSxHQUFHbkIsK0NBQVFBLENBQVc7SUFFekQsTUFBTW9CLGVBQWU7UUFDbkIsSUFBSTtZQUNGLE1BQU1DLE1BQU0sTUFBTUMsTUFBTSxlQUFlO2dCQUNyQ0MsUUFBUTtZQUNWO1lBRUEsSUFBSUYsSUFBSUcsRUFBRSxFQUFFO2dCQUNWVCxjQUFjO2dCQUNkSSxlQUFlLFNBQVMsZ0NBQWdDO1lBQzFELE9BQU87Z0JBQ0xNLFFBQVFDLEtBQUssQ0FBQyxrQkFBa0IsTUFBTUwsSUFBSU0sSUFBSTtZQUNoRDtRQUNGLEVBQUUsT0FBT0QsT0FBTztZQUNkRCxRQUFRQyxLQUFLLENBQUMsb0NBQW9DQTtRQUNwRDtJQUNGO0lBRUEsTUFBTUUscUJBQXFCO1FBQ3pCYixjQUFjO1FBQ2RJLGVBQWUsVUFBVSxnQ0FBZ0M7SUFDM0Q7SUFFQSxNQUFNVSx3QkFBd0I7UUFDNUJWLGVBQWUsVUFBVSxrREFBa0Q7SUFDN0U7SUFFQWxCLGdEQUFTQTswQkFBQztZQUNSLE1BQU02QjtrREFBa0I7b0JBQ3RCLElBQUk7d0JBQ0YsTUFBTVQsTUFBTSxNQUFNQyxNQUFNO3dCQUN4QixJQUFJRCxJQUFJRyxFQUFFLEVBQUU7NEJBQ1ZULGNBQWM7NEJBQ2QsZ0VBQWdFOzRCQUNoRSxJQUFJRyxnQkFBZ0IsUUFBUTtnQ0FDMUJDLGVBQWU7NEJBQ2pCO3dCQUNGLE9BQU87NEJBQ0xKLGNBQWM7d0JBQ2hCO29CQUNGLEVBQUUsT0FBT1csT0FBTzt3QkFDZFgsY0FBYztvQkFDaEIsU0FBVTt3QkFDUkUsZUFBZTtvQkFDakI7Z0JBQ0Y7O1lBRUFhO1lBRUEsbUJBQW1CO1lBQ25CUixNQUFNLG1CQUNIUyxJQUFJO2tDQUFDLENBQUNWLE1BQVFBLElBQUlXLElBQUk7aUNBQ3RCRCxJQUFJO2tDQUFDLENBQUNFO29CQUNMLElBQUlBLEtBQUtDLE9BQU8sRUFBRXZCLGNBQWNzQixLQUFLQSxJQUFJO2dCQUMzQzs7UUFDSjt5QkFBRyxFQUFFO0lBRUwsc0JBQXNCO0lBQ3RCLE1BQU1FLG9CQUFvQjtRQUN4QixPQUFRakI7WUFDTixLQUFLO2dCQUNILHFCQUNFLDhEQUFDZixtRUFBUUE7b0JBQ1BpQyxTQUFTLElBQU1qQixlQUFlO29CQUM5QmtCLFlBQVksSUFBTWxCLGVBQWU7Ozs7OztZQUd2QyxLQUFLO2dCQUNILHFCQUNFLDhEQUFDZixvRUFBU0E7b0JBQ1JNLFlBQVlBO29CQUNaRSxvQkFBb0JBO29CQUNwQkMsdUJBQXVCQTs7Ozs7O1lBRzdCLEtBQUs7Z0JBQ0gscUJBQU8sOERBQUNSLHNFQUFXQTs7Ozs7WUFDckIsS0FBSztnQkFDSCxxQkFDRSw4REFBQ0Msb0VBQVNBO29CQUNSZ0MsV0FBV1Y7b0JBQ1hXLFVBQVUsSUFBTXBCLGVBQWU7Ozs7OztZQUdyQyxLQUFLO2dCQUNILHFCQUNFLDhEQUFDWix1RUFBWUE7b0JBQ1grQixXQUFXVDtvQkFDWFUsVUFBVSxJQUFNcEIsZUFBZTs7Ozs7O1lBR3JDLEtBQUs7Z0JBQ0gscUJBQU8sOERBQUNYLHFFQUFVQTs7Ozs7WUFDcEI7Z0JBQ0UscUJBQ0UsOERBQUNMLG1FQUFRQTtvQkFDUGlDLFNBQVMsSUFBTWpCLGVBQWU7b0JBQzlCa0IsWUFBWSxJQUFNbEIsZUFBZTs7Ozs7O1FBR3pDO0lBQ0Y7SUFFQSxJQUFJLENBQUNILGFBQWE7UUFDaEIscUJBQU8sOERBQUN3QjtzQkFBSTs7Ozs7O0lBQ2Q7SUFFQSxxQkFDRTs7MEJBQ0UsOERBQUN0QywwREFBTUE7Z0JBQ0x1QyxVQUFVckI7Z0JBQ1ZOLFlBQVlBO2dCQUNaSSxhQUFhQTtnQkFDYndCLFlBQVl2Qjs7Ozs7OzBCQUVkLDhEQUFDd0I7Z0JBQUtDLFdBQVU7MEJBQWdCVDs7Ozs7Ozs7QUFHdEM7R0E5SHdCMUI7S0FBQUEiLCJzb3VyY2VzIjpbIi9Vc2Vycy9lbGl6YS5qb2huL0Rvd25sb2Fkcy9zb2NpYWwtbmV0d29yay9OZXh0ICsgUmVhY3QgKyBUeXBlc2NyaXB0L2FwcC9wYWdlLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBhcHAvcGFnZS50c3ggLSBNYWluIHBhZ2Ugd2l0aCBuYXZpZ2F0aW9uXG5cInVzZSBjbGllbnRcIjtcbmltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBIZWFkZXIgZnJvbSBcIi4uL2NvbXBvbmVudHMvSGVhZGVyXCI7XG5pbXBvcnQgSG9tZVBhZ2UgZnJvbSBcIi4uL2NvbXBvbmVudHMvcGFnZXMvSG9tZVBhZ2VcIjtcbmltcG9ydCBQb3N0c1BhZ2UgZnJvbSBcIi4uL2NvbXBvbmVudHMvcGFnZXMvUG9zdHNQYWdlXCI7XG5pbXBvcnQgUHJvZmlsZVBhZ2UgZnJvbSBcIi4uL2NvbXBvbmVudHMvcGFnZXMvUHJvZmlsZVBhZ2VcIjtcbmltcG9ydCBMb2dpblBhZ2UgZnJvbSBcIi4uL2NvbXBvbmVudHMvcGFnZXMvTG9naW5QYWdlXCI7XG5pbXBvcnQgUmVnaXN0ZXJQYWdlIGZyb20gXCIuLi9jb21wb25lbnRzL3BhZ2VzL1JlZ2lzdGVyUGFnZVwiO1xuaW1wb3J0IEdyb3Vwc1BhZ2UgZnJvbSBcIi4uL2NvbXBvbmVudHMvcGFnZXMvR3JvdXBzUGFnZVwiO1xuaW1wb3J0IHR5cGUgeyBDYXRlZ29yeSB9IGZyb20gXCIuLi90eXBlcy90eXBlc1wiO1xuXG50eXBlIFBhZ2VUeXBlID0gXCJob21lXCIgfCBcInBvc3RzXCIgfCBcInByb2ZpbGVcIiB8IFwibG9naW5cIiB8IFwicmVnaXN0ZXJcIiB8IFwiZ3JvdXBzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFBhZ2UoKSB7XG4gIGNvbnN0IFtjYXRlZ29yaWVzLCBzZXRDYXRlZ29yaWVzXSA9IHVzZVN0YXRlPENhdGVnb3J5W10+KFtdKTtcbiAgY29uc3QgW3NlbGVjdGVkQ2F0ZWdvcnlJZCwgc2V0U2VsZWN0ZWRDYXRlZ29yeUlkXSA9IHVzZVN0YXRlPG51bWJlciB8IG51bGw+KFxuICAgIG51bGxcbiAgKTtcbiAgY29uc3QgW2lzTG9nZ2VkSW4sIHNldElzTG9nZ2VkSW5dID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbYXV0aENoZWNrZWQsIHNldEF1dGhDaGVja2VkXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2N1cnJlbnRQYWdlLCBzZXRDdXJyZW50UGFnZV0gPSB1c2VTdGF0ZTxQYWdlVHlwZT4oXCJob21lXCIpO1xuXG4gIGNvbnN0IGhhbmRsZUxvZ291dCA9IGFzeW5jICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goXCIvYXBpL2xvZ291dFwiLCB7XG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICB9KTtcblxuICAgICAgaWYgKHJlcy5vaykge1xuICAgICAgICBzZXRJc0xvZ2dlZEluKGZhbHNlKTtcbiAgICAgICAgc2V0Q3VycmVudFBhZ2UoXCJob21lXCIpOyAvLyBSZWRpcmVjdCB0byBob21lIGFmdGVyIGxvZ291dFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkxvZ291dCBmYWlsZWQ6XCIsIGF3YWl0IHJlcy50ZXh0KCkpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiQW4gZXJyb3Igb2NjdXJyZWQgZHVyaW5nIGxvZ291dDpcIiwgZXJyb3IpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBoYW5kbGVMb2dpblN1Y2Nlc3MgPSAoKSA9PiB7XG4gICAgc2V0SXNMb2dnZWRJbih0cnVlKTtcbiAgICBzZXRDdXJyZW50UGFnZShcInBvc3RzXCIpOyAvLyBSZWRpcmVjdCB0byBwb3N0cyBhZnRlciBsb2dpblxuICB9O1xuXG4gIGNvbnN0IGhhbmRsZVJlZ2lzdGVyU3VjY2VzcyA9ICgpID0+IHtcbiAgICBzZXRDdXJyZW50UGFnZShcImxvZ2luXCIpOyAvLyBSZWRpcmVjdCB0byBsb2dpbiBhZnRlciBzdWNjZXNzZnVsIHJlZ2lzdHJhdGlvblxuICB9O1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgY2hlY2tBdXRoU3RhdHVzID0gYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goXCIvYXBpL21lXCIpO1xuICAgICAgICBpZiAocmVzLm9rKSB7XG4gICAgICAgICAgc2V0SXNMb2dnZWRJbih0cnVlKTtcbiAgICAgICAgICAvLyBJZiB1c2VyIGlzIGFscmVhZHkgbG9nZ2VkIGluLCBzaG93IHBvc3RzIHBhZ2UgaW5zdGVhZCBvZiBob21lXG4gICAgICAgICAgaWYgKGN1cnJlbnRQYWdlID09PSBcImhvbWVcIikge1xuICAgICAgICAgICAgc2V0Q3VycmVudFBhZ2UoXCJwb3N0c1wiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2V0SXNMb2dnZWRJbihmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHNldElzTG9nZ2VkSW4oZmFsc2UpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgc2V0QXV0aENoZWNrZWQodHJ1ZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNoZWNrQXV0aFN0YXR1cygpO1xuXG4gICAgLy8gRmV0Y2ggY2F0ZWdvcmllc1xuICAgIGZldGNoKFwiL2FwaS9jYXRlZ29yaWVzXCIpXG4gICAgICAudGhlbigocmVzKSA9PiByZXMuanNvbigpKVxuICAgICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgaWYgKGRhdGEuc3VjY2Vzcykgc2V0Q2F0ZWdvcmllcyhkYXRhLmRhdGEpO1xuICAgICAgfSk7XG4gIH0sIFtdKTtcblxuICAvLyBSZW5kZXIgY3VycmVudCBwYWdlXG4gIGNvbnN0IHJlbmRlckN1cnJlbnRQYWdlID0gKCkgPT4ge1xuICAgIHN3aXRjaCAoY3VycmVudFBhZ2UpIHtcbiAgICAgIGNhc2UgXCJob21lXCI6XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPEhvbWVQYWdlXG4gICAgICAgICAgICBvbkxvZ2luPXsoKSA9PiBzZXRDdXJyZW50UGFnZShcImxvZ2luXCIpfVxuICAgICAgICAgICAgb25SZWdpc3Rlcj17KCkgPT4gc2V0Q3VycmVudFBhZ2UoXCJyZWdpc3RlclwiKX1cbiAgICAgICAgICAvPlxuICAgICAgICApO1xuICAgICAgY2FzZSBcInBvc3RzXCI6XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPFBvc3RzUGFnZVxuICAgICAgICAgICAgY2F0ZWdvcmllcz17Y2F0ZWdvcmllc31cbiAgICAgICAgICAgIHNlbGVjdGVkQ2F0ZWdvcnlJZD17c2VsZWN0ZWRDYXRlZ29yeUlkfVxuICAgICAgICAgICAgc2V0U2VsZWN0ZWRDYXRlZ29yeUlkPXtzZXRTZWxlY3RlZENhdGVnb3J5SWR9XG4gICAgICAgICAgLz5cbiAgICAgICAgKTtcbiAgICAgIGNhc2UgXCJwcm9maWxlXCI6XG4gICAgICAgIHJldHVybiA8UHJvZmlsZVBhZ2UgLz47XG4gICAgICBjYXNlIFwibG9naW5cIjpcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8TG9naW5QYWdlXG4gICAgICAgICAgICBvblN1Y2Nlc3M9e2hhbmRsZUxvZ2luU3VjY2Vzc31cbiAgICAgICAgICAgIG9uQ2FuY2VsPXsoKSA9PiBzZXRDdXJyZW50UGFnZShcImhvbWVcIil9XG4gICAgICAgICAgLz5cbiAgICAgICAgKTtcbiAgICAgIGNhc2UgXCJyZWdpc3RlclwiOlxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxSZWdpc3RlclBhZ2VcbiAgICAgICAgICAgIG9uU3VjY2Vzcz17aGFuZGxlUmVnaXN0ZXJTdWNjZXNzfVxuICAgICAgICAgICAgb25DYW5jZWw9eygpID0+IHNldEN1cnJlbnRQYWdlKFwiaG9tZVwiKX1cbiAgICAgICAgICAvPlxuICAgICAgICApO1xuICAgICAgY2FzZSBcImdyb3Vwc1wiOlxuICAgICAgICByZXR1cm4gPEdyb3Vwc1BhZ2UgLz47XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxIb21lUGFnZVxuICAgICAgICAgICAgb25Mb2dpbj17KCkgPT4gc2V0Q3VycmVudFBhZ2UoXCJsb2dpblwiKX1cbiAgICAgICAgICAgIG9uUmVnaXN0ZXI9eygpID0+IHNldEN1cnJlbnRQYWdlKFwicmVnaXN0ZXJcIil9XG4gICAgICAgICAgLz5cbiAgICAgICAgKTtcbiAgICB9XG4gIH07XG5cbiAgaWYgKCFhdXRoQ2hlY2tlZCkge1xuICAgIHJldHVybiA8ZGl2PkxvYWRpbmcuLi48L2Rpdj47XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8SGVhZGVyXG4gICAgICAgIG9uTG9nb3V0PXtoYW5kbGVMb2dvdXR9XG4gICAgICAgIGlzTG9nZ2VkSW49e2lzTG9nZ2VkSW59XG4gICAgICAgIGN1cnJlbnRQYWdlPXtjdXJyZW50UGFnZX1cbiAgICAgICAgb25OYXZpZ2F0ZT17c2V0Q3VycmVudFBhZ2V9XG4gICAgICAvPlxuICAgICAgPG1haW4gY2xhc3NOYW1lPVwibWFpbi1jb250ZW50XCI+e3JlbmRlckN1cnJlbnRQYWdlKCl9PC9tYWluPlxuICAgIDwvPlxuICApO1xufVxuIl0sIm5hbWVzIjpbInVzZVN0YXRlIiwidXNlRWZmZWN0IiwiSGVhZGVyIiwiSG9tZVBhZ2UiLCJQb3N0c1BhZ2UiLCJQcm9maWxlUGFnZSIsIkxvZ2luUGFnZSIsIlJlZ2lzdGVyUGFnZSIsIkdyb3Vwc1BhZ2UiLCJQYWdlIiwiY2F0ZWdvcmllcyIsInNldENhdGVnb3JpZXMiLCJzZWxlY3RlZENhdGVnb3J5SWQiLCJzZXRTZWxlY3RlZENhdGVnb3J5SWQiLCJpc0xvZ2dlZEluIiwic2V0SXNMb2dnZWRJbiIsImF1dGhDaGVja2VkIiwic2V0QXV0aENoZWNrZWQiLCJjdXJyZW50UGFnZSIsInNldEN1cnJlbnRQYWdlIiwiaGFuZGxlTG9nb3V0IiwicmVzIiwiZmV0Y2giLCJtZXRob2QiLCJvayIsImNvbnNvbGUiLCJlcnJvciIsInRleHQiLCJoYW5kbGVMb2dpblN1Y2Nlc3MiLCJoYW5kbGVSZWdpc3RlclN1Y2Nlc3MiLCJjaGVja0F1dGhTdGF0dXMiLCJ0aGVuIiwianNvbiIsImRhdGEiLCJzdWNjZXNzIiwicmVuZGVyQ3VycmVudFBhZ2UiLCJvbkxvZ2luIiwib25SZWdpc3RlciIsIm9uU3VjY2VzcyIsIm9uQ2FuY2VsIiwiZGl2Iiwib25Mb2dvdXQiLCJvbk5hdmlnYXRlIiwibWFpbiIsImNsYXNzTmFtZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(app-pages-browser)/./app/page.tsx\n"));

/***/ }),

/***/ "(app-pages-browser)/./components/Header.tsx":
/*!*******************************!*\
  !*** ./components/Header.tsx ***!
  \*******************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n\nconst Header = (param)=>{\n    let { onLogout, isLoggedIn, onLogin, onRegister, onProfile, onCreateGroup } = param;\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"header\", {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"header-left\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h1\", {\n                    children: \"Gritlab Gossiper\"\n                }, void 0, false, {\n                    fileName: \"/Users/eliza.john/Downloads/social-network/Next + React + Typescript/components/Header.tsx\",\n                    lineNumber: 20,\n                    columnNumber: 7\n                }, undefined)\n            }, void 0, false, {\n                fileName: \"/Users/eliza.john/Downloads/social-network/Next + React + Typescript/components/Header.tsx\",\n                lineNumber: 19,\n                columnNumber: 5\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"header-right\",\n                children: !isLoggedIn ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                            onClick: onLogin,\n                            children: \"Login\"\n                        }, void 0, false, {\n                            fileName: \"/Users/eliza.john/Downloads/social-network/Next + React + Typescript/components/Header.tsx\",\n                            lineNumber: 25,\n                            columnNumber: 11\n                        }, undefined),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                            onClick: onRegister,\n                            children: \"Register\"\n                        }, void 0, false, {\n                            fileName: \"/Users/eliza.john/Downloads/social-network/Next + React + Typescript/components/Header.tsx\",\n                            lineNumber: 26,\n                            columnNumber: 11\n                        }, undefined)\n                    ]\n                }, void 0, true) : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                            onClick: onCreateGroup,\n                            children: \"Create Group\"\n                        }, void 0, false, {\n                            fileName: \"/Users/eliza.john/Downloads/social-network/Next + React + Typescript/components/Header.tsx\",\n                            lineNumber: 30,\n                            columnNumber: 11\n                        }, undefined),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                            onClick: onProfile,\n                            children: \"Profile\"\n                        }, void 0, false, {\n                            fileName: \"/Users/eliza.john/Downloads/social-network/Next + React + Typescript/components/Header.tsx\",\n                            lineNumber: 31,\n                            columnNumber: 11\n                        }, undefined),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                            onClick: onLogout,\n                            children: \"Logout\"\n                        }, void 0, false, {\n                            fileName: \"/Users/eliza.john/Downloads/social-network/Next + React + Typescript/components/Header.tsx\",\n                            lineNumber: 32,\n                            columnNumber: 11\n                        }, undefined)\n                    ]\n                }, void 0, true)\n            }, void 0, false, {\n                fileName: \"/Users/eliza.john/Downloads/social-network/Next + React + Typescript/components/Header.tsx\",\n                lineNumber: 22,\n                columnNumber: 5\n            }, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/eliza.john/Downloads/social-network/Next + React + Typescript/components/Header.tsx\",\n        lineNumber: 18,\n        columnNumber: 3\n    }, undefined);\n};\n_c = Header;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Header);\nvar _c;\n$RefreshReg$(_c, \"Header\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2NvbXBvbmVudHMvSGVhZGVyLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFTQSxNQUFNQSxTQUFTO1FBQUMsRUFDZEMsUUFBUSxFQUNSQyxVQUFVLEVBQ1ZDLE9BQU8sRUFDUEMsVUFBVSxFQUNWQyxTQUFTLEVBQ1RDLGFBQWEsRUFDUDt5QkFDTiw4REFBQ0M7OzBCQUNDLDhEQUFDQztnQkFBSUMsV0FBVTswQkFDYiw0RUFBQ0M7OEJBQUc7Ozs7Ozs7Ozs7OzBCQUVOLDhEQUFDRjtnQkFBSUMsV0FBVTswQkFDWixDQUFDUCwyQkFDQTs7c0NBQ0UsOERBQUNTOzRCQUFPQyxTQUFTVDtzQ0FBUzs7Ozs7O3NDQUMxQiw4REFBQ1E7NEJBQU9DLFNBQVNSO3NDQUFZOzs7Ozs7O2lEQUcvQjs7c0NBQ0UsOERBQUNPOzRCQUFPQyxTQUFTTjtzQ0FBZTs7Ozs7O3NDQUNoQyw4REFBQ0s7NEJBQU9DLFNBQVNQO3NDQUFXOzs7Ozs7c0NBQzVCLDhEQUFDTTs0QkFBT0MsU0FBU1g7c0NBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBdEIvQkQ7QUE2Qk4saUVBQWVBLE1BQU1BLEVBQUMiLCJzb3VyY2VzIjpbIi9Vc2Vycy9lbGl6YS5qb2huL0Rvd25sb2Fkcy9zb2NpYWwtbmV0d29yay9OZXh0ICsgUmVhY3QgKyBUeXBlc2NyaXB0L2NvbXBvbmVudHMvSGVhZGVyLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJ0eXBlIFByb3BzID0ge1xuICBvbkxvZ291dDogKCkgPT4gdm9pZDtcbiAgaXNMb2dnZWRJbjogYm9vbGVhbjtcbiAgb25Mb2dpbjogKCkgPT4gdm9pZDtcbiAgb25SZWdpc3RlcjogKCkgPT4gdm9pZDtcbiAgb25Qcm9maWxlOiAoKSA9PiB2b2lkO1xuICBvbkNyZWF0ZUdyb3VwPzogKCkgPT4gdm9pZDtcbn07XG5cbmNvbnN0IEhlYWRlciA9ICh7XG4gIG9uTG9nb3V0LFxuICBpc0xvZ2dlZEluLFxuICBvbkxvZ2luLFxuICBvblJlZ2lzdGVyLFxuICBvblByb2ZpbGUsXG4gIG9uQ3JlYXRlR3JvdXAsXG59OiBQcm9wcykgPT4gKFxuICA8aGVhZGVyPlxuICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyLWxlZnRcIj5cbiAgICAgIDxoMT5Hcml0bGFiIEdvc3NpcGVyPC9oMT5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImhlYWRlci1yaWdodFwiPlxuICAgICAgeyFpc0xvZ2dlZEluID8gKFxuICAgICAgICA8PlxuICAgICAgICAgIDxidXR0b24gb25DbGljaz17b25Mb2dpbn0+TG9naW48L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e29uUmVnaXN0ZXJ9PlJlZ2lzdGVyPC9idXR0b24+XG4gICAgICAgIDwvPlxuICAgICAgKSA6IChcbiAgICAgICAgPD5cbiAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e29uQ3JlYXRlR3JvdXB9PkNyZWF0ZSBHcm91cDwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b24gb25DbGljaz17b25Qcm9maWxlfT5Qcm9maWxlPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkxvZ291dH0+TG9nb3V0PC9idXR0b24+XG4gICAgICAgIDwvPlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgPC9oZWFkZXI+XG4pO1xuXG5leHBvcnQgZGVmYXVsdCBIZWFkZXI7XG4iXSwibmFtZXMiOlsiSGVhZGVyIiwib25Mb2dvdXQiLCJpc0xvZ2dlZEluIiwib25Mb2dpbiIsIm9uUmVnaXN0ZXIiLCJvblByb2ZpbGUiLCJvbkNyZWF0ZUdyb3VwIiwiaGVhZGVyIiwiZGl2IiwiY2xhc3NOYW1lIiwiaDEiLCJidXR0b24iLCJvbkNsaWNrIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./components/Header.tsx\n"));

/***/ }),

/***/ "(app-pages-browser)/./components/pages/GroupsPage.tsx":
/*!*****************************************!*\
  !*** ./components/pages/GroupsPage.tsx ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



;
    // Wrapped in an IIFE to avoid polluting the global scope
    ;
    (function () {
        var _a, _b;
        // Legacy CSS implementations will `eval` browser code in a Node.js context
        // to extract CSS. For backwards compatibility, we need to check we're in a
        // browser context before continuing.
        if (typeof self !== 'undefined' &&
            // AMP / No-JS mode does not inject these helpers:
            '$RefreshHelpers$' in self) {
            // @ts-ignore __webpack_module__ is global
            var currentExports = module.exports;
            // @ts-ignore __webpack_module__ is global
            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;
            // This cannot happen in MainTemplate because the exports mismatch between
            // templating and execution.
            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);
            // A module can be accepted automatically based on its exports, e.g. when
            // it is a Refresh Boundary.
            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {
                // Save the previous exports signature on update so we can compare the boundary
                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)
                module.hot.dispose(function (data) {
                    data.prevSignature =
                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);
                });
                // Unconditionally accept an update to this module, we'll check if it's
                // still a Refresh Boundary later.
                // @ts-ignore importMeta is replaced in the loader
                module.hot.accept();
                // This field is set when the previous version of this module was a
                // Refresh Boundary, letting us know we need to check for invalidation or
                // enqueue an update.
                if (prevSignature !== null) {
                    // A boundary can become ineligible if its exports are incompatible
                    // with the previous exports.
                    //
                    // For example, if you add/remove/change exports, we'll want to
                    // re-execute the importing modules, and force those components to
                    // re-render. Similarly, if you convert a class component to a
                    // function, we want to invalidate the boundary.
                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {
                        module.hot.invalidate();
                    }
                    else {
                        self.$RefreshHelpers$.scheduleUpdate();
                    }
                }
            }
            else {
                // Since we just executed the code for the module, it's possible that the
                // new exports made it ineligible for being a boundary.
                // We only care about the case when we were _previously_ a boundary,
                // because we already accepted this update (accidental side effect).
                var isNoLongerABoundary = prevSignature !== null;
                if (isNoLongerABoundary) {
                    module.hot.invalidate();
                }
            }
        }
    })();


/***/ }),

/***/ "(app-pages-browser)/./components/pages/HomePage.tsx":
/*!***************************************!*\
  !*** ./components/pages/HomePage.tsx ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



;
    // Wrapped in an IIFE to avoid polluting the global scope
    ;
    (function () {
        var _a, _b;
        // Legacy CSS implementations will `eval` browser code in a Node.js context
        // to extract CSS. For backwards compatibility, we need to check we're in a
        // browser context before continuing.
        if (typeof self !== 'undefined' &&
            // AMP / No-JS mode does not inject these helpers:
            '$RefreshHelpers$' in self) {
            // @ts-ignore __webpack_module__ is global
            var currentExports = module.exports;
            // @ts-ignore __webpack_module__ is global
            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;
            // This cannot happen in MainTemplate because the exports mismatch between
            // templating and execution.
            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);
            // A module can be accepted automatically based on its exports, e.g. when
            // it is a Refresh Boundary.
            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {
                // Save the previous exports signature on update so we can compare the boundary
                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)
                module.hot.dispose(function (data) {
                    data.prevSignature =
                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);
                });
                // Unconditionally accept an update to this module, we'll check if it's
                // still a Refresh Boundary later.
                // @ts-ignore importMeta is replaced in the loader
                module.hot.accept();
                // This field is set when the previous version of this module was a
                // Refresh Boundary, letting us know we need to check for invalidation or
                // enqueue an update.
                if (prevSignature !== null) {
                    // A boundary can become ineligible if its exports are incompatible
                    // with the previous exports.
                    //
                    // For example, if you add/remove/change exports, we'll want to
                    // re-execute the importing modules, and force those components to
                    // re-render. Similarly, if you convert a class component to a
                    // function, we want to invalidate the boundary.
                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {
                        module.hot.invalidate();
                    }
                    else {
                        self.$RefreshHelpers$.scheduleUpdate();
                    }
                }
            }
            else {
                // Since we just executed the code for the module, it's possible that the
                // new exports made it ineligible for being a boundary.
                // We only care about the case when we were _previously_ a boundary,
                // because we already accepted this update (accidental side effect).
                var isNoLongerABoundary = prevSignature !== null;
                if (isNoLongerABoundary) {
                    module.hot.invalidate();
                }
            }
        }
    })();


/***/ }),

/***/ "(app-pages-browser)/./components/pages/LoginPage.tsx":
/*!****************************************!*\
  !*** ./components/pages/LoginPage.tsx ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



;
    // Wrapped in an IIFE to avoid polluting the global scope
    ;
    (function () {
        var _a, _b;
        // Legacy CSS implementations will `eval` browser code in a Node.js context
        // to extract CSS. For backwards compatibility, we need to check we're in a
        // browser context before continuing.
        if (typeof self !== 'undefined' &&
            // AMP / No-JS mode does not inject these helpers:
            '$RefreshHelpers$' in self) {
            // @ts-ignore __webpack_module__ is global
            var currentExports = module.exports;
            // @ts-ignore __webpack_module__ is global
            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;
            // This cannot happen in MainTemplate because the exports mismatch between
            // templating and execution.
            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);
            // A module can be accepted automatically based on its exports, e.g. when
            // it is a Refresh Boundary.
            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {
                // Save the previous exports signature on update so we can compare the boundary
                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)
                module.hot.dispose(function (data) {
                    data.prevSignature =
                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);
                });
                // Unconditionally accept an update to this module, we'll check if it's
                // still a Refresh Boundary later.
                // @ts-ignore importMeta is replaced in the loader
                module.hot.accept();
                // This field is set when the previous version of this module was a
                // Refresh Boundary, letting us know we need to check for invalidation or
                // enqueue an update.
                if (prevSignature !== null) {
                    // A boundary can become ineligible if its exports are incompatible
                    // with the previous exports.
                    //
                    // For example, if you add/remove/change exports, we'll want to
                    // re-execute the importing modules, and force those components to
                    // re-render. Similarly, if you convert a class component to a
                    // function, we want to invalidate the boundary.
                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {
                        module.hot.invalidate();
                    }
                    else {
                        self.$RefreshHelpers$.scheduleUpdate();
                    }
                }
            }
            else {
                // Since we just executed the code for the module, it's possible that the
                // new exports made it ineligible for being a boundary.
                // We only care about the case when we were _previously_ a boundary,
                // because we already accepted this update (accidental side effect).
                var isNoLongerABoundary = prevSignature !== null;
                if (isNoLongerABoundary) {
                    module.hot.invalidate();
                }
            }
        }
    })();


/***/ }),

/***/ "(app-pages-browser)/./components/pages/PostsPage.tsx":
/*!****************************************!*\
  !*** ./components/pages/PostsPage.tsx ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



;
    // Wrapped in an IIFE to avoid polluting the global scope
    ;
    (function () {
        var _a, _b;
        // Legacy CSS implementations will `eval` browser code in a Node.js context
        // to extract CSS. For backwards compatibility, we need to check we're in a
        // browser context before continuing.
        if (typeof self !== 'undefined' &&
            // AMP / No-JS mode does not inject these helpers:
            '$RefreshHelpers$' in self) {
            // @ts-ignore __webpack_module__ is global
            var currentExports = module.exports;
            // @ts-ignore __webpack_module__ is global
            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;
            // This cannot happen in MainTemplate because the exports mismatch between
            // templating and execution.
            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);
            // A module can be accepted automatically based on its exports, e.g. when
            // it is a Refresh Boundary.
            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {
                // Save the previous exports signature on update so we can compare the boundary
                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)
                module.hot.dispose(function (data) {
                    data.prevSignature =
                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);
                });
                // Unconditionally accept an update to this module, we'll check if it's
                // still a Refresh Boundary later.
                // @ts-ignore importMeta is replaced in the loader
                module.hot.accept();
                // This field is set when the previous version of this module was a
                // Refresh Boundary, letting us know we need to check for invalidation or
                // enqueue an update.
                if (prevSignature !== null) {
                    // A boundary can become ineligible if its exports are incompatible
                    // with the previous exports.
                    //
                    // For example, if you add/remove/change exports, we'll want to
                    // re-execute the importing modules, and force those components to
                    // re-render. Similarly, if you convert a class component to a
                    // function, we want to invalidate the boundary.
                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {
                        module.hot.invalidate();
                    }
                    else {
                        self.$RefreshHelpers$.scheduleUpdate();
                    }
                }
            }
            else {
                // Since we just executed the code for the module, it's possible that the
                // new exports made it ineligible for being a boundary.
                // We only care about the case when we were _previously_ a boundary,
                // because we already accepted this update (accidental side effect).
                var isNoLongerABoundary = prevSignature !== null;
                if (isNoLongerABoundary) {
                    module.hot.invalidate();
                }
            }
        }
    })();


/***/ }),

/***/ "(app-pages-browser)/./components/pages/ProfilePage.tsx":
/*!******************************************!*\
  !*** ./components/pages/ProfilePage.tsx ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



;
    // Wrapped in an IIFE to avoid polluting the global scope
    ;
    (function () {
        var _a, _b;
        // Legacy CSS implementations will `eval` browser code in a Node.js context
        // to extract CSS. For backwards compatibility, we need to check we're in a
        // browser context before continuing.
        if (typeof self !== 'undefined' &&
            // AMP / No-JS mode does not inject these helpers:
            '$RefreshHelpers$' in self) {
            // @ts-ignore __webpack_module__ is global
            var currentExports = module.exports;
            // @ts-ignore __webpack_module__ is global
            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;
            // This cannot happen in MainTemplate because the exports mismatch between
            // templating and execution.
            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);
            // A module can be accepted automatically based on its exports, e.g. when
            // it is a Refresh Boundary.
            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {
                // Save the previous exports signature on update so we can compare the boundary
                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)
                module.hot.dispose(function (data) {
                    data.prevSignature =
                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);
                });
                // Unconditionally accept an update to this module, we'll check if it's
                // still a Refresh Boundary later.
                // @ts-ignore importMeta is replaced in the loader
                module.hot.accept();
                // This field is set when the previous version of this module was a
                // Refresh Boundary, letting us know we need to check for invalidation or
                // enqueue an update.
                if (prevSignature !== null) {
                    // A boundary can become ineligible if its exports are incompatible
                    // with the previous exports.
                    //
                    // For example, if you add/remove/change exports, we'll want to
                    // re-execute the importing modules, and force those components to
                    // re-render. Similarly, if you convert a class component to a
                    // function, we want to invalidate the boundary.
                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {
                        module.hot.invalidate();
                    }
                    else {
                        self.$RefreshHelpers$.scheduleUpdate();
                    }
                }
            }
            else {
                // Since we just executed the code for the module, it's possible that the
                // new exports made it ineligible for being a boundary.
                // We only care about the case when we were _previously_ a boundary,
                // because we already accepted this update (accidental side effect).
                var isNoLongerABoundary = prevSignature !== null;
                if (isNoLongerABoundary) {
                    module.hot.invalidate();
                }
            }
        }
    })();


/***/ }),

/***/ "(app-pages-browser)/./components/pages/RegisterPage.tsx":
/*!*******************************************!*\
  !*** ./components/pages/RegisterPage.tsx ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



;
    // Wrapped in an IIFE to avoid polluting the global scope
    ;
    (function () {
        var _a, _b;
        // Legacy CSS implementations will `eval` browser code in a Node.js context
        // to extract CSS. For backwards compatibility, we need to check we're in a
        // browser context before continuing.
        if (typeof self !== 'undefined' &&
            // AMP / No-JS mode does not inject these helpers:
            '$RefreshHelpers$' in self) {
            // @ts-ignore __webpack_module__ is global
            var currentExports = module.exports;
            // @ts-ignore __webpack_module__ is global
            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;
            // This cannot happen in MainTemplate because the exports mismatch between
            // templating and execution.
            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);
            // A module can be accepted automatically based on its exports, e.g. when
            // it is a Refresh Boundary.
            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {
                // Save the previous exports signature on update so we can compare the boundary
                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)
                module.hot.dispose(function (data) {
                    data.prevSignature =
                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);
                });
                // Unconditionally accept an update to this module, we'll check if it's
                // still a Refresh Boundary later.
                // @ts-ignore importMeta is replaced in the loader
                module.hot.accept();
                // This field is set when the previous version of this module was a
                // Refresh Boundary, letting us know we need to check for invalidation or
                // enqueue an update.
                if (prevSignature !== null) {
                    // A boundary can become ineligible if its exports are incompatible
                    // with the previous exports.
                    //
                    // For example, if you add/remove/change exports, we'll want to
                    // re-execute the importing modules, and force those components to
                    // re-render. Similarly, if you convert a class component to a
                    // function, we want to invalidate the boundary.
                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {
                        module.hot.invalidate();
                    }
                    else {
                        self.$RefreshHelpers$.scheduleUpdate();
                    }
                }
            }
            else {
                // Since we just executed the code for the module, it's possible that the
                // new exports made it ineligible for being a boundary.
                // We only care about the case when we were _previously_ a boundary,
                // because we already accepted this update (accidental side effect).
                var isNoLongerABoundary = prevSignature !== null;
                if (isNoLongerABoundary) {
                    module.hot.invalidate();
                }
            }
        }
    })();


/***/ }),

/***/ "(app-pages-browser)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?modules=%7B%22request%22%3A%22%2FUsers%2Feliza.john%2FDownloads%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript%2Fapp%2Fpage.tsx%22%2C%22ids%22%3A%5B%5D%7D&server=false!":
/*!****************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?modules=%7B%22request%22%3A%22%2FUsers%2Feliza.john%2FDownloads%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript%2Fapp%2Fpage.tsx%22%2C%22ids%22%3A%5B%5D%7D&server=false! ***!
  \****************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval(__webpack_require__.ts("Promise.resolve(/*! import() eager */).then(__webpack_require__.bind(__webpack_require__, /*! ./app/page.tsx */ \"(app-pages-browser)/./app/page.tsx\"));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvYnVpbGQvd2VicGFjay9sb2FkZXJzL25leHQtZmxpZ2h0LWNsaWVudC1lbnRyeS1sb2FkZXIuanM/bW9kdWxlcz0lN0IlMjJyZXF1ZXN0JTIyJTNBJTIyJTJGVXNlcnMlMkZlbGl6YS5qb2huJTJGRG93bmxvYWRzJTJGc29jaWFsLW5ldHdvcmslMkZOZXh0JTIwJTJCJTIwUmVhY3QlMjAlMkIlMjBUeXBlc2NyaXB0JTJGYXBwJTJGcGFnZS50c3glMjIlMkMlMjJpZHMlMjIlM0ElNUIlNUQlN0Qmc2VydmVyPWZhbHNlISIsIm1hcHBpbmdzIjoiQUFBQSxzSkFBc0giLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQoLyogd2VicGFja01vZGU6IFwiZWFnZXJcIiAqLyBcIi9Vc2Vycy9lbGl6YS5qb2huL0Rvd25sb2Fkcy9zb2NpYWwtbmV0d29yay9OZXh0ICsgUmVhY3QgKyBUeXBlc2NyaXB0L2FwcC9wYWdlLnRzeFwiKTtcbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?modules=%7B%22request%22%3A%22%2FUsers%2Feliza.john%2FDownloads%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript%2Fapp%2Fpage.tsx%22%2C%22ids%22%3A%5B%5D%7D&server=false!\n"));

/***/ }),

/***/ "(app-pages-browser)/./node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval(__webpack_require__.ts("/**\n * @license React\n * react-jsx-dev-runtime.development.js\n *\n * Copyright (c) Meta Platforms, Inc. and affiliates.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE file in the root directory of this source tree.\n */\n\n\n true &&\n  (function () {\n    function getComponentNameFromType(type) {\n      if (null == type) return null;\n      if (\"function\" === typeof type)\n        return type.$$typeof === REACT_CLIENT_REFERENCE\n          ? null\n          : type.displayName || type.name || null;\n      if (\"string\" === typeof type) return type;\n      switch (type) {\n        case REACT_FRAGMENT_TYPE:\n          return \"Fragment\";\n        case REACT_PROFILER_TYPE:\n          return \"Profiler\";\n        case REACT_STRICT_MODE_TYPE:\n          return \"StrictMode\";\n        case REACT_SUSPENSE_TYPE:\n          return \"Suspense\";\n        case REACT_SUSPENSE_LIST_TYPE:\n          return \"SuspenseList\";\n        case REACT_ACTIVITY_TYPE:\n          return \"Activity\";\n      }\n      if (\"object\" === typeof type)\n        switch (\n          (\"number\" === typeof type.tag &&\n            console.error(\n              \"Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue.\"\n            ),\n          type.$$typeof)\n        ) {\n          case REACT_PORTAL_TYPE:\n            return \"Portal\";\n          case REACT_CONTEXT_TYPE:\n            return (type.displayName || \"Context\") + \".Provider\";\n          case REACT_CONSUMER_TYPE:\n            return (type._context.displayName || \"Context\") + \".Consumer\";\n          case REACT_FORWARD_REF_TYPE:\n            var innerType = type.render;\n            type = type.displayName;\n            type ||\n              ((type = innerType.displayName || innerType.name || \"\"),\n              (type = \"\" !== type ? \"ForwardRef(\" + type + \")\" : \"ForwardRef\"));\n            return type;\n          case REACT_MEMO_TYPE:\n            return (\n              (innerType = type.displayName || null),\n              null !== innerType\n                ? innerType\n                : getComponentNameFromType(type.type) || \"Memo\"\n            );\n          case REACT_LAZY_TYPE:\n            innerType = type._payload;\n            type = type._init;\n            try {\n              return getComponentNameFromType(type(innerType));\n            } catch (x) {}\n        }\n      return null;\n    }\n    function testStringCoercion(value) {\n      return \"\" + value;\n    }\n    function checkKeyStringCoercion(value) {\n      try {\n        testStringCoercion(value);\n        var JSCompiler_inline_result = !1;\n      } catch (e) {\n        JSCompiler_inline_result = !0;\n      }\n      if (JSCompiler_inline_result) {\n        JSCompiler_inline_result = console;\n        var JSCompiler_temp_const = JSCompiler_inline_result.error;\n        var JSCompiler_inline_result$jscomp$0 =\n          (\"function\" === typeof Symbol &&\n            Symbol.toStringTag &&\n            value[Symbol.toStringTag]) ||\n          value.constructor.name ||\n          \"Object\";\n        JSCompiler_temp_const.call(\n          JSCompiler_inline_result,\n          \"The provided key is an unsupported type %s. This value must be coerced to a string before using it here.\",\n          JSCompiler_inline_result$jscomp$0\n        );\n        return testStringCoercion(value);\n      }\n    }\n    function getTaskName(type) {\n      if (type === REACT_FRAGMENT_TYPE) return \"<>\";\n      if (\n        \"object\" === typeof type &&\n        null !== type &&\n        type.$$typeof === REACT_LAZY_TYPE\n      )\n        return \"<...>\";\n      try {\n        var name = getComponentNameFromType(type);\n        return name ? \"<\" + name + \">\" : \"<...>\";\n      } catch (x) {\n        return \"<...>\";\n      }\n    }\n    function getOwner() {\n      var dispatcher = ReactSharedInternals.A;\n      return null === dispatcher ? null : dispatcher.getOwner();\n    }\n    function UnknownOwner() {\n      return Error(\"react-stack-top-frame\");\n    }\n    function hasValidKey(config) {\n      if (hasOwnProperty.call(config, \"key\")) {\n        var getter = Object.getOwnPropertyDescriptor(config, \"key\").get;\n        if (getter && getter.isReactWarning) return !1;\n      }\n      return void 0 !== config.key;\n    }\n    function defineKeyPropWarningGetter(props, displayName) {\n      function warnAboutAccessingKey() {\n        specialPropKeyWarningShown ||\n          ((specialPropKeyWarningShown = !0),\n          console.error(\n            \"%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)\",\n            displayName\n          ));\n      }\n      warnAboutAccessingKey.isReactWarning = !0;\n      Object.defineProperty(props, \"key\", {\n        get: warnAboutAccessingKey,\n        configurable: !0\n      });\n    }\n    function elementRefGetterWithDeprecationWarning() {\n      var componentName = getComponentNameFromType(this.type);\n      didWarnAboutElementRef[componentName] ||\n        ((didWarnAboutElementRef[componentName] = !0),\n        console.error(\n          \"Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release.\"\n        ));\n      componentName = this.props.ref;\n      return void 0 !== componentName ? componentName : null;\n    }\n    function ReactElement(\n      type,\n      key,\n      self,\n      source,\n      owner,\n      props,\n      debugStack,\n      debugTask\n    ) {\n      self = props.ref;\n      type = {\n        $$typeof: REACT_ELEMENT_TYPE,\n        type: type,\n        key: key,\n        props: props,\n        _owner: owner\n      };\n      null !== (void 0 !== self ? self : null)\n        ? Object.defineProperty(type, \"ref\", {\n            enumerable: !1,\n            get: elementRefGetterWithDeprecationWarning\n          })\n        : Object.defineProperty(type, \"ref\", { enumerable: !1, value: null });\n      type._store = {};\n      Object.defineProperty(type._store, \"validated\", {\n        configurable: !1,\n        enumerable: !1,\n        writable: !0,\n        value: 0\n      });\n      Object.defineProperty(type, \"_debugInfo\", {\n        configurable: !1,\n        enumerable: !1,\n        writable: !0,\n        value: null\n      });\n      Object.defineProperty(type, \"_debugStack\", {\n        configurable: !1,\n        enumerable: !1,\n        writable: !0,\n        value: debugStack\n      });\n      Object.defineProperty(type, \"_debugTask\", {\n        configurable: !1,\n        enumerable: !1,\n        writable: !0,\n        value: debugTask\n      });\n      Object.freeze && (Object.freeze(type.props), Object.freeze(type));\n      return type;\n    }\n    function jsxDEVImpl(\n      type,\n      config,\n      maybeKey,\n      isStaticChildren,\n      source,\n      self,\n      debugStack,\n      debugTask\n    ) {\n      var children = config.children;\n      if (void 0 !== children)\n        if (isStaticChildren)\n          if (isArrayImpl(children)) {\n            for (\n              isStaticChildren = 0;\n              isStaticChildren < children.length;\n              isStaticChildren++\n            )\n              validateChildKeys(children[isStaticChildren]);\n            Object.freeze && Object.freeze(children);\n          } else\n            console.error(\n              \"React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.\"\n            );\n        else validateChildKeys(children);\n      if (hasOwnProperty.call(config, \"key\")) {\n        children = getComponentNameFromType(type);\n        var keys = Object.keys(config).filter(function (k) {\n          return \"key\" !== k;\n        });\n        isStaticChildren =\n          0 < keys.length\n            ? \"{key: someKey, \" + keys.join(\": ..., \") + \": ...}\"\n            : \"{key: someKey}\";\n        didWarnAboutKeySpread[children + isStaticChildren] ||\n          ((keys =\n            0 < keys.length ? \"{\" + keys.join(\": ..., \") + \": ...}\" : \"{}\"),\n          console.error(\n            'A props object containing a \"key\" prop is being spread into JSX:\\n  let props = %s;\\n  <%s {...props} />\\nReact keys must be passed directly to JSX without using spread:\\n  let props = %s;\\n  <%s key={someKey} {...props} />',\n            isStaticChildren,\n            children,\n            keys,\n            children\n          ),\n          (didWarnAboutKeySpread[children + isStaticChildren] = !0));\n      }\n      children = null;\n      void 0 !== maybeKey &&\n        (checkKeyStringCoercion(maybeKey), (children = \"\" + maybeKey));\n      hasValidKey(config) &&\n        (checkKeyStringCoercion(config.key), (children = \"\" + config.key));\n      if (\"key\" in config) {\n        maybeKey = {};\n        for (var propName in config)\n          \"key\" !== propName && (maybeKey[propName] = config[propName]);\n      } else maybeKey = config;\n      children &&\n        defineKeyPropWarningGetter(\n          maybeKey,\n          \"function\" === typeof type\n            ? type.displayName || type.name || \"Unknown\"\n            : type\n        );\n      return ReactElement(\n        type,\n        children,\n        self,\n        source,\n        getOwner(),\n        maybeKey,\n        debugStack,\n        debugTask\n      );\n    }\n    function validateChildKeys(node) {\n      \"object\" === typeof node &&\n        null !== node &&\n        node.$$typeof === REACT_ELEMENT_TYPE &&\n        node._store &&\n        (node._store.validated = 1);\n    }\n    var React = __webpack_require__(/*! next/dist/compiled/react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\"),\n      REACT_ELEMENT_TYPE = Symbol.for(\"react.transitional.element\"),\n      REACT_PORTAL_TYPE = Symbol.for(\"react.portal\"),\n      REACT_FRAGMENT_TYPE = Symbol.for(\"react.fragment\"),\n      REACT_STRICT_MODE_TYPE = Symbol.for(\"react.strict_mode\"),\n      REACT_PROFILER_TYPE = Symbol.for(\"react.profiler\");\n    Symbol.for(\"react.provider\");\n    var REACT_CONSUMER_TYPE = Symbol.for(\"react.consumer\"),\n      REACT_CONTEXT_TYPE = Symbol.for(\"react.context\"),\n      REACT_FORWARD_REF_TYPE = Symbol.for(\"react.forward_ref\"),\n      REACT_SUSPENSE_TYPE = Symbol.for(\"react.suspense\"),\n      REACT_SUSPENSE_LIST_TYPE = Symbol.for(\"react.suspense_list\"),\n      REACT_MEMO_TYPE = Symbol.for(\"react.memo\"),\n      REACT_LAZY_TYPE = Symbol.for(\"react.lazy\"),\n      REACT_ACTIVITY_TYPE = Symbol.for(\"react.activity\"),\n      REACT_CLIENT_REFERENCE = Symbol.for(\"react.client.reference\"),\n      ReactSharedInternals =\n        React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,\n      hasOwnProperty = Object.prototype.hasOwnProperty,\n      isArrayImpl = Array.isArray,\n      createTask = console.createTask\n        ? console.createTask\n        : function () {\n            return null;\n          };\n    React = {\n      \"react-stack-bottom-frame\": function (callStackForError) {\n        return callStackForError();\n      }\n    };\n    var specialPropKeyWarningShown;\n    var didWarnAboutElementRef = {};\n    var unknownOwnerDebugStack = React[\"react-stack-bottom-frame\"].bind(\n      React,\n      UnknownOwner\n    )();\n    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));\n    var didWarnAboutKeySpread = {};\n    exports.Fragment = REACT_FRAGMENT_TYPE;\n    exports.jsxDEV = function (\n      type,\n      config,\n      maybeKey,\n      isStaticChildren,\n      source,\n      self\n    ) {\n      var trackActualOwner =\n        1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;\n      return jsxDEVImpl(\n        type,\n        config,\n        maybeKey,\n        isStaticChildren,\n        source,\n        self,\n        trackActualOwner\n          ? Error(\"react-stack-top-frame\")\n          : unknownOwnerDebugStack,\n        trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask\n      );\n    };\n  })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvY29tcGlsZWQvcmVhY3QvY2pzL3JlYWN0LWpzeC1kZXYtcnVudGltZS5kZXZlbG9wbWVudC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWE7QUFDYixLQUFxQztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWCwrQ0FBK0MsNkJBQTZCO0FBQzVFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsZ0JBQWdCLGdEQUFnRDtBQUNoRSxnQkFBZ0IsYUFBYTtBQUM3QjtBQUNBO0FBQ0EsZ0NBQWdDLGtDQUFrQyxPQUFPO0FBQ3pFO0FBQ0EsZ0dBQWdHLFNBQVMsVUFBVSxzRkFBc0YsYUFBYSxVQUFVLFVBQVU7QUFDMU87QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsbUJBQU8sQ0FBQyxzR0FBMEI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLGdCQUFnQjtBQUNwQixJQUFJLGNBQWM7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHIiwic291cmNlcyI6WyIvVXNlcnMvZWxpemEuam9obi9Eb3dubG9hZHMvc29jaWFsLW5ldHdvcmsvTmV4dCArIFJlYWN0ICsgVHlwZXNjcmlwdC9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2NvbXBpbGVkL3JlYWN0L2Nqcy9yZWFjdC1qc3gtZGV2LXJ1bnRpbWUuZGV2ZWxvcG1lbnQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZSBSZWFjdFxuICogcmVhY3QtanN4LWRldi1ydW50aW1lLmRldmVsb3BtZW50LmpzXG4gKlxuICogQ29weXJpZ2h0IChjKSBNZXRhIFBsYXRmb3JtcywgSW5jLiBhbmQgYWZmaWxpYXRlcy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblwicHJvZHVjdGlvblwiICE9PSBwcm9jZXNzLmVudi5OT0RFX0VOViAmJlxuICAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIGdldENvbXBvbmVudE5hbWVGcm9tVHlwZSh0eXBlKSB7XG4gICAgICBpZiAobnVsbCA9PSB0eXBlKSByZXR1cm4gbnVsbDtcbiAgICAgIGlmIChcImZ1bmN0aW9uXCIgPT09IHR5cGVvZiB0eXBlKVxuICAgICAgICByZXR1cm4gdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfQ0xJRU5UX1JFRkVSRU5DRVxuICAgICAgICAgID8gbnVsbFxuICAgICAgICAgIDogdHlwZS5kaXNwbGF5TmFtZSB8fCB0eXBlLm5hbWUgfHwgbnVsbDtcbiAgICAgIGlmIChcInN0cmluZ1wiID09PSB0eXBlb2YgdHlwZSkgcmV0dXJuIHR5cGU7XG4gICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSBSRUFDVF9GUkFHTUVOVF9UWVBFOlxuICAgICAgICAgIHJldHVybiBcIkZyYWdtZW50XCI7XG4gICAgICAgIGNhc2UgUkVBQ1RfUFJPRklMRVJfVFlQRTpcbiAgICAgICAgICByZXR1cm4gXCJQcm9maWxlclwiO1xuICAgICAgICBjYXNlIFJFQUNUX1NUUklDVF9NT0RFX1RZUEU6XG4gICAgICAgICAgcmV0dXJuIFwiU3RyaWN0TW9kZVwiO1xuICAgICAgICBjYXNlIFJFQUNUX1NVU1BFTlNFX1RZUEU6XG4gICAgICAgICAgcmV0dXJuIFwiU3VzcGVuc2VcIjtcbiAgICAgICAgY2FzZSBSRUFDVF9TVVNQRU5TRV9MSVNUX1RZUEU6XG4gICAgICAgICAgcmV0dXJuIFwiU3VzcGVuc2VMaXN0XCI7XG4gICAgICAgIGNhc2UgUkVBQ1RfQUNUSVZJVFlfVFlQRTpcbiAgICAgICAgICByZXR1cm4gXCJBY3Rpdml0eVwiO1xuICAgICAgfVxuICAgICAgaWYgKFwib2JqZWN0XCIgPT09IHR5cGVvZiB0eXBlKVxuICAgICAgICBzd2l0Y2ggKFxuICAgICAgICAgIChcIm51bWJlclwiID09PSB0eXBlb2YgdHlwZS50YWcgJiZcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgICAgIFwiUmVjZWl2ZWQgYW4gdW5leHBlY3RlZCBvYmplY3QgaW4gZ2V0Q29tcG9uZW50TmFtZUZyb21UeXBlKCkuIFRoaXMgaXMgbGlrZWx5IGEgYnVnIGluIFJlYWN0LiBQbGVhc2UgZmlsZSBhbiBpc3N1ZS5cIlxuICAgICAgICAgICAgKSxcbiAgICAgICAgICB0eXBlLiQkdHlwZW9mKVxuICAgICAgICApIHtcbiAgICAgICAgICBjYXNlIFJFQUNUX1BPUlRBTF9UWVBFOlxuICAgICAgICAgICAgcmV0dXJuIFwiUG9ydGFsXCI7XG4gICAgICAgICAgY2FzZSBSRUFDVF9DT05URVhUX1RZUEU6XG4gICAgICAgICAgICByZXR1cm4gKHR5cGUuZGlzcGxheU5hbWUgfHwgXCJDb250ZXh0XCIpICsgXCIuUHJvdmlkZXJcIjtcbiAgICAgICAgICBjYXNlIFJFQUNUX0NPTlNVTUVSX1RZUEU6XG4gICAgICAgICAgICByZXR1cm4gKHR5cGUuX2NvbnRleHQuZGlzcGxheU5hbWUgfHwgXCJDb250ZXh0XCIpICsgXCIuQ29uc3VtZXJcIjtcbiAgICAgICAgICBjYXNlIFJFQUNUX0ZPUldBUkRfUkVGX1RZUEU6XG4gICAgICAgICAgICB2YXIgaW5uZXJUeXBlID0gdHlwZS5yZW5kZXI7XG4gICAgICAgICAgICB0eXBlID0gdHlwZS5kaXNwbGF5TmFtZTtcbiAgICAgICAgICAgIHR5cGUgfHxcbiAgICAgICAgICAgICAgKCh0eXBlID0gaW5uZXJUeXBlLmRpc3BsYXlOYW1lIHx8IGlubmVyVHlwZS5uYW1lIHx8IFwiXCIpLFxuICAgICAgICAgICAgICAodHlwZSA9IFwiXCIgIT09IHR5cGUgPyBcIkZvcndhcmRSZWYoXCIgKyB0eXBlICsgXCIpXCIgOiBcIkZvcndhcmRSZWZcIikpO1xuICAgICAgICAgICAgcmV0dXJuIHR5cGU7XG4gICAgICAgICAgY2FzZSBSRUFDVF9NRU1PX1RZUEU6XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAoaW5uZXJUeXBlID0gdHlwZS5kaXNwbGF5TmFtZSB8fCBudWxsKSxcbiAgICAgICAgICAgICAgbnVsbCAhPT0gaW5uZXJUeXBlXG4gICAgICAgICAgICAgICAgPyBpbm5lclR5cGVcbiAgICAgICAgICAgICAgICA6IGdldENvbXBvbmVudE5hbWVGcm9tVHlwZSh0eXBlLnR5cGUpIHx8IFwiTWVtb1wiXG4gICAgICAgICAgICApO1xuICAgICAgICAgIGNhc2UgUkVBQ1RfTEFaWV9UWVBFOlxuICAgICAgICAgICAgaW5uZXJUeXBlID0gdHlwZS5fcGF5bG9hZDtcbiAgICAgICAgICAgIHR5cGUgPSB0eXBlLl9pbml0O1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGdldENvbXBvbmVudE5hbWVGcm9tVHlwZSh0eXBlKGlubmVyVHlwZSkpO1xuICAgICAgICAgICAgfSBjYXRjaCAoeCkge31cbiAgICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHRlc3RTdHJpbmdDb2VyY2lvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIFwiXCIgKyB2YWx1ZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY2hlY2tLZXlTdHJpbmdDb2VyY2lvbih2YWx1ZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGVzdFN0cmluZ0NvZXJjaW9uKHZhbHVlKTtcbiAgICAgICAgdmFyIEpTQ29tcGlsZXJfaW5saW5lX3Jlc3VsdCA9ICExO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBKU0NvbXBpbGVyX2lubGluZV9yZXN1bHQgPSAhMDtcbiAgICAgIH1cbiAgICAgIGlmIChKU0NvbXBpbGVyX2lubGluZV9yZXN1bHQpIHtcbiAgICAgICAgSlNDb21waWxlcl9pbmxpbmVfcmVzdWx0ID0gY29uc29sZTtcbiAgICAgICAgdmFyIEpTQ29tcGlsZXJfdGVtcF9jb25zdCA9IEpTQ29tcGlsZXJfaW5saW5lX3Jlc3VsdC5lcnJvcjtcbiAgICAgICAgdmFyIEpTQ29tcGlsZXJfaW5saW5lX3Jlc3VsdCRqc2NvbXAkMCA9XG4gICAgICAgICAgKFwiZnVuY3Rpb25cIiA9PT0gdHlwZW9mIFN5bWJvbCAmJlxuICAgICAgICAgICAgU3ltYm9sLnRvU3RyaW5nVGFnICYmXG4gICAgICAgICAgICB2YWx1ZVtTeW1ib2wudG9TdHJpbmdUYWddKSB8fFxuICAgICAgICAgIHZhbHVlLmNvbnN0cnVjdG9yLm5hbWUgfHxcbiAgICAgICAgICBcIk9iamVjdFwiO1xuICAgICAgICBKU0NvbXBpbGVyX3RlbXBfY29uc3QuY2FsbChcbiAgICAgICAgICBKU0NvbXBpbGVyX2lubGluZV9yZXN1bHQsXG4gICAgICAgICAgXCJUaGUgcHJvdmlkZWQga2V5IGlzIGFuIHVuc3VwcG9ydGVkIHR5cGUgJXMuIFRoaXMgdmFsdWUgbXVzdCBiZSBjb2VyY2VkIHRvIGEgc3RyaW5nIGJlZm9yZSB1c2luZyBpdCBoZXJlLlwiLFxuICAgICAgICAgIEpTQ29tcGlsZXJfaW5saW5lX3Jlc3VsdCRqc2NvbXAkMFxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gdGVzdFN0cmluZ0NvZXJjaW9uKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0VGFza05hbWUodHlwZSkge1xuICAgICAgaWYgKHR5cGUgPT09IFJFQUNUX0ZSQUdNRU5UX1RZUEUpIHJldHVybiBcIjw+XCI7XG4gICAgICBpZiAoXG4gICAgICAgIFwib2JqZWN0XCIgPT09IHR5cGVvZiB0eXBlICYmXG4gICAgICAgIG51bGwgIT09IHR5cGUgJiZcbiAgICAgICAgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfTEFaWV9UWVBFXG4gICAgICApXG4gICAgICAgIHJldHVybiBcIjwuLi4+XCI7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgbmFtZSA9IGdldENvbXBvbmVudE5hbWVGcm9tVHlwZSh0eXBlKTtcbiAgICAgICAgcmV0dXJuIG5hbWUgPyBcIjxcIiArIG5hbWUgKyBcIj5cIiA6IFwiPC4uLj5cIjtcbiAgICAgIH0gY2F0Y2ggKHgpIHtcbiAgICAgICAgcmV0dXJuIFwiPC4uLj5cIjtcbiAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0T3duZXIoKSB7XG4gICAgICB2YXIgZGlzcGF0Y2hlciA9IFJlYWN0U2hhcmVkSW50ZXJuYWxzLkE7XG4gICAgICByZXR1cm4gbnVsbCA9PT0gZGlzcGF0Y2hlciA/IG51bGwgOiBkaXNwYXRjaGVyLmdldE93bmVyKCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIFVua25vd25Pd25lcigpIHtcbiAgICAgIHJldHVybiBFcnJvcihcInJlYWN0LXN0YWNrLXRvcC1mcmFtZVwiKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaGFzVmFsaWRLZXkoY29uZmlnKSB7XG4gICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChjb25maWcsIFwia2V5XCIpKSB7XG4gICAgICAgIHZhciBnZXR0ZXIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGNvbmZpZywgXCJrZXlcIikuZ2V0O1xuICAgICAgICBpZiAoZ2V0dGVyICYmIGdldHRlci5pc1JlYWN0V2FybmluZykgcmV0dXJuICExO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZvaWQgMCAhPT0gY29uZmlnLmtleTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZGVmaW5lS2V5UHJvcFdhcm5pbmdHZXR0ZXIocHJvcHMsIGRpc3BsYXlOYW1lKSB7XG4gICAgICBmdW5jdGlvbiB3YXJuQWJvdXRBY2Nlc3NpbmdLZXkoKSB7XG4gICAgICAgIHNwZWNpYWxQcm9wS2V5V2FybmluZ1Nob3duIHx8XG4gICAgICAgICAgKChzcGVjaWFsUHJvcEtleVdhcm5pbmdTaG93biA9ICEwKSxcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICAgXCIlczogYGtleWAgaXMgbm90IGEgcHJvcC4gVHJ5aW5nIHRvIGFjY2VzcyBpdCB3aWxsIHJlc3VsdCBpbiBgdW5kZWZpbmVkYCBiZWluZyByZXR1cm5lZC4gSWYgeW91IG5lZWQgdG8gYWNjZXNzIHRoZSBzYW1lIHZhbHVlIHdpdGhpbiB0aGUgY2hpbGQgY29tcG9uZW50LCB5b3Ugc2hvdWxkIHBhc3MgaXQgYXMgYSBkaWZmZXJlbnQgcHJvcC4gKGh0dHBzOi8vcmVhY3QuZGV2L2xpbmsvc3BlY2lhbC1wcm9wcylcIixcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lXG4gICAgICAgICAgKSk7XG4gICAgICB9XG4gICAgICB3YXJuQWJvdXRBY2Nlc3NpbmdLZXkuaXNSZWFjdFdhcm5pbmcgPSAhMDtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm9wcywgXCJrZXlcIiwge1xuICAgICAgICBnZXQ6IHdhcm5BYm91dEFjY2Vzc2luZ0tleSxcbiAgICAgICAgY29uZmlndXJhYmxlOiAhMFxuICAgICAgfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGVsZW1lbnRSZWZHZXR0ZXJXaXRoRGVwcmVjYXRpb25XYXJuaW5nKCkge1xuICAgICAgdmFyIGNvbXBvbmVudE5hbWUgPSBnZXRDb21wb25lbnROYW1lRnJvbVR5cGUodGhpcy50eXBlKTtcbiAgICAgIGRpZFdhcm5BYm91dEVsZW1lbnRSZWZbY29tcG9uZW50TmFtZV0gfHxcbiAgICAgICAgKChkaWRXYXJuQWJvdXRFbGVtZW50UmVmW2NvbXBvbmVudE5hbWVdID0gITApLFxuICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgIFwiQWNjZXNzaW5nIGVsZW1lbnQucmVmIHdhcyByZW1vdmVkIGluIFJlYWN0IDE5LiByZWYgaXMgbm93IGEgcmVndWxhciBwcm9wLiBJdCB3aWxsIGJlIHJlbW92ZWQgZnJvbSB0aGUgSlNYIEVsZW1lbnQgdHlwZSBpbiBhIGZ1dHVyZSByZWxlYXNlLlwiXG4gICAgICAgICkpO1xuICAgICAgY29tcG9uZW50TmFtZSA9IHRoaXMucHJvcHMucmVmO1xuICAgICAgcmV0dXJuIHZvaWQgMCAhPT0gY29tcG9uZW50TmFtZSA/IGNvbXBvbmVudE5hbWUgOiBudWxsO1xuICAgIH1cbiAgICBmdW5jdGlvbiBSZWFjdEVsZW1lbnQoXG4gICAgICB0eXBlLFxuICAgICAga2V5LFxuICAgICAgc2VsZixcbiAgICAgIHNvdXJjZSxcbiAgICAgIG93bmVyLFxuICAgICAgcHJvcHMsXG4gICAgICBkZWJ1Z1N0YWNrLFxuICAgICAgZGVidWdUYXNrXG4gICAgKSB7XG4gICAgICBzZWxmID0gcHJvcHMucmVmO1xuICAgICAgdHlwZSA9IHtcbiAgICAgICAgJCR0eXBlb2Y6IFJFQUNUX0VMRU1FTlRfVFlQRSxcbiAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAga2V5OiBrZXksXG4gICAgICAgIHByb3BzOiBwcm9wcyxcbiAgICAgICAgX293bmVyOiBvd25lclxuICAgICAgfTtcbiAgICAgIG51bGwgIT09ICh2b2lkIDAgIT09IHNlbGYgPyBzZWxmIDogbnVsbClcbiAgICAgICAgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkodHlwZSwgXCJyZWZcIiwge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogITEsXG4gICAgICAgICAgICBnZXQ6IGVsZW1lbnRSZWZHZXR0ZXJXaXRoRGVwcmVjYXRpb25XYXJuaW5nXG4gICAgICAgICAgfSlcbiAgICAgICAgOiBPYmplY3QuZGVmaW5lUHJvcGVydHkodHlwZSwgXCJyZWZcIiwgeyBlbnVtZXJhYmxlOiAhMSwgdmFsdWU6IG51bGwgfSk7XG4gICAgICB0eXBlLl9zdG9yZSA9IHt9O1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHR5cGUuX3N0b3JlLCBcInZhbGlkYXRlZFwiLCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogITEsXG4gICAgICAgIGVudW1lcmFibGU6ICExLFxuICAgICAgICB3cml0YWJsZTogITAsXG4gICAgICAgIHZhbHVlOiAwXG4gICAgICB9KTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0eXBlLCBcIl9kZWJ1Z0luZm9cIiwge1xuICAgICAgICBjb25maWd1cmFibGU6ICExLFxuICAgICAgICBlbnVtZXJhYmxlOiAhMSxcbiAgICAgICAgd3JpdGFibGU6ICEwLFxuICAgICAgICB2YWx1ZTogbnVsbFxuICAgICAgfSk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodHlwZSwgXCJfZGVidWdTdGFja1wiLCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogITEsXG4gICAgICAgIGVudW1lcmFibGU6ICExLFxuICAgICAgICB3cml0YWJsZTogITAsXG4gICAgICAgIHZhbHVlOiBkZWJ1Z1N0YWNrXG4gICAgICB9KTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0eXBlLCBcIl9kZWJ1Z1Rhc2tcIiwge1xuICAgICAgICBjb25maWd1cmFibGU6ICExLFxuICAgICAgICBlbnVtZXJhYmxlOiAhMSxcbiAgICAgICAgd3JpdGFibGU6ICEwLFxuICAgICAgICB2YWx1ZTogZGVidWdUYXNrXG4gICAgICB9KTtcbiAgICAgIE9iamVjdC5mcmVlemUgJiYgKE9iamVjdC5mcmVlemUodHlwZS5wcm9wcyksIE9iamVjdC5mcmVlemUodHlwZSkpO1xuICAgICAgcmV0dXJuIHR5cGU7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGpzeERFVkltcGwoXG4gICAgICB0eXBlLFxuICAgICAgY29uZmlnLFxuICAgICAgbWF5YmVLZXksXG4gICAgICBpc1N0YXRpY0NoaWxkcmVuLFxuICAgICAgc291cmNlLFxuICAgICAgc2VsZixcbiAgICAgIGRlYnVnU3RhY2ssXG4gICAgICBkZWJ1Z1Rhc2tcbiAgICApIHtcbiAgICAgIHZhciBjaGlsZHJlbiA9IGNvbmZpZy5jaGlsZHJlbjtcbiAgICAgIGlmICh2b2lkIDAgIT09IGNoaWxkcmVuKVxuICAgICAgICBpZiAoaXNTdGF0aWNDaGlsZHJlbilcbiAgICAgICAgICBpZiAoaXNBcnJheUltcGwoY2hpbGRyZW4pKSB7XG4gICAgICAgICAgICBmb3IgKFxuICAgICAgICAgICAgICBpc1N0YXRpY0NoaWxkcmVuID0gMDtcbiAgICAgICAgICAgICAgaXNTdGF0aWNDaGlsZHJlbiA8IGNoaWxkcmVuLmxlbmd0aDtcbiAgICAgICAgICAgICAgaXNTdGF0aWNDaGlsZHJlbisrXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAgIHZhbGlkYXRlQ2hpbGRLZXlzKGNoaWxkcmVuW2lzU3RhdGljQ2hpbGRyZW5dKTtcbiAgICAgICAgICAgIE9iamVjdC5mcmVlemUgJiYgT2JqZWN0LmZyZWV6ZShjaGlsZHJlbik7XG4gICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICAgICBcIlJlYWN0LmpzeDogU3RhdGljIGNoaWxkcmVuIHNob3VsZCBhbHdheXMgYmUgYW4gYXJyYXkuIFlvdSBhcmUgbGlrZWx5IGV4cGxpY2l0bHkgY2FsbGluZyBSZWFjdC5qc3hzIG9yIFJlYWN0LmpzeERFVi4gVXNlIHRoZSBCYWJlbCB0cmFuc2Zvcm0gaW5zdGVhZC5cIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgZWxzZSB2YWxpZGF0ZUNoaWxkS2V5cyhjaGlsZHJlbik7XG4gICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChjb25maWcsIFwia2V5XCIpKSB7XG4gICAgICAgIGNoaWxkcmVuID0gZ2V0Q29tcG9uZW50TmFtZUZyb21UeXBlKHR5cGUpO1xuICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGNvbmZpZykuZmlsdGVyKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgICAgcmV0dXJuIFwia2V5XCIgIT09IGs7XG4gICAgICAgIH0pO1xuICAgICAgICBpc1N0YXRpY0NoaWxkcmVuID1cbiAgICAgICAgICAwIDwga2V5cy5sZW5ndGhcbiAgICAgICAgICAgID8gXCJ7a2V5OiBzb21lS2V5LCBcIiArIGtleXMuam9pbihcIjogLi4uLCBcIikgKyBcIjogLi4ufVwiXG4gICAgICAgICAgICA6IFwie2tleTogc29tZUtleX1cIjtcbiAgICAgICAgZGlkV2FybkFib3V0S2V5U3ByZWFkW2NoaWxkcmVuICsgaXNTdGF0aWNDaGlsZHJlbl0gfHxcbiAgICAgICAgICAoKGtleXMgPVxuICAgICAgICAgICAgMCA8IGtleXMubGVuZ3RoID8gXCJ7XCIgKyBrZXlzLmpvaW4oXCI6IC4uLiwgXCIpICsgXCI6IC4uLn1cIiA6IFwie31cIiksXG4gICAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgICdBIHByb3BzIG9iamVjdCBjb250YWluaW5nIGEgXCJrZXlcIiBwcm9wIGlzIGJlaW5nIHNwcmVhZCBpbnRvIEpTWDpcXG4gIGxldCBwcm9wcyA9ICVzO1xcbiAgPCVzIHsuLi5wcm9wc30gLz5cXG5SZWFjdCBrZXlzIG11c3QgYmUgcGFzc2VkIGRpcmVjdGx5IHRvIEpTWCB3aXRob3V0IHVzaW5nIHNwcmVhZDpcXG4gIGxldCBwcm9wcyA9ICVzO1xcbiAgPCVzIGtleT17c29tZUtleX0gey4uLnByb3BzfSAvPicsXG4gICAgICAgICAgICBpc1N0YXRpY0NoaWxkcmVuLFxuICAgICAgICAgICAgY2hpbGRyZW4sXG4gICAgICAgICAgICBrZXlzLFxuICAgICAgICAgICAgY2hpbGRyZW5cbiAgICAgICAgICApLFxuICAgICAgICAgIChkaWRXYXJuQWJvdXRLZXlTcHJlYWRbY2hpbGRyZW4gKyBpc1N0YXRpY0NoaWxkcmVuXSA9ICEwKSk7XG4gICAgICB9XG4gICAgICBjaGlsZHJlbiA9IG51bGw7XG4gICAgICB2b2lkIDAgIT09IG1heWJlS2V5ICYmXG4gICAgICAgIChjaGVja0tleVN0cmluZ0NvZXJjaW9uKG1heWJlS2V5KSwgKGNoaWxkcmVuID0gXCJcIiArIG1heWJlS2V5KSk7XG4gICAgICBoYXNWYWxpZEtleShjb25maWcpICYmXG4gICAgICAgIChjaGVja0tleVN0cmluZ0NvZXJjaW9uKGNvbmZpZy5rZXkpLCAoY2hpbGRyZW4gPSBcIlwiICsgY29uZmlnLmtleSkpO1xuICAgICAgaWYgKFwia2V5XCIgaW4gY29uZmlnKSB7XG4gICAgICAgIG1heWJlS2V5ID0ge307XG4gICAgICAgIGZvciAodmFyIHByb3BOYW1lIGluIGNvbmZpZylcbiAgICAgICAgICBcImtleVwiICE9PSBwcm9wTmFtZSAmJiAobWF5YmVLZXlbcHJvcE5hbWVdID0gY29uZmlnW3Byb3BOYW1lXSk7XG4gICAgICB9IGVsc2UgbWF5YmVLZXkgPSBjb25maWc7XG4gICAgICBjaGlsZHJlbiAmJlxuICAgICAgICBkZWZpbmVLZXlQcm9wV2FybmluZ0dldHRlcihcbiAgICAgICAgICBtYXliZUtleSxcbiAgICAgICAgICBcImZ1bmN0aW9uXCIgPT09IHR5cGVvZiB0eXBlXG4gICAgICAgICAgICA/IHR5cGUuZGlzcGxheU5hbWUgfHwgdHlwZS5uYW1lIHx8IFwiVW5rbm93blwiXG4gICAgICAgICAgICA6IHR5cGVcbiAgICAgICAgKTtcbiAgICAgIHJldHVybiBSZWFjdEVsZW1lbnQoXG4gICAgICAgIHR5cGUsXG4gICAgICAgIGNoaWxkcmVuLFxuICAgICAgICBzZWxmLFxuICAgICAgICBzb3VyY2UsXG4gICAgICAgIGdldE93bmVyKCksXG4gICAgICAgIG1heWJlS2V5LFxuICAgICAgICBkZWJ1Z1N0YWNrLFxuICAgICAgICBkZWJ1Z1Rhc2tcbiAgICAgICk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlQ2hpbGRLZXlzKG5vZGUpIHtcbiAgICAgIFwib2JqZWN0XCIgPT09IHR5cGVvZiBub2RlICYmXG4gICAgICAgIG51bGwgIT09IG5vZGUgJiZcbiAgICAgICAgbm9kZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFICYmXG4gICAgICAgIG5vZGUuX3N0b3JlICYmXG4gICAgICAgIChub2RlLl9zdG9yZS52YWxpZGF0ZWQgPSAxKTtcbiAgICB9XG4gICAgdmFyIFJlYWN0ID0gcmVxdWlyZShcIm5leHQvZGlzdC9jb21waWxlZC9yZWFjdFwiKSxcbiAgICAgIFJFQUNUX0VMRU1FTlRfVFlQRSA9IFN5bWJvbC5mb3IoXCJyZWFjdC50cmFuc2l0aW9uYWwuZWxlbWVudFwiKSxcbiAgICAgIFJFQUNUX1BPUlRBTF9UWVBFID0gU3ltYm9sLmZvcihcInJlYWN0LnBvcnRhbFwiKSxcbiAgICAgIFJFQUNUX0ZSQUdNRU5UX1RZUEUgPSBTeW1ib2wuZm9yKFwicmVhY3QuZnJhZ21lbnRcIiksXG4gICAgICBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFID0gU3ltYm9sLmZvcihcInJlYWN0LnN0cmljdF9tb2RlXCIpLFxuICAgICAgUkVBQ1RfUFJPRklMRVJfVFlQRSA9IFN5bWJvbC5mb3IoXCJyZWFjdC5wcm9maWxlclwiKTtcbiAgICBTeW1ib2wuZm9yKFwicmVhY3QucHJvdmlkZXJcIik7XG4gICAgdmFyIFJFQUNUX0NPTlNVTUVSX1RZUEUgPSBTeW1ib2wuZm9yKFwicmVhY3QuY29uc3VtZXJcIiksXG4gICAgICBSRUFDVF9DT05URVhUX1RZUEUgPSBTeW1ib2wuZm9yKFwicmVhY3QuY29udGV4dFwiKSxcbiAgICAgIFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUgPSBTeW1ib2wuZm9yKFwicmVhY3QuZm9yd2FyZF9yZWZcIiksXG4gICAgICBSRUFDVF9TVVNQRU5TRV9UWVBFID0gU3ltYm9sLmZvcihcInJlYWN0LnN1c3BlbnNlXCIpLFxuICAgICAgUkVBQ1RfU1VTUEVOU0VfTElTVF9UWVBFID0gU3ltYm9sLmZvcihcInJlYWN0LnN1c3BlbnNlX2xpc3RcIiksXG4gICAgICBSRUFDVF9NRU1PX1RZUEUgPSBTeW1ib2wuZm9yKFwicmVhY3QubWVtb1wiKSxcbiAgICAgIFJFQUNUX0xBWllfVFlQRSA9IFN5bWJvbC5mb3IoXCJyZWFjdC5sYXp5XCIpLFxuICAgICAgUkVBQ1RfQUNUSVZJVFlfVFlQRSA9IFN5bWJvbC5mb3IoXCJyZWFjdC5hY3Rpdml0eVwiKSxcbiAgICAgIFJFQUNUX0NMSUVOVF9SRUZFUkVOQ0UgPSBTeW1ib2wuZm9yKFwicmVhY3QuY2xpZW50LnJlZmVyZW5jZVwiKSxcbiAgICAgIFJlYWN0U2hhcmVkSW50ZXJuYWxzID1cbiAgICAgICAgUmVhY3QuX19DTElFTlRfSU5URVJOQUxTX0RPX05PVF9VU0VfT1JfV0FSTl9VU0VSU19USEVZX0NBTk5PVF9VUEdSQURFLFxuICAgICAgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LFxuICAgICAgaXNBcnJheUltcGwgPSBBcnJheS5pc0FycmF5LFxuICAgICAgY3JlYXRlVGFzayA9IGNvbnNvbGUuY3JlYXRlVGFza1xuICAgICAgICA/IGNvbnNvbGUuY3JlYXRlVGFza1xuICAgICAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH07XG4gICAgUmVhY3QgPSB7XG4gICAgICBcInJlYWN0LXN0YWNrLWJvdHRvbS1mcmFtZVwiOiBmdW5jdGlvbiAoY2FsbFN0YWNrRm9yRXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxTdGFja0ZvckVycm9yKCk7XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgc3BlY2lhbFByb3BLZXlXYXJuaW5nU2hvd247XG4gICAgdmFyIGRpZFdhcm5BYm91dEVsZW1lbnRSZWYgPSB7fTtcbiAgICB2YXIgdW5rbm93bk93bmVyRGVidWdTdGFjayA9IFJlYWN0W1wicmVhY3Qtc3RhY2stYm90dG9tLWZyYW1lXCJdLmJpbmQoXG4gICAgICBSZWFjdCxcbiAgICAgIFVua25vd25Pd25lclxuICAgICkoKTtcbiAgICB2YXIgdW5rbm93bk93bmVyRGVidWdUYXNrID0gY3JlYXRlVGFzayhnZXRUYXNrTmFtZShVbmtub3duT3duZXIpKTtcbiAgICB2YXIgZGlkV2FybkFib3V0S2V5U3ByZWFkID0ge307XG4gICAgZXhwb3J0cy5GcmFnbWVudCA9IFJFQUNUX0ZSQUdNRU5UX1RZUEU7XG4gICAgZXhwb3J0cy5qc3hERVYgPSBmdW5jdGlvbiAoXG4gICAgICB0eXBlLFxuICAgICAgY29uZmlnLFxuICAgICAgbWF5YmVLZXksXG4gICAgICBpc1N0YXRpY0NoaWxkcmVuLFxuICAgICAgc291cmNlLFxuICAgICAgc2VsZlxuICAgICkge1xuICAgICAgdmFyIHRyYWNrQWN0dWFsT3duZXIgPVxuICAgICAgICAxZTQgPiBSZWFjdFNoYXJlZEludGVybmFscy5yZWNlbnRseUNyZWF0ZWRPd25lclN0YWNrcysrO1xuICAgICAgcmV0dXJuIGpzeERFVkltcGwoXG4gICAgICAgIHR5cGUsXG4gICAgICAgIGNvbmZpZyxcbiAgICAgICAgbWF5YmVLZXksXG4gICAgICAgIGlzU3RhdGljQ2hpbGRyZW4sXG4gICAgICAgIHNvdXJjZSxcbiAgICAgICAgc2VsZixcbiAgICAgICAgdHJhY2tBY3R1YWxPd25lclxuICAgICAgICAgID8gRXJyb3IoXCJyZWFjdC1zdGFjay10b3AtZnJhbWVcIilcbiAgICAgICAgICA6IHVua25vd25Pd25lckRlYnVnU3RhY2ssXG4gICAgICAgIHRyYWNrQWN0dWFsT3duZXIgPyBjcmVhdGVUYXNrKGdldFRhc2tOYW1lKHR5cGUpKSA6IHVua25vd25Pd25lckRlYnVnVGFza1xuICAgICAgKTtcbiAgICB9O1xuICB9KSgpO1xuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js\n"));

/***/ }),

/***/ "(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js":
/*!******************************************************************!*\
  !*** ./node_modules/next/dist/compiled/react/jsx-dev-runtime.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval(__webpack_require__.ts("\n\nif (false) {} else {\n  module.exports = __webpack_require__(/*! ./cjs/react-jsx-dev-runtime.development.js */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js\");\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvY29tcGlsZWQvcmVhY3QvanN4LWRldi1ydW50aW1lLmpzIiwibWFwcGluZ3MiOiJBQUFhOztBQUViLElBQUksS0FBcUMsRUFBRSxFQUUxQyxDQUFDO0FBQ0YsRUFBRSw4TEFBc0U7QUFDeEUiLCJzb3VyY2VzIjpbIi9Vc2Vycy9lbGl6YS5qb2huL0Rvd25sb2Fkcy9zb2NpYWwtbmV0d29yay9OZXh0ICsgUmVhY3QgKyBUeXBlc2NyaXB0L25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvY29tcGlsZWQvcmVhY3QvanN4LWRldi1ydW50aW1lLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9yZWFjdC1qc3gtZGV2LXJ1bnRpbWUucHJvZHVjdGlvbi5qcycpO1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9yZWFjdC1qc3gtZGV2LXJ1bnRpbWUuZGV2ZWxvcG1lbnQuanMnKTtcbn1cbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\n"));

/***/ })

});