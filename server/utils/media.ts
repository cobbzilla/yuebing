import { MediaPlugin, ParsedProfile, registerMediaPlugin } from "yuebing-media";
import { mediaPlugin as videoPlugin } from "yuebing-media-video";
import { MobilettoOrmRepository } from "mobiletto-orm";
import { MediaProfileType, MediaType } from "yuebing-model";

const ALL_PLUGINS: MediaPlugin[] = [videoPlugin];

const profileMap: Record<string, ParsedProfile[]> = {};

export const initializeMediaPlugins = async (
  mediaRepo: MobilettoOrmRepository<MediaType>,
  mediaProfileRepo: MobilettoOrmRepository<MediaProfileType>,
): Promise<void> => {
  if (Object.keys(profileMap).length > 0) return;
  for (const plugin of ALL_PLUGINS) {
    if (plugin.media && plugin.media.name) {
      profileMap[plugin.media.name] = await registerMediaPlugin(plugin, mediaRepo, mediaProfileRepo);
    }
  }
};

export const mediaPlugin = (name: string): MediaPlugin | undefined => ALL_PLUGINS.find((p) => p?.media?.name === name);
