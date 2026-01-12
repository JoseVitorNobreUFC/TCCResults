// @ts-nocheck
const getAuthFromAuthHeader = (headers: Record<string, string>) =>
  pipe(
    headers.Authorization,
    O.fromNullable,
    O.map((a) => a.split(` `)),
    O.filter((a) => a.length > 1),
    O.chain((kv) =>
      O.fromNullable(
        (() => {
          switch (kv[0].toLowerCase()) {
            case `bearer`:
              return <HoppRESTAuth>{
                authActive: true,
                authType: `bearer`,
                token: kv[1],
              }
            case `basic`: {
              const [username, password] = pipe(
                O.tryCatch(() => atob(kv[1])),
                O.map(S.split(`:`)),
                O.filter((arr) => arr.length > 0),
                O.map(
                  ([username, password]) =>
                    <[string, string]>[username, password]
                ),
                O.getOrElse(() => [``, ``])
              )
              if (!username) return undefined
              return <HoppRESTAuth>{
                authActive: true,
                authType: `basic`,
                username,
                password: password ?? ``,
              }
            }
            default:
              return undefined
          }
        })()
      )
    )
  )