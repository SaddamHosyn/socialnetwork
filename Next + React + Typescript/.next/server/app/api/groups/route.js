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
exports.id = "app/api/groups/route";
exports.ids = ["app/api/groups/route"];
exports.modules = {

/***/ "(rsc)/./app/api/groups/route.ts":
/*!*********************************!*\
  !*** ./app/api/groups/route.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST),\n/* harmony export */   dynamic: () => (/* binding */ dynamic)\n/* harmony export */ });\n// app/api/groups/route.ts\nconst dynamic = \"force-dynamic\";\nasync function GET(req) {\n    const { searchParams } = new URL(req.url);\n    const limit = searchParams.get(\"limit\") || \"20\";\n    const offset = searchParams.get(\"offset\") || \"0\";\n    const cookie = req.headers.get(\"cookie\");\n    const res = await fetch(`http://localhost:8080/api/groups?limit=${limit}&offset=${offset}`, {\n        method: \"GET\",\n        headers: {\n            Cookie: cookie || \"\"\n        },\n        cache: \"no-store\"\n    });\n    return res;\n}\nasync function POST(req) {\n    const cookie = req.headers.get(\"cookie\");\n    const body = await req.text();\n    const res = await fetch(\"http://localhost:8080/api/groups\", {\n        method: \"POST\",\n        headers: {\n            \"Content-Type\": \"application/x-www-form-urlencoded\",\n            Cookie: cookie || \"\"\n        },\n        body: body,\n        cache: \"no-store\"\n    });\n    return res;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2dyb3Vwcy9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwwQkFBMEI7QUFHbkIsTUFBTUEsVUFBVSxnQkFBZ0I7QUFFaEMsZUFBZUMsSUFBSUMsR0FBZ0I7SUFDeEMsTUFBTSxFQUFFQyxZQUFZLEVBQUUsR0FBRyxJQUFJQyxJQUFJRixJQUFJRyxHQUFHO0lBQ3hDLE1BQU1DLFFBQVFILGFBQWFJLEdBQUcsQ0FBQyxZQUFZO0lBQzNDLE1BQU1DLFNBQVNMLGFBQWFJLEdBQUcsQ0FBQyxhQUFhO0lBQzdDLE1BQU1FLFNBQVNQLElBQUlRLE9BQU8sQ0FBQ0gsR0FBRyxDQUFDO0lBRS9CLE1BQU1JLE1BQU0sTUFBTUMsTUFBTSxDQUFDLHVDQUF1QyxFQUFFTixNQUFNLFFBQVEsRUFBRUUsUUFBUSxFQUFFO1FBQzFGSyxRQUFRO1FBQ1JILFNBQVM7WUFDUEksUUFBUUwsVUFBVTtRQUNwQjtRQUNBTSxPQUFPO0lBQ1Q7SUFFQSxPQUFPSjtBQUNUO0FBRU8sZUFBZUssS0FBS2QsR0FBZ0I7SUFDekMsTUFBTU8sU0FBU1AsSUFBSVEsT0FBTyxDQUFDSCxHQUFHLENBQUM7SUFDL0IsTUFBTVUsT0FBTyxNQUFNZixJQUFJZ0IsSUFBSTtJQUUzQixNQUFNUCxNQUFNLE1BQU1DLE1BQU0sb0NBQW9DO1FBQzFEQyxRQUFRO1FBQ1JILFNBQVM7WUFDUCxnQkFBZ0I7WUFDaEJJLFFBQVFMLFVBQVU7UUFDcEI7UUFDQVEsTUFBTUE7UUFDTkYsT0FBTztJQUNUO0lBRUEsT0FBT0o7QUFDVCIsInNvdXJjZXMiOlsiL1VzZXJzL2F1bmcubWluL0Rlc2t0b3AvVGVhbXMvc29jaWFsLW5ldHdvcmsvTmV4dCArIFJlYWN0ICsgVHlwZXNjcmlwdC9hcHAvYXBpL2dyb3Vwcy9yb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBhcHAvYXBpL2dyb3Vwcy9yb3V0ZS50c1xuaW1wb3J0IHsgdHlwZSBOZXh0UmVxdWVzdCB9IGZyb20gXCJuZXh0L3NlcnZlclwiO1xuXG5leHBvcnQgY29uc3QgZHluYW1pYyA9IFwiZm9yY2UtZHluYW1pY1wiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKHJlcTogTmV4dFJlcXVlc3QpIHtcbiAgY29uc3QgeyBzZWFyY2hQYXJhbXMgfSA9IG5ldyBVUkwocmVxLnVybCk7XG4gIGNvbnN0IGxpbWl0ID0gc2VhcmNoUGFyYW1zLmdldChcImxpbWl0XCIpIHx8IFwiMjBcIjtcbiAgY29uc3Qgb2Zmc2V0ID0gc2VhcmNoUGFyYW1zLmdldChcIm9mZnNldFwiKSB8fCBcIjBcIjtcbiAgY29uc3QgY29va2llID0gcmVxLmhlYWRlcnMuZ2V0KFwiY29va2llXCIpO1xuXG4gIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjgwODAvYXBpL2dyb3Vwcz9saW1pdD0ke2xpbWl0fSZvZmZzZXQ9JHtvZmZzZXR9YCwge1xuICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICBoZWFkZXJzOiB7XG4gICAgICBDb29raWU6IGNvb2tpZSB8fCBcIlwiLFxuICAgIH0sXG4gICAgY2FjaGU6IFwibm8tc3RvcmVcIixcbiAgfSk7XG5cbiAgcmV0dXJuIHJlcztcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QocmVxOiBOZXh0UmVxdWVzdCkge1xuICBjb25zdCBjb29raWUgPSByZXEuaGVhZGVycy5nZXQoXCJjb29raWVcIik7XG4gIGNvbnN0IGJvZHkgPSBhd2FpdCByZXEudGV4dCgpO1xuXG4gIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKFwiaHR0cDovL2xvY2FsaG9zdDo4MDgwL2FwaS9ncm91cHNcIiwge1xuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgaGVhZGVyczoge1xuICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIixcbiAgICAgIENvb2tpZTogY29va2llIHx8IFwiXCIsXG4gICAgfSxcbiAgICBib2R5OiBib2R5LFxuICAgIGNhY2hlOiBcIm5vLXN0b3JlXCIsXG4gIH0pO1xuXG4gIHJldHVybiByZXM7XG59Il0sIm5hbWVzIjpbImR5bmFtaWMiLCJHRVQiLCJyZXEiLCJzZWFyY2hQYXJhbXMiLCJVUkwiLCJ1cmwiLCJsaW1pdCIsImdldCIsIm9mZnNldCIsImNvb2tpZSIsImhlYWRlcnMiLCJyZXMiLCJmZXRjaCIsIm1ldGhvZCIsIkNvb2tpZSIsImNhY2hlIiwiUE9TVCIsImJvZHkiLCJ0ZXh0Il0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/groups/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fgroups%2Froute&page=%2Fapi%2Fgroups%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fgroups%2Froute.ts&appDir=%2FUsers%2Faung.min%2FDesktop%2FTeams%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Faung.min%2FDesktop%2FTeams%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fgroups%2Froute&page=%2Fapi%2Fgroups%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fgroups%2Froute.ts&appDir=%2FUsers%2Faung.min%2FDesktop%2FTeams%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Faung.min%2FDesktop%2FTeams%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_aung_min_Desktop_Teams_social_network_Next_React_Typescript_app_api_groups_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/groups/route.ts */ \"(rsc)/./app/api/groups/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/groups/route\",\n        pathname: \"/api/groups\",\n        filename: \"route\",\n        bundlePath: \"app/api/groups/route\"\n    },\n    resolvedPagePath: \"/Users/aung.min/Desktop/Teams/social-network/Next + React + Typescript/app/api/groups/route.ts\",\n    nextConfigOutput,\n    userland: _Users_aung_min_Desktop_Teams_social_network_Next_React_Typescript_app_api_groups_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZncm91cHMlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmdyb3VwcyUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmdyb3VwcyUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmF1bmcubWluJTJGRGVza3RvcCUyRlRlYW1zJTJGc29jaWFsLW5ldHdvcmslMkZOZXh0JTIwJTJCJTIwUmVhY3QlMjAlMkIlMjBUeXBlc2NyaXB0JTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZVc2VycyUyRmF1bmcubWluJTJGRGVza3RvcCUyRlRlYW1zJTJGc29jaWFsLW5ldHdvcmslMkZOZXh0JTIwJTJCJTIwUmVhY3QlMjAlMkIlMjBUeXBlc2NyaXB0JmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUM4QztBQUMzSDtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL1VzZXJzL2F1bmcubWluL0Rlc2t0b3AvVGVhbXMvc29jaWFsLW5ldHdvcmsvTmV4dCArIFJlYWN0ICsgVHlwZXNjcmlwdC9hcHAvYXBpL2dyb3Vwcy9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvZ3JvdXBzL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvZ3JvdXBzXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9ncm91cHMvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvVXNlcnMvYXVuZy5taW4vRGVza3RvcC9UZWFtcy9zb2NpYWwtbmV0d29yay9OZXh0ICsgUmVhY3QgKyBUeXBlc2NyaXB0L2FwcC9hcGkvZ3JvdXBzL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fgroups%2Froute&page=%2Fapi%2Fgroups%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fgroups%2Froute.ts&appDir=%2FUsers%2Faung.min%2FDesktop%2FTeams%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Faung.min%2FDesktop%2FTeams%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fgroups%2Froute&page=%2Fapi%2Fgroups%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fgroups%2Froute.ts&appDir=%2FUsers%2Faung.min%2FDesktop%2FTeams%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Faung.min%2FDesktop%2FTeams%2Fsocial-network%2FNext%20%2B%20React%20%2B%20Typescript&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();