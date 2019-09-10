require('source-map-support/register');
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/datasources/launch.js":
/*!***********************************!*\
  !*** ./src/datasources/launch.js ***!
  \***********************************/
/*! exports provided: LaunchAPI */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LaunchAPI", function() { return LaunchAPI; });
/* harmony import */ var apollo_datasource_rest__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! apollo-datasource-rest */ "apollo-datasource-rest");
/* harmony import */ var apollo_datasource_rest__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(apollo_datasource_rest__WEBPACK_IMPORTED_MODULE_0__);


class LaunchAPI extends apollo_datasource_rest__WEBPACK_IMPORTED_MODULE_0__["RESTDataSource"] {
  constructor() {
    super();
    this.baseURL = "https://api.spacexdata.com/v2/";
  }
  /* // without pagination
  query GetLaunchByIds {
    launches {
      id
      site
      mission {
        name
      }
      rocket {
        name
      }
    }
  }
  */

  /* // with pagination
    query GetLaunchesPagination {
      launches (pageSize: 3
        //, after: "1561433400" // optional parameter
        ) {
        cursor
        hasMore
        launches {
          id
          mission{
            name
          }
        }
      }
    }
  */


  async getAllLaunches() {
    // Get from 'this.baseURL' + 'launches'
    const response = await this.get("launches");
    return Array.isArray(response) ? response.map(launch => this.launchReducer(launch)) : [];
  } // Convert response data from server to our graphQL schema format


  launchReducer(launch) {
    return {
      id: launch.flight_number || 0,
      cursor: `${launch.launch_date_unix}`,
      site: launch.launch_site && launch.launch_site.site_name,
      mission: {
        name: launch.mission_name,
        missionPatchSmall: launch.links.mission_patch_small,
        missionPatchLarge: launch.links.mission_patch
      },
      rocket: {
        id: launch.rocket.rocket_id,
        name: launch.rocket.rocket_name,
        type: launch.rocket.rocket_type
      }
    };
  }
  /*
  query GetLaunchById {
    launch(id: 60) {
      id
      site
      mission {
        name
      }
      rocket {
        id
        type
      }
    }
  }
  */


  async getLaunchById({
    launchId
  }) {
    const response = await this.get("launches", {
      flight_number: launchId
    });
    return this.launchReducer(response[0]);
  }
  /*
  query GetLaunchByIds {
    launchesById(launchIds: [1,2,60]) {
      id
      site
      mission {
        name
      }
      rocket {
        name
      }
    }
  }
  */


  getLaunchesByIds({
    launchIds
  }) {
    return Promise.all(launchIds.map(launchId => this.getLaunchById({
      launchId
    })));
  }

}



/***/ }),

/***/ "./src/datasources/user.js":
/*!*********************************!*\
  !*** ./src/datasources/user.js ***!
  \*********************************/
/*! exports provided: UserAPI */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserAPI", function() { return UserAPI; });
/* harmony import */ var apollo_datasource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! apollo-datasource */ "apollo-datasource");
/* harmony import */ var apollo_datasource__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(apollo_datasource__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var isemail__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! isemail */ "isemail");
/* harmony import */ var isemail__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(isemail__WEBPACK_IMPORTED_MODULE_1__);



class UserAPI extends apollo_datasource__WEBPACK_IMPORTED_MODULE_0__["DataSource"] {
  constructor({
    store
  }) {
    super();
    this.store = store;
    console.log("this.store", this.store);
  }
  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */


  initialize(config) {
    this.context = config.context;
  }
  /**
   * User can be called with an argument that includes email, but it doesn't
   * have to be. If the user is already on the context, it will use that user
   * instead
   */


  async findOrCreateUser({
    email: emailArg
  } = {}) {
    console.log("findOrCreateUser");
    const email = this.context && this.context.user ? this.context.user.email : emailArg;
    console.log("findOrCreateUser", email);
    if (!email || !isemail__WEBPACK_IMPORTED_MODULE_1___default.a.validate(email)) return null;
    console.log("findOrCreateUser 2");
    const users = await this.store.users.findOrCreate({
      where: {
        email
      }
    });
    console.log("findOrCreateUser", users);
    return users && users[0] ? users[0] : null;
  }

  async bookTrips({
    launchIds
  }) {
    const userId = this.context.user.id;
    if (!userId) return;
    let results = []; // for each launch id, try to book the trip and add it to the results array
    // if successful

    for (const launchId of launchIds) {
      const res = await this.bookTrip({
        launchId
      });
      if (res) results.push(res);
    }

    return results;
  }

