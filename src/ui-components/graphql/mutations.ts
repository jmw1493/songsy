/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createSong = /* GraphQL */ `
  mutation CreateSong(
    $condition: ModelSongConditionInput
    $input: CreateSongInput!
  ) {
    createSong(condition: $condition, input: $input) {
      coverArtUrl
      createdAt
      id
      songUrl
      title
      updatedAt
      __typename
    }
  }
`;
export const deleteSong = /* GraphQL */ `
  mutation DeleteSong(
    $condition: ModelSongConditionInput
    $input: DeleteSongInput!
  ) {
    deleteSong(condition: $condition, input: $input) {
      coverArtUrl
      createdAt
      id
      songUrl
      title
      updatedAt
      __typename
    }
  }
`;
export const updateSong = /* GraphQL */ `
  mutation UpdateSong(
    $condition: ModelSongConditionInput
    $input: UpdateSongInput!
  ) {
    updateSong(condition: $condition, input: $input) {
      coverArtUrl
      createdAt
      id
      songUrl
      title
      updatedAt
      __typename
    }
  }
`;
