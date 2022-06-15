import { ApolloClient, InMemoryCache, gql, cache } from "@apollo/client";
async function fetchOrderTokens(exchangeURL, masterURL, wrappedURL) {
  console.log("fetchOrderTokens--excahngeURL", exchangeURL);
  const client = new ApolloClient({
    uri: exchangeURL,
    cache: new InMemoryCache(),
  });

  const query = `query {
            orders {
                tokenGive
                tokenGiveTicker
            }         
    }`;
  try {
    console.log("fetchOrderTokens--query", query, client);
    const { data } = await client?.query({
      query: gql(query),
    });
    let derivatives = [];
    data.orders.map((order) => {
      derivatives.push(order.tokenGive);
    });
    return derivatives.map((s) => `"${s}"`).join(", ");
  } catch (error) {
    console.log(error);
  }
}

async function fetchProjectIDForDerivatives(
  derivatives,
  exchangeURL,
  masterURL,
  wrappedURL
) {
  const client = new ApolloClient({
    uri: wrappedURL,
    cache: new InMemoryCache(),
  });

  const query = `query {
            projects {
                id
                projectTokenAddress
                projectTokenTicker
                projectTokenDecimal
                derivatives (where: {id_in: [${derivatives}]}){
                  id
                  wrappedTokenTicker
                }
            }         
        }`;
  try {
    const { data } = await client.query({
      query: gql(query),
    });
    let projectIDs = [];
    data.projects.map((project) => {
      if (project.derivatives.length > 0) {
        projectIDs.push(project.id);
      }
    });
    return projectIDs.map((s) => `"${s}"`).join(", ");
  } catch (error) {
    console.log(error);
  }
}

export const fetchAllProjectData = async (
  exchangeURL,
  masterURL,
  wrappedURL
) => {
  let _project = [];
  let derivatives = await fetchOrderTokens(exchangeURL, masterURL, wrappedURL);
  let projects = await fetchProjectIDForDerivatives(
    derivatives,
    exchangeURL,
    masterURL,
    wrappedURL
  );

  const client = new ApolloClient({
    uri: masterURL,
    cache: new InMemoryCache(),
  });

  const query = `query {
        projects (where: {id_in: [${projects}]}) {
            id
            projectName
            projectTokenAddress
            projectTokenTicker
            projectDocHash
        }
    }`;

  try {
    const { data } = await client.query({
      query: gql(query),
    });

    data.projects.map((project) => {
      let projectData = {};
      projectData.id = project.id;
      projectData.tokenAddress = project.projectTokenAddress;
      projectData.tokenTicker = project.projectTokenTicker;
      projectData.projectName = project.projectName;
      _project.push(projectData);
    });
  } catch (error) {
    console.log(error);
  }
  return _project;
};
