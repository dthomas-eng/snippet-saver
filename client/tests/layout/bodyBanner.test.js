import React from "react";
import { render } from "@testing-library/react";
import BodyBanner from "../../src/components/layout/BodyBanner";
import BodyBannerContext from "../../src/context/bodyBanner/bodyBannerContext";

describe("BodyBanner Component tests", () => {
  test("BodyBanner renders", () => {
    const { getByText } = render(
      <BodyBannerContext.Provider
        value={{
          shown: true,
          msg: "This is the test message.",
        }}
      >
        <BodyBanner />
      </BodyBannerContext.Provider>
    );

    getByText("This is the test message.");
  });
});
