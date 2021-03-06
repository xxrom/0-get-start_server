import { RESTDataSource } from "apollo-datasource-rest";

class LaunchAPI extends RESTDataSource {
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
    return Array.isArray(response)
      ? response.map(launch => this.launchReducer(launch))
      : [];
  }

  // Convert response data from server to our graphQL schema format
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
  async getLaunchById({ launchId }) {
    const response = await this.get("launches", { flight_number: launchId });
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
  getLaunchesByIds({ launchIds }) {
    return Promise.all(
      launchIds.map(launchId => this.getLaunchById({ launchId }))
    );
  }
}

export { LaunchAPI };
