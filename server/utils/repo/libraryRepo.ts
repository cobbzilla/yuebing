import { ybRepo } from "~/server/utils/system";
import { LibraryType, LibraryTypeDef } from "yuebing-model";

export const libraryRepository = () => ybRepo<LibraryType>(LibraryTypeDef);
