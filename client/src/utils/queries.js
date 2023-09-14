import { gql } from '@apollo/client';


export const QUERY_CHECKOUT = gql`
  query getCheckout($products: [ProductInput]) {
    checkout(products: $products) {
      session
    }
  }
`;

export const QUERY_USERS_BOOKS = gql`
query getUserOwnedBooks($userId: ID!) {
  userBooks(userId: $userId) {
    _id
    title
    authors
    description
    condition
    image
    bookId
    category {
      _id
      name
    }
    owner {
      _id
      username
    }
  }
}

`;

export const QUERY_CATEGORIES = gql`
  {
    categories {
      _id
      name
    }
  }
`;

export const QUERY_ALL_SAVED_BOOKS = gql`
{
  books{
    _id
  title
  authors
  description
  image
  bookId
  category {
    _id
    name
  }
  owner {
    _id
    username
  }
}
}
`

export const QUERY_USER = gql`
  {
    user {
      _id
    username
    email
    ownedBooks {
        _id
        title
        authors
        description
        image
        bookId
      }
      }
    }
`;
