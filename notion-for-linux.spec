Name:           notion-for-linux
Version:        1.1.0
Release:        1%{?dist}
Summary:        Unofficial Notion desktop client for Linux
License:        MIT
URL:            https://github.com/notyorch/Notion-for-Linux

Source0:        notion-for-linux-%{version}-x64.AppImage
BuildArch:      x86_64

%description
Notion for Linux - A native desktop wrapper for Notion.so with enhanced features
for Linux users. Includes zoom controls, window persistence, keyboard shortcuts,
and a native application menu.

%prep
# No setup needed, we're using a pre-built AppImage

%build
# No build needed

%install
mkdir -p %{buildroot}%{_bindir}
mkdir -p %{buildroot}%{_datadir}/applications
mkdir -p %{buildroot}%{_datadir}/icons/hicolor/256x256/apps

install -m 0755 %{SOURCE0} %{buildroot}%{_bindir}/notion-for-linux

cat > %{buildroot}%{_datadir}/applications/notion-for-linux.desktop << 'EOF'
[Desktop Entry]
Name=Notion
Comment=Unofficial Notion desktop client for Linux
Exec=notion-for-linux %%U
Icon=notion-for-linux
Terminal=false
Type=Application
Categories=Office;Utility;
StartupWMClass=notion-for-linux
MimeType=x-scheme-handler/notion;
EOF

%files
%{_bindir}/notion-for-linux
%{_datadir}/applications/notion-for-linux.desktop

%changelog
* Mon May 18 2026 notyorch <jorge@example.com> - 1.1.0-1
- Initial RPM package for Notion for Linux
