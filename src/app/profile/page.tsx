import { TabBar } from "@/components/tab-bar";
import { UserIcon } from "@/components/icons";
import { SettingsRow, SettingsSection, SettingsToggleRow } from "@/components/settings";
import { getAppConfig, getUserProfile } from "@/lib/pokedex-service";

export const dynamic = "force-static";

export default function PerfilPage() {
  const config = getAppConfig();
  const t = config.texts;
  const userProfile = getUserProfile();

  return (
    <main className="mobile-shell flex flex-col bg-[#f2f3f5]">
      <header className="bg-white px-4 pb-5 pt-[calc(16px+env(safe-area-inset-top))]">
        <h1 className="text-[28px] font-black tracking-[-0.03em] text-[#222327]">{t.profilePageTitle}</h1>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#e8eaf2]">
            <UserIcon className="h-7 w-7 text-[#173EA5]" />
          </div>
          <div>
            <p className="text-[18px] font-bold text-[#1f2024]">{userProfile.username}</p>
            <p className="text-[12px] text-[#8a8c91]">{userProfile.email}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pt-5 pb-6">
        <SettingsSection title={t.profileAccountSection}>
          <SettingsRow label={t.profileNameLabel} value={userProfile.displayName} chevron />
          <SettingsRow label={t.profileEmailLabel} value={userProfile.email} chevron />
          <SettingsRow label={t.profilePasswordLabel} value={t.profilePasswordMask} chevron />
        </SettingsSection>

        <SettingsSection title={t.profilePokedexSection}>
          <SettingsToggleRow label={t.profileMegaEvolutionsLabel} enabled={userProfile.settings.megaEvolutions} />
          <SettingsToggleRow label={t.profileOtherFormsLabel} enabled={userProfile.settings.otherForms} />
        </SettingsSection>

        <SettingsSection title={t.profileNotificationsSection}>
          <SettingsToggleRow label={t.profileUpdatesLabel} enabled={userProfile.settings.notifyUpdates} />
          <SettingsToggleRow label={t.profilePokemonWorldLabel} enabled={userProfile.settings.notifyPokemonWorld} />
        </SettingsSection>

        <SettingsSection title={t.profileLanguageSection}>
          <SettingsRow label={t.profileInterfaceLanguageLabel} value={userProfile.settings.interfaceLanguage} chevron />
          <SettingsRow label={t.profileGameLanguageLabel} value={userProfile.settings.gameLanguage} chevron />
        </SettingsSection>

        <SettingsSection title={t.profileGeneralSection}>
          <SettingsRow label={t.profileVersionLabel} value={config.app.version} />
          <SettingsRow label={t.profileTermsLabel} chevron />
          <SettingsRow label={t.profileHelpLabel} chevron />
          <SettingsRow label={t.profileAboutLabel} chevron />
        </SettingsSection>

        <SettingsSection title={t.profileOthersSection}>
          <div className="px-4 py-3.5">
            <p className="text-[16px] font-semibold text-[#e03535]">{t.profileLogoutLabel}</p>
            <p className="mt-0.5 text-[12px] text-[#8a8c91]">{t.profileLogoutSubtitle.replace("{name}", userProfile.displayName)}</p>
          </div>
        </SettingsSection>
      </div>

      <TabBar />
    </main>
  );
}
