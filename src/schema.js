import { gql } from "apollo-server";

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
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

export { typeDefs };
