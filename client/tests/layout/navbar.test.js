import React from "react";
import { render } from "@testing-library/react";
import Navbar from "../../src/components/layout/Navbar";

import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";

describe("Navbar Component tests", () => {
  test("Navbar renders", () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router history={history}>
        <Navbar showNew='true' />
      </Router>
    );

    getByText("SNIPPET SAVER");
    getByText("+ New");
  });
});
