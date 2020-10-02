import React from "react";
import { render } from "@testing-library/react";
import ListLoader from "../../src/components/layout/ListLoader";
import ListLoaderContext from "../../src/context/listLoader/listLoaderContext";

describe("ListLoader Component tests", () => {
  test("ListLoader renders", () => {
    const { getByAltText } = render(
      <ListLoaderContext.Provider
        value={{
          showIt: true,
        }}
      >
        <ListLoader />
      </ListLoaderContext.Provider>
    );

    getByAltText("loading...");
  });
});
