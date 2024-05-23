/* eslint-disable */
"use client";
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { StorageManager } from "@aws-amplify/ui-react-storage";
import {
  fetchByPath,
  getOverrideProps,
  processFile,
  validateField,
} from "./utils";
import { generateClient } from "aws-amplify/api";
import { createSong } from "./graphql/mutations";
import imageCompression from "browser-image-compression";
const client = generateClient();
export default function SongCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    title: "",
    songUrl: "",
    coverArtUrl: "",
  };
  const [title, setTitle] = React.useState(initialValues.title);
  const [songUrl, setSongUrl] = React.useState(initialValues.songUrl);
  const [coverArtUrl, setCoverArtUrl] = React.useState(
    initialValues.coverArtUrl
  );
  const [errors, setErrors] = React.useState({});
  const [submissionMessage, setSubmissionMessage] = React.useState("");
  const resetStateValues = () => {
    setTitle(initialValues.title);
    setSongUrl(initialValues.songUrl);
    setCoverArtUrl(initialValues.coverArtUrl);
    setErrors({});
  };
  const validations = {
    title: [{ type: "Required" }],
    songUrl: [{ type: "Required" }],
    coverArtUrl: [{ type: "Required" }],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  const customProcessFile = async ({ file, key }) => {
    const options = {
      maxSizeMB: 1, // Maximum file size in MB
      maxWidthOrHeight: 300, // Maximum width or height
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      const returnObj = await processFile({ file: compressedFile });
      return returnObj;
    } catch (e) {
      return { file, key };
    }
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          title,
          songUrl,
          coverArtUrl,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: createSong.replaceAll("__typename", ""),
            variables: {
              input: {
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
          setSubmissionMessage("Song submitted successfully!");
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
            setSubmissionMessage(`Error submitting song: ${messages}`);
          }
        }
      }}
      {...getOverrideProps(overrides, "SongCreateForm")}
      {...rest}
    >
      <TextField
        label="Song Title"
        isRequired={true}
        isReadOnly={false}
        value={title}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title: value,
              songUrl,
              coverArtUrl,
            };
            const result = onChange(modelFields);
            value = result?.title ?? value;
          }
          if (errors.title?.hasError) {
            runValidationTasks("title", value);
          }
          setTitle(value);
        }}
        onBlur={() => runValidationTasks("title", title)}
        errorMessage={errors.title?.errorMessage}
        hasError={errors.title?.hasError}
        {...getOverrideProps(overrides, "title")}
      ></TextField>
      <StorageManager
        displayText={{
          dropFilesText: "Drop Cover Art File Here",
        }}
        maxFileCount={1}
        path="image/"
        acceptedFileTypes={["image/*"]}
        processFile={customProcessFile}
        onUploadSuccess={({ key }) => {
          setCoverArtUrl(key);
        }}
        onFileRemove={({ key }) => {
          setCoverArtUrl(undefined);
        }}
        clearOnSuccess
      />
      <StorageManager
        displayText={{
          dropFilesText: "Drop Song File Here",
        }}
        maxFileCount={1}
        path="audio/"
        acceptedFileTypes={["audio/*"]}
        processFile={processFile}
        onUploadSuccess={({ key }) => {
          setSongUrl(key);
        }}
        onFileRemove={({ key }) => {
          setSongUrl(undefined);
        }}
        clearOnSuccess
      />
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
