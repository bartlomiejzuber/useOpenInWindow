import * as React from "react";

import { fireEvent, render } from "@testing-library/react";

import { useOpenInWindow } from "./useOpenInWindow";

describe("useOpenInWindow()", () => {
  describe("url as first arg", () => {
    it("should wait for callback invoke", () => {
      const spy = jest.spyOn(global as any, "open");
      const HookTestComponent: React.FunctionComponent<any> = () => {
        const [handleWindowOpen] = useOpenInWindow("blabla");
        return (
          <div>
            <div data-testid="onClickHandler" onClick={handleWindowOpen}></div>
          </div>
        );
      };

      render(<HookTestComponent />);

      expect(spy).not.toHaveBeenCalled();
    });

    it("should call window.open with correct params", () => {
      const windowOpenMock = jest.fn();
      (global as any).open = windowOpenMock;
      const url = "/blabla";
      const HookTestComponent: React.FunctionComponent<any> = () => {
        const [handleWindowOpen] = useOpenInWindow(url);
        return (
          <div>
            <div data-testid="onClickHandler" onClick={handleWindowOpen}></div>
          </div>
        );
      };

      const { getByTestId } = render(<HookTestComponent />);
      fireEvent.click(getByTestId("onClickHandler"));

      expect(windowOpenMock).toHaveBeenCalledWith(
        url,
        expect.any(String),
        expect.any(String)
      );
    });

    it("should focus new window", () => {
      const newWindowMock = {
        focus: jest.fn(),
      };
      (global as any).open = jest.fn(() => newWindowMock);
      const url = "/blabla";
      const HookTestComponent: React.FunctionComponent<any> = () => {
        const [handleWindowOpen] = useOpenInWindow(url);
        return (
          <div>
            <div data-testid="onClickHandler" onClick={handleWindowOpen}></div>
          </div>
        );
      };

      const { getByTestId } = render(<HookTestComponent />);
      fireEvent.click(getByTestId("onClickHandler"));

      expect(newWindowMock.focus).toHaveBeenCalledTimes(1);
    });

    it("should open not centered window", () => {
      const newWindowMock = {
        focus: jest.fn(),
      };
      (global as any).open = jest.fn(() => newWindowMock);
      const url = "/blabla";
      const HookTestComponent: React.FunctionComponent<any> = () => {
        const [handleWindowOpen] = useOpenInWindow(url, { centered: false });
        return (
          <div>
            <div data-testid="onClickHandler" onClick={handleWindowOpen}></div>
          </div>
        );
      };

      const { getByTestId } = render(<HookTestComponent />);
      fireEvent.click(getByTestId("onClickHandler"));

      expect((global as any).open).toHaveBeenCalledWith<any>(
        expect.any(String),
        expect.not.stringContaining("top=0"),
        expect.any(String)
      );
    });
  });

  describe("options as first arg", () => {
    it("should wait for callback invoke when options passed as first argument", () => {
      const spy = jest.spyOn(global as any, "open");
      const HookTestComponent: React.FunctionComponent<any> = () => {
        const [handleWindowOpen] = useOpenInWindow({ url: "blabla" });
        return (
          <div>
            <div data-testid="onClickHandler" onClick={handleWindowOpen}></div>
          </div>
        );
      };

      render(<HookTestComponent />);

      expect(spy).not.toHaveBeenCalled();
    });

    it("should call window.open with correct params", () => {
      const windowOpenMock = jest.fn();
      (global as any).open = windowOpenMock;
      const url = "/blabla";
      const HookTestComponent: React.FunctionComponent<any> = () => {
        const [handleWindowOpen] = useOpenInWindow({ url });
        return (
          <div>
            <div data-testid="onClickHandler" onClick={handleWindowOpen}></div>
          </div>
        );
      };

      const { getByTestId } = render(<HookTestComponent />);
      fireEvent.click(getByTestId("onClickHandler"));

      expect(windowOpenMock).toHaveBeenCalledWith(
        url,
        expect.any(String),
        expect.any(String)
      );
    });

    it("should focus new window", () => {
      const newWindowMock = {
        focus: jest.fn(),
      };
      (global as any).open = jest.fn(() => newWindowMock);
      const url = "/blabla";
      const HookTestComponent: React.FunctionComponent<any> = () => {
        const [handleWindowOpen] = useOpenInWindow({ url });
        return (
          <div>
            <div data-testid="onClickHandler" onClick={handleWindowOpen}></div>
          </div>
        );
      };

      const { getByTestId } = render(<HookTestComponent />);
      fireEvent.click(getByTestId("onClickHandler"));

      expect(newWindowMock.focus).toHaveBeenCalledTimes(1);
    });
  });

  describe.only("options passed through callback", () => {
    it("should call window.open with overridden settings", () => {
      const windowOpenMock = jest.fn();
      (global as any).open = windowOpenMock;
      const url = "/blabla";
      const overriddenUrl = "/blabla2";
      const HookTestComponent: React.FunctionComponent<any> = () => {
        const [handleWindowOpen] = useOpenInWindow({ url });

        return (
          <div>
            <div
              data-testid="onClickHandler"
              onClick={() => handleWindowOpen({} as any, { url: overriddenUrl })}
            ></div>
          </div>
        );
      };

      const { getByTestId } = render(<HookTestComponent />);
      fireEvent.click(getByTestId("onClickHandler"));

      expect(windowOpenMock).toHaveBeenCalledWith(
        overriddenUrl,
        expect.any(String),
        expect.any(String)
      );
    });

    it("should call window.open with url from settings when not overridden", () => {
      const windowOpenMock = jest.fn();
      (global as any).open = windowOpenMock;
      const url = "/blabla";
      const HookTestComponent: React.FunctionComponent<any> = () => {
        const [handleWindowOpen] = useOpenInWindow({ url });

        return (
          <div>
            <div
              data-testid="onClickHandler"
              onClick={() => handleWindowOpen({} as any)}
            ></div>
          </div>
        );
      };

      const { getByTestId } = render(<HookTestComponent />);
      fireEvent.click(getByTestId("onClickHandler"));

      expect(windowOpenMock).toHaveBeenCalledWith(
        url,
        expect.any(String),
        expect.any(String)
      );
    });
  });
});
