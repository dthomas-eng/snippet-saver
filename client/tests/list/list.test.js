import React from "react";
import { render } from "@testing-library/react";
import ListAlertContext from "../../src/context/listAlert/listAlertContext";
import ListLoaderContext from "../../src/context/listLoader/listLoaderContext";
import ListContext from "../../src/context/list/listContext";
import List from "../../src/components/list/List";

import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";

const fakeSnippets = [
  {
    title: "Snippet 1",
    notes: "These are the notes for snippet 1.",
    code: {
      value: "This is the code for snippet 1.",
    },
    authorId: "fillerId1",
    authorName: "Snippet1 Author",
    dateUpdated: 10,
    isPrivate: false,
    likes: 0,
  },
  {
    title: "Snippet 2",
    notes: "These are the notes for snippet 2.",
    code: {
      value: "This is the code for snippet 2.",
    },
    authorId: "fillerId2",
    authorName: "Snippet2 Author",
    dateUpdated: 100,
    isPrivate: false,
    likes: 10,
  },
];

describe("List Component tests", () => {
  test("List renders", () => {
    const history = createMemoryHistory();
    const { getAllByText } = render(
      <Router history={history}>
        <ListAlertContext.Provider
          value={{
            showError: true,
            msg: "This is the test message.",
            showAlert: () => {},
            hideAlert: () => {},
          }}
        >
          <ListLoaderContext.Provider
            value={{
              showIt: false,
              hideListLoader: () => {},
            }}
          >
            <ListContext.Provider
              value={{
                snippets: fakeSnippets,
                filteredList: [],
                searchValue: "",
                filterSnippets: false,
                loadingList: false,
              }}
            >
              <List />
            </ListContext.Provider>
          </ListLoaderContext.Provider>
        </ListAlertContext.Provider>
      </Router>
    );
    const found = getAllByText(/Snippet [0-9]/);
    expect(found).toHaveLength(2);
  });
});
