// Orders created should not be completely filled, i.e. amountSent < amountGive || amountReceived < amountGet
// expiryTime should be in future, i.e expiryTime > current_Timestamp in UTC.

import { ApolloClient, InMemoryCache, gql, cache } from '@apollo/client';
import BigNumber from 'bignumber.js';
export async function fetchProjectID(tokenAddress, wrappedURL) {

  const client = new ApolloClient({
    uri: wrappedURL,
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
    let id = "";
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
export const fetchProjectDetails = async (tokenAddress, masterURL) => {
  let listedTokens = [];
  const client = new ApolloClient({
    uri: masterURL,
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
    console.log(data,"projectdata");
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
