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

// get /books - Shows the full list of books.
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

// get /books/new - Shows the create new book form.
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
    res.redirect(`/${newBook.id}`);
  })
);
// get /books/:id - Shows book detail form.
router.get(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    res.render("book-details", { title: book.title, book });
  })
);
// post /books/:id - Updates book info in the database.
router.post("/:id", function (req, res, next) {
  // res.send("post :id route");
});
// post /books/:id/delete - Deletes a book. Careful, this can’t be undone. It can be helpful to create a new “test” book to test deleting.
router.post("/:id/delete", function (req, res, next) {
  res.send(":id/delete route");
});

module.exports = router;
