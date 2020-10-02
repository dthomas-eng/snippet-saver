import React from "react";
import { render } from "@testing-library/react";
import BodyLoader from "../../src/components/layout/BodyLoader";
import BodyLoaderContext from "../../src/context/bodyLoader/bodyLoaderContext";

describe("BodyLoader Component tests", () => {
  test("BodyLoader renders", () => {
    const { getByAltText } = render(
      <BodyLoaderContext.Provider
        value={{
          showIt: true,
        }}
      >
        <BodyLoader />
      </BodyLoaderContext.Provider>
    );

    getByAltText("loading...");
  });
});
