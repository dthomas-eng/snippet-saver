import React from "react";
import { render } from "@testing-library/react";
import ListAlert from "../../src/components/layout/ListAlert";
import ListAlertContext from "../../src/context/listAlert/listAlertContext";

describe("ListAlert Component tests", () => {
  test("ListAlert renders", () => {
    const { getByText } = render(
      <ListAlertContext.Provider
        value={{
          showError: true,
          msg: "This is the test message.",
        }}
      >
        <ListAlert />
      </ListAlertContext.Provider>
    );

    getByText("This is the test message.");
  });
});
