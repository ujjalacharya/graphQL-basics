import { GraphQLServer } from "graphql-yoga";

/*
title String
price foat
realeaseYear int-opt
rating  float-opt
inStock Boolean
*/

const typeDefs = `
  type Query{
    title: String!
    price: Float!
    releaseYear: Int
    rating: Float
    inStock: Boolean!
  }
`

const resolvers = {
  Query:{
    title(){
      return 'Nike Shoes'
    },
    price(){
      return 2400.5
    },
    releaseYear(){
      return 2015
    },
    rating(){
      return 2.5
    },
    inStock(){
      return true
    },

  }
}

const server = new GraphQLServer({typeDefs, resolvers})

server.start(() => {
  console.log("GraphQL server is up and running!");
});
