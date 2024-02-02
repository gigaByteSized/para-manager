interface IErrorState {
    error: string | null
    dispatch: React.Dispatch<
      IReducerAction<TErrorActionType, TErrorActionPayload>
    > | null
  }
  
  type TErrorActionPayload = string | null
  type TErrorActionType = 'SHOW_ERROR'