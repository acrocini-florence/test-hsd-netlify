import { sortLike } from "../../utils/array";

const cardsOrderArray = ["company-page-1", "company-page-2", "company-page-3"];

export const sortCompanyCard = (cards: Queries.CompanyCardFragment[]) =>
  sortLike(cards, cardsOrderArray, (card) => card.handler);
