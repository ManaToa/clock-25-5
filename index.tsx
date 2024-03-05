import { Provider, useDispatch, useSelector } from 'react-redux'
import {
  ClockState,
  decrementBreak,
  decrementSession,
  incrementBreak,
  incrementSession,
  reduceTime,
  resetTimer,
  store,
  toggleRunning,
  toggleTimer,
} from './redux'
import { FaMinusCircle, FaPause, FaPlay, FaPlusCircle } from 'react-icons/fa'
import { VscDebugRestart } from 'react-icons/vsc'
import { useEffect } from 'react'

interface SettingButtonProps {
  label: string
  value: number
  type: string
}

function SettingButton({ label, value, type }: SettingButtonProps) {
  const dispatch = useDispatch()
  function handleDecrement() {
    type === 'session'
      ? dispatch(decrementSession())
      : dispatch(decrementBreak())
  }

  function handleIncrement() {
    type === 'session'
      ? dispatch(incrementSession())
      : dispatch(incrementBreak())
  }

  return (
    <button className='block w-[10rem] p-1 rounded-sm hover:bg-ligthColorHover'>
      <div className='uppercase font-bold text-xl mb-4'>{label}</div>
      <div className='flex justify-center items-center'>
        <FaMinusCircle
          className='text-xl hover:text-mainColor'
          onClick={() => handleDecrement()}
        />
        <div className='text-4xl w-[4rem]'>{value}</div>
        <FaPlusCircle
          className='text-xl hover:text-mainColor'
          onClick={() => handleIncrement()}
        />
      </div>
    </button>
  )
}

function Settings() {
  const sessionValue = useSelector((state: ClockState) => state.session)
  const breakValue = useSelector((state: ClockState) => state.break)

  return (
    <div className='flex flex-col sm:flex-row items-center sm:justify-around lg:p-2'>
      <SettingButton
        label='Durée pause'
        value={Math.floor(breakValue / 60)}
        type='break'
      />
      <SettingButton
        label='Durée Session'
        value={Math.floor(sessionValue / 60)}
        type='session'
      />
    </div>
  )
}

function Session() {
  const isRunning = useSelector((state: ClockState) => state.running)
  const isSession = useSelector((state: ClockState) => state.isSession)
  const sessionTime = useSelector((state: ClockState) => state.sessionTime)
  const breakTime = useSelector((state: ClockState) => state.breakTime)
  const dispatch = useDispatch()

  function formatTime(timeInSec: number): string {
    const minutes = Math.floor(timeInSec / 60)
    const seconds = timeInSec % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`
  }

  function handleStartStop() {
    dispatch(toggleRunning())
  }

  useEffect(() => {
    let timer: number
    let timeout: number

    if (sessionTime === 0 || breakTime === 0)
      timer = setTimeout(() => dispatch(toggleTimer()), 1000)

    if (isRunning) timer = setInterval(() => dispatch(reduceTime()), 1000)

    return () => {
      if (timer) clearInterval(timer)
      if (timeout) clearTimeout(timeout)
    }
  }, [dispatch, isRunning, isSession, sessionTime, breakTime])

  return (
    <div className='flex flex-col items-center justify-center mt-5'>
      <div className='uppercase font-bold text-4xl mb-4'>
        {isSession ? 'Session' : 'Pause'}
      </div>
      <div
        className={`${
          (sessionTime <= 10 || breakTime <= 10) && 'text-mainColor'
        } text-6xl lg:text-7xl font-black text-center`}
      >
        {formatTime(isSession ? sessionTime : breakTime)}
      </div>
      <div className='flex text-3xl mt-7 cursor-pointer items-center mb-3 hover:*:text-mainColor *:mx-2'>
        {isRunning ? (
          <FaPause onClick={() => handleStartStop()} />
        ) : (
          <FaPlay onClick={() => handleStartStop()} />
        )}
        <VscDebugRestart
          className='text-4xl'
          onClick={() => dispatch(resetTimer())}
        />
      </div>
    </div>
  )
}

function ClockMachine() {
  return (
    <div className='bg-lightColor shadow-xl p-1 sm:p-6 rounded-sm w-full sm:w-[25rem]'>
      <Settings />
      <Session />
    </div>
  )
}

export default function Clock() {
  return (
    <Provider store={store}>
      <ClockMachine />
    </Provider>
  )
}
