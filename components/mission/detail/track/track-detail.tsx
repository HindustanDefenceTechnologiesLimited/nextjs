"use client";

import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ThreatLevel, Track, TrackStatus } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/auth";
import { toast } from "sonner";
import DetailLayout from "../detail-layout";
import TrackPositions from "./track-positions";
import TrackFiles from "./track-files";
import { useAppDispatch } from "@/store/hook";
import { setSidebarData } from "@/store/slices/sidebarSlice";
import { updateTrack } from "@/store/slices/missionSlice";
import { TRACK_HIRARCHY } from "@/lib/constants"; // schema source of truth
import { renderIcon } from "../../list/track-list";

/** Types for the schema (based on your constants.ts) */
type PrimitiveType = "string" | "integer" | "boolean" | "enum" | "array" | "object";

type AttributeSpec = {
  type: PrimitiveType;
  options?: string[]; // for enum
  items?: string; // for array - type of items (string in current schema)
  properties?: Record<string, AttributeSpec>; // for object
  description?: string;
  required?: boolean;
};

type SubtypeSchema = {
  name: string;
  attributes: Record<string, AttributeSpec>;
};

type TrackHierarchy = Record<string, { subtypes: SubtypeSchema[] }>;

/** Utility helpers */

/** safe structured clone with JSON fallback */
const safeClone = <T,>(obj: T): T => {
  // structuredClone is available in modern runtimes; fallback to JSON when missing.
  try {
    // @ts-ignore - structuredClone is available in many runtimes
    return structuredClone(obj);
  } catch {
    return JSON.parse(JSON.stringify(obj));
  }
};

/** deep equality check (handles primitives, arrays, plain objects) */
const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a == null || b == null) return a === b;

  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
    return true;
  }

  if (typeof a === "object") {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    for (const k of aKeys) {
      if (!Object.prototype.hasOwnProperty.call(b, k)) return false;
      if (!deepEqual(a[k], b[k])) return false;
    }
    return true;
  }

  // primitives
  return a === b;
};

/** Format key for labels */
const formatKey = (key: string) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());

/** Default value for a given AttributeSpec */
const defaultForSpec = (spec: AttributeSpec): any => {
  switch (spec.type) {
    case "string":
    case "enum":
      return "";
    case "integer":
      return 0;
    case "boolean":
      return false;
    case "array":
      return [];
    case "object": {
      const obj: Record<string, any> = {};
      if (spec.properties) {
        for (const [k, childSpec] of Object.entries(spec.properties)) {
          obj[k] = defaultForSpec(childSpec);
        }
      }
      return obj;
    }
    default:
      return "";
  }
};

/** Build merged attributes when subtype changes */
const buildMergedAttributes = (
  oldAttrs: Record<string, any> | undefined,
  newSpec: Record<string, AttributeSpec>
) => {
  const merged: Record<string, any> = {};
  for (const [k, spec] of Object.entries(newSpec)) {
    if (oldAttrs && oldAttrs[k] !== undefined) {
      // If existing value matches expected shape, keep it; otherwise, attempt to coerce.
      merged[k] = oldAttrs[k];
    } else {
      merged[k] = defaultForSpec(spec);
    }
  }
  return merged;
};

/** Props and main component */

