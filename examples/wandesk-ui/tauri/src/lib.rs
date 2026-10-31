mod shell;
mod state;

use std::sync::Mutex;

use tauri::Manager;

use crate::{
    shell::ui::{build_tray, ensure_main_window, show_app_window},
    state::TrayState,
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // Single instance: bring existing window to front on re-launch
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.unminimize();
                let _ = window.set_focus();
            }
        }))
        .plugin(tauri_plugin_opener::init())
        .manage(Mutex::<TrayState>::default())
        .on_window_event(|window, event| {
            // Hide on close instead of quitting — stay in tray
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                api.prevent_close();
                let _ = window.hide();
            }
        })
        .setup(|app| {
            // Detect locale
            shell::language::init_locale();

            // Create main window (hidden initially)
            ensure_main_window(app.handle());

            // Build system tray
            let built_tray = build_tray(app.handle())?;
            let tray_state = app.state::<Mutex<TrayState>>();
            let mut tray_state = tray_state.lock().expect("tray state poisoned");
            tray_state.tray = Some(built_tray.tray);
            drop(tray_state);

            // Show the main window with the app
            show_app_window(app.handle());

            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while building Wandesk UI")
        .run(|_app, _event| {
            #[cfg(target_os = "macos")]
            if let tauri::RunEvent::Reopen {
                has_visible_windows,
                ..
            } = &_event
            {
                if !has_visible_windows {
                    if let Some(window) = _app.get_webview_window("main") {
                        let _ = window.show();
                        let _ = window.unminimize();
                        let _ = window.set_focus();
                    }
                }
            }
        });
}
