import { paginateResults } from "../utils";

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.
const books = [
  {
    title: "Harry Potter and the Chamber of Secrets",
    author: "J.K. Rowling"
  },
  {
    title: "Jurassic Park",
    author: "Michael Crichton"
  }
];

// Resolvers define the technique for fetching the types in the
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
    launches: async (_, { pageSize = 20, after }, { dataSources }) => {
      const allLaunches = await dataSources.launchAPI.getAllLaunches();
      // we want these in reverse chronological order
      allLaunches.reverse();
      const launches = paginateResults({
        after,
        pageSize,
        results: allLaunches
      });
      return {
        launches,
        cursor: launches.length ? launches[launches.length - 1].cursor : null,
        // if the cursor of the end of the paginated results is the same as the
        // last item in _all_ results, then there are no more results after this
        hasMore: launches.length
          ? launches[launches.length - 1].cursor !==
            allLaunches[allLaunches.length - 1].cursor
          : false
      };
    },
    launch: (_, { id }, { dataSources }) =>
      dataSources.launchAPI.getLaunchById({ launchId: id }),
    launchesById: (_, { launchIds }, { dataSources }) =>
      dataSources.launchAPI.getLaunchesByIds({ launchIds }),
    me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser()
  },
  Mutation: {
    login: async (_, { email }, { dataSources }) => {
      const user = await dataSources.userAPI.findOrCreateUser({ email });
      if (user) return Buffer.from(email).toString("base64");
    },
    bookTrips: async (_, { launchIds }, { dataSources }) => {
      const results = await dataSources.userAPI.bookTrips({ launchIds });
      const launches = await dataSources.launchAPI.getLaunchesByIds({
        launchIds
      });

      return {
        success: results && results.length === launchIds.length,
        message:
          results.length === launchIds.length
            ? "trips booked successfully"
            : `the following launches couldn't be booked: ${launchIds.filter(
                id => !results.includes(id)
              )}`,
        launches
      };
    },
    cancelTrip: async (_, { launchId }, { dataSources }) => {
      const result = await dataSources.userAPI.cancelTrip({ launchId });

      if (!result)
        return {
          success: false,
          message: "failed to cancel trip"
        };

      const launch = await dataSources.launchAPI.getLaunchById({ launchId });
      return {
        success: true,
        message: "trip cancelled",
        launches: [launch]
      };
    }
  },
  Mission: {
    // make sure the default size is 'large' in case user doesn't specify
    missionPatch: (mission, { size } = { size: "LARGE" }) => {
      return size === "SMALL"
        ? mission.missionPatchSmall
        : mission.missionPatchLarge;
    }
  },
  // Нахрена нам нужно это ??? зачем  отдельный блок
  Launch: {
    isBooked: async (launch, _, { dataSources }) =>
      dataSources.userAPI.isBookedOnLaunch({ launchId: launch.id })
  },
  // Нахрена нам нужно это ??? зачем  отдельный блок
  User: {
    trips: async (_, __, { dataSources }) => {
      // get ids of launches by user
      const launchIds = await dataSources.userAPI.getLaunchIdsByUser();

      if (!launchIds.length) return [];

      // look up those launches by their ids
      return (
        dataSources.launchAPI.getLaunchesByIds({
          launchIds
        }) || []
      );
    }
  }
};

export { resolvers };
