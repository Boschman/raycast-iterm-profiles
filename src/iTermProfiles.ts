import { runAppleScript } from "@raycast/utils";
import { parseFile } from "bplist-parser";
import { homedir } from "os";

const iTermConfigFile = homedir() + "/Library/Preferences/com.googlecode.iterm2.plist";
const iTermBundleId = "com.googlecode.iterm2";

type ITermPreferences = { "New Bookmarks"?: { Name?: string }[] };

const getItermProfiles = async () => {
  const [preferences] = await parseFile<ITermPreferences>(iTermConfigFile);
  const bookmarks = preferences["New Bookmarks"] ?? [];

  return bookmarks.filter((bookmark) => bookmark.Name).map((bookmark) => ({ name: bookmark.Name as string }));
};

const openProfile = (profileName: string) => runAppleScript(appleScriptToOpenProfile(profileName));

const toAppleScriptString = (value: string) => `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

// On a cold start iTerm opens its startup window asynchronously, so wait for it before replacing it.
// Without iTerm windows there is no current window, so create one instead of a tab.
const appleScriptToOpenProfile = (profileName: string) => {
  const profile = toAppleScriptString(profileName);

  return `
    set wasRunning to application id "${iTermBundleId}" is running

    tell application id "${iTermBundleId}"
        activate

        if not wasRunning then
            repeat 30 times
                if (count of windows) > 0 then exit repeat
                delay 0.1
            end repeat
            if (count of windows) > 0 then close first window
        end if

        if current window is missing value then
            create window with profile ${profile}
        else
            tell current window to create tab with profile ${profile}
        end if
    end tell`;
};

export { getItermProfiles, openProfile };
