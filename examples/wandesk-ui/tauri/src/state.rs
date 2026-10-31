use tauri::tray::TrayIcon;

#[derive(Default)]
pub(crate) struct TrayState {
    pub tray: Option<TrayIcon>,
}
