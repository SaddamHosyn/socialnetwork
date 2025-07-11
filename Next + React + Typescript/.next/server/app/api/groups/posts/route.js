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
exports.id = "app/api/groups/posts/route";
exports.ids = ["app/api/groups/posts/route"];
exports.modules = {

/***/ "(rsc)/./app/api/groups/posts/route.ts":
/*!***************************************!*\
  !*** ./app/api/groups/posts/route.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST),\n/* harmony export */   dynamic: () => (/* binding */ dynamic)\n/* harmony export */ });\nconst dynamic = \"force-dynamic\";\nasync function GET(req) {\n    const { searchParams } = new URL(req.url);\n    const groupId = searchParams.get(\"group_id\");\n    const limit = searchParams.get(\"limit\") || \"20\";\n    const offset = searchParams.get(\"offset\") || \"0\";\n    const cookie = req.headers.get(\"cookie\");\n    const res = await fetch(`http://localhost:8080/api/groups/posts?group_id=${groupId}&limit=${limit}&offset=${offset}`, {\n        method: \"GET\",\n        headers: {\n            Cookie: cookie || \"\"\n        },\n        cache: \"no-store\"\n    });\n    return res;\n}\nasync function POST(req) {\n    const cookie = req.headers.get(\"cookie\");\n    const body = await req.text();\n    const res = await fetch(\"http://localhost:8080/api/groups/posts/create\", {\n        method: \"POST\",\n        headers: {\n            \"Content-Type\": \"application/x-www-form-urlencoded\",\n            Cookie: cookie || \"\"\n        },\n        body: body,\n        cache: \"no-store\"\n    });\n    return res;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2dyb3Vwcy9wb3N0cy9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFFTyxNQUFNQSxVQUFVLGdCQUFnQjtBQUVoQyxlQUFlQyxJQUFJQyxHQUFnQjtJQUN4QyxNQUFNLEVBQUVDLFlBQVksRUFBRSxHQUFHLElBQUlDLElBQUlGLElBQUlHLEdBQUc7SUFDeEMsTUFBTUMsVUFBVUgsYUFBYUksR0FBRyxDQUFDO0lBQ2pDLE1BQU1DLFFBQVFMLGFBQWFJLEdBQUcsQ0FBQyxZQUFZO0lBQzNDLE1BQU1FLFNBQVNOLGFBQWFJLEdBQUcsQ0FBQyxhQUFhO0lBQzdDLE1BQU1HLFNBQVNSLElBQUlTLE9BQU8sQ0FBQ0osR0FBRyxDQUFDO0lBRS9CLE1BQU1LLE1BQU0sTUFBTUMsTUFBTSxDQUFDLGdEQUFnRCxFQUFFUCxRQUFRLE9BQU8sRUFBRUUsTUFBTSxRQUFRLEVBQUVDLFFBQVEsRUFBRTtRQUNwSEssUUFBUTtRQUNSSCxTQUFTO1lBQ1BJLFFBQVFMLFVBQVU7UUFDcEI7UUFDQU0sT0FBTztJQUNUO0lBRUEsT0FBT0o7QUFDVDtBQUVPLGVBQWVLLEtBQUtmLEdBQWdCO0lBQ3pDLE1BQU1RLFNBQVNSLElBQUlTLE9BQU8sQ0FBQ0osR0FBRyxDQUFDO0lBQy9CLE1BQU1XLE9BQU8sTUFBTWhCLElBQUlpQixJQUFJO0lBRTNCLE1BQU1QLE1BQU0sTUFBTUMsTUFBTSxpREFBaUQ7UUFDdkVDLFFBQVE7UUFDUkgsU0FBUztZQUNQLGdCQUFnQjtZQUNoQkksUUFBUUwsVUFBVTtRQUNwQjtRQUNBUSxNQUFNQTtRQUNORixPQUFPO0lBQ1Q7SUFFQSxPQUFPSjtBQUNUIiwic291cmNlcyI6WyIvVXNlcnMvZWxpemEuam9obi9Eb3dubG9hZHMvc29jaWFsLW5ldHdvcmsvTmV4dCArIFJlYWN0ICsgVHlwZXNjcmlwdC9hcHAvYXBpL2dyb3Vwcy9wb3N0cy9yb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB0eXBlIE5leHRSZXF1ZXN0IH0gZnJvbSBcIm5leHQvc2VydmVyXCI7XG5cbmV4cG9ydCBjb25zdCBkeW5hbWljID0gXCJmb3JjZS1keW5hbWljXCI7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQocmVxOiBOZXh0UmVxdWVzdCkge1xuICBjb25zdCB7IHNlYXJjaFBhcmFtcyB9ID0gbmV3IFVSTChyZXEudXJsKTtcbiAgY29uc3QgZ3JvdXBJZCA9IHNlYXJjaFBhcmFtcy5nZXQoXCJncm91cF9pZFwiKTtcbiAgY29uc3QgbGltaXQgPSBzZWFyY2hQYXJhbXMuZ2V0KFwibGltaXRcIikgfHwgXCIyMFwiO1xuICBjb25zdCBvZmZzZXQgPSBzZWFyY2hQYXJhbXMuZ2V0KFwib2Zmc2V0XCIpIHx8IFwiMFwiO1xuICBjb25zdCBjb29raWUgPSByZXEuaGVhZGVycy5nZXQoXCJjb29raWVcIik7XG5cbiAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goYGh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hcGkvZ3JvdXBzL3Bvc3RzP2dyb3VwX2lkPSR7Z3JvdXBJZH0mbGltaXQ9JHtsaW1pdH0mb2Zmc2V0PSR7b2Zmc2V0fWAsIHtcbiAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgaGVhZGVyczoge1xuICAgICAgQ29va2llOiBjb29raWUgfHwgXCJcIixcbiAgICB9LFxuICAgIGNhY2hlOiBcIm5vLXN0b3JlXCIsXG4gIH0pO1xuXG4gIHJldHVybiByZXM7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcTogTmV4dFJlcXVlc3QpIHtcbiAgY29uc3QgY29va2llID0gcmVxLmhlYWRlcnMuZ2V0KFwiY29va2llXCIpO1xuICBjb25zdCBib2R5ID0gYXdhaXQgcmVxLnRleHQoKTtcblxuICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hcGkvZ3JvdXBzL3Bvc3RzL2NyZWF0ZVwiLCB7XG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBoZWFkZXJzOiB7XG4gICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiLFxuICAgICAgQ29va2llOiBjb29raWUgfHwgXCJcIixcbiAgICB9LFxuICAgIGJvZHk6IGJvZHksXG4gICAgY2FjaGU6IFwibm8tc3RvcmVcIixcbiAgfSk7XG5cbiAgcmV0dXJuIHJlcztcbn0iXSwibmFtZXMiOlsiZHluYW1pYyIsIkdFVCIsInJlcSIsInNlYXJjaFBhcmFtcyIsIlVSTCIsInVybCIsImdyb3VwSWQiLCJnZXQiLCJsaW1pdCIsIm9mZnNldCIsImNvb2tpZSIsImhlYWRlcnMiLCJyZXMiLCJmZXRjaCIsIm1ldGhvZCIsIkNvb2tpZSIsImNhY2hlIiwiUE9TVCIsImJvZHkiLCJ0ZXh0Il0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/groups/posts/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fgroups%2Fposts%2Froute&page=%2Fapi%2Fgroups%2Fposts%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fgroups%2Fposts%2Froute.ts&appDir=%2FUsers%2Feliza.john%2FDownloads%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Feliza.john%2FDownloads%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fgroups%2Fposts%2Froute&page=%2Fapi%2Fgroups%2Fposts%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fgroups%2Fposts%2Froute.ts&appDir=%2FUsers%2Feliza.john%2FDownloads%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Feliza.john%2FDownloads%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_eliza_john_Downloads_social_network_Next_React_Typescript_app_api_groups_posts_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/groups/posts/route.ts */ \"(rsc)/./app/api/groups/posts/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/groups/posts/route\",\n        pathname: \"/api/groups/posts\",\n        filename: \"route\",\n        bundlePath: \"app/api/groups/posts/route\"\n    },\n    resolvedPagePath: \"/Users/eliza.john/Downloads/social-network/Next + React + Typescript/app/api/groups/posts/route.ts\",\n    nextConfigOutput,\n    userland: _Users_eliza_john_Downloads_social_network_Next_React_Typescript_app_api_groups_posts_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZncm91cHMlMkZwb3N0cyUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGZ3JvdXBzJTJGcG9zdHMlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZncm91cHMlMkZwb3N0cyUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmVsaXphLmpvaG4lMkZEb3dubG9hZHMlMkZzb2NpYWwtbmV0d29yayUyRk5leHQlMjAlMkIlMjBSZWFjdCUyMCUyQiUyMFR5cGVzY3JpcHQlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRlVzZXJzJTJGZWxpemEuam9obiUyRkRvd25sb2FkcyUyRnNvY2lhbC1uZXR3b3JrJTJGTmV4dCUyMCUyQiUyMFJlYWN0JTIwJTJCJTIwVHlwZXNjcmlwdCZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDa0Q7QUFDL0g7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9Vc2Vycy9lbGl6YS5qb2huL0Rvd25sb2Fkcy9zb2NpYWwtbmV0d29yay9OZXh0ICsgUmVhY3QgKyBUeXBlc2NyaXB0L2FwcC9hcGkvZ3JvdXBzL3Bvc3RzL3JvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9ncm91cHMvcG9zdHMvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9ncm91cHMvcG9zdHNcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2dyb3Vwcy9wb3N0cy9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIi9Vc2Vycy9lbGl6YS5qb2huL0Rvd25sb2Fkcy9zb2NpYWwtbmV0d29yay9OZXh0ICsgUmVhY3QgKyBUeXBlc2NyaXB0L2FwcC9hcGkvZ3JvdXBzL3Bvc3RzL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fgroups%2Fposts%2Froute&page=%2Fapi%2Fgroups%2Fposts%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fgroups%2Fposts%2Froute.ts&appDir=%2FUsers%2Feliza.john%2FDownloads%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Feliza.john%2FDownloads%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fgroups%2Fposts%2Froute&page=%2Fapi%2Fgroups%2Fposts%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fgroups%2Fposts%2Froute.ts&appDir=%2FUsers%2Feliza.john%2FDownloads%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Feliza.john%2FDownloads%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();