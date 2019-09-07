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
    launches: (_, __, { dataSources }) =>
      dataSources.launchAPI.getAllLaunches(),
    launch: (_, { id }, { dataSources }) =>
      dataSources.launchAPI.getLaunchById({ launchId: id }),
    launchesById: (_, { launchIds }, { dataSources }) =>
      dataSources.launchAPI.getLaunchesByIds({ launchIds }),
    me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser()
  }
};

export { resolvers };
