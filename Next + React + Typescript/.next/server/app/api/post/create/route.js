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
exports.id = "app/api/post/create/route";
exports.ids = ["app/api/post/create/route"];
exports.modules = {

/***/ "(rsc)/./app/api/post/create/route.ts":
/*!**************************************!*\
  !*** ./app/api/post/create/route.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST),\n/* harmony export */   dynamic: () => (/* binding */ dynamic)\n/* harmony export */ });\nconst dynamic = \"force-dynamic\";\nasync function POST(req) {\n    // Forward the raw body and headers to the Go backend\n    const cookie = req.headers.get(\"cookie\");\n    const contentType = req.headers.get(\"content-type\");\n    // IMPORTANT: Use req.body directly (stream) – do NOT parse or clone the body!\n    const res = await fetch(\"http://localhost:8080/api/post/create\", {\n        method: \"POST\",\n        headers: {\n            cookie: cookie || \"\",\n            \"content-type\": contentType || \"\"\n        },\n        body: req.body,\n        // @ts-expect-error duplex is required by Node.js fetch, not in TS yet\n        duplex: \"half\"\n    });\n    // Forward response from Go backend as-is\n    const responseBody = await res.text();\n    return new Response(responseBody, {\n        status: res.status,\n        headers: {\n            \"content-type\": res.headers.get(\"content-type\") || \"application/json\"\n        }\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3Bvc3QvY3JlYXRlL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7O0FBRU8sTUFBTUEsVUFBVSxnQkFBZ0I7QUFFaEMsZUFBZUMsS0FBS0MsR0FBZ0I7SUFDekMscURBQXFEO0lBQ3JELE1BQU1DLFNBQVNELElBQUlFLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDO0lBQy9CLE1BQU1DLGNBQWNKLElBQUlFLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDO0lBRXBDLDhFQUE4RTtJQUM5RSxNQUFNRSxNQUFNLE1BQU1DLE1BQU0seUNBQXlDO1FBQy9EQyxRQUFRO1FBQ1JMLFNBQVM7WUFDUEQsUUFBUUEsVUFBVTtZQUNsQixnQkFBZ0JHLGVBQWU7UUFDakM7UUFDQUksTUFBTVIsSUFBSVEsSUFBSTtRQUVkLHNFQUFzRTtRQUN0RUMsUUFBUTtJQUVWO0lBRUEseUNBQXlDO0lBQ3pDLE1BQU1DLGVBQWUsTUFBTUwsSUFBSU0sSUFBSTtJQUNuQyxPQUFPLElBQUlDLFNBQVNGLGNBQWM7UUFDaENHLFFBQVFSLElBQUlRLE1BQU07UUFDbEJYLFNBQVM7WUFDUCxnQkFBZ0JHLElBQUlILE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLG1CQUFtQjtRQUNyRDtJQUNGO0FBQ0YiLCJzb3VyY2VzIjpbIi9Vc2Vycy9lbGl6YS5qb2huL0Rvd25sb2Fkcy9zb2NpYWwtbmV0d29yay9OZXh0ICsgUmVhY3QgKyBUeXBlc2NyaXB0L2FwcC9hcGkvcG9zdC9jcmVhdGUvcm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlcXVlc3QgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIjtcblxuZXhwb3J0IGNvbnN0IGR5bmFtaWMgPSBcImZvcmNlLWR5bmFtaWNcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QocmVxOiBOZXh0UmVxdWVzdCkge1xuICAvLyBGb3J3YXJkIHRoZSByYXcgYm9keSBhbmQgaGVhZGVycyB0byB0aGUgR28gYmFja2VuZFxuICBjb25zdCBjb29raWUgPSByZXEuaGVhZGVycy5nZXQoXCJjb29raWVcIik7XG4gIGNvbnN0IGNvbnRlbnRUeXBlID0gcmVxLmhlYWRlcnMuZ2V0KFwiY29udGVudC10eXBlXCIpO1xuXG4gIC8vIElNUE9SVEFOVDogVXNlIHJlcS5ib2R5IGRpcmVjdGx5IChzdHJlYW0pIOKAkyBkbyBOT1QgcGFyc2Ugb3IgY2xvbmUgdGhlIGJvZHkhXG4gIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKFwiaHR0cDovL2xvY2FsaG9zdDo4MDgwL2FwaS9wb3N0L2NyZWF0ZVwiLCB7XG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBoZWFkZXJzOiB7XG4gICAgICBjb29raWU6IGNvb2tpZSB8fCBcIlwiLFxuICAgICAgXCJjb250ZW50LXR5cGVcIjogY29udGVudFR5cGUgfHwgXCJcIiwgLy8gYWx3YXlzIGZvcndhcmQgY29udGVudC10eXBlIGV4YWN0bHlcbiAgICB9LFxuICAgIGJvZHk6IHJlcS5ib2R5LCAvLyBTdHJlYW0gdGhlIGJvZHkgYXMtaXNcblxuICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgZHVwbGV4IGlzIHJlcXVpcmVkIGJ5IE5vZGUuanMgZmV0Y2gsIG5vdCBpbiBUUyB5ZXRcbiAgICBkdXBsZXg6IFwiaGFsZlwiLFxuICAgIC8vIGNyZWRlbnRpYWxzIGlzIE5PVCBuZWVkZWQgZm9yIGJhY2tlbmQtdG8tYmFja2VuZFxuICB9KTtcblxuICAvLyBGb3J3YXJkIHJlc3BvbnNlIGZyb20gR28gYmFja2VuZCBhcy1pc1xuICBjb25zdCByZXNwb25zZUJvZHkgPSBhd2FpdCByZXMudGV4dCgpO1xuICByZXR1cm4gbmV3IFJlc3BvbnNlKHJlc3BvbnNlQm9keSwge1xuICAgIHN0YXR1czogcmVzLnN0YXR1cyxcbiAgICBoZWFkZXJzOiB7XG4gICAgICBcImNvbnRlbnQtdHlwZVwiOiByZXMuaGVhZGVycy5nZXQoXCJjb250ZW50LXR5cGVcIikgfHwgXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgfSxcbiAgfSk7XG59XG4iXSwibmFtZXMiOlsiZHluYW1pYyIsIlBPU1QiLCJyZXEiLCJjb29raWUiLCJoZWFkZXJzIiwiZ2V0IiwiY29udGVudFR5cGUiLCJyZXMiLCJmZXRjaCIsIm1ldGhvZCIsImJvZHkiLCJkdXBsZXgiLCJyZXNwb25zZUJvZHkiLCJ0ZXh0IiwiUmVzcG9uc2UiLCJzdGF0dXMiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/post/create/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fpost%2Fcreate%2Froute&page=%2Fapi%2Fpost%2Fcreate%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fpost%2Fcreate%2Froute.ts&appDir=%2FUsers%2Feliza.john%2FDownloads%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Feliza.john%2FDownloads%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fpost%2Fcreate%2Froute&page=%2Fapi%2Fpost%2Fcreate%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fpost%2Fcreate%2Froute.ts&appDir=%2FUsers%2Feliza.john%2FDownloads%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Feliza.john%2FDownloads%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_eliza_john_Downloads_social_network_Next_React_Typescript_app_api_post_create_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/post/create/route.ts */ \"(rsc)/./app/api/post/create/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/post/create/route\",\n        pathname: \"/api/post/create\",\n        filename: \"route\",\n        bundlePath: \"app/api/post/create/route\"\n    },\n    resolvedPagePath: \"/Users/eliza.john/Downloads/social-network/Next + React + Typescript/app/api/post/create/route.ts\",\n    nextConfigOutput,\n    userland: _Users_eliza_john_Downloads_social_network_Next_React_Typescript_app_api_post_create_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZwb3N0JTJGY3JlYXRlJTJGcm91dGUmcGFnZT0lMkZhcGklMkZwb3N0JTJGY3JlYXRlJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGcG9zdCUyRmNyZWF0ZSUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmVsaXphLmpvaG4lMkZEb3dubG9hZHMlMkZzb2NpYWwtbmV0d29yayUyRk5leHQlMjAlMkIlMjBSZWFjdCUyMCUyQiUyMFR5cGVzY3JpcHQlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRlVzZXJzJTJGZWxpemEuam9obiUyRkRvd25sb2FkcyUyRnNvY2lhbC1uZXR3b3JrJTJGTmV4dCUyMCUyQiUyMFJlYWN0JTIwJTJCJTIwVHlwZXNjcmlwdCZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDaUQ7QUFDOUg7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9Vc2Vycy9lbGl6YS5qb2huL0Rvd25sb2Fkcy9zb2NpYWwtbmV0d29yay9OZXh0ICsgUmVhY3QgKyBUeXBlc2NyaXB0L2FwcC9hcGkvcG9zdC9jcmVhdGUvcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL3Bvc3QvY3JlYXRlL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvcG9zdC9jcmVhdGVcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL3Bvc3QvY3JlYXRlL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL1VzZXJzL2VsaXphLmpvaG4vRG93bmxvYWRzL3NvY2lhbC1uZXR3b3JrL05leHQgKyBSZWFjdCArIFR5cGVzY3JpcHQvYXBwL2FwaS9wb3N0L2NyZWF0ZS9yb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fpost%2Fcreate%2Froute&page=%2Fapi%2Fpost%2Fcreate%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fpost%2Fcreate%2Froute.ts&appDir=%2FUsers%2Feliza.john%2FDownloads%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Feliza.john%2FDownloads%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fpost%2Fcreate%2Froute&page=%2Fapi%2Fpost%2Fcreate%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fpost%2Fcreate%2Froute.ts&appDir=%2FUsers%2Feliza.john%2FDownloads%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Feliza.john%2FDownloads%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();