import { GraphQLServer } from "graphql-yoga";

const typeDefs = `
  type Query{
    greetings(name: String): String!
    me: User!
    post: Post!
    add(numbers: [Float!]!): Float!
  }

  type User{
    id: ID!,
    name: String!,
    email: String,
    age: Int
  }

  type Post{
    id: ID!,
    title: String!,
    body: String!,
    isPublished: Boolean!
  }

`;
const resolvers = {
  Query: {
    add(parent, args) {
      if (args.numbers.length) {
        return args.numbers.reduce((acc, current) => {
          return acc + current;
        });
      }
      return 0;
    },
    greetings(parent, args) {
      if (args.name) {
        return `Hey there, ${args.name}!`;
      }
      return "Hey there, Guest!";
    },
    me() {
      return {
        id: "12345",
        name: "Ujjal",
        email: "acharyaujjal1@gmail.com",
        age: 22
      };
    },
    post() {
      return {
        id: "abc12",
        title: "Post about dogs",
        body: "Some description on dogs",
        isPublished: true
      };
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log("Graphql server is up and running at port 4000");
});
