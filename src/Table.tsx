import React, { forwardRef, memo, type ReactNode, type CSSProperties } from "react";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { fr } from "./fr";
import { cx } from "./tools/cx";
import { symToStr } from "tsafe/symToStr";
import type { FrClassName } from "./fr/generatedFromCss/classNames";
import { useAnalyticsId } from "./tools/useAnalyticsId";

export type TableProps = {
    id?: string;
    data: ReactNode[][];
    className?: string;
    caption?: ReactNode;
    headers?: ReactNode[];
    /** Default: false */
    fixed?: boolean;
    /** Default: false */
    noScroll?: boolean;
    /** Default: false */
    bordered?: boolean;
    /** Default: false */
    noCaption?: boolean;
    /** Default: false */
    bottomCaption?: boolean;
    /** Default: false */
    isSelectable?: boolean;
    /** Default: false */
    isFirstDataRowHeader?: boolean;
    style?: CSSProperties;
    colorVariant?: TableProps.ColorVariant;
};

export namespace TableProps {
    type ExtractColorVariant<FrClassName> = FrClassName extends `fr-table--${infer AccentColor}`
        ? Exclude<
              AccentColor,
              "no-scroll" | "no-caption" | "caption-bottom" | "layout-fixed" | "bordered"
          >
        : never;

    export type ColorVariant = ExtractColorVariant<FrClassName>;
}

/** @see <https://components.react-dsfr.codegouv.studio/?path=/docs/tableau>  */
export const Table = memo(
    forwardRef<HTMLDivElement, TableProps>((props, ref) => {
        const {
            id: id_props,
            data,
            headers,
            caption,
            bordered = false,
            noScroll = false,
            fixed = false,
            noCaption = false,
            bottomCaption = false,
            isSelectable = false,
            isFirstDataRowHeader = false,
            colorVariant,
            className,
            style,
            ...rest
        } = props;

        assert<Equals<keyof typeof rest, never>>();

        const id = useAnalyticsId({
            "defaultIdPrefix": "fr-table",
            "explicitlyProvidedId": id_props
        });

        return (
            <div
                id={id}
                ref={ref}
                style={style}
                className={cx(
                    fr.cx(
                        "fr-table",
                        {
                            "fr-table--bordered": bordered,
                            "fr-table--no-scroll": noScroll,
                            "fr-table--layout-fixed": fixed,
                            "fr-table--no-caption": noCaption,
                            "fr-table--caption-bottom": bottomCaption
                        },
                        colorVariant !== undefined && `fr-table--${colorVariant}`
                    ),
                    className
                )}
            >
                <div className={fr.cx("fr-table__content")}>
                    <table>
                        {caption !== undefined && <caption>{caption}</caption>}
                        {headers !== undefined && (
                            <thead>
                                <tr>
                                    {(isSelectable || isFirstDataRowHeader) && (
                                        <th className={fr.cx("fr-cell--fixed")} role="columnheader">
                                            {isSelectable && (
                                                <span className={fr.cx("fr-sr-only")}>
                                                    Sélectionner
                                                </span>
                                            )}
                                            {isFirstDataRowHeader && headers[0]}
                                        </th>
                                    )}
                                    {headers.map((header, i) =>
                                        isFirstDataRowHeader && i === 0 ? (
                                            <></>
                                        ) : (
                                            <th key={i} scope="col">
                                                {header}
                                            </th>
                                        )
                                    )}
                                </tr>
                            </thead>
                        )}
                        <tbody>
                            {data.map((row, i) => (
                                <tr key={i}>
                                    {isSelectable && (
                                        <th className={fr.cx("fr-cell--fixed")} scope="row">
                                            <div
                                                className={fr.cx(
                                                    "fr-checkbox-group",
                                                    "fr-checkbox-group--sm"
                                                )}
                                            >
                                                <input
                                                    name="row-select"
                                                    id={`table-select-checkbox-7748--${i}`}
                                                    type="checkbox"
                                                />
                                                <label
                                                    className={fr.cx("fr-label")}
                                                    htmlFor={`table-select-checkbox-7748--${i}`}
                                                >
                                                    Sélectionner la ligne {i + 1}
                                                </label>
                                            </div>
                                            {isFirstDataRowHeader && row[0]}
                                        </th>
                                    )}
                                    {row.map((col, j) =>
                                        isFirstDataRowHeader && j === 0 ? (
                                            <></>
                                        ) : (
                                            <td key={j}>{col}</td>
                                        )
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    })
);

Table.displayName = symToStr({ Table });

export default Table;
