import { Tv, Wifi, Volume2, Eye, Moon, Globe, HelpCircle, Info } from "lucide-react";

export function Settings() {
  const settingsSections = [
    {
      title: "Display",
      icon: Tv,
      items: [
        { label: "Screen Resolution", description: "1920 x 1080 (Full HD)", value: "1080p" },
        { label: "Picture Mode", description: "Standard, Vivid, Cinema, Game", value: "Standard" },
        { label: "HDR Mode", description: "Automatically adjust HDR content", value: "Auto" },
      ],
    },
    {
      title: "Network",
      icon: Wifi,
      items: [
        { label: "Wi-Fi Connection", description: "Connected to Home Network", value: "Connected" },
        { label: "Network Speed", description: "Download: 150 Mbps", value: "150 Mbps" },
        { label: "Ethernet", description: "Not connected", value: "Disabled" },
      ],
    },
    {
      title: "Audio",
      icon: Volume2,
      items: [
        { label: "Sound Mode", description: "Standard, Music, Movie, Sports", value: "Standard" },
        { label: "Volume Level", description: "Current volume setting", value: "50%" },
        { label: "Surround Sound", description: "Enable virtual surround sound", value: "On" },
      ],
    },
    {
      title: "Accessibility",
      icon: Eye,
      items: [
        { label: "Closed Captions", description: "Display subtitles on all content", value: "Off" },
        { label: "Text Size", description: "Large text for better readability", value: "Medium" },
        { label: "High Contrast", description: "Improve visibility for UI elements", value: "Off" },
      ],
    },
    {
      title: "Appearance",
      icon: Moon,
      items: [
        { label: "Theme", description: "Dark or Light mode", value: "Dark" },
        { label: "App Layout", description: "Grid size and spacing", value: "Comfortable" },
        { label: "Screensaver", description: "Time before screensaver activates", value: "5 minutes" },
      ],
    },
    {
      title: "Language & Region",
      icon: Globe,
      items: [
        { label: "Language", description: "Interface language", value: "English" },
        { label: "Region", description: "Content availability region", value: "United States" },
        { label: "Time Zone", description: "Local time zone setting", value: "EST (UTC-5)" },
      ],
    },
    {
      title: "Help & Support",
      icon: HelpCircle,
      items: [
        { label: "Help Center", description: "Find answers to common questions" },
        { label: "Contact Support", description: "Get help from our support team" },
        { label: "System Diagnostics", description: "Check system performance" },
      ],
    },
    {
      title: "About",
      icon: Info,
      items: [
        { label: "Software Version", description: "TV Hub OS 3.5.0", value: "3.5.0" },
        { label: "Device Name", description: "Living Room TV", value: "Living Room" },
        { label: "Model", description: "TH-4K-2025", value: "TH-4K-2025" },
      ],
    },
  ];

  return (
    <div className="py-8 px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-zinc-400">Customize your TV Hub experience</p>
      </div>

      {/* System Info Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">TV Hub OS 3.5.0</h2>
            <p className="text-blue-100">All systems operational</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100 mb-1">Storage Used</p>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-blue-900 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-white rounded-full"></div>
              </div>
              <span className="text-sm">67%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingsSections.map((section) => (
          <div key={section.title} className="bg-zinc-900 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-3">
              <section.icon className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-semibold">{section.title}</h2>
            </div>
            <div>
              {section.items.map((item, index) => (
                <button
                  key={item.label}
                  className={`w-full px-6 py-4 flex items-center justify-between hover:bg-zinc-800 transition-colors text-left ${
                    index !== section.items.length - 1 ? "border-b border-zinc-800" : ""
                  }`}
                >
                  <div className="flex-1">
                    <p className="font-medium mb-1">{item.label}</p>
                    <p className="text-sm text-zinc-400">{item.description}</p>
                  </div>
                  {item.value && (
                    <span className="text-sm text-blue-400 font-medium ml-4">{item.value}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Reset Button */}
      <div className="mt-8 flex gap-4">
        <button className="flex-1 px-6 py-4 bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors">
          Check for Updates
        </button>
        <button className="flex-1 px-6 py-4 bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors text-red-500">
          Factory Reset
        </button>
      </div>
    </div>
  );
}
