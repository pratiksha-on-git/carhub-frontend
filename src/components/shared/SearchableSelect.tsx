import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SearchableSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  placeholder: string;
  allowCustom?: boolean;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
}

export function SearchableSelect({
  value,
  onValueChange,
  options,
  placeholder,
  allowCustom = false,
  disabled = false,
  className,
  triggerClassName,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  // Filter options based on search input
  const filteredOptions = React.useMemo(() => {
    if (!search.trim()) return options;
    const lowerSearch = search.toLowerCase();
    return options.filter((opt) => opt.toLowerCase().includes(lowerSearch));
  }, [options, search]);

  const exactMatchExists = React.useMemo(() => {
    return options.some(
      (opt) => opt.toLowerCase() === search.trim().toLowerCase(),
    );
  }, [options, search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between bg-white text-left font-normal border border-slate-200 rounded-xl px-3 hover:bg-slate-50 hover:text-slate-500 transition-colors shadow-sm",
            value ? "text-slate-900" : "text-slate-400",
            triggerClassName,
          )}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        avoidCollisions={false}
        className={cn(
          "p-0 rounded-2xl shadow-lg border border-slate-100 bg-white z-50 w-[var(--radix-popover-trigger-width)]",
          className,
        )}
      >
        <Command shouldFilter={false} className="rounded-2xl">
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
            value={search}
            onValueChange={setSearch}
            className="border-0 focus:ring-0 text-sm h-11"
          />
          <CommandList
            className="max-h-60 overflow-y-auto p-1"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {filteredOptions.length === 0 && !allowCustom && (
              <div className="text-center py-6 text-sm text-slate-500">
                No results found.
              </div>
            )}

            {options.length === 0 && allowCustom && search.trim() === "" && (
              <div className="text-center py-6 px-4 text-xs text-slate-400 leading-normal">
                No matches. Type to enter custom {placeholder.toLowerCase()}...
              </div>
            )}

            <CommandGroup>
              {filteredOptions.map((opt) => (
                <CommandItem
                  key={opt}
                  value={opt}
                  onSelect={() => {
                    onValueChange(opt);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="flex items-center justify-between px-3 py-2 text-sm rounded-xl cursor-pointer hover:!bg-slate-100 data-[selected=true]:!bg-slate-100 !text-gray-700 data-[selected=true]:!text-gray-900"
                >
                  <span className="truncate">{opt}</span>
                  <Check
                    className={cn(
                      "h-4 w-4 text-blue-900 shrink-0",
                      value === opt ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>

            {allowCustom && search.trim() !== "" && !exactMatchExists && (
              <CommandGroup
                heading="Custom Option"
                className="border-t border-slate-100 pt-1 mt-1"
              >
                <CommandItem
                  value={search}
                  onSelect={() => {
                    onValueChange(search.trim());
                    setOpen(false);
                    setSearch("");
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl cursor-pointer !bg-blue-50 !text-blue-700 hover:!bg-blue-100 data-[selected=true]:!bg-blue-100 data-[selected=true]:!text-blue-900"
                >
                  <Plus className="h-4 w-4 shrink-0" />
                  <span className="truncate">
                    Use custom: "{search.trim()}"
                  </span>
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
