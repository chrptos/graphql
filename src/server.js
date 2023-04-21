const { ApolloServer, gql } = require("apollo-server");
const fs = require("fs");
const { dirname } = require("path");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// リゾルバ（スキーマに対応する）
const resolvers = {
    Query: {
        info: () => "HackerNewsクローン",
        feed: async (parent, args, context) => {
            return context.prisma.link.findMany();
        },
    },
    Mutation: {
        post: (parent, args, context) => {
            const newLink = context.prisma.link.create({
                data: {
                    url: args.url,
                    description: args.description,
                }
            });
            return newLink;
        }
    }
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf-8"),
    resolvers,
    context: {
        prisma, // ここに宣言することで、Prismaがリゾルバ内で利用できる。
    },
})

server.listen().then(({ url }) => console.log(`${url}でサーバーを起動中...`))