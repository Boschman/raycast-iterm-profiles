import { Action, ActionPanel, closeMainWindow, List, popToRoot, PopToRootType, showToast, Toast } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { getItermProfiles, openProfile } from "./iTermProfiles";

const openProfileAction = async (profileName: string) => {
  try {
    // iTerm taking focus closes the Raycast window, which pops to root and unloads the command
    // mid-script. Close the window first and suspend pop to root until the script is done.
    await closeMainWindow({ popToRootType: PopToRootType.Suspended });
    await openProfile(profileName);
  } catch (e: unknown) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Error opening iTerm Profile",
      message: (e as Error).message,
    });
  } finally {
    await popToRoot();
  }
};

const getProfiles = async () => {
  try {
    return await getItermProfiles();
  } catch (e: unknown) {
    const err = e as Error;
    await showToast({
      style: Toast.Style.Failure,
      title: "Error getting iTerm Profiles",
      message: err.message,
    });
    return [];
  }
};

export default function Command() {
  const { isLoading, data } = useCachedPromise(async () => getProfiles());

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Open iTerm Profile">
      {data?.map((profile) => (
        <List.Item
          icon="command-icon.png"
          title={profile.name}
          key={profile.name}
          actions={
            <ActionPanel>
              <Action title={'Open profile "' + profile.name + '"'} onAction={() => openProfileAction(profile.name)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
