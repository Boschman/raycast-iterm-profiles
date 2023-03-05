import { Action, ActionPanel, closeMainWindow, List, popToRoot, showToast, Toast } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { getItermProfiles, openProfile } from "./iTermProfiles";

const openProfileAction = (profileName: string) => {
  openProfile(profileName)
    .then(async () => {
      await closeMainWindow();
      await popToRoot();
    })
    .catch(async (e) => {
      await showToast({
        style: Toast.Style.Failure,
        title: "Error opening iTerm Profile",
        message: e.message,
      });
    });
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
