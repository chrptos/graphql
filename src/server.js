const { ApolloServer, gql } = require("apollo-server");

// HackerNewsの投稿情報
let links = [
    { id: "link-0", description: "tutorial1", url: "http://google1.com/" },
    { id: "link-1", description: "tutorial2", url: "http://google2.com/" },
    { id: "link-2", description: "tutorial3", url: "http://google3.com/" },
]

// GraphQLスキーマの定義
const typeDefs = gql`
    type Query {
        info: String!
        feed: [Link]!
    }
    type Link {
        id: ID!
        description: String!
        url: String!
    }
    type Mutation {
        post(url: String!, description: String!): Link!
    }
`

// リゾルバ（スキーマに対応する）
const resolvers = {
    Query: {
        info: () => "HackerNewsクローン",
        feed: () => links,
    },
    Mutation: {
        post: (parent, args) => {
            let idCount = links.length;
            const link = {
                id: `link-${idCount++}`,
                description: args.description,
                url: args.url,
            }
            links.push(link);
            return link;
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

server.listen().then(({ url }) => console.log(`${url}でサーバーを起動中...`))