import { runAppleScript } from "@raycast/utils";
import { parseFile } from "bplist-parser";
import { homedir } from "os";

const iTermConfigFile = homedir() + "/Library/Preferences/com.googlecode.iterm2.plist";

type ITermPreferences = { "New Bookmarks"?: { Name?: string }[] };

const getItermProfiles = async () => {
  const [preferences] = await parseFile<ITermPreferences>(iTermConfigFile);
  const bookmarks = preferences["New Bookmarks"] ?? [];

  return bookmarks.filter((bookmark) => bookmark.Name).map((bookmark) => ({ name: bookmark.Name as string }));
};

const openProfile = (profileName: string) => runAppleScript(appleScriptToOpenProfile(profileName));

const appleScriptToOpenProfile = (profileName: string) =>
  `
    tell application "iTerm"
        activate
        
        set isRunning to (count of windows) > 0

        if not (isRunning) then
            delay 0.5
            close the current window
            create window with profile "` +
  profileName +
  `"
        end if

        set hasNoWindows to ((count of windows) is 0)
        if isRunning and hasNoWindows then
            delay 0.5
            close the current window
            create window with profile "` +
  profileName +
  `"
        end if

        select first window

        tell the first window
            if isRunning and hasNoWindows is false then
                create tab with profile "` +
  profileName +
  `"
            end if
        end tell
    end tell`;

export { getItermProfiles, openProfile };
