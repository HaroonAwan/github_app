import {ApolloClient, InMemoryCache, HttpLink} from "@apollo/client";

let client: ApolloClient<any> | null = null;

export const getClient = (token: any) => {
    // create a new client if there's no existing one
    // or if we are running on the server.
    if (!client || typeof window === "undefined") {
        const httpLink = new HttpLink({
            uri: "https://api.github.com/graphql",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        client = new ApolloClient({
            link: httpLink,
            cache: new InMemoryCache({
                typePolicies: {
                    Query: {
                        fields: {
                            user: {
                                merge(existing = {}, incoming) {
                                },
                            },
                        },
                    },
                },
            }),
        });
    }

    return client;
};