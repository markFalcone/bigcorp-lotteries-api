## Module: State management with Redux

The lotteries App is growing nice, but you’ve noticed that local state is getting bigger. You need to find a way to manage state better than it’s done now. And then there’s also a case of unifying network requests and data handling from those.

After investigation into various solutions you’ve decided to use Redux as a state management tool - it will let you manage state of the app consistently and access it with ease.      

### End goal of this homework

The goal of this homework is to add and use redux package.

### Part 1: Redux and dependencies

1. Add `redux` and it’s dependencies to mobile app
2. Create Store, reducers and actions responsible for fetching lotteries and creating new ones
3. Add `redux-logger` package to inspect state and dispatched actions
4. Migrate setup to `redux-toolkit` for even better developer experience!
