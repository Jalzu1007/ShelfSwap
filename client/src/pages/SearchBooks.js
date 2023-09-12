import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row
} from 'react-bootstrap';

import Auth from '../utils/auth'
import { useMutation, useQuery } from '@apollo/client';
import CategoryMenu from "../components/CategoryMenu";
import Donate from "../components/Donate";

import { QUERY_USERS_BOOKS, QUERY_USER} from '../utils/queries';

import { SAVE_BOOK } from '../utils/mutations';

import { searchGoogleBooks } from '../utils/API';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';



const SearchBooks = () => {
  const { loading: loadingUserBooks, data: userBooksData } = useQuery(QUERY_USERS_BOOKS, {
    variables: { userId: '64ff6705fac2a0301c09d118'  },
  });
  // create state for holding returned google api data
  const [searchedBooks, setSearchedBooks] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');
  const { loading, data } = useQuery(QUERY_USER);
  const savedBooks = data?.user  ? data.user.ownedBooks : [];

  // create state to hold saved bookId values
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  const [addBook, { error }] = useMutation(SAVE_BOOK);

  const navigate = useNavigate();
  
  const [buttonLabel, setButtonLabel] = useState('Save Book');


  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  },[savedBookIds]);

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { items } = await response.json();

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
      }));
      console.log('this is a test', bookData)
      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a book to our database
  const handleSaveBook = async (bookId) => {
    // find the book in `searchedBooks` state by the matching id

    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);


  //   // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await addBook({
        variables: { bookInput: { ...bookToSave } },
      })
      

    // Check if the mutation was successful
    if (data && data.addBook) {
      // Update the user's owned books data with the newly saved book
      const updatedUserBooks = [...userBooksData.userBooks, data.addBook];
      setSavedBookIds([...savedBookIds, bookToSave.bookId]); // Update savedBookIds
      // Optionally, you can update the local state with the new data
      setSearchedBooks(updatedUserBooks);
      // Inform the user that the book was successfully saved
      console.log('Book is saved:', bookToSave.title);

      // Change the button label and disable it after saving
      setButtonLabel('Book is Saved');
      // Use navigate to redirect to the user's profile
      
}
  } catch (err) {
    console.error(err);
  }
};

  return (
    <>
      <div className="text-light bg-dark p-5">
       

        <Container>
          <h1>Search for Books!</h1> 
          <CategoryMenu />
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Donate />

      <Container>
      <h2 className='pt-5'>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to add to your collection'}
        </h2>
        <Row>
          {searchedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
                  {book.image ? (
                    <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    {/* Add the Save Book button here */}
                    {savedBooks.find((savedBook) => savedBook.bookId === book.bookId) ? (
                      <Button variant='info' disabled>
                        Book is Saved
                      </Button>
                    ) : (
                      <Button
                      variant='info'
                      onClick={() => handleSaveBook(book.bookId) }
                      disabled={buttonLabel === 'Book is Saved'}
                    >
                      {buttonLabel}
                    </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks;
