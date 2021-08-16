const graphql = require('graphql');
const _ = require('lodash');
const Book = require("../models/book");
const Author = require("../models/author")

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

// // dummy data
// var books =[
//   {name:'My Favorite Fish and Water', genre: 'Essay', id:'1', authorId: '1'},
//   {name:'My Cats Leggy and Eho', genre: 'Poem', id:'2', authorId: '2'},
//   {name:'Winning Bitcoin', genre: 'Non-Fiction', id:'3', authorId: '3'},
//   {name:'Fotona 4D Pro guide', genre: 'Essay', id:'4', authorId: '2'},
//   {name:'Hiking 指南', genre: 'Poem', id:'5', authorId: '3'},
//   {name:'宵夜宝典', genre: 'Non-Fiction', id:'6', authorId: '3'},
// ];

// var authors = [
//   {name: 'eho', age:1, id: '1'},
//   {name: 'ivy', age:26, id: '2'},
//   {name: 'eo', age:33, id: '3'}
// ];

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: ( ) => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args){
        // return _.find(authors, { id: parent.authorId });
        return Author.findById(parent.authorId);
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: ( ) => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args){
        // return _.filter(books, { authorId: parent.id });
        return Book.find({ authorId: parent.id})
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: { 
      type: BookType,
      args: {id: { type: GraphQLID }},
      resolve(parent,args){
        //code to get data from db/ other source
        // return _.find(books, {id: args.id});
        return Book.findById(args.id)
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args){
        // return _.find(authors, { id: args.id });
        return Author.findById(args.id)
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args){
        // return books
        return Book.find({})
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args){
        // return authors
        return Author.find({})
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: new GraphQLNonNull(GraphQLInt)}
      },
      resolve(parent, args){
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return author.save();
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        genre: {type: new GraphQLNonNull(GraphQLString)},
        authorId: {type: new GraphQLNonNull(GraphQLID)}
      },
      resolve(parent, args){
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        });
        return book.save();
      }
    }
  }
})



module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
