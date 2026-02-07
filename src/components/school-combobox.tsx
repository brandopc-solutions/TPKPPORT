"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
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
import { MAINSTREAM_SCHOOL_OPTIONS } from "@/lib/school-options";

interface SchoolComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function SchoolCombobox({
  value,
  onValueChange,
  disabled,
}: SchoolComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Only show results when there's a search query (too many items to show all)
  const filtered =
    search.length >= 2
      ? MAINSTREAM_SCHOOL_OPTIONS.filter((school) =>
          school.toLowerCase().includes(search.toLowerCase())
        ).slice(0, 50)
      : [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
          disabled={disabled}
        >
          <span className="truncate">
            {value || "Select school..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Type at least 2 characters to search..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {search.length < 2 ? (
              <CommandEmpty>Type at least 2 characters to search...</CommandEmpty>
            ) : filtered.length === 0 ? (
              <CommandEmpty>No school found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {filtered.map((school) => (
                  <CommandItem
                    key={school}
                    value={school}
                    onSelect={() => {
                      onValueChange(school);
                      setOpen(false);
                      setSearch("");
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === school ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {school}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
