import { useRef } from "react";
import { Camera, X } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/tw";

interface PhotoPickerProps {
  value?: string;
  name: string;
  onChange: (dataUrl: string | undefined) => void;
  size?: number;
  className?: string;
}

export function PhotoPicker({ value, name, onChange, size = 64, className }: PhotoPickerProps) {
  const ref = useRef<HTMLInputElement>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      window.alert("Please choose an image under 4MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="relative flex-shrink-0"
        aria-label="Choose photo"
      >
        <Avatar src={value} name={name || "Someone"} size={size} />
        <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-card-soft text-text-secondary">
          <Camera size={14} strokeWidth={1.8} />
        </span>
      </button>
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="text-[15px] font-medium text-text"
        >
          {value ? "Change photo" : "Add a photo"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="inline-flex w-fit items-center gap-1 text-[13px] text-text-muted"
          >
            <X size={13} strokeWidth={1.8} /> Remove
          </button>
        )}
        <span className="caption">A likeness to help you remember them.</span>
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        onChange={onFile}
        className="hidden"
      />
    </div>
  );
}