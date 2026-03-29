import { useState, useEffect } from 'react';
import { useProfile } from '../../hooks/useProfile.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useLang } from '../../hooks/useLang.js';
import { IconCamera } from '../../components/icons/icons.jsx';
import './Profile.css';
import '../Settings/Settings.css';

const BACKEND   = import.meta.env.VITE_API_URL?.replace('/api', '') ?? 'http://localhost:5000';
const TOKEN_KEY = 'mjqbe_token';

export default function Profile() {
  const { t } = useLang();
  const { refreshUser } = useAuth();
  const {
    profile, loading, error,
    saveProfile, savePassword, changeAvatar, removeAvatar,
  } = useProfile();

  // ── Avatar ──────────────────────────────────────────────────────────────────
  const [avatarUploading, setAvatarUploading] = useState(false);

  // ── Profile form ─────────────────────────────────────────────────────────────
  const [username,       setUsername]       = useState('');
  const [email,          setEmail]          = useState('');
  const [verifyPwd,      setVerifyPwd]      = useState('');
  const [reauthToken,    setReauthToken]    = useState(null);
  const [savingProfile,  setSavingProfile]  = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError,   setProfileError]   = useState(null);

  // ── Password form ────────────────────────────────────────────────────────────
  const [currentPwd,  setCurrentPwd]  = useState('');
  const [newPwd,      setNewPwd]      = useState('');
  const [confirmPwd,  setConfirmPwd]  = useState('');
  const [savingPwd,   setSavingPwd]   = useState(false);
  const [pwdSuccess,  setPwdSuccess]  = useState(false);
  const [pwdError,    setPwdError]    = useState(null);

  // Read ?reauth=<token> from URL after OAuth reauth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rt = params.get('reauth');
    if (rt) {
      setReauthToken(rt);
      window.history.replaceState({}, '', '/profile');
    }
  }, []);

  // Sync form when profile loads
  useEffect(() => {
    if (profile) {
      setUsername(profile.username ?? '');
      setEmail(profile.email ?? '');
    }
  }, [profile]);

  // ── Handlers ──────────────────────────────────────────────────────────────────

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      await changeAvatar(file);
      await refreshUser();
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    await removeAvatar();
    await refreshUser();
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError(null);
    try {
      await saveProfile(
        { username, email: email || null },
        profile.has_password ? verifyPwd : undefined,
        !profile.has_password ? reauthToken : undefined,
      );
      setProfileSuccess(true);
      setVerifyPwd('');
      await refreshUser();
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      const code = err.code;
      if      (code === 'USERNAME_TAKEN')    setProfileError(t('profile.errorUsernameTaken'));
      else if (code === 'EMAIL_TAKEN')       setProfileError(t('profile.errorEmailTaken'));
      else if (code === 'WRONG_PASSWORD')    setProfileError(t('profile.errorWrongPassword'));
      else                                   setProfileError(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setPwdError(null);
    if (newPwd !== confirmPwd) { setPwdError(t('profile.errorPasswordMismatch')); return; }
    setSavingPwd(true);
    try {
      await savePassword(currentPwd, newPwd);
      setPwdSuccess(true);
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
      setTimeout(() => setPwdSuccess(false), 3000);
    } catch (err) {
      if (err.code === 'WRONG_PASSWORD') setPwdError(t('profile.errorWrongPassword'));
      else                               setPwdError(err.message);
    } finally {
      setSavingPwd(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  if (loading) {
    return <div className="loading-screen"><div className="loading-spinner" /></div>;
  }
  if (error || !profile) {
    return <div className="page-profile"><p className="page-error">{error || 'Error'}</p></div>;
  }

  const avatarSrc = profile.avatar ? `${BACKEND}${profile.avatar}` : null;
  const token     = localStorage.getItem(TOKEN_KEY);
  const canSubmitProfile = profile.has_password
    ? verifyPwd.length > 0
    : reauthToken !== null;

  return (
    <div className="page-profile">
      <div className="page-header">
        <h1 className="page-title">{t('profile.title')}</h1>
        <p className="page-subtitle">{t('profile.subtitle')}</p>
      </div>

      <div className="profile-sections">

        {/* ── Avatar ── */}
        <section className="settings-section">
          <h2 className="settings-section-title">{t('profile.avatar')}</h2>
          <div className="profile-avatar-row">
            <div className="profile-avatar">
              {avatarSrc ? (
                <img src={avatarSrc} alt={profile.username} />
              ) : (
                <span className="profile-avatar-initial">
                  {profile.username?.[0]?.toUpperCase()}
                </span>
              )}
            </div>
            <div className="profile-avatar-actions">
              <label
                className="settings-toggle-btn profile-avatar-btn"
                htmlFor="avatar-input"
              >
                <IconCamera />
                <span>{avatarUploading ? '…' : t('profile.avatarChange')}</span>
              </label>
              <input
                id="avatar-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarChange}
                className="profile-file-input"
              />
              {profile.avatar && (
                <button className="settings-logout-btn" onClick={handleRemoveAvatar}>
                  {t('profile.avatarDelete')}
                </button>
              )}
              <p className="settings-row-desc">{t('profile.avatarHint')}</p>
            </div>
          </div>
        </section>

        {/* ── Infos profil ── */}
        <section className="settings-section">
          <h2 className="settings-section-title">{t('profile.title')}</h2>
          <form onSubmit={handleSaveProfile} className="profile-form" autoComplete="off">

            <div className="profile-field">
              <label className="settings-row-label" htmlFor="prof-username">
                {t('profile.username')}
              </label>
              <p className="settings-row-desc">{t('profile.usernameDesc')}</p>
              <input
                id="prof-username"
                className="profile-input"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                minLength={3}
                maxLength={100}
              />
            </div>

            <div className="profile-field">
              <label className="settings-row-label" htmlFor="prof-email">
                {t('profile.email')}
              </label>
              <p className="settings-row-desc">{t('profile.emailDesc')}</p>
              <input
                id="prof-email"
                className="profile-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t('profile.emailPlaceholder')}
              />
            </div>

            {/* Identity verification */}
            <div className="profile-verif">
              <p className="settings-row-label">{t('profile.identityVerif')}</p>
              {profile.has_password ? (
                <>
                  <p className="settings-row-desc">{t('profile.identityVerifDesc')}</p>
                  <input
                    className="profile-input"
                    type="password"
                    autoComplete="current-password"
                    placeholder={t('profile.currentPassword')}
                    value={verifyPwd}
                    onChange={e => setVerifyPwd(e.target.value)}
                  />
                </>
              ) : (
                <>
                  <p className="settings-row-desc">{t('profile.oauthIdentityDesc')}</p>
                  <div className="profile-verif-btns">
                    {profile.oauth_provider === 'google' && (
                      <a
                        href={`${BACKEND}/api/auth/google/reauth?token=${token}`}
                        className="settings-toggle-btn"
                      >
                        {t('profile.verifyViaGoogle')}
                      </a>
                    )}
                    {profile.oauth_provider === 'github' && (
                      <a
                        href={`${BACKEND}/api/auth/github/reauth?token=${token}`}
                        className="settings-toggle-btn"
                      >
                        {t('profile.verifyViaGitHub')}
                      </a>
                    )}
                  </div>
                  {reauthToken && (
                    <p className="profile-verif-ok">✓ {t('profile.identityVerif')}</p>
                  )}
                </>
              )}
            </div>

            {profileError   && <p className="page-error">{profileError}</p>}
            {profileSuccess && <p className="profile-success">{t('profile.successProfile')}</p>}

            <button
              type="submit"
              className="settings-toggle-btn profile-submit-btn"
              disabled={savingProfile || !canSubmitProfile}
            >
              {savingProfile ? t('profile.savingProfile') : t('profile.saveProfile')}
            </button>
          </form>
        </section>

        {/* ── Mot de passe ── */}
        {profile.has_password && (
          <section className="settings-section">
            <h2 className="settings-section-title">{t('profile.password')}</h2>
            <p className="settings-row-desc" style={{ marginBottom: 'var(--space-4)' }}>
              {t('profile.passwordDesc')}
            </p>
            <form onSubmit={handleSavePassword} className="profile-form" autoComplete="off">
              <div className="profile-field">
                <label className="settings-row-label" htmlFor="cur-pwd">
                  {t('profile.currentPassword')}
                </label>
                <input
                  id="cur-pwd"
                  className="profile-input"
                  type="password"
                  autoComplete="current-password"
                  value={currentPwd}
                  onChange={e => setCurrentPwd(e.target.value)}
                  required
                />
              </div>
              <div className="profile-field">
                <label className="settings-row-label" htmlFor="new-pwd">
                  {t('profile.newPassword')}
                </label>
                <input
                  id="new-pwd"
                  className="profile-input"
                  type="password"
                  autoComplete="new-password"
                  value={newPwd}
                  onChange={e => setNewPwd(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="profile-field">
                <label className="settings-row-label" htmlFor="conf-pwd">
                  {t('profile.confirmPassword')}
                </label>
                <input
                  id="conf-pwd"
                  className="profile-input"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPwd}
                  onChange={e => setConfirmPwd(e.target.value)}
                  required
                />
              </div>
              {pwdError   && <p className="page-error">{pwdError}</p>}
              {pwdSuccess && <p className="profile-success">{t('profile.successPassword')}</p>}
              <button
                type="submit"
                className="settings-toggle-btn profile-submit-btn"
                disabled={savingPwd}
              >
                {savingPwd ? t('profile.savingPassword') : t('profile.savePassword')}
              </button>
            </form>
          </section>
        )}

        {/* ── Compte connecté ── */}
        {profile.oauth_provider && (
          <section className="settings-section">
            <div className="settings-row">
              <div className="settings-row-info">
                <span className="settings-row-label">{t('profile.connectedAccount')}</span>
                <span className="settings-row-desc">
                  {t('profile.connectedAccountDesc').replace(
                    '{provider}',
                    profile.oauth_provider === 'google' ? 'Google' : 'GitHub',
                  )}
                </span>
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
