import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';
import React from 'react';
import { Link } from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER } from '../utils/queries';
import Auth from '../utils/auth';


function Profile() {
  const { loading, data } = useQuery(QUERY_USER);
  let user;

  if (data) {
    user = data.user;
  }
  if (loading) {
    return <h2>LOADING...</h2>;
  }
  return (
    <>
            <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      {/* <Container>
        <h2 className='pt-5'>
          {user.savedBooks?.length
            ? `Viewing ${user.savedBooks.length} saved ${user.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {user.savedBooks?.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container> */}
    </>
  );
}

export default Profile;