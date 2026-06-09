"use client";

interface Props {
  value: string;    // 如 "center" "top left" "50% 30%" 等
  onChange: (pos: string) => void;
}

/**
 * 3×3 九宫格焦点选择器
 * 选择图片的对焦点，控制 object-position
 */
const positions = [
  { value: "20% 20%",   label: "↖" },
  { value: "50% 20%",   label: "↑" },
  { value: "80% 20%",   label: "↗" },
  { value: "20% 50%",   label: "←" },
  { value: "50% 50%",   label: "⊙" },
  { value: "80% 50%",   label: "→" },
  { value: "20% 80%",   label: "↙" },
  { value: "50% 80%",   label: "↓" },
  { value: "80% 80%",   label: "↘" },
];

export default function FocalPointPicker({ value, onChange }: Props) {
  const current = value || "50% 50%";

  return (
    <div className="inline-flex flex-col items-center gap-1.5">
      <div className="grid grid-cols-3 gap-1 bg-gray-100 rounded-lg p-1 dark:bg-green-900/30">
        {positions.map((pos) => (
          <button
            key={pos.value}
            type="button"
            onClick={() => onChange(pos.value)}
            title={pos.label}
            className={`flex h-7 w-7 items-center justify-center rounded text-sm transition-colors ${
              current === pos.value
                ? "bg-primary text-white shadow-sm"
                : "bg-white text-gray-400 hover:bg-gray-50 dark:bg-[#1a2e22] dark:text-gray-500 dark:hover:bg-green-900/50"
            }`}
          >
            {pos.label}
          </button>
        ))}
      </div>
      <span className="text-[10px] text-gray-400">选择图片焦点</span>
    </div>
  );
}
