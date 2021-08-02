const middlewareAdapter = (context, middleware, idx) => {
  const nextMiddleware = middleware[idx]

  if (!nextMiddleware) {
    return context.next
  }

  return () => {
    const nextAdapter = middlewareAdapter(context, middleware, idx + 1)

    nextMiddleware({ ...context, next: nextAdapter })
  }
}

export default middlewareAdapter
