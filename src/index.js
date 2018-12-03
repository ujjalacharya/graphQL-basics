import { GraphQLServer } from "graphql-yoga";
import uuid4 from 'uuid/v4'

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
const comments = [
  {
    id: "101",
    text: "This is so awesome",
    author: "1c",
    post: "3"
  },
  {
    id: "102",
    text: "I love Graphql",
    author: "1a",
    post: "1"
  },
  {
    id: "103",
    text: "I love Ujjal Acharya",
    author: "1a",
    post: "1"
  }
];

const typeDefs = `
  type Query{
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
    me: User!
    post: Post!
  }

  type Mutation{
    createUser(name: String!, email: String!, age: Int): User!
  }

  type User{
    id: ID!,
    name: String!,
    email: String,
    age: Int
    posts: [Post]!
    comments: [Comment]!
  }

  type Post{
    id: ID!,
    title: String!,
    body: String!,
    isPublished: Boolean!
    author: User!
    comments: [Comment]!
  }

  type Comment{
    id: ID!
    text: String!
    author: User!
    post: Post!
  }

`;
const resolvers = {
  Query: {
    comments(parent, args, ctx, info) {
      return comments;
    },

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
  Mutation:{
    createUser(parent, args, ctx, info){
      let {name, email, age} = args;
      const emailTaken = users.some(user => user.email === args.email)
      if(emailTaken){
        throw new Error('Email taken!')
      }
      const newuser = {
        id: uuid4(),
        name,
        email,
        age
      };
      
      users.push(newuser);
      return newuser;
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        // return single value if post's author === user's id
        return user.id === parent.author;
      });
    },
    
    comments(parent, args, ctx, info){
      return comments.filter(comment=>{
        return comment.post === parent.id
      })
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => {
        // return array if post's author === user's id
        return parent.id === post.author;
      });
    },

    comments(parent, args, ctx, info) {
      return comments.filter(comment => {
        return comment.author === parent.id;
      });
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        console.log(user.id, parent.author);
        return user.id === parent.author;
      });
    },

    post(parent, args, ctx, info){
      return posts.find(post=>{
        return post.id === parent.post
      })
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
