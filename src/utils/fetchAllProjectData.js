import { ApolloClient, InMemoryCache, gql, cache } from "@apollo/client";
import BigNumber from "bignumber.js";
const GRAPHAPIURL =
  "https://api.studio.thegraph.com/query/16341/liquid-master/v3.0.0";
const CONTROLLER_GRAPH_URL =
  "https://api.studio.thegraph.com/query/16341/liquid-original/v3.0.0";
const EXCHANGE_GRAPH_URL =
  "https://api.studio.thegraph.com/query/16341/exchange/v0.1.3";

async function fetchOrderTokens() {
  const client = new ApolloClient({
    uri: EXCHANGE_GRAPH_URL,
    cache: new InMemoryCache(),
  });

  const query = `query {
            orders {
                tokenGive
                tokenGiveTicker
            }         
    }`;
  try {
    const { data } = await client.query({
      query: gql(query),
    });
    let derivatives = [];
    data.orders.map((order) => {
      derivatives.push(order.tokenGive);
    });
    console.log(derivatives);
    return derivatives.map((s) => `"${s}"`).join(", ");
  } catch (error) {
    console.log(error);
  }
}

async function fetchProjectIDForDerivatives(derivatives) {
  const client = new ApolloClient({
    uri: CONTROLLER_GRAPH_URL,
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

export const fetchAllProjectData = async () => {
  let _project = [];
  let derivatives = await fetchOrderTokens();
  console.log("DerivativesIDs", derivatives);
  let projects = await fetchProjectIDForDerivatives(derivatives);
  console.log("ProjectIDs", projects);

  const client = new ApolloClient({
    uri: GRAPHAPIURL,
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
