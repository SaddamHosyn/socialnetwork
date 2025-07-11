/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/groups/posts/create/route";
exports.ids = ["app/api/groups/posts/create/route"];
exports.modules = {

/***/ "(rsc)/./app/api/groups/posts/create/route.ts":
/*!**********************************************!*\
  !*** ./app/api/groups/posts/create/route.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST),\n/* harmony export */   dynamic: () => (/* binding */ dynamic)\n/* harmony export */ });\nconst dynamic = \"force-dynamic\";\nasync function POST(req) {\n    const cookie = req.headers.get(\"cookie\");\n    const contentType = req.headers.get(\"content-type\");\n    let body;\n    let fetchHeaders = {\n        Cookie: cookie || \"\"\n    };\n    // Check if the request is multipart form data (likely contains files)\n    if (contentType && contentType.includes(\"multipart/form-data\")) {\n        // For file uploads, pass FormData directly\n        body = await req.formData();\n    // Don't set Content-Type header for FormData - let fetch handle it\n    } else {\n        // For regular text form data\n        body = await req.text();\n        fetchHeaders[\"Content-Type\"] = \"application/x-www-form-urlencoded\";\n    }\n    const res = await fetch(\"http://localhost:8080/api/groups/posts/create\", {\n        method: \"POST\",\n        headers: fetchHeaders,\n        body,\n        cache: \"no-store\"\n    });\n    return res;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2dyb3Vwcy9wb3N0cy9jcmVhdGUvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFTyxNQUFNQSxVQUFVLGdCQUFnQjtBQUVoQyxlQUFlQyxLQUFLQyxHQUFnQjtJQUN6QyxNQUFNQyxTQUFTRCxJQUFJRSxPQUFPLENBQUNDLEdBQUcsQ0FBQztJQUMvQixNQUFNQyxjQUFjSixJQUFJRSxPQUFPLENBQUNDLEdBQUcsQ0FBQztJQUVwQyxJQUFJRTtJQUNKLElBQUlDLGVBQXVDO1FBQ3pDQyxRQUFRTixVQUFVO0lBQ3BCO0lBRUEsc0VBQXNFO0lBQ3RFLElBQUlHLGVBQWVBLFlBQVlJLFFBQVEsQ0FBQyx3QkFBd0I7UUFDOUQsMkNBQTJDO1FBQzNDSCxPQUFPLE1BQU1MLElBQUlTLFFBQVE7SUFDekIsbUVBQW1FO0lBQ3JFLE9BQU87UUFDTCw2QkFBNkI7UUFDN0JKLE9BQU8sTUFBTUwsSUFBSVUsSUFBSTtRQUNyQkosWUFBWSxDQUFDLGVBQWUsR0FBRztJQUNqQztJQUVBLE1BQU1LLE1BQU0sTUFBTUMsTUFBTSxpREFBaUQ7UUFDdkVDLFFBQVE7UUFDUlgsU0FBU0k7UUFDVEQ7UUFDQVMsT0FBTztJQUNUO0lBRUEsT0FBT0g7QUFDVCIsInNvdXJjZXMiOlsiL1VzZXJzL2VsaXphLmpvaG4vRG93bmxvYWRzL3NvY2lhbC1uZXR3b3JrL05leHQgKyBSZWFjdCArIFR5cGVzY3JpcHQvYXBwL2FwaS9ncm91cHMvcG9zdHMvY3JlYXRlL3JvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHR5cGUgTmV4dFJlcXVlc3QgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIjtcblxuZXhwb3J0IGNvbnN0IGR5bmFtaWMgPSBcImZvcmNlLWR5bmFtaWNcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QocmVxOiBOZXh0UmVxdWVzdCkge1xuICBjb25zdCBjb29raWUgPSByZXEuaGVhZGVycy5nZXQoXCJjb29raWVcIik7XG4gIGNvbnN0IGNvbnRlbnRUeXBlID0gcmVxLmhlYWRlcnMuZ2V0KFwiY29udGVudC10eXBlXCIpO1xuICBcbiAgbGV0IGJvZHk7XG4gIGxldCBmZXRjaEhlYWRlcnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgQ29va2llOiBjb29raWUgfHwgXCJcIixcbiAgfTtcblxuICAvLyBDaGVjayBpZiB0aGUgcmVxdWVzdCBpcyBtdWx0aXBhcnQgZm9ybSBkYXRhIChsaWtlbHkgY29udGFpbnMgZmlsZXMpXG4gIGlmIChjb250ZW50VHlwZSAmJiBjb250ZW50VHlwZS5pbmNsdWRlcyhcIm11bHRpcGFydC9mb3JtLWRhdGFcIikpIHtcbiAgICAvLyBGb3IgZmlsZSB1cGxvYWRzLCBwYXNzIEZvcm1EYXRhIGRpcmVjdGx5XG4gICAgYm9keSA9IGF3YWl0IHJlcS5mb3JtRGF0YSgpO1xuICAgIC8vIERvbid0IHNldCBDb250ZW50LVR5cGUgaGVhZGVyIGZvciBGb3JtRGF0YSAtIGxldCBmZXRjaCBoYW5kbGUgaXRcbiAgfSBlbHNlIHtcbiAgICAvLyBGb3IgcmVndWxhciB0ZXh0IGZvcm0gZGF0YVxuICAgIGJvZHkgPSBhd2FpdCByZXEudGV4dCgpO1xuICAgIGZldGNoSGVhZGVyc1tcIkNvbnRlbnQtVHlwZVwiXSA9IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCI7XG4gIH1cblxuICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hcGkvZ3JvdXBzL3Bvc3RzL2NyZWF0ZVwiLCB7XG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBoZWFkZXJzOiBmZXRjaEhlYWRlcnMsXG4gICAgYm9keSxcbiAgICBjYWNoZTogXCJuby1zdG9yZVwiLFxuICB9KTtcblxuICByZXR1cm4gcmVzO1xufVxuIl0sIm5hbWVzIjpbImR5bmFtaWMiLCJQT1NUIiwicmVxIiwiY29va2llIiwiaGVhZGVycyIsImdldCIsImNvbnRlbnRUeXBlIiwiYm9keSIsImZldGNoSGVhZGVycyIsIkNvb2tpZSIsImluY2x1ZGVzIiwiZm9ybURhdGEiLCJ0ZXh0IiwicmVzIiwiZmV0Y2giLCJtZXRob2QiLCJjYWNoZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/groups/posts/create/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fgroups%2Fposts%2Fcreate%2Froute&page=%2Fapi%2Fgroups%2Fposts%2Fcreate%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fgroups%2Fposts%2Fcreate%2Froute.ts&appDir=%2FUsers%2Feliza.john%2FDownloads%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Feliza.john%2FDownloads%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fgroups%2Fposts%2Fcreate%2Froute&page=%2Fapi%2Fgroups%2Fposts%2Fcreate%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fgroups%2Fposts%2Fcreate%2Froute.ts&appDir=%2FUsers%2Feliza.john%2FDownloads%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Feliza.john%2FDownloads%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_eliza_john_Downloads_social_network_Next_React_Typescript_app_api_groups_posts_create_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/groups/posts/create/route.ts */ \"(rsc)/./app/api/groups/posts/create/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/groups/posts/create/route\",\n        pathname: \"/api/groups/posts/create\",\n        filename: \"route\",\n        bundlePath: \"app/api/groups/posts/create/route\"\n    },\n    resolvedPagePath: \"/Users/eliza.john/Downloads/social-network/Next + React + Typescript/app/api/groups/posts/create/route.ts\",\n    nextConfigOutput,\n    userland: _Users_eliza_john_Downloads_social_network_Next_React_Typescript_app_api_groups_posts_create_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZncm91cHMlMkZwb3N0cyUyRmNyZWF0ZSUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGZ3JvdXBzJTJGcG9zdHMlMkZjcmVhdGUlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZncm91cHMlMkZwb3N0cyUyRmNyZWF0ZSUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmVsaXphLmpvaG4lMkZEb3dubG9hZHMlMkZzb2NpYWwtbmV0d29yayUyRk5leHQlMjAlMkIlMjBSZWFjdCUyMCUyQiUyMFR5cGVzY3JpcHQlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRlVzZXJzJTJGZWxpemEuam9obiUyRkRvd25sb2FkcyUyRnNvY2lhbC1uZXR3b3JrJTJGTmV4dCUyMCUyQiUyMFJlYWN0JTIwJTJCJTIwVHlwZXNjcmlwdCZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDeUQ7QUFDdEk7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9Vc2Vycy9lbGl6YS5qb2huL0Rvd25sb2Fkcy9zb2NpYWwtbmV0d29yay9OZXh0ICsgUmVhY3QgKyBUeXBlc2NyaXB0L2FwcC9hcGkvZ3JvdXBzL3Bvc3RzL2NyZWF0ZS9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvZ3JvdXBzL3Bvc3RzL2NyZWF0ZS9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2dyb3Vwcy9wb3N0cy9jcmVhdGVcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2dyb3Vwcy9wb3N0cy9jcmVhdGUvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvVXNlcnMvZWxpemEuam9obi9Eb3dubG9hZHMvc29jaWFsLW5ldHdvcmsvTmV4dCArIFJlYWN0ICsgVHlwZXNjcmlwdC9hcHAvYXBpL2dyb3Vwcy9wb3N0cy9jcmVhdGUvcm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fgroups%2Fposts%2Fcreate%2Froute&page=%2Fapi%2Fgroups%2Fposts%2Fcreate%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fgroups%2Fposts%2Fcreate%2Froute.ts&appDir=%2FUsers%2Feliza.john%2FDownloads%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Feliza.john%2FDownloads%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fgroups%2Fposts%2Fcreate%2Froute&page=%2Fapi%2Fgroups%2Fposts%2Fcreate%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fgroups%2Fposts%2Fcreate%2Froute.ts&appDir=%2FUsers%2Feliza.john%2FDownloads%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Feliza.john%2FDownloads%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();