import * as React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import {
  COLORS,
  Flex,
  SPACING,
  TYPOGRAPHY,
  BORDERS,
  WRAP,
  Icon,
  DIRECTION_ROW,
} from '@opentrons/components'
import { MICRO_LITERS } from '@opentrons/shared-data'
import { StyledText } from '../../atoms/text'
import { LiquidsLabwareDetailsModal } from '../Devices/ProtocolRun/SetupLiquids/LiquidsLabwareDetailsModal'
import { getSlotLabwareName } from '../Devices/ProtocolRun/utils/getSlotLabwareName'
import { getTotalVolumePerLiquidId } from '../Devices/ProtocolRun/SetupLiquids/utils'
import type { RunTimeCommand } from '@opentrons/shared-data'
import type { LabwareByLiquidId, ParsedLiquid } from '@opentrons/api-client'

const Table = styled('table')`
  table-layout: ${SPACING.spacingAuto};
  width: 100%;
  border-spacing: 0 ${BORDERS.size_two};
  text-align: ${TYPOGRAPHY.textAlignLeft};
  color: ${COLORS.darkBlack_ninety};
`
const TableHeader = styled('th')`
  text-transform: ${TYPOGRAPHY.textTransformCapitalize};
  font-weight: ${TYPOGRAPHY.fontWeightSemiBold};
  font-size: ${TYPOGRAPHY.fontSize22};
  line-height: ${TYPOGRAPHY.lineHeight28};
  padding: 0 ${SPACING.spacing5} ${SPACING.spacing3};
`
const TableRow = styled('tr')`
  height: 5.75rem;
  opacity: 90%;
`
const TableDatum = styled('td')`
  z-index: 2;
  padding: ${SPACING.spacing3} ${SPACING.spacingM};
  background-color: ${COLORS.light_two};
  font-size: ${TYPOGRAPHY.fontSize22};
  white-space: break-spaces;
  text-overflow: ${WRAP};
  &:first-child {
    border-top-left-radius: ${BORDERS.size_three};
    border-bottom-left-radius: ${BORDERS.size_three};
    width: 20%;
  }
  &:last-child {
    border-top-right-radius: ${BORDERS.size_three};
    border-bottom-right-radius: ${BORDERS.size_three};
  }
`

interface LiquidDetailsProps {
  liquid: ParsedLiquid
  labwareByLiquidId: LabwareByLiquidId
  runId: string
  commands?: RunTimeCommand[]
}

export function LiquidDetails(props: LiquidDetailsProps): JSX.Element {
  const { liquid, labwareByLiquidId, runId, commands } = props
  const { t } = useTranslation('protocol_setup')
  const [labwareIdModal, setLabwareIdModal] = React.useState<string | null>(
    null
  )
  return (
    <Flex marginTop={SPACING.spacing5}>
      {labwareIdModal != null && (
        <LiquidsLabwareDetailsModal
          labwareId={labwareIdModal}
          liquidId={liquid.id}
          runId={runId}
          closeModal={() => setLabwareIdModal(null)}
        />
      )}
      <Table>
        <thead>
          <tr>
            <TableHeader>{t('location')}</TableHeader>
            <TableHeader>{t('labware_name')}</TableHeader>
            <TableHeader>{t('volume')}</TableHeader>
          </tr>
        </thead>
        <tbody>
          {labwareByLiquidId[liquid.id].map(labware => {
            const { slotName, labwareName } = getSlotLabwareName(
              labware.labwareId,
              commands
            )
            return (
              <TableRow
                key={labware.labwareId}
                aria-label={`LiquidDetails_${liquid.id}`}
                onClick={() => setLabwareIdModal(labware.labwareId)}
              >
                <TableDatum>
                  <Flex>
                    <Flex
                      padding="0.375rem"
                      textAlign={TYPOGRAPHY.textAlignLeft}
                      borderRadius={BORDERS.size_three}
                      border={`3px solid ${COLORS.darkBlackEnabled}`}
                      fontSize={TYPOGRAPHY.fontSize20}
                      fontWeight="700"
                    >
                      {slotName}
                    </Flex>
                  </Flex>
                </TableDatum>
                <TableDatum>
                  <StyledText
                    lineHeight={TYPOGRAPHY.lineHeight28}
                    fontSize="1.375rem"
                    fontWeight={TYPOGRAPHY.fontWeightRegular}
                  >
                    {labwareName}
                  </StyledText>
                </TableDatum>

                <TableDatum>
                  <Flex flexDirection={DIRECTION_ROW}>
                    <Flex
                      height="2.75rem"
                      padding={`${SPACING.spacing3} 0.75rem`}
                      width="max-content"
                      alignItems={TYPOGRAPHY.textAlignCenter}
                      marginRight={SPACING.spacingAuto}
                    >
                      {getTotalVolumePerLiquidId(liquid.id, labwareByLiquidId)}{' '}
                      {MICRO_LITERS}
                    </Flex>
                    <Icon name="chevron-right" size="3rem" />
                  </Flex>
                </TableDatum>
              </TableRow>
            )
          })}
        </tbody>
      </Table>
    </Flex>
  )
}