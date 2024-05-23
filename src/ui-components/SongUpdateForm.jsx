/* eslint-disable */
"use client";
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getSong } from "./graphql/queries";
import { updateSong } from "./graphql/mutations";
const client = generateClient();
export default function SongUpdateForm(props) {
  const {
    id: idProp,
    song: songModelProp,
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
  const resetStateValues = () => {
    const cleanValues = songRecord
      ? { ...initialValues, ...songRecord }
      : initialValues;
    setTitle(cleanValues.title);
    setSongUrl(cleanValues.songUrl);
    setCoverArtUrl(cleanValues.coverArtUrl);
    setErrors({});
  };
  const [songRecord, setSongRecord] = React.useState(songModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getSong.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getSong
        : songModelProp;
      setSongRecord(record);
    };
    queryData();
  }, [idProp, songModelProp]);
  React.useEffect(resetStateValues, [songRecord]);
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
            query: updateSong.replaceAll("__typename", ""),
            variables: {
              input: {
                id: songRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "SongUpdateForm")}
      {...rest}
    >
      <TextField
        label="Title"
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
      <TextField
        label="Song url"
        isRequired={true}
        isReadOnly={false}
        value={songUrl}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title,
              songUrl: value,
              coverArtUrl,
            };
            const result = onChange(modelFields);
            value = result?.songUrl ?? value;
          }
          if (errors.songUrl?.hasError) {
            runValidationTasks("songUrl", value);
          }
          setSongUrl(value);
        }}
        onBlur={() => runValidationTasks("songUrl", songUrl)}
        errorMessage={errors.songUrl?.errorMessage}
        hasError={errors.songUrl?.hasError}
        {...getOverrideProps(overrides, "songUrl")}
      ></TextField>
      <TextField
        label="Cover art url"
        isRequired={true}
        isReadOnly={false}
        value={coverArtUrl}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title,
              songUrl,
              coverArtUrl: value,
            };
            const result = onChange(modelFields);
            value = result?.coverArtUrl ?? value;
          }
          if (errors.coverArtUrl?.hasError) {
            runValidationTasks("coverArtUrl", value);
          }
          setCoverArtUrl(value);
        }}
        onBlur={() => runValidationTasks("coverArtUrl", coverArtUrl)}
        errorMessage={errors.coverArtUrl?.errorMessage}
        hasError={errors.coverArtUrl?.hasError}
        {...getOverrideProps(overrides, "coverArtUrl")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || songModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || songModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
