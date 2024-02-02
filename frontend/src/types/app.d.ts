// interface IReducerAction<T, U> {
//   type: T
//   payload: U
// }

// interface IContext<T, U> {
//   data: T
//   dispatch: (params: U) => T
// }

type IEvent = unknown

type IMap<T> = {
  [key: string]: T
}