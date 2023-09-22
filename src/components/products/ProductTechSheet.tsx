import { mqUntil } from "@biesse-group/react-components";
import React, { FC, useMemo } from "react";
import styled, { css } from "styled-components";

import { useLabels } from "../../hooks/useLabels";

export interface ProductTechSheetProps {
  sheets: Queries.contentfulProductTechnicalSheetsJsonNode[];
}

const StyledTableContainer = styled.div`
  overflow-x: auto;
  width: 100%;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableCellText = styled.p<{ clamp?: number; align?: "left" | "center" }>`
  ${(props) => css`
    display: -webkit-box;
    -webkit-line-clamp: ${props.clamp};
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 0;
  `}
`;

const StyledTd = styled.td<{ sticky?: boolean }>`
  overflow: hidden;
  height: 40px;
  padding: 8px 20px;
  align-items: center;
  justify-content: ${(props) => (props.sticky ? "start" : "center")};
  font-weight: ${(props) => props.theme.font.weight[props.sticky ? "bold" : "book"]};
  background-color: ${(props) => props.theme.color.white};
  border-bottom: 1px solid ${(props) => props.theme.table.borderColor};
  text-align: ${(props) => (props.sticky ? "left" : "center")};

  :not(:last-child) {
    border-right: 1px solid ${(props) => props.theme.table.borderColor};
  }

  margin: 0px;
  min-width: 18ch;

  ${mqUntil(
    "md",
    css`
      flex: 1 0 100%;
      font-size: ${(props) => props.theme.font.mobile.body.md};
      padding: 12px 8px;
    `
  )}

  ${mqUntil(
    "sm",
    css`
      padding: 12px;
    `
  )}

  ${(props) =>
    props.sticky &&
    css`
      color: ${props.theme.color.primary};
      position: sticky;
      left: 0;
      border-right: 0 !important;
      box-shadow: inset -1px 0 0 0 ${(props) => props.theme.table.borderColor};
    `}
`;

const StyledTr = styled.tr<{ header?: boolean }>`
  ${(props) =>
    props.header
      ? css`
          border: 0 !important;
          > ${StyledTd} {
            color: ${props.theme.color.primary};
            font-weight: ${(props) => props.theme.font.weight.bold};
            border-top: 0 !important;
            border-right: 0 !important;
            box-shadow: none;
          }
        `
      : css`
          &:first-child {
            > ${StyledTd} {
              border-top: 1px solid ${(props) => props.theme.table.borderColor};
            }
          }
        `}
`;

export const ProductTechSheet: FC<ProductTechSheetProps> = ({ sheets }) => {
  const labels = useLabels();

  const tableRows = useMemo(() => {
    return sheets.reduce<{ key: string; values: string[] }[]>(
      (sheetMap, { technicalSheet }, index) => {
        technicalSheet?.forEach((techData) => {
          const key = techData!.key!;
          let sheetIndex = sheetMap.findIndex((s) => s.key === key);
          if (sheetIndex < 0) {
            sheetMap.push({
              key,
              values: new Array(sheets.length).fill(""),
            });
            sheetIndex = sheetMap.length - 1;
          }
          sheetMap[sheetIndex].values[index] = techData!.value!;
        });
        return sheetMap;
      },
      []
    );
  }, [sheets]);

  return (
    <StyledTableContainer>
      <StyledTable>
        <tbody>
          {sheets.some(({ headerLabel }) => headerLabel) && (
            <StyledTr header>
              {/* empty placeholder for sticky column */}
              <StyledTd sticky />
              {/* columns headers */}
              {sheets.map(({ headerLabel }, index) => (
                <StyledTd key={index}>
                  <TableCellText align="center">{headerLabel}</TableCellText>
                </StyledTd>
              ))}
            </StyledTr>
          )}
          {tableRows.map(({ key, values }, index) => (
            <StyledTr key={index}>
              <StyledTd sticky>
                <TableCellText align="left">{labels[`tech-sheet-${key}`]}</TableCellText>
              </StyledTd>
              {values.map((value, index) => (
                <StyledTd key={index}>
                  <TableCellText align="center">{value}</TableCellText>
                </StyledTd>
              ))}
            </StyledTr>
          ))}
        </tbody>
      </StyledTable>
    </StyledTableContainer>
  );
};
