
import {
  gql
} from "@apollo/client"

const getBooks = gql`
  {
    books {
      name
      id
    }
  }
`;

const getAuthorsQuery = gql`
    {
        authors {
            name
            id
        }
    }
`;

const addBookMutation = gql`
  mutation AddBook($name: String!, $genre: String!, $authorId: ID!) {
        addBook(name: $name, genre: $genre, authorId: $authorId) {
            name
    }
  }
`

const getBook = gql`
  query($id: ID){
    book(id: $id){
      id
      name
      genre
      author {
        id
        name
        books{
          name
          id
        }
      }
    }
  }
`
export {getBooks, getAuthorsQuery, addBookMutation, getBook}