// Orders created should not be completely filled, i.e. amountSent < amountGive || amountReceived < amountGet
// expiryTime should be in future, i.e expiryTime > current_Timestamp in UTC.

import { ApolloClient, InMemoryCache, gql, cache } from '@apollo/client';
import BigNumber from 'bignumber.js';
const GRAPHAPIURL =
  'https://api.studio.thegraph.com/query/16341/liquid-master/v3.0.0';
const CONTROLLER_GRAPH_URL =
  'https://api.studio.thegraph.com/query/16341/liquid-original/v3.0.0';

export async function fetchProjectID(tokenAddress) {
  const client = new ApolloClient({
    uri: CONTROLLER_GRAPH_URL,
    cache: new InMemoryCache(),
  });
  const query = `query {
        projects {
          id
            projectTokenTicker
            projectTokenAddress
          derivatives (where:{id: "${tokenAddress}"}){
            id
            wrappedTokenTicker
          }
        }
      }`;
  try {
    const { data } = await client.query({
      query: gql(query),
    });
    let id = '';
    data.projects.map((project) => {
      if (project.derivatives.length > 0) {
        id = project.projectTokenAddress;
      }
    });
    return id;
  } catch (error) {
    console.log(error);
  }
}
export const fetchProjectDetails = async (tokenAddress) => {
  let listedTokens = [];
  const client = new ApolloClient({
    uri: GRAPHAPIURL,
    cache: new InMemoryCache(),
  });
  const query = `query {
    projects (where:{projectTokenAddress:"${tokenAddress}"}){
      id
      projectName
      projectTokenAddress
      projectTokenTicker
      projectDocHash
    }
  }
`;
  try {
    const { data } = await client.query({
      query: gql(query),
    });
    console.log(data.projects);
    let description = null;
    try {
      const res = await fetch(
        `https://milliondollarhomepage.mypinata.cloud/ipfs/${data.projects[0].projectDocHash}`
      );
      const desc = await res.json();
      description = desc.description;
    } catch (error) {
      console.log(error);
    }
    listedTokens = { ...data.projects[0], projectDescription: description };
  } catch (error) {
    console.log(error);
  }
  return listedTokens;
};