  async bookTrip({
    launchId
  }) {
    const userId = this.context.user.id;
    const res = await this.store.trips.findOrCreate({
      where: {
        userId,
        launchId
      }
    });
    return res && res.length ? res[0].get() : false;
  }

  async cancelTrip({
    launchId
  }) {
    const userId = this.context.user.id;
    return !!this.store.trips.destroy({
      where: {
        userId,
        launchId
      }
    });
  }

  async getLaunchIdsByUser() {
    const userId = this.context.user.id;
    const found = await this.store.trips.findAll({
      where: {
        userId
      }
    });
    return found && found.length ? found.map(l => l.dataValues.launchId).filter(l => !!l) : [];
  }

  async isBookedOnLaunch({
    launchId
  }) {
    if (!this.context || !this.context.user) return false;
    const userId = this.context.user.id;
    const found = await this.store.trips.findAll({
      where: {
        userId,
        launchId
      }
    });
    return found && found.length > 0;
  }

}



/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var apollo_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! apollo-server */ "apollo-server");
/* harmony import */ var apollo_server__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(apollo_server__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var isemail__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! isemail */ "isemail");
/* harmony import */ var isemail__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(isemail__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/utils.js");
/* harmony import */ var _schema__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./schema */ "./src/schema.js");
/* harmony import */ var _resolvers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./resolvers */ "./src/resolvers/index.js");
/* harmony import */ var _datasources_launch__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./datasources/launch */ "./src/datasources/launch.js");
/* harmony import */ var _datasources_user__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./datasources/user */ "./src/datasources/user.js");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }








const store = Object(_utils__WEBPACK_IMPORTED_MODULE_2__["createStore"])(); // In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.

const server = new apollo_server__WEBPACK_IMPORTED_MODULE_0__["ApolloServer"]({
  typeDefs: _schema__WEBPACK_IMPORTED_MODULE_3__["typeDefs"],
  resolvers: _resolvers__WEBPACK_IMPORTED_MODULE_4__["resolvers"],
  dataSources: () => ({
    launchAPI: new _datasources_launch__WEBPACK_IMPORTED_MODULE_5__["LaunchAPI"](),
    userAPI: new _datasources_user__WEBPACK_IMPORTED_MODULE_6__["UserAPI"]({
      store
    })
  }),
  context: async ({
    req
  }) => {
    // simple auth check on every request
    const auth = req.headers && req.headers.authorization || "";
    const email = Buffer.from(auth, "base64").toString("ascii"); // if the email isn't formatted validly, return null for user

    if (!isemail__WEBPACK_IMPORTED_MODULE_1___default.a.validate(email)) return {
      user: null
    }; // find a user by their email

    const users = await store.users.findOrCreate({
      where: {
        email
      }
    });
    const user = users && users[0] ? users[0] : null;
    return {
      user: _objectSpread({}, user.dataValues)
    };
  }
}); // This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.

server.listen().then(({
  url
}) => {
  console.log(`🚀  Server ready at ${url}`);
});

/***/ }),

/***/ "./src/resolvers/index.js":
/*!********************************!*\
  !*** ./src/resolvers/index.js ***!
  \********************************/
