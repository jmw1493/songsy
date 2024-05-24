/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getSong = /* GraphQL */ `
  query GetSong($id: ID!) {
    getSong(id: $id) {
      coverArtUrl
      createdAt
      id
      owner
      songUrl
      title
      updatedAt
      __typename
    }
  }
`;
export const listSongs = /* GraphQL */ `
  query ListSongs(
    $filter: ModelSongFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSongs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        coverArtUrl
        createdAt
        id
        owner
        songUrl
        title
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
