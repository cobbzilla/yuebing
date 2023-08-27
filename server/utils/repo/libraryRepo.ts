import { LibraryType, LibraryTypeDef } from "yuebing-model";
import { ybRepo } from "~/server/utils/system";

export const libraryRepository = () => ybRepo<LibraryType>(LibraryTypeDef);
