import React from 'react'
import Snackbar from '@mui/material/Snackbar'
import { Alert } from '@mui/material'

const HIDE_DURATION = 5000

interface IProps {
  children?: React.ReactNode
}

const ErrorHandler: React.FC<IProps> = ({ children }) => {
  //state
  const [state, dispatch] = React.useReducer(errorReducer, {
    error: null,
    dispatch: null,
  })

  const open = Boolean(state.error)

  // console.log({ errorState: state })

  return (
    <errorContext.Provider
      value={{
        error: state.error,
        dispatch,
      }}
    >
      {children}
      {open && (
        <Snackbar open={Boolean(state.error)} autoHideDuration={HIDE_DURATION}>
          <Alert severity="error">{state.error}</Alert>
        </Snackbar>
      )}
    </errorContext.Provider>
  )
}

export default ErrorHandler

const errorContext = React.createContext<IErrorState>({
  error: null,
  dispatch: null,
})

// eslint-disable-next-line react-refresh/only-export-components
export const useError = () => React.useContext<IErrorState>(errorContext)

const errorReducer = (
  state: IErrorState,
  action: IReducerAction<TErrorActionType, TErrorActionPayload>
): IErrorState => {
  switch (action.type) {
    case 'SHOW_ERROR':
      return {
        ...state,
        error: action.payload as string,
      }
    default:
      return state
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export const showErrorSnackbar = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { dispatch } = useError()
  if (!dispatch) return null
  return (error: string) => {
    dispatch({ type: 'SHOW_ERROR', payload: error })
    setTimeout(() => {
      dispatch({ type: 'SHOW_ERROR', payload: null })
    }, HIDE_DURATION)
  }
}