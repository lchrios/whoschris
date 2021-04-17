import React from 'react'
import { Redirect } from 'react-router-dom'

const redirectRoute = [
    {
      path: "/",
      exact: true,
      component: () => history.push("/")
    },
  ];

const errorRoute = [
    {
        component: () => <Redirect to="/session/404" />,
    },
]

const routes = [
    ...redirectRoute,
    ...errorRoute,
]

export default routes