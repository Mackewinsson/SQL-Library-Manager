const express = require("express");
const router = express.Router();
const { Book } = require("../models");

/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      res.status(500).send(error);
    }
  };
}

// get /books - Shows the full list of books. OK
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const books = await Book.findAll();
    res.render("index", {
      title: "Books",
      books,
    });
  })
);

// get /books/new - Shows the create new book form. OK
router.get(
  "/new",
  asyncHandler(async (req, res) => {
    res.render("new-book", { title: "New Book" });
  })
);

// post /books/new - Posts a new book to the database.
router.post(
  "/",
  asyncHandler(async (req, res, next) => {
    const book = await req.body;
    const newBook = await Book.create(book);
    res.redirect(`/books/${newBook.id}`);
  })
);

// get /books/:id - Shows book detail form. OK
router.get(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("book-details", { title: book.title, book });
    } else {
      res.sendStatus(404);
    }
  })
);
// post /books/:id - Updates book info in the database.
router.post(
  "/:id/edit",
  asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    await book.update(req.body);
    res.redirect(`/books/${book.id}`);
  })
);
// post /books/:id/delete - Deletes a book. Careful, this can’t be undone. It can be helpful to create a new “test” book to test deleting.
router.post(
  "/:id/delete",
  asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    await book.destroy(req.body);
    res.redirect(`/books`);
  })
);

module.exports = router;