const TrackDetail: React.FC = () => {
  const sidebarData = useSelector((s: RootState) => s.sidebar.data) as Track | null;
  const [originalTrack, setOriginalTrack] = useState<Track | null>(
    sidebarData ? safeClone(sidebarData) : null
  );
  // if sidebar not yet populated, show nothing
  if (!originalTrack) return null;

  const dispatch = useAppDispatch();
  const [track, setTrack] = useState<Track>(() => safeClone(originalTrack));
  const [loading, setLoading] = useState(false);

  /** Helpers to read schema */
  const hierarchy = (TRACK_HIRARCHY as unknown) as TrackHierarchy;

  const getSubtypes = (type?: string): SubtypeSchema[] => {
    if (!type) return [];
    return hierarchy[type]?.subtypes || [];
  };

  const subtypeSchema = useMemo(() => {
    const subtypes = getSubtypes(track.type);
    return subtypes.find((s) => s.name === track.classification?.subType) ?? null;
  }, [track.type, track.classification?.subType]);

  /** Nested attribute setter: key like 'identification.number' or top-level 'gender' */
  const setNestedAttribute = (keyPath: string, value: any) => {
    const parts = keyPath.split(".");
    setTrack((prev) => {
      const next = safeClone(prev);
      if (!next.classification) next.classification = { ...next.classification || {} , attributes: {} } as any;
      if (!next.classification!.attributes) next.classification!.attributes = {};
      let pointer: any = next.classification!.attributes;

      for (let i = 0; i < parts.length - 1; i++) {
        const p = parts[i];
        if (pointer[p] === undefined || pointer[p] === null) pointer[p] = {};
        // if pointer[p] is not object, replace with object
        if (typeof pointer[p] !== "object") pointer[p] = {};
        pointer = pointer[p];
      }
      pointer[parts[parts.length - 1]] = value;
      return next;
    });
  };

  /** Generic onChange for top-level fields */
  const onChange = <K extends keyof Track>(key: K, value: Track[K]) => {
    setTrack((p) => ({ ...p, [key]: value }));
  };

  /** Handle subtype change */
  const handleSubtypeChange = (newSubType: string) => {
    const subtypes = getSubtypes(track.type);
    const newSchema = subtypes.find((s) => s.name === newSubType);
    if (!newSchema) return;

    const oldAttrs = track.classification?.attributes || {};
    const merged = buildMergedAttributes(oldAttrs, newSchema.attributes);

    setTrack((prev) => ({
      ...prev,
      classification: {
        ...prev.classification,
        subType: newSubType,
        attributes: merged,
      },
    }));
  };

  /** Cancel */
  const handleCancel = () => {
    if (!originalTrack) return;
    setTrack(safeClone(originalTrack));
    toast.info("Changes reverted");
  };

  /** Save */
  const handleSave = async () => {
    setLoading(true);
    toast.loading("Saving...", { id: "save" });

    try {
      await api.put(`/api/track/update/${track.id}`, track);
      toast.success("Track updated successfully!", { id: "save" });
      dispatch(setSidebarData(track));
      dispatch(updateTrack(track));
      setOriginalTrack(safeClone(track));
    } catch (err) {
      console.error(err);
      toast.error("Failed to update track", { id: "save" });
    } finally {
      setLoading(false);
    }
  };

  const isDirty = !deepEqual(track, originalTrack);

  /** Renderers for attribute types */
  const renderAttributeField = (
    keyPath: string,
    spec: AttributeSpec,
    value: any
  ): React.ReactNode => {
    const keyParts = keyPath.split(".");
    const label = formatKey(keyParts[keyParts.length - 1]);

    // Primitive input
    switch (spec.type) {
      case "string":
        return (
          <DetailInputRow
            key={keyPath}
            label={label}
            value={value ?? ""}
            onChange={(v) => setNestedAttribute(keyPath, v)}
          />
        );

      case "integer":
        return (
          <DetailInputRow
            key={keyPath}
            label={label}
            value={value ?? ""}
            onChange={(v) => {
              const num = v === "" ? 0 : Number(v);
              setNestedAttribute(keyPath, Number.isNaN(num) ? 0 : num);
            }}
          />
        );

      case "boolean":
        return (
          <div className="flex justify-between items-center gap-2 mb-2" key={keyPath}>
            <Label>{label}</Label>
            <Select
              value={String(value ?? "")}
              onValueChange={(v) => setNestedAttribute(keyPath, v === "true")}
            >
              <SelectTrigger size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case "enum":
        return (
          <div className="flex justify-between items-center gap-2 mb-2" key={keyPath}>
            <Label>{label}</Label>
            <Select
              value={value ?? ""}
              onValueChange={(v) => setNestedAttribute(keyPath, v)}
            >
              <SelectTrigger size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(spec.options || []).map((op) => (
                  <SelectItem key={op} value={op}>
                    {op}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case "array":
        return (
          <DetailInputRow
            key={keyPath}
            label={label}
            value={Array.isArray(value) ? value.join(", ") : ""}
            onChange={(v) =>
              setNestedAttribute(
                keyPath,
                v
                  .split(",")
                  .map((s: any) => s.trim())
                  .filter((s: any) => s.length > 0)
              )
            }
          />
        );

      case "object":
        return (
          <div className="mb-3" key={keyPath}>
            <Label className="w-full">{label}</Label>
            <div className="pl-3 pt-2 text-muted-foreground space-y-2">
              {spec.properties &&
                Object.entries(spec.properties).map(([subKey, subSpec]) =>
                  renderAttributeField(
                    `${keyPath}.${subKey}`,
                    subSpec,
                    value?.[subKey] ?? defaultForSpec(subSpec)
                  )
                )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DetailLayout
      headerContent={
        <div className="flex justify-between w-full items-center ">
          <span className="font-semibold truncate">
            {String(track.trackId)
              .split("-")
              .map((id) => id.charAt(0).toUpperCase() + id.slice(1))
              .join(" ")}
          </span>
        </div>
      }
    >
      <div className="space-y-4 p-2">
        <div>
          <p className="text-sm font-semibold mb-2">Track ID</p>
          <Input value={track.trackId} onChange={(e) => onChange("trackId", e.target.value)} />
        </div>

        <div className="flex justify-between">
          <p className="text-sm font-semibold">Type</p>
          <span className="text-sm flex gap-2 items-center">
            {renderIcon(track)} {track.type}
          </span>
        </div>

        <Textarea
          placeholder="Description"
          value={track.description || ""}
          onChange={(e) => onChange("description", e.target.value)}
        />

        <TrackFiles track={track} />

        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <Label>Status</Label>
            <Select value={track.status} onValueChange={(v: TrackStatus) => onChange("status", v)}>
              <SelectTrigger size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="LOST">Lost</SelectItem>
                <SelectItem value="TERMINATED">TERMINATED</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between">
            <Label>Threat Level</Label>
            <Select value={track.threatLevel} onValueChange={(v: ThreatLevel) => onChange("threatLevel", v)}>
              <SelectTrigger size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">None</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Classification Section */}
        {track.classification && (
          <Section title="Classification">
            <DetailInputRow
              label="Size"
              value={track.classification.size || ""}
              onChange={(v) =>
                setTrack((p) => ({
                  ...p,
                  classification: { ...p.classification, size: v },
                }))
              }
            />

            <DetailInputRow
              label="Color"
              value={track.classification.color || ""}
              onChange={(v) =>
                setTrack((p) => ({
                  ...p,
                  classification: { ...p.classification, color: v },
                }))
              }
            />

            {/* Subtype */}
            <div className="mb-3 flex justify-between items-center">
              <Label>Subtype</Label>
              <Select
                value={track.classification?.subType || ""}
                onValueChange={handleSubtypeChange}
              >
                <SelectTrigger className="h-8 mt-1">
                  <SelectValue placeholder="Select subtype" />
                </SelectTrigger>
                <SelectContent>
                  {getSubtypes(track.type).map((st) => (
                    <SelectItem key={st.name} value={st.name}>
                      {st.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dynamic Attributes */}
            {subtypeSchema && (
              <div className="mt-2">
                <h4 className="font-medium mb-1">Attributes</h4>
                <div className="space-y-2">
                  {Object.entries(subtypeSchema.attributes).map(([key, spec]) => {
                    const currentValue = track.classification?.attributes?.[key];
                    return (
                      <div key={key}>
                        {renderAttributeField(key, spec, currentValue ?? defaultForSpec(spec))}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </Section>
        )}

        <TrackPositions track={track} />
      </div>

      <div className="sticky bottom-0 bg-card/30 backdrop-blur-lg justify-end rounded-b-md p-2 flex gap-2">
        <Button variant="ghost" size="sm" onClick={handleCancel}>
          Revert
        </Button>
        <Button disabled={loading || !isDirty} size="sm" onClick={handleSave}>
          Save
        </Button>
      </div>
    </DetailLayout>
  );
};

export default TrackDetail;

/** Small UI helpers */

const DetailInputRow: React.FC<{
  label: string;
  value: any;
  onChange: (v: any) => void;
  [x: string]: any;
}> = ({ label, value, onChange, ...props }) => (
  <div className="flex items-center justify-between gap-2 mb-2">
    <Label className="w-1/3 min-w-[110px]">{label}</Label>
    <Input
      {...props}
      className="py-0 h-8 flex-1"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="border-b pb-2">
    <span className="mb-1">{title}</span>
    {children}
  </div>
);
