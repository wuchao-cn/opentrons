import styled, { css } from 'styled-components'
import {
  BORDERS,
  COLORS,
  DIRECTION_COLUMN,
  OVERFLOW_HIDDEN,
  SPACING,
  TYPOGRAPHY,
} from '@opentrons/components'
import type { FlattenSimpleInterpolation } from 'styled-components'

export const BUTTON_LINK_STYLE = css`
  color: ${COLORS.grey60};
  &:hover {
    color: ${COLORS.grey40};
  }
`

export const LINE_CLAMP_TEXT_STYLE = (
  lineClamp: number
): FlattenSimpleInterpolation => css`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: ${OVERFLOW_HIDDEN};
  text-overflow: ellipsis;
  word-wrap: break-word;
  -webkit-line-clamp: ${lineClamp};
  word-break: break-all; // for a non word case like aaaaaaaa
`

const MIN_OVERVIEW_WIDTH = '64rem'
const COLUMN_GRID_GAP = '5rem'
export const COLUMN_STYLE = css`
  flex-direction: ${DIRECTION_COLUMN};
  min-width: calc((${MIN_OVERVIEW_WIDTH} - ${COLUMN_GRID_GAP}) * 0.5);
  flex: 1;
`

export const DescriptionField = styled.textarea`
  min-height: 5rem;
  width: 100%;
  border: 1px ${BORDERS.styleSolid} ${COLORS.grey50};
  border-radius: ${BORDERS.borderRadius4};
  padding: ${SPACING.spacing8};
  font-size: ${TYPOGRAPHY.fontSizeP};
  resize: none;

  &:active:enabled {
    border: 1px ${BORDERS.styleSolid} ${COLORS.blue50};
  }

  &:hover {
    border: 1px ${BORDERS.styleSolid} ${COLORS.grey60};
  }

  &:focus-visible {
    border: 1px ${BORDERS.styleSolid} ${COLORS.grey55};
    outline: 2px ${BORDERS.styleSolid} ${COLORS.blue50};
    outline-offset: 2px;
  }

  &:focus-within {
    border: 1px ${BORDERS.styleSolid} ${COLORS.blue50};
  }

  &:disabled {
    border: 1px ${BORDERS.styleSolid} ${COLORS.grey30};
  }
  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`
