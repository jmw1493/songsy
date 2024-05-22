import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Song } from "./graphql/types";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type SongUpdateFormInputValues = {
    title?: string;
    songUrl?: string;
    coverArtUrl?: string;
};
export declare type SongUpdateFormValidationValues = {
    title?: ValidationFunction<string>;
    songUrl?: ValidationFunction<string>;
    coverArtUrl?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type SongUpdateFormOverridesProps = {
    SongUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    songUrl?: PrimitiveOverrideProps<TextFieldProps>;
    coverArtUrl?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type SongUpdateFormProps = React.PropsWithChildren<{
    overrides?: SongUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    song?: Song;
    onSubmit?: (fields: SongUpdateFormInputValues) => SongUpdateFormInputValues;
    onSuccess?: (fields: SongUpdateFormInputValues) => void;
    onError?: (fields: SongUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: SongUpdateFormInputValues) => SongUpdateFormInputValues;
    onValidate?: SongUpdateFormValidationValues;
} & React.CSSProperties>;
export default function SongUpdateForm(props: SongUpdateFormProps): React.ReactElement;
