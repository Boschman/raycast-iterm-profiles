import { runAppleScript } from "run-applescript";
import bplist from "bplist-parser";
import { homedir } from "os";

const iTermConfigFile = homedir + "/Library/Preferences/com.googlecode.iterm2.plist";

const getItermProfiles = async () => {
  const obj = await bplist.parseFile(iTermConfigFile, (err: Error | null) => {
    if (null !== err) {
      console.log(err.message);
    }
  });

  const bookmarks = obj[0]["New Bookmarks"];

  const profiles = [];

  for (let i = 0; i < bookmarks.length; i++) {
    if (bookmarks[i].Name) {
      profiles.push({
        name: bookmarks[i].Name,
      });
    }
  }

  return profiles;
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
