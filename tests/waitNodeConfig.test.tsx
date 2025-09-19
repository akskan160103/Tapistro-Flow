import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import WaitNodeConfig, { WaitNodeData } from '../src/components/NodeConfigurations/WaitNodeConfig/WaitNodeConfig'

const mockOnSave = jest.fn()
const mockOnClose = jest.fn()
const mockOnDelete = jest.fn()

const defaultProps = {
  open: true,
  onClose: mockOnClose,
  onSave: mockOnSave,
  onDelete: mockOnDelete,
}

describe('WaitNodeConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render with default values', () => {
    render(<WaitNodeConfig {...defaultProps} />)

    expect(screen.getByLabelText('Hours')).toHaveValue('0')
    expect(screen.getByLabelText('Minutes')).toHaveValue('1')
    expect(screen.getByLabelText('Seconds')).toHaveValue('0')
    expect(screen.getByText('Wait for 1m')).toBeInTheDocument()
  })

  it('should render with initial config', () => {
    const initialConfig: WaitNodeData = {
      hours: 2,
      minutes: 30,
      seconds: 15
    }

    render(<WaitNodeConfig {...defaultProps} initialConfig={initialConfig} />)

    expect(screen.getByLabelText('Hours')).toHaveValue('2')
    expect(screen.getByLabelText('Minutes')).toHaveValue('30')
    expect(screen.getByLabelText('Seconds')).toHaveValue('15')
    expect(screen.getByText('Wait for 2h 30m 15s')).toBeInTheDocument()
  })

  it('should update preview when values change', async () => {
    const user = userEvent.setup()
    render(<WaitNodeConfig {...defaultProps} />)

    const hoursInput = screen.getByLabelText('Hours')
    const minutesInput = screen.getByLabelText('Minutes')
    const secondsInput = screen.getByLabelText('Seconds')

    await user.clear(hoursInput)
    await user.type(hoursInput, '2')
    expect(screen.getByText('Wait for 2h 1m')).toBeInTheDocument()

    await user.clear(minutesInput)
    await user.type(minutesInput, '30')
    expect(screen.getByText('Wait for 2h 30m')).toBeInTheDocument()

    await user.clear(secondsInput)
    await user.type(secondsInput, '15')
    expect(screen.getByText('Wait for 2h 30m 15s')).toBeInTheDocument()
  })

  it('should save with valid values', async () => {
    const user = userEvent.setup()
    render(<WaitNodeConfig {...defaultProps} />)

    const hoursInput = screen.getByLabelText('Hours')
    const minutesInput = screen.getByLabelText('Minutes')
    const secondsInput = screen.getByLabelText('Seconds')

    await user.clear(hoursInput)
    await user.type(hoursInput, '1')
    await user.clear(minutesInput)
    await user.type(minutesInput, '30')
    await user.clear(secondsInput)
    await user.type(secondsInput, '45')

    const saveButton = screen.getByText('Save Configuration')
    await user.click(saveButton)

    expect(mockOnSave).toHaveBeenCalledWith({
      hours: 1,
      minutes: 30,
      seconds: 45
    })
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should show error when all values are zero', async () => {
    const user = userEvent.setup()
    render(<WaitNodeConfig {...defaultProps} />)

    const minutesInput = screen.getByLabelText('Minutes')
    await user.clear(minutesInput)

    const saveButton = screen.getByText('Save Configuration')
    await user.click(saveButton)

    expect(screen.getByText('Please enter at least one time value (hours, minutes, or seconds)')).toBeInTheDocument()
    expect(mockOnSave).not.toHaveBeenCalled()
  })


  it('should show error for minutes >= 60', async () => {
    const user = userEvent.setup()
    render(<WaitNodeConfig {...defaultProps} />)

    const minutesInput = screen.getByLabelText('Minutes')
    await user.clear(minutesInput)
    await user.type(minutesInput, '60')

    const saveButton = screen.getByText('Save Configuration')
    await user.click(saveButton)

    expect(screen.getByText('Minutes and seconds must be less than 60')).toBeInTheDocument()
    expect(mockOnSave).not.toHaveBeenCalled()
  })

  it('should show error for seconds >= 60', async () => {
    const user = userEvent.setup()
    render(<WaitNodeConfig {...defaultProps} />)

    const secondsInput = screen.getByLabelText('Seconds')
    await user.clear(secondsInput)
    await user.type(secondsInput, '60')

    const saveButton = screen.getByText('Save Configuration')
    await user.click(saveButton)

    expect(screen.getByText('Minutes and seconds must be less than 60')).toBeInTheDocument()
    expect(mockOnSave).not.toHaveBeenCalled()
  })

  it('should only allow numeric input', async () => {
    const user = userEvent.setup()
    render(<WaitNodeConfig {...defaultProps} />)

    const hoursInput = screen.getByLabelText('Hours')
    await user.clear(hoursInput)
    await user.type(hoursInput, 'abc123')

    // Should only accept the numeric part
    expect(hoursInput).toHaveValue('123')
  })

  it('should call onDelete when delete button is clicked', async () => {
    const user = userEvent.setup()
    render(<WaitNodeConfig {...defaultProps} />)

    const deleteButton = screen.getByText('Delete Node')
    await user.click(deleteButton)

    expect(mockOnDelete).toHaveBeenCalled()
  })

  it('should call onClose when cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(<WaitNodeConfig {...defaultProps} />)

    const cancelButton = screen.getByText('Cancel')
    await user.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should not render delete button when onDelete is not provided', () => {
    render(<WaitNodeConfig {...defaultProps} onDelete={undefined} />)

    expect(screen.queryByText('Delete Node')).not.toBeInTheDocument()
  })

  it('should format preview correctly with different combinations', async () => {
    const user = userEvent.setup()
    render(<WaitNodeConfig {...defaultProps} />)

    // Test hours only
    const hoursInput = screen.getByLabelText('Hours')
    await user.clear(hoursInput)
    await user.type(hoursInput, '2')
    await user.clear(screen.getByLabelText('Minutes'))
    await user.clear(screen.getByLabelText('Seconds'))
    
    expect(screen.getByText('Wait for 2h')).toBeInTheDocument()

    // Test seconds only
    await user.clear(hoursInput)
    const secondsInput = screen.getByLabelText('Seconds')
    await user.clear(secondsInput)
    await user.type(secondsInput, '30')
    
    expect(screen.getByText('Wait for 30s')).toBeInTheDocument()
  })
})
