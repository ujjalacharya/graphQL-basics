import { GraphQLServer } from "graphql-yoga";

const users = [
  {
    id: "1a",
    name: "Ujjal",
    email: "acharyaujjal1@gmail.com",
    age: 22
  },
  {
    id: "1b",
    name: "Colt",
    email: "colt@gmail.com",
    age: 29
  },
  {
    id: "1c",
    name: "Stephen",
    email: "grider@gmail.com",
    age: 27
  }
];
const posts = [
  {
    id: "1",
    title: "Nike Shoes",
    body: "Brand new nike shoes is on sale",
    isPublished: true,
    author: "1a"
  },
  {
    id: "2",
    title: "Pocophone f1",
    body: "Get brand new xiaomi pocophone at cheapest price",
    isPublished: true,
    author: "1b"
  },
  {
    id: "3",
    title: "Oneplus 6T",
    body: "One plus releases 6T",
    isPublished: false,
    author: "1b"
  }
];

const typeDefs = `
  type Query{
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    me: User!
    post: Post!
  }

  type User{
    id: ID!,
    name: String!,
    email: String,
    age: Int
    posts: [Post]!
  }

  type Post{
    id: ID!,
    title: String!,
    body: String!,
    isPublished: Boolean!
    author: User!
  }

`;
const resolvers = {
  Query: {
    posts(parent, args, ctx, info) {
      if (args.query) {
        return posts.filter(post => {
          const title = post.title
            .toLowerCase()
            .includes(args.query.toLowerCase());
          const body = post.body
            .toLowerCase()
            .includes(args.query.toLowerCase());
          return title || body;
        });
      }
      return posts;
    },
    users(parent, args, ctx) {
      if (args.query) {
        return users.filter(user => {
          return user.name.toLowerCase().includes(args.query.toLowerCase());
        });
      }
      return users;
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
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        // return single value if post's author === user's id
        return user.id === parent.author;
      });
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => {
        // return array if post's author === user's id        
        return parent.id === post.author;
      });
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
