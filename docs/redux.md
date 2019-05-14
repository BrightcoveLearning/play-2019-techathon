# Redux

[Redux][redux] is a pattern for managing the state of Javascript applications. It can be used with view libraries, including [React][redux-with-react]. The state that we store in React components in our project could be kept in a Redux store, though our application is simple enough that it is not necessary.

You can learn about Redux by going through the [basic][redux-basics] and [advanced tutorials][redux-adv] to understand how Redux could be helpful to a Javascript application.

## Solution

If you came from our [guide][guide], hopefully you tried out adding Redux in to your solution. Now you can take a look at our [full solution of the project with Redux][full-solution] to see how we chose to implement Redux in the project. Pay particular attention to the use of [async actions][full-solution-actions] in `actions.js` and [combined reducers][full-solution-reducers] in `reducers.js`.

## References
- [Redux][redux]
- [Redux: Usage with React][redux-with-react]
- [React-Redux][react-redux]
- [Redux Basics][redux-basics]
- [Redux Advanced Tutorial][redux-adv]
- [Redux Full Solution][full-solution]
- [Project Guide][guide]

[redux]: https://redux.js.org/
[react-redux]: https://react-redux.js.org/
[redux-with-react]: https://redux.js.org/basics/usage-with-react
[redux-basics]: https://redux-docs.netlify.com/basics
[redux-adv]: https://redux-docs.netlify.com/advanced
[async-actions]: https://redux-docs.netlify.com/advanced/async-actions
[full-solution]: https://github.com/BrightcoveLearning/play-2019-techathon/tree/redux-solution
[full-solution-actions]: https://github.com/BrightcoveLearning/play-2019-techathon/blob/redux-solution/src/actions.js
[full-solution-reducers]: https://github.com/BrightcoveLearning/play-2019-techathon/blob/redux-solution/src/reducers.js
[guide]: ./guide.md#extra-credit-redux-version