/*! exports provided: resolvers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resolvers", function() { return resolvers; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./src/utils.js");
 // This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.

const books = [{
  title: "Harry Potter and the Chamber of Secrets",
  author: "J.K. Rowling"
}, {
  title: "Jurassic Park",
  author: "Michael Crichton"
}]; // Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.

const resolvers = {
  Query: {
    // books: (_, __, { dataSources }) => dataSources.booksAPI.getAllLaunches(),
    // books: () => books
    // launches: (_, __, { dataSources }) =>  // Old one without pagination (which could be done)
    //   dataSources.launchAPI.getAllLaunches(),

    /**
     * pageSize - размер блока с данными, after - начало отсчета?
     * query GetLaunches {
     * launches(pageSize: 3) {
     *   launches {
     *       id
     *       mission {
     *         name
     *       }
     *     }
     *   }
     * }
     */
    launches: async (_, {
      pageSize = 20,
      after
    }, {
      dataSources
    }) => {
      const allLaunches = await dataSources.launchAPI.getAllLaunches(); // we want these in reverse chronological order

      allLaunches.reverse();
      const launches = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["paginateResults"])({
        after,
        pageSize,
        results: allLaunches
      });
      return {
        launches,
        cursor: launches.length ? launches[launches.length - 1].cursor : null,
        // if the cursor of the end of the paginated results is the same as the
        // last item in _all_ results, then there are no more results after this
        hasMore: launches.length ? launches[launches.length - 1].cursor !== allLaunches[allLaunches.length - 1].cursor : false
      };
    },
    launch: (_, {
      id
    }, {
      dataSources
    }) => dataSources.launchAPI.getLaunchById({
      launchId: id
    }),
    launchesById: (_, {
      launchIds
    }, {
      dataSources
    }) => dataSources.launchAPI.getLaunchesByIds({
      launchIds
    }),
    me: (_, __, {
      dataSources
    }) => dataSources.userAPI.findOrCreateUser()
  },
  Mutation: {
    login: async (_, {
      email
    }, {
      dataSources
    }) => {
      const user = await dataSources.userAPI.findOrCreateUser({
        email
      });
      if (user) return Buffer.from(email).toString("base64");
    },
    bookTrips: async (_, {
      launchIds
    }, {
      dataSources
    }) => {
      const results = await dataSources.userAPI.bookTrips({
        launchIds
      });
      const launches = await dataSources.launchAPI.getLaunchesByIds({
        launchIds
      });
      return {
        success: results && results.length === launchIds.length,
        message: results.length === launchIds.length ? "trips booked successfully" : `the following launches couldn't be booked: ${launchIds.filter(id => !results.includes(id))}`,
        launches
      };
    },
    cancelTrip: async (_, {
      launchId
    }, {
      dataSources
    }) => {
      const result = await dataSources.userAPI.cancelTrip({
        launchId
      });
      if (!result) return {
        success: false,
        message: "failed to cancel trip"
      };
      const launch = await dataSources.launchAPI.getLaunchById({
        launchId
      });
      return {
        success: true,
        message: "trip cancelled",
        launches: [launch]
      };
    }
  },
  Mission: {
    // make sure the default size is 'large' in case user doesn't specify
    missionPatch: (mission, {
      size
    } = {
      size: "LARGE"
    }) => {
      return size === "SMALL" ? mission.missionPatchSmall : mission.missionPatchLarge;
    }
  },
  // Нахрена нам нужно это ??? зачем  отдельный блок
  Launch: {
    isBooked: async (launch, _, {
      dataSources
    }) => dataSources.userAPI.isBookedOnLaunch({
      launchId: launch.id
    })
  },
  // Нахрена нам нужно это ??? зачем  отдельный блок
  User: {
    trips: async (_, __, {
      dataSources
    }) => {
      // get ids of launches by user
      const launchIds = await dataSources.userAPI.getLaunchIdsByUser();
      if (!launchIds.length) return []; // look up those launches by their ids

      return dataSources.launchAPI.getLaunchesByIds({
        launchIds
      }) || [];
    }
  }
};


/***/ }),

/***/ "./src/schema.js":
/*!***********************!*\
  !*** ./src/schema.js ***!
  \***********************/
/*! exports provided: typeDefs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "typeDefs", function() { return typeDefs; });
/* harmony import */ var apollo_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! apollo-server */ "apollo-server");
/* harmony import */ var apollo_server__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(apollo_server__WEBPACK_IMPORTED_MODULE_0__);
 // Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.

const typeDefs = apollo_server__WEBPACK_IMPORTED_MODULE_0__["gql"]`
  ### Apollo Tutorial (Build a schema)
  # This "Book" type can be used in other type declarations.
  type Book {
    title: String
    author: String
  }

  type Rocket {
    id: ID!
    name: String
    type: String
  }

  type User {
    id: ID!
    email: String!
    trips: [Launch]!
  }

  type Mission {
    name: String
    # missionPatch(size: PatchSize): String
    missionPatch(mission: String, size: PatchSize): String
  }

  type TripUpdateResponse {
    success: Boolean!
    message: String
    launches: [Launch]
  }

  enum PatchSize {
    SMALL
    LARGE
  }

  type Launch {
    id: ID!
    site: String
    mission: Mission
    rocket: Rocket
    isBooked: Boolean!
  }

  """
  Simple wrapper around our list of launches that contains a cursor to the
  last item in the list. Pass this cursor to the launches query to fetch results
  after these.
  """
  type LaunchConnection { # add this below the Query type as an additional type.
    cursor: String!
    hasMore: Boolean!
    launches: [Launch]!
  }

  ### QUERY
  type Query {
    books: [Book]
    ### ---
    launches( # replace the current launches query with this one.
      """
      The number of results to show. Must be >= 1. Default = 20
      """
      pageSize: Int
      """
      If you add a cursor here, it will only return results _after_ this cursor
      Optional, get from answer in cursor string data (in launches query)
      """
      after: String
    ): LaunchConnection!
    launch(id: ID!): Launch
    launchesById(launchIds: [ID!]): [Launch]
    # Queries for the current user
    me: User
  }

  ### MUTATION
  type Mutation {
    # if false, booking trips failed -- check errors
    bookTrips(launchIds: [ID]!): TripUpdateResponse!

    # if false, cancellation failed -- check errors
    cancelTrip(launchId: ID!): TripUpdateResponse!

    login(email: String): String # login token
  }
`;


