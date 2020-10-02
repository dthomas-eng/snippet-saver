import React from "react";
import { render } from "@testing-library/react";
import BodyAlert from "../../src/components/layout/BodyAlert";
import BodyAlertContext from "../../src/context/bodyAlert/bodyAlertContext";

describe("BodyAlert Component tests", () => {
  test("BodyAlert renders", () => {
    const { getByText } = render(
      <BodyAlertContext.Provider
        value={{
          showError: true,
          msg: "This is the test message.",
        }}
      >
        <BodyAlert />
      </BodyAlertContext.Provider>
    );

    getByText("This is the test message.");
  });
});
