import { configureStore, createSlice } from '@reduxjs/toolkit'
import { increment, decrement } from './functions'

export interface ClockState {
  session: number
  break: number
  sessionTime: number
  breakTime: number
  running: boolean
  isSession: boolean
}

const defaultSession = 1500
const defaultBreak = 300

const clockSlice = createSlice({
  name: 'clock',
  initialState: {
    session: defaultSession,
    break: defaultBreak,
    sessionTime: defaultSession,
    breakTime: defaultBreak,
    running: false,
    isSession: true,
  } as ClockState,
  reducers: {
    incrementSession: state => {
      state.session = increment(state.session)
      state.sessionTime = increment(state.sessionTime)
    },
    incrementBreak: state => {
      state.break = increment(state.break)
      state.breakTime = increment(state.breakTime)
    },
    decrementSession: state => {
      state.session = decrement(state.session)
      state.sessionTime = decrement(state.sessionTime)
    },
    decrementBreak: state => {
      state.break = decrement(state.break)
      state.breakTime = decrement(state.breakTime)
    },
    toggleRunning: state => {
      state.running = !state.running
    },
    toggleTimer: state => {
      state.isSession = !state.isSession
      state.isSession
        ? (state.breakTime = state.break)
        : (state.sessionTime = state.session)
    },
    reduceTime: state => {
      state.isSession
        ? (state.sessionTime =
            state.sessionTime > 0 ? state.sessionTime - 1 : 0)
        : (state.breakTime = state.breakTime > 0 ? state.breakTime - 1 : 0)
    },
    resetTimer: () => {
      return {
        session: defaultSession,
        break: defaultBreak,
        sessionTime: defaultSession,
        breakTime: defaultBreak,
        running: false,
        isSession: true,
      } as ClockState
    },
  },
})

export const {
  incrementBreak,
  incrementSession,
  decrementBreak,
  decrementSession,
  toggleRunning,
  toggleTimer,
  reduceTime,
  resetTimer,
} = clockSlice.actions

export const store = configureStore({
  reducer: clockSlice.reducer,
})