/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/*! exports provided: createStore, paginateResults */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createStore", function() { return createStore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "paginateResults", function() { return paginateResults; });
/* harmony import */ var sequelize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sequelize */ "sequelize");
/* harmony import */ var sequelize__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sequelize__WEBPACK_IMPORTED_MODULE_0__);


const paginateResults = ({
  after: cursor,
  pageSize = 20,
  results,
  // can pass in a function to calculate an item's cursor
  getCursor = () => null
}) => {
  if (pageSize < 1) return [];
  if (!cursor) return results.slice(0, pageSize);
  const cursorIndex = results.findIndex(item => {
    // if an item has a `cursor` on it, use that, otherwise try to generate one
    let itemCursor = item.cursor ? item.cursor : getCursor(item); // if there's still not a cursor, return false by default

    return itemCursor ? cursor === itemCursor : false;
  });
  return cursorIndex >= 0 ? cursorIndex === results.length - 1 // don't let us overflow
  ? [] : results.slice(cursorIndex + 1, Math.min(results.length, cursorIndex + 1 + pageSize)) : results.slice(0, pageSize);
};

const createStore = () => {
  const Op = sequelize__WEBPACK_IMPORTED_MODULE_0___default.a.Op;
  const operatorsAliases = {
    $in: Op.in
  };
  const db = new sequelize__WEBPACK_IMPORTED_MODULE_0___default.a("database", "username", "password", {
    dialect: "sqlite",
    storage: "./store.sqlite",
    operatorsAliases,
    logging: false
  });
  const users = db.define("user", {
    id: {
      type: sequelize__WEBPACK_IMPORTED_MODULE_0___default.a.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    createdAt: sequelize__WEBPACK_IMPORTED_MODULE_0___default.a.DATE,
    updatedAt: sequelize__WEBPACK_IMPORTED_MODULE_0___default.a.DATE,
    email: sequelize__WEBPACK_IMPORTED_MODULE_0___default.a.STRING,
    token: sequelize__WEBPACK_IMPORTED_MODULE_0___default.a.STRING
  });
  const trips = db.define("trip", {
    id: {
      type: sequelize__WEBPACK_IMPORTED_MODULE_0___default.a.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    createdAt: sequelize__WEBPACK_IMPORTED_MODULE_0___default.a.DATE,
    updatedAt: sequelize__WEBPACK_IMPORTED_MODULE_0___default.a.DATE,
    launchId: sequelize__WEBPACK_IMPORTED_MODULE_0___default.a.INTEGER,
    userId: sequelize__WEBPACK_IMPORTED_MODULE_0___default.a.INTEGER
  });
  return {
    users,
    trips
  };
};



/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./src/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/nikita/js/graphql/0-get-start_server/src/index.js */"./src/index.js");


/***/ }),

/***/ "apollo-datasource":
/*!************************************!*\
  !*** external "apollo-datasource" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-datasource");

/***/ }),

/***/ "apollo-datasource-rest":
/*!*****************************************!*\
  !*** external "apollo-datasource-rest" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-datasource-rest");

/***/ }),

/***/ "apollo-server":
/*!********************************!*\
  !*** external "apollo-server" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-server");

/***/ }),

/***/ "isemail":
/*!**************************!*\
  !*** external "isemail" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("isemail");

/***/ }),

/***/ "sequelize":
/*!****************************!*\
  !*** external "sequelize" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sequelize");

/***/ })

/******/ });
//# sourceMappingURL=main.map