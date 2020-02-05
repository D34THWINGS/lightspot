import { SafeResourceUrl } from "@angular/platform-browser";

export interface IResult {
  title: string;
  removeDash: boolean;
  icon?: SafeResourceUrl;
  action(): void;
}
