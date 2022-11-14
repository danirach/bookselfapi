/* eslint-disable prettier/prettier */
const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);

  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    finished,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: "error",
    message: "Buku gagal ditambahkan",
  });

  response.code(500);
  return response;
};
const getAllBookHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  if (name) {
    const filteredBooksName = books.filter((book) => {
      const nameRegex = new RegExp(name, "gi");
      return nameRegex.test(book.name);
    });

    // eslint-disable-next-line no-shadow
    const filterBookName = filteredBooksName.map(({ id, name, publisher }) => ({
      id,
      name,
      publisher,
    }));

    const response = h.response({
      status: "success",
      data: {
        books: filterBookName,
      },
    });

    return response;
  }

  if (reading) {
    const filteredBooksReading = books.filter((book) => Number(book.reading) === Number(reading));

    // eslint-disable-next-line no-shadow
    const filterBookRead = filteredBooksReading.map(({ id, name, publisher }) => ({
      id,
      name,
      publisher,
    }));

    const response = h.response({
      status: "success",
      data: {
        books: filterBookRead,
      },
    });

    return response;
  }

  if (finished) {
    const filteredBooksFinished = books.filter((book) => Number(book.finished) === Number(finished));

    // eslint-disable-next-line no-shadow
    const filterBookFinish = filteredBooksFinished.map(({ id, name, publisher }) => ({
      id,
      name,
      publisher,
    }));

    const response = h.response({
      status: "success",
      data: {
        books: filterBookFinish,
      },
    });

    return response;
  }
  // eslint-disable-next-line no-shadow
  const getItem = books.map(({ id, name, publisher }) => ({
    id,
    name,
    publisher,
  }));
  return {
    status: "success",
    data: {
      books: getItem,
    },
  };
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((n) => n.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: "success",
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });

  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }
  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
      author,
    };
    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

const deleteBookHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};
module.exports = {
  addBookHandler,
  getAllBookHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookHandler,
};
