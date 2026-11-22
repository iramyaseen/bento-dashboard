import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { useDashboardStore } from '../src/store/dashboardStore'
import { PomodoroWidget } from '../src/components/widgets/PomodoroWidget'

vi.mock('../src/store/dashboardStore', () => ({
  useDashboardStore: vi.fn(),
}))

describe('PomodoroWidget', () => {
  const mockStartPomodoro = vi.fn()
  const mockPausePomodoro = vi.fn()
  const mockResetPomodoro = vi.fn()
  const mockTickPomodoro = vi.fn()
  const mockSkipPomodoroPhase = vi.fn()

  const defaultPomodoroState = {
    timeLeft: 25 * 60,
    isRunning: false,
    mode: 'work' as const,
    sessionsCompleted: 0,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    ;(useDashboardStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      pomodoro: defaultPomodoroState,
      startPomodoro: mockStartPomodoro,
      pausePomodoro: mockPausePomodoro,
      resetPomodoro: mockResetPomodoro,
      tickPomodoro: mockTickPomodoro,
      skipPomodoroPhase: mockSkipPomodoroPhase,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders with initial state', () => {
    render(<PomodoroWidget />)
    
    expect(screen.getByText('Focus Time')).toBeInTheDocument()
    expect(screen.getByText('25:00')).toBeInTheDocument()
    expect(screen.getByText('Sessions completed:')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('starts timer when play button is clicked', () => {
    render(<PomodoroWidget />)
    
    fireEvent.click(screen.getByLabelText('Start timer'))

    expect(mockStartPomodoro).toHaveBeenCalled()
  })

  it('pauses timer when pause button is clicked', () => {
    ;(useDashboardStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      pomodoro: { ...defaultPomodoroState, isRunning: true },
      startPomodoro: mockStartPomodoro,
      pausePomodoro: mockPausePomodoro,
      resetPomodoro: mockResetPomodoro,
      tickPomodoro: mockTickPomodoro,
      skipPomodoroPhase: mockSkipPomodoroPhase,
    })

    render(<PomodoroWidget />)
    
    fireEvent.click(screen.getByLabelText('Pause timer'))

    expect(mockPausePomodoro).toHaveBeenCalled()
  })

  it('resets timer when reset button is clicked', () => {
    render(<PomodoroWidget />)
    
    fireEvent.click(screen.getByLabelText('Reset timer'))

    expect(mockResetPomodoro).toHaveBeenCalled()
  })

  it('skips to next phase when skip button is clicked', () => {
    render(<PomodoroWidget />)
    
    fireEvent.click(screen.getByLabelText('Skip to next phase'))

    expect(mockSkipPomodoroPhase).toHaveBeenCalled()
  })

  it('displays short break time correctly', () => {
    ;(useDashboardStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      pomodoro: { ...defaultPomodoroState, mode: 'shortBreak', timeLeft: 5 * 60 },
      startPomodoro: mockStartPomodoro,
      pausePomodoro: mockPausePomodoro,
      resetPomodoro: mockResetPomodoro,
      tickPomodoro: mockTickPomodoro,
      skipPomodoroPhase: mockSkipPomodoroPhase,
    })

    render(<PomodoroWidget />)
    
    expect(screen.getByText('Short Break')).toBeInTheDocument()
    expect(screen.getByText('05:00')).toBeInTheDocument()
  })

  it('displays long break time correctly', () => {
    ;(useDashboardStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      pomodoro: { ...defaultPomodoroState, mode: 'longBreak', timeLeft: 15 * 60 },
      startPomodoro: mockStartPomodoro,
      pausePomodoro: mockPausePomodoro,
      resetPomodoro: mockResetPomodoro,
      tickPomodoro: mockTickPomodoro,
      skipPomodoroPhase: mockSkipPomodoroPhase,
    })

    render(<PomodoroWidget />)
    
    expect(screen.getByText('Long Break')).toBeInTheDocument()
    expect(screen.getByText('15:00')).toBeInTheDocument()
  })

  it('displays sessions completed count', () => {
    ;(useDashboardStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      pomodoro: { ...defaultPomodoroState, sessionsCompleted: 3 },
      startPomodoro: mockStartPomodoro,
      pausePomodoro: mockPausePomodoro,
      resetPomodoro: mockResetPomodoro,
      tickPomodoro: mockTickPomodoro,
      skipPomodoroPhase: mockSkipPomodoroPhase,
    })

    render(<PomodoroWidget />)
    
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('shows settings panel when settings button is clicked', () => {
    render(<PomodoroWidget />)
    
    fireEvent.click(screen.getByText('Settings'))

    expect(screen.getByText('Work Duration (minutes)')).toBeInTheDocument()
  })

  it('toggles settings visibility', () => {
    render(<PomodoroWidget />)
    
    fireEvent.click(screen.getByText('Settings'))
    expect(screen.getByText('Hide Settings')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Hide Settings'))
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })
})
