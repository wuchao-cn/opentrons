import * as React from 'react'
import { useSelector } from 'react-redux'
import { useParams, useHistory, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import {
  Flex,
  DIRECTION_COLUMN,
  TYPOGRAPHY,
  SPACING,
  COLORS,
  JUSTIFY_CENTER,
  ALIGN_CENTER,
  POSITION_RELATIVE,
  OVERFLOW_HIDDEN,
  ALIGN_FLEX_END,
  POSITION_ABSOLUTE,
  Icon,
  JUSTIFY_SPACE_BETWEEN,
  ALIGN_STRETCH,
  ALIGN_FLEX_START,
  BORDERS,
  DIRECTION_ROW,
  DISPLAY_FLEX,
  SIZE_2,
  Btn,
} from '@opentrons/components'
import { RUN_STATUS_SUCCEEDED } from '@opentrons/api-client'
import { useProtocolQuery, useRunQuery } from '@opentrons/react-api-client'

import { LargeButton, TertiaryButton } from '../../atoms/buttons'
import {
  useRunTimestamps,
  useRunControls,
} from '../../organisms/RunTimeControl/hooks'
import {
  useRunCreatedAtTimestamp,
  useTrackProtocolRunEvent,
  useRobotAnalyticsData,
} from '../../organisms/Devices/hooks'
import { useCloseCurrentRun } from '../../organisms/ProtocolUpload/hooks'
import { onDeviceDisplayFormatTimestamp } from '../../organisms/Devices/utils'
import { EMPTY_TIMESTAMP } from '../../organisms/Devices/constants'
import { RunTimer } from '../../organisms/Devices/ProtocolRun/RunTimer'
import {
  useTrackEvent,
  // ANALYTICS_PROTOCOL_RUN_CANCEL,
  ANALYTICS_PROTOCOL_RUN_AGAIN,
  ANALYTICS_PROTOCOL_RUN_FINISH,
} from '../../redux/analytics'

import type { Run } from '@opentrons/api-client'
import type { OnDeviceRouteParams } from '../../App/types'
import { getLocalRobot } from '../../redux/discovery'

export function RunSummary(): JSX.Element {
  const { runId } = useParams<OnDeviceRouteParams>()
  const { t } = useTranslation('run_details')
  const history = useHistory()
  const { data: runRecord } = useRunQuery(runId, { staleTime: Infinity })
  const runStatus = runRecord?.data.status ?? null
  const isRunSucceeded = runStatus === RUN_STATUS_SUCCEEDED
  const protocolId = runRecord?.data.protocolId ?? null
  const { data: protocolRecord } = useProtocolQuery(protocolId, {
    staleTime: Infinity,
  })
  const protocolName =
    protocolRecord?.data.metadata.protocolName ??
    protocolRecord?.data.files[0].name
  const { startedAt, stoppedAt, completedAt } = useRunTimestamps(runId)
  const createdAtTimestamp = useRunCreatedAtTimestamp(runId)
  const startedAtTimestamp =
    startedAt != null
      ? onDeviceDisplayFormatTimestamp(startedAt)
      : EMPTY_TIMESTAMP

  const completedAtTimestamp =
    completedAt != null
      ? onDeviceDisplayFormatTimestamp(completedAt)
      : EMPTY_TIMESTAMP

  const [showSplash, setShowSplash] = React.useState(runRecord?.data.current)
  const { trackProtocolRunEvent } = useTrackProtocolRunEvent(runId)
  const onResetSuccess = (createRunResponse: Run): void =>
    history.push(`/protocols/${runId}/setup`)
  const { reset } = useRunControls(runId, onResetSuccess)
  const trackEvent = useTrackEvent()
  const { closeCurrentRun, isClosingCurrentRun } = useCloseCurrentRun()
  const localRobot = useSelector(getLocalRobot)
  const robotName = localRobot?.name ?? 'no name'
  const robotAnalyticsData = useRobotAnalyticsData(robotName)

  const runStatusText = isRunSucceeded
    ? t('run_complete')
    : t('run_failed_modal_title')

  const handleReturnToDash = (): void => {
    history.push('/')
  }

  const handleRunAgain = (): void => {
    reset()
    trackEvent({
      name: 'proceedToRun',
      properties: { sourceLocation: 'RunSummary' },
    })
    trackProtocolRunEvent({ name: ANALYTICS_PROTOCOL_RUN_AGAIN })
  }

  const handleViewErrorDetails = (): void => {
    // Note (kj:04/28/2023) the current RunFailedModal is needed to refactor before hooking up
    console.log('will be added')
  }

  const handleClickSplash = (): void => {
    trackProtocolRunEvent({
      name: ANALYTICS_PROTOCOL_RUN_FINISH,
      properties: robotAnalyticsData ?? undefined,
    })
    closeCurrentRun()
    setShowSplash(false)
  }

  return (
    <>
      <Btn
        display={DISPLAY_FLEX}
        width="100%"
        height="100vh"
        flexDirection={DIRECTION_COLUMN}
        position={POSITION_RELATIVE}
        overflow={OVERFLOW_HIDDEN}
        disabled={isClosingCurrentRun}
        onClick={handleClickSplash}
      >
        {showSplash ? (
          <Flex
            height="100vh"
            width="100%"
            justifyContent={JUSTIFY_CENTER}
            alignItems={ALIGN_CENTER}
            position={POSITION_ABSOLUTE}
            flexDirection={DIRECTION_COLUMN}
            gridGap={SPACING.spacingXXL}
            padding={SPACING.spacingXXL}
            backgroundColor={isRunSucceeded ? COLORS.green2 : COLORS.red2}
          >
            <SplashFrame>
              <Flex gridGap={SPACING.spacing6} alignItems={ALIGN_CENTER}>
                <Icon
                  name={isRunSucceeded ? 'ot-check' : 'ot-alert'}
                  size="4.5rem"
                  color={COLORS.white}
                />
                <SplashHeader> {runStatusText} </SplashHeader>
              </Flex>
              <Flex width="49rem" justifyContent={JUSTIFY_CENTER}>
                <SplashBody>{protocolName}</SplashBody>
              </Flex>
            </SplashFrame>
          </Flex>
        ) : (
          <Flex
            height="100vh"
            width="100%"
            flexDirection={DIRECTION_COLUMN}
            justifyContent={JUSTIFY_SPACE_BETWEEN}
            padding={SPACING.spacingXXL}
          >
            <Flex
              flexDirection={DIRECTION_COLUMN}
              alignItems={ALIGN_FLEX_START}
              gridGap={SPACING.spacing4}
            >
              <Flex gridGap={SPACING.spacing3} alignItems={ALIGN_CENTER}>
                <Icon
                  name={isRunSucceeded ? 'ot-check' : 'ot-alert'}
                  size={SIZE_2}
                  color={
                    isRunSucceeded ? COLORS.successEnabled : COLORS.errorEnabled
                  }
                />
                <SummaryHeader>{runStatusText}</SummaryHeader>
              </Flex>
              <ProtocolName>{protocolName}</ProtocolName>
              <Flex gridGap={SPACING.spacing3}>
                <SummaryDatum>{`${t(
                  'run'
                )}: ${createdAtTimestamp}`}</SummaryDatum>
                <SummaryDatum>
                  {`${t('duration')}: `}
                  <RunTimer
                    {...{
                      runStatus,
                      startedAt,
                      stoppedAt,
                      completedAt,
                    }}
                    style={DURATION_TEXT_STYLE}
                  />
                </SummaryDatum>
                <SummaryDatum>{`${t(
                  'start'
                )}: ${startedAtTimestamp}`}</SummaryDatum>
                <SummaryDatum>{`${t(
                  'end'
                )}: ${completedAtTimestamp}`}</SummaryDatum>
              </Flex>
            </Flex>
            <Flex alignSelf={ALIGN_STRETCH} gridGap={SPACING.spacing4}>
              <LargeButton
                flex="1"
                iconName="arrow-left"
                buttonType="secondary"
                onClick={handleReturnToDash}
                buttonText={t('return_to_dashboard')}
                height="17rem"
              />
              <LargeButton
                flex="1"
                iconName="play-round-corners"
                buttonType="primary"
                onClick={handleRunAgain}
                buttonText={t('run_again')}
                height="17rem"
              />
              {!isRunSucceeded ? (
                <LargeButton
                  flex="1"
                  iconName="info"
                  buttonType="alert"
                  onClick={handleViewErrorDetails}
                  buttonText={t('view_error_details')}
                  height="17rem"
                />
              ) : null}
            </Flex>
          </Flex>
        )}
      </Btn>
      {/* temporary */}
      <Flex
        alignSelf={ALIGN_FLEX_END}
        marginTop={SPACING.spacing5}
        width="fit-content"
        paddingRight={SPACING.spacing6}
      >
        <Link to="/dashboard">
          <TertiaryButton>back to RobotDashboard</TertiaryButton>
        </Link>
      </Flex>
    </>
  )
}

const SplashHeader = styled.h1`
  font-weight: ${TYPOGRAPHY.fontWeightBold};
  text-align: ${TYPOGRAPHY.textAlignLeft};
  text-transform: ${TYPOGRAPHY.textTransformCapitalize};
  font-size: 80px;
  line-height: 94px;
  color: ${COLORS.white};
`
const SplashBody = styled.h4`
  font-weight: ${TYPOGRAPHY.fontWeightSemiBold};
  text-align: ${TYPOGRAPHY.textAlignLeft};
  text-transform: ${TYPOGRAPHY.textTransformCapitalize};
  font-size: ${TYPOGRAPHY.fontSize32};
  line-height: ${TYPOGRAPHY.lineHeight42};
  color: ${COLORS.white};
`

const SummaryHeader = styled.h4`
  font-weight: ${TYPOGRAPHY.fontWeightBold};
  text-align: ${TYPOGRAPHY.textAlignLeft};
  text-transform: ${TYPOGRAPHY.textTransformCapitalize};
  font-size: ${TYPOGRAPHY.fontSize28};
  line-height: ${TYPOGRAPHY.lineHeight36};
`

const SplashFrame = styled(Flex)`
  width: 100%;
  height: 100%;
  flex-direction: ${DIRECTION_COLUMN};
  justify-content: ${JUSTIFY_CENTER};
  align-items: ${ALIGN_CENTER};
  border: ${BORDERS.size_two} solid ${COLORS.white}${COLORS.opacity20HexCode};
  border-radius: ${BORDERS.size_three};
  grid-gap: ${SPACING.spacingXXL};
`

const ProtocolName = styled.h4`
  font-weight: ${TYPOGRAPHY.fontWeightSemiBold};
  text-align: ${TYPOGRAPHY.textAlignLeft};
  text-transform: ${TYPOGRAPHY.textTransformCapitalize};
  font-size: ${TYPOGRAPHY.fontSize28};
  line-height: ${TYPOGRAPHY.lineHeight36};
  color: ${COLORS.darkBlack70};
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  overflow-wrap: break-word;
  height: max-content;
`

const SummaryDatum = styled.div`
  display: ${DISPLAY_FLEX};
  flex-direction: ${DIRECTION_ROW};
  align-items: ${ALIGN_CENTER};
  padding: ${SPACING.spacing3} 0.75rem;
  grid-gap: ${SPACING.spacing2};
  height: 44px;
  background: #d6d6d6;
  border-radius: 4px;
  color: ${COLORS.darkBlack90};
  font-size: ${TYPOGRAPHY.fontSize22};
  line-height: ${TYPOGRAPHY.lineHeight28};
  font-weight: ${TYPOGRAPHY.fontWeightRegular};
  width: max-content;
`

const DURATION_TEXT_STYLE = css`
  font-size: ${TYPOGRAPHY.fontSize22};
  line-height: ${TYPOGRAPHY.lineHeight28};
  font-weight: ${TYPOGRAPHY.fontWeightRegular};
`