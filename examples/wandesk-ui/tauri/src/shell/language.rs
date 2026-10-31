use std::sync::OnceLock;

const ZH: &str = "zh";
const EN: &str = "en";
const DEFAULT_LOCALE: &str = EN;

static CURRENT_LOCALE: OnceLock<String> = OnceLock::new();

pub(crate) struct ShellText {
    pub open: &'static str,
    pub about: &'static str,
    pub quit: &'static str,
    pub shell_title: &'static str,
}

const ZH_TEXT: ShellText = ShellText {
    open: "打开",
    about: "关于",
    quit: "退出",
    shell_title: "Wandesk UI",
};

const EN_TEXT: ShellText = ShellText {
    open: "Open",
    about: "About",
    quit: "Quit",
    shell_title: "Wandesk UI",
};

pub(crate) fn shell_text() -> &'static ShellText {
    match current_locale() {
        "zh" => &ZH_TEXT,
        _ => &EN_TEXT,
    }
}

fn normalize(candidate: &str) -> Option<String> {
    let lower = candidate.trim().to_ascii_lowercase();
    if lower.is_empty() {
        return None;
    }
    if lower.starts_with(ZH) {
        return Some(ZH.to_string());
    }
    if lower.starts_with(EN) {
        return Some(EN.to_string());
    }
    None
}

fn detect_system_locale() -> String {
    sys_locale::get_locale()
        .and_then(|value| normalize(&value))
        .unwrap_or_else(|| DEFAULT_LOCALE.to_string())
}

pub(crate) fn init_locale() -> &'static str {
    let locale = detect_system_locale();
    let _ = CURRENT_LOCALE.set(locale);
    current_locale()
}

pub(crate) fn current_locale() -> &'static str {
    CURRENT_LOCALE
        .get()
        .map(|value| value.as_str())
        .unwrap_or(DEFAULT_LOCALE)
}
