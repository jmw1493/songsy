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
      owner
      songUrl
      title
      updatedAt
      __typename
    }
  }
`;
export const createTodo = /* GraphQL */ `
  mutation CreateTodo(
    $condition: ModelTodoConditionInput
    $input: CreateTodoInput!
  ) {
    createTodo(condition: $condition, input: $input) {
      content
      createdAt
      id
      owner
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
      owner
      songUrl
      title
      updatedAt
      __typename
    }
  }
`;
export const deleteTodo = /* GraphQL */ `
  mutation DeleteTodo(
    $condition: ModelTodoConditionInput
    $input: DeleteTodoInput!
  ) {
    deleteTodo(condition: $condition, input: $input) {
      content
      createdAt
      id
      owner
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
      owner
      songUrl
      title
      updatedAt
      __typename
    }
  }
`;
export const updateTodo = /* GraphQL */ `
  mutation UpdateTodo(
    $condition: ModelTodoConditionInput
    $input: UpdateTodoInput!
  ) {
    updateTodo(condition: $condition, input: $input) {
      content
      createdAt
      id
      owner
      updatedAt
      __typename
    }
  }
`;
