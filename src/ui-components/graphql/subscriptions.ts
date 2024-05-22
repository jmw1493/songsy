/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateSong = /* GraphQL */ `
  subscription OnCreateSong(
    $filter: ModelSubscriptionSongFilterInput
    $owner: String
  ) {
    onCreateSong(filter: $filter, owner: $owner) {
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
export const onCreateTodo = /* GraphQL */ `
  subscription OnCreateTodo(
    $filter: ModelSubscriptionTodoFilterInput
    $owner: String
  ) {
    onCreateTodo(filter: $filter, owner: $owner) {
      content
      createdAt
      id
      owner
      updatedAt
      __typename
    }
  }
`;
export const onDeleteSong = /* GraphQL */ `
  subscription OnDeleteSong(
    $filter: ModelSubscriptionSongFilterInput
    $owner: String
  ) {
    onDeleteSong(filter: $filter, owner: $owner) {
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
export const onDeleteTodo = /* GraphQL */ `
  subscription OnDeleteTodo(
    $filter: ModelSubscriptionTodoFilterInput
    $owner: String
  ) {
    onDeleteTodo(filter: $filter, owner: $owner) {
      content
      createdAt
      id
      owner
      updatedAt
      __typename
    }
  }
`;
export const onUpdateSong = /* GraphQL */ `
  subscription OnUpdateSong(
    $filter: ModelSubscriptionSongFilterInput
    $owner: String
  ) {
    onUpdateSong(filter: $filter, owner: $owner) {
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
export const onUpdateTodo = /* GraphQL */ `
  subscription OnUpdateTodo(
    $filter: ModelSubscriptionTodoFilterInput
    $owner: String
  ) {
    onUpdateTodo(filter: $filter, owner: $owner) {
      content
      createdAt
      id
      owner
      updatedAt
      __typename
    }
  }
`;
