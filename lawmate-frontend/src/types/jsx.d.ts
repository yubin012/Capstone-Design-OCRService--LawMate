import * as React from 'react';

declare global {
  namespace JSX {
    // props: unknown, type: string | JSXElementConstructor<unknown>
    type Element = React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>;

    interface IntrinsicElements {
      [elemName: string]: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}
