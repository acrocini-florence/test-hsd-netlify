import { BiesseTheme } from "@biesse-group/react-components";
import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme extends BiesseTheme {
    table: {
      borderColor: string;
    };
  }
}
