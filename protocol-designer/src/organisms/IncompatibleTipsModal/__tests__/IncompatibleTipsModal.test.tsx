import type * as React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fireEvent, screen } from '@testing-library/react'
import { i18n } from '../../../assets/localization'
import { renderWithProviders } from '../../../__testing-utils__'
import { setFeatureFlags } from '../../../feature-flags/actions'
import { IncompatibleTipsModal } from '..'

vi.mock('../../../feature-flags/actions')

const render = (props: React.ComponentProps<typeof IncompatibleTipsModal>) => {
  return renderWithProviders(<IncompatibleTipsModal {...props} />, {
    i18nInstance: i18n,
  })[0]
}

describe('IncompatibleTipsModal', () => {
  let props: React.ComponentProps<typeof IncompatibleTipsModal>

  beforeEach(() => {
    props = {
      onClose: vi.fn(),
    }
  })
  it('renders the text and ctas', () => {
    render(props)
    screen.getByText('Incompatible tips')
    screen.getByText(
      'Protocol Designer only accepts custom JSON labware definitions made with our Labware Creator. Upload a valid file to continue.'
    )
    fireEvent.click(screen.getByText('Show more tip types'))
    expect(vi.mocked(setFeatureFlags)).toHaveBeenCalled()
    fireEvent.click(screen.getByText('Cancel'))
    expect(props.onClose).toHaveBeenCalled()
  })
})
