import { configureStore } from '@reduxjs/toolkit'

/**
 * Корневой редьюсер.
 *
 * Пока нет ни одного среза (slice), используется заглушка, возвращающая
 * состояние без изменений. Когда появится первый срез, замените её на
 * `combineReducers({ someSlice })` из @reduxjs/toolkit.
 */
const rootReducer = (state = {}) => state

/**
 * Глобальное состояние приложения.
 */
const store = configureStore({
  reducer: rootReducer,
})

/** Состояние приложения. */
export type RootState = ReturnType<typeof store.getState>

/** Диспетчер действий приложения. */
export type AppDispatch = typeof store.dispatch

export default store
